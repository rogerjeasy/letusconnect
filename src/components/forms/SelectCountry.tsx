"use client";

import { useEffect, useState } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { useCountryStore } from "../../store/userCountryStore";
import { useUserLanguageStore } from "../../store/userLanguageStore";
import { fetchCountryData } from "../../utils/countryapi"
import { CountryAPIResponse } from "../../store/types"
import Scroll from "./Scroll";

interface FetchState {
  loading: boolean;
  error: string | null;
}

export default function UserSelection({
  selectionMode = "country",
  defaultValue,
  onChange,
}: {
  selectionMode: "country" | "language" | "phone";
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
}) {
  const { countries, setCountries } = useCountryStore();
  const { languages, phoneCodes, setLanguages, setPhoneCodes } = useUserLanguageStore();
  const [fetchState, setFetchState] = useState<FetchState>({ loading: false, error: null });

  useEffect(() => {
    const loadData = async () => {
      if (countries.length > 0 && languages.length > 0 && phoneCodes.length > 0) {
        return;
      }

      setFetchState({ loading: true, error: null });

      try {
        const data = await fetchCountryData();

        const formattedCountries = data.map((country) => ({
          name: country.name.common,
          flag: country.flags.svg,
        }));

        const uniqueLanguages = Array.from(
          new Set(
            data.flatMap((country) =>
              Object.values(country.languages || {}) as string[]
            )
          )
        ).map((language) => ({
          code: language.toLowerCase(),
          name: language,
        }));

        const uniquePhoneCodes = Array.from(
          data.reduce((acc: Map<string, any>, country) => {
            const code = `${country.idd?.root || ""}${country.idd?.suffixes?.[0] || ""}`;
            if (code && !acc.has(code)) {
              acc.set(code, {
                country: country.name.common,
                code,
              });
            }
            return acc;
          }, new Map()).values()
        );

        setCountries(formattedCountries);
        setLanguages(uniqueLanguages);
        setPhoneCodes(uniquePhoneCodes);
        setFetchState({ loading: false, error: null });

      } catch (error) {
        console.error("Failed to fetch data:", error);
        setFetchState({
          loading: false,
          error: "Unable to load data. Please try again later.",
        });
      }
    };

    loadData();
  }, [countries, languages, phoneCodes, setCountries, setLanguages, setPhoneCodes]);

  const handleSelect = (
    selectedKeys: Set<string>,
    mode: "country" | "language" | "phone"
  ) => {
    if (!onChange) return;

    const selectedArray = Array.from(selectedKeys);

    switch (mode) {
      case "country": {
        const country = countries.find((c) => c.name === selectedArray[0]);
        if (country) onChange(country.name);
        break;
      }
      case "language": {
        const selectedLanguages = selectedArray
          .map((key) => languages.find((lang) => lang.code === key)?.name)
          .filter((name): name is string => !!name);
        onChange(selectedLanguages);
        break;
      }
      case "phone": {
        const phone = phoneCodes.find((pc) => pc.code === selectedArray[0]);
        if (phone) onChange(phone.code);
        break;
      }
    }
  };

  if (fetchState.loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (fetchState.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{fetchState.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  const renderSelection = () => {
    switch (selectionMode) {
      case "country":
        return (
          <Select
            className="max-w-full"
            label="Select Country"
            defaultSelectedKeys={typeof defaultValue === "string" ? [defaultValue] : undefined}
            onSelectionChange={(keys) => handleSelect(keys as Set<string>, "country")}
          >
            {countries.map((country) => (
              <SelectItem
                key={country.name}
                value={country.name}
                startContent={
                  <Avatar alt={country.name} className="w-6 h-6" src={country.flag} />
                }
              >
                {country.name}
              </SelectItem>
            ))}
          </Select>
        );

      case "language":
        return (
          <Scroll className="max-w-full h-[200px] overflow-auto">
            <Select
              className="w-full"
              label="Select Languages"
              selectionMode="multiple"
              defaultSelectedKeys={
                Array.isArray(defaultValue)
                  ? new Set(
                      defaultValue
                        .map((name) =>
                          languages.find((lang) => lang.name === name)?.code
                        )
                        .filter((key): key is string => !!key)
                    )
                  : undefined
              }
              onSelectionChange={(keys) => handleSelect(keys as Set<string>, "language")}
            >
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </Select>
          </Scroll>
        );

      case "phone":
        return (
          <Select
            className="max-w-full"
            label="Select Phone Code"
            defaultSelectedKeys={typeof defaultValue === "string" ? [defaultValue] : undefined}
            onSelectionChange={(keys) => handleSelect(keys as Set<string>, "phone")}
          >
            {phoneCodes.map((pc) => (
              <SelectItem key={pc.code} value={pc.code}>
                {`${pc.country} (${pc.code})`}
              </SelectItem>
            ))}
          </Select>
        );
    }
  };

  return <div className="flex flex-col gap-4">{renderSelection()}</div>;
}
