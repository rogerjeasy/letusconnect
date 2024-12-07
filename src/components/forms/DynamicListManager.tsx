"use client";

import { Button } from "@nextui-org/react";
import InputToUpdate from "../forms/InputToUpdate";
import InputForm from "../forms/InputForm";
import { DeleteDocumentIcon } from "../icons/DeleteDocumentIcon";
import { PlusCircleIcon } from "../icons/PlusCircleIcon";

interface DynamicListManagerProps {
  title: string;
  items: string[];
  isEditing: boolean;
  handleAddItem: () => void;
  handleUpdateItem: (index: number, value: string) => void;
  handleDeleteItem: (index: number) => void;
}

export default function DynamicListManager({
  title,
  items,
  isEditing,
  handleAddItem,
  handleUpdateItem,
  handleDeleteItem,
}: DynamicListManagerProps) {
  return (
    <>
      <p className="text-md font-bold">{title}</p>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {isEditing ? (
            <InputToUpdate
              type="text"
              label={`${title.slice(0, -1)} ${index + 1}`}
              placeholder={`Enter ${title.slice(0, -1).toLowerCase()}`}
              value={item}
              onChange={(value) => handleUpdateItem(index, value)}
            />
          ) : (
            <InputForm
              type="text"
              label={`${title.slice(0, -1)} ${index + 1}`}
              value={item}
            />
          )}
          {isEditing && (
            <Button
              size="sm"
              variant="flat"
              color="danger"
              onPress={() => handleDeleteItem(index)}
              startContent={<DeleteDocumentIcon />}
            >
              Remove
            </Button>
          )}
        </div>
      ))}
      {isEditing && (
        <Button
          size="sm"
          variant="flat"
          color="primary"
          onPress={handleAddItem}
          startContent={<PlusCircleIcon />}
        >
          Add {title.slice(0, -1)}
        </Button>
      )}
    </>
  );
}
