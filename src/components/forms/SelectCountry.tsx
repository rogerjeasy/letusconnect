"use client";

import { useEffect } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import { useCountryStore } from "../../store/userCountryStore";
import { useUserLanguageStore } from "../../store/userLanguageStore";
import Scroll from "./Scroll";

interface Language {
  code: string;
  name: string;
}

interface PhoneCode {
  country: string;
  code: string;
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
  const {
    languages,
    phoneCodes,
    setLanguages,
    setPhoneCodes,
    setSelectedLanguage,
    setSelectedPhoneCode,
  } = useUserLanguageStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data: any[] = await response.json();

        const formattedCountries = data.map((country: any) => ({
          name: country.name.common,
          flag: country.flags.svg,
        }));

        const uniqueLanguages: Language[] = Array.from(
          new Set(
            data.flatMap((country: any) =>
              Object.values(country.languages || {}) as string[]
            )
          )
        ).map((language) => ({
          code: language.toLowerCase(),
          name: language,
        }));

        const uniquePhoneCodes: PhoneCode[] = Array.from(
          data.reduce((acc: Map<string, PhoneCode>, country: any) => {
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
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    if (countries.length === 0 || languages.length === 0 || phoneCodes.length === 0) {
      fetchData();
    }
  }, [countries, setCountries, languages, setLanguages, phoneCodes.length, setPhoneCodes]);

  const handleSelect = (value: any) => {

    if (selectionMode === "country") {
      const selected = countries.find((country) => country.name === value);

      if (selected) {
        console.log("Selected country:", selected.name); // Log selected country
        onChange?.(selected.name); // Call onChange with the country's name
      } else {
        console.error("Selected country not found");
        console.log("Available countries for matching:", countries.map((c) => c.name));
      }
    } else if (selectionMode === "language") {
      const selectedLanguages = Array.isArray(value)
        ? languages.filter((lang) => lang && value.includes(lang.name))
        : languages.filter((lang) => lang && lang.name === value);

      if (selectedLanguages.length > 0 && onChange) {
        onChange(selectedLanguages.map((lang) => lang.name));
      }
    } else if (selectionMode === "phone") {
      const selected = phoneCodes.find((pc) => pc.code === value);
      if (selected) {
        setSelectedPhoneCode(selected);
        if (onChange) onChange(selected.code);
      }
    }
  };

  const renderSelection = () => {
    if (selectionMode === "country") {
      return (
        <Select
          className="max-w-full"
          label="Select Country"
          defaultSelectedKeys={typeof defaultValue === "string" ? [defaultValue] : undefined}
          onChange={(selectedKeys) => {
            // `selectedKeys` is an array (due to the multiple selection handling in Select)
            const selectedValue = Array.isArray(selectedKeys) ? selectedKeys[0] : selectedKeys;

            console.log("Selected key (value):", selectedValue);

            if (typeof selectedValue === "string") {
              console.log("Selected value from <Select>:", selectedValue);
        
              // Match the selected value to the country name
              const selectedCountry = countries.find(
                (country) => country.name === selectedValue
              );
        
              if (selectedCountry) {
                console.log("Matched country:", selectedCountry.name);
                onChange?.(selectedCountry.name); 
              } else {
                console.error("Country not found in the list.");
                console.log("Available countries:", countries.map((country) => country.name));
              }
            } else {
              console.error("Unexpected value type:", selectedValue);
            }
          }}
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
    } else if (selectionMode === "language") {
      return (
        <Scroll className="max-w-full h-[200px] overflow-auto">
          <Select
            className="w-full"
            label="Select Languages"
            selectionMode="multiple"
            defaultSelectedKeys={
              Array.isArray(defaultValue)
                ? defaultValue.filter((key) => key !== undefined)
                : [defaultValue].filter((key) => key !== undefined)
            }
            onChange={(selected) => {
              if (Array.isArray(selected)) {
                handleSelect(selected.map((item) => item.toString())); // Ensure selected is passed as string[]
              } else {
                handleSelect(selected.toString()); // Ensure single string is passed
              }
            }}
          >
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </Select>
        </Scroll>

      );
    } else if (selectionMode === "phone") {
      return (
        <Select
          className="max-w-full"
          label="Select Phone Code"
          defaultSelectedKeys={typeof defaultValue === "string" ? [defaultValue] : undefined}
          onChange={(value) => handleSelect(value.toString())}
        >
          {phoneCodes.map((pc) => (
            <SelectItem key={pc.code}>
              {`${pc.country} (${pc.code})`}
            </SelectItem>
          ))}
        </Select>
      );
    }
  };

  return <div className="flex flex-col gap-4">{renderSelection()}</div>;
}
