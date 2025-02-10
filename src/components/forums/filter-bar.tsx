import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from 'lucide-react';
import { GroupCategory } from '@/store/groupForum';


interface FilterBarProps {
    categories: GroupCategory[];
    selectedCategory: string;
    selectedPrivacy: string;
    onCategoryChange: (value: string) => void;
    onPrivacyChange: (value: string) => void;
    onSortChange: (value: 'name' | 'members' | 'newest') => void;
  }
  
  export const FilterBar: React.FC<FilterBarProps> = ({
    categories,
    selectedCategory,
    selectedPrivacy,
    onCategoryChange,
    onPrivacyChange,
    onSortChange,
  }) => (
    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.name} value={category.name}>
              {category.name} ({category.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
  
      <Select value={selectedPrivacy} onValueChange={onPrivacyChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Privacy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="private">Private</SelectItem>
          <SelectItem value="restricted">Restricted</SelectItem>
        </SelectContent>
      </Select>
  
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSortChange('name')}>
            Name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('members')}>
            Most Members
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('newest')}>
            Newest First
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );