"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { studyPrograms } from "@/schemas/registerSchema"
import type { RegisterFormValues } from "@/schemas/registerSchema"

interface ProgramComboboxProps {
  value: RegisterFormValues['program']
  onChange: (value: RegisterFormValues['program']) => void
}

export function ProgramCombobox({ value, onChange }: ProgramComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Select program..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search programs..." className="h-9" />
          <CommandList>
            <CommandEmpty>No program found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {studyPrograms.map((program) => (
                <CommandItem
                  key={program.value}
                  value={program.label}
                  onSelect={() => {
                    onChange(program.label as RegisterFormValues['program'])
                    setOpen(false)
                  }}
                >
                  {program.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === program.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}