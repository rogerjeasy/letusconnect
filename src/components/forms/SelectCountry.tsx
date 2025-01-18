"use client";

import { useEffect, useState } from "react";
import { Select, SelectItem, Avatar, Button, Chip } from "@nextui-org/react";
import { Button as ButtonComponent } from "@/components/ui/button";
import { useCountryStore } from "../../store/userCountryStore";
import { useUserLanguageStore } from "../../store/userLanguageStore";
import { fetchCountryData } from "../../utils/countryapi"
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


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
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : []
  );
  const [open, setOpen] = useState(false);

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

  const handleLanguageToggle = (language: string) => {
    const updatedSelection = selectedLanguages.includes(language)
      ? selectedLanguages.filter(lang => lang !== language)
      : [...selectedLanguages, language];
    
    setSelectedLanguages(updatedSelection);
    onChange?.(updatedSelection);
  };

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
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-default-100 p-4 rounded-lg">
                <span className="text-sm font-medium">
                  Selected Languages: {selectedLanguages.length}
                </span>
              </div>
          
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <ButtonComponent
                    variant="secondary"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-default-50 hover:bg-default-100 transition-colors"
                  >
                    Select Languages
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </ButtonComponent>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search languages..." />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((lang) => (
                          <CommandItem
                            key={lang.code}
                            value={lang.name}
                            onSelect={() => {
                              handleLanguageToggle(lang.name);
                            }}
                          >
                            {lang.name}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedLanguages.includes(lang.name) ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
          
              {selectedLanguages.length > 0 && (
                <div className="border border-default-200 p-6 rounded-lg bg-white">
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguages.map((lang) => (
                      <Chip
                        key={lang}
                        variant="flat"
                        color="primary"
                        className="cursor-pointer hover:opacity-90"
                        onClose={() => handleLanguageToggle(lang)}
                      >
                        {lang}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );

          case "phone":
            return (
              <div className="space-y-4">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <ButtonComponent
                      variant="secondary"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {defaultValue ? 
                        phoneCodes.find(pc => pc.code === defaultValue)?.code || "Select Phone Code" 
                        : "Select Phone Code"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </ButtonComponent>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search phone codes..." />
                      <CommandList>
                        <CommandEmpty>No phone code found.</CommandEmpty>
                        <CommandGroup>
                          {phoneCodes.map((pc) => (
                            <CommandItem
                              key={pc.code}
                              value={pc.code}
                              onSelect={() => {
                                onChange?.(pc.code);
                                setOpen(false);
                              }}
                            >
                              {`${pc.country} (${pc.code})`}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  defaultValue === pc.code ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            );
    }
  };

  return <div className="flex flex-col gap-4">{renderSelection()}</div>;
}
