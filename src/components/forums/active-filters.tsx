import React from 'react';
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  onClearSearch: () => void;
  onClearCategory: () => void;
  totalResults: number;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  searchTerm,
  selectedCategory,
  onClearSearch,
  onClearCategory,
  totalResults,
}) => (
  <div className="flex items-center justify-between text-sm text-muted-foreground">
    <span>{totalResults} groups found</span>
    <div className="flex gap-2">
      {searchTerm && (
        <Badge variant="secondary" className="gap-1">
          Search: {searchTerm}
          <X className="h-3 w-3 cursor-pointer" onClick={onClearSearch} />
        </Badge>
      )}
      {selectedCategory !== 'all' && (
        <Badge variant="secondary" className="gap-1">
          Category: {selectedCategory}
          <X className="h-3 w-3 cursor-pointer" onClick={onClearCategory} />
        </Badge>
      )}
    </div>
  </div>
);