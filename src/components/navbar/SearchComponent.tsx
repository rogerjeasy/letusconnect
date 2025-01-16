"use client";

import React, { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { useClickAway } from 'react-use';
import { SearchIcon } from "./SearchIcon";

const SearchComponent = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = React.useRef(null);

  useClickAway(searchRef, () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  });

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div className="relative" ref={searchRef}>
      {!isSearchOpen ? (
        <Button
          isIconOnly
          variant="light"
          className="text-white"
          size="sm"
          onPress={toggleSearch}
        >
          <SearchIcon size={18} />
        </Button>
      ) : (
        <div className="absolute right-0 top-0 flex gap-2">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[12rem] h-10 bg-gray-200 rounded-full",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-gray-200",
            }}
            placeholder="Search..."
            size="sm"
            startContent={<SearchIcon size={18} />}
            type="search"
            autoFocus
          />
          <Button
            size="sm"
            color="primary"
            onPress={toggleSearch}
          >
            Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;