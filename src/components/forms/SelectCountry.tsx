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


interface CountryAPIResponse {
  name: {
    common: string;
  };
  flags: {
    svg: string;
  };
  languages?: {
    [key: string]: string;
  };
  idd?: {
    root?: string;
    suffixes?: string[];
  };
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
  } = useUserLanguageStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data: CountryAPIResponse[] = await response.json();

        const formattedCountries = data.map((country) => ({
          name: country.name.common,
          flag: country.flags.svg,
        }));

        const uniqueLanguages: Language[] = Array.from(
          new Set(
            data.flatMap((country) =>
              Object.values(country.languages || {}) as string[]
            )
          )
        ).map((language) => ({
          code: language.toLowerCase(),
          name: language,
        }));

        const uniquePhoneCodes: PhoneCode[] = Array.from(
          data.reduce((acc: Map<string, PhoneCode>, country) => {
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

  const handleLanguageSelect = (selectedKeys: Set<string> | Iterable<string>) => {
    const selectedLanguages = Array.from(selectedKeys)
      .map((key) => {
        const lang = languages.find((lang) => lang.code === key);
        return lang?.name;
      })
      .filter((name): name is string => !!name);

    if (onChange) {
      onChange(selectedLanguages);
    }
  };

  const handleCountrySelect = (selectedKeys: Set<string>) => {
    const selectedKey = Array.from(selectedKeys)[0];
  
    const selectedCountry = countries.find((country) => country.name === selectedKey);
  
    if (selectedCountry && onChange) {
      onChange(selectedCountry.name);
    }
  };
  


  const handlePhoneSelect = (selectedKey: Set<string>) => {
    const selectedValue = Array.from(selectedKey)[0];
  
    const selectedPhone = phoneCodes.find((pc) => pc.code === selectedValue);
  
    if (selectedPhone && onChange) {
      onChange(selectedPhone.code);
    }
  };  
  

  const renderSelection = () => {
    if (selectionMode === "country") {
      return (
        <Select
          className="max-w-full"
          label="Select Country"
          defaultSelectedKeys={typeof defaultValue === "string" ? [defaultValue] : undefined}
          onSelectionChange={(selectedKeys) => handleCountrySelect(selectedKeys as Set<string>)}
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
              defaultValue instanceof Array
                ? new Set(
                    defaultValue
                      .map((name) =>
                        languages.find((lang) => lang.name === name)?.code
                      )
                      .filter((key): key is string => !!key)
                  )
                : undefined
            }
            onSelectionChange={(selectedKeys) => handleLanguageSelect(selectedKeys as Set<string>)}
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
          onSelectionChange={(selectedKey) => handlePhoneSelect(selectedKey as Set<string>)}
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