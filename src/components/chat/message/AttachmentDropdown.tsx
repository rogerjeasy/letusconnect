"use client";

import { useRef } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaPlus, FaFile, FaImage, FaCamera, FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface AttachmentDropdownProps {
    onAttachDocument?: (files: FileList | null) => void;
  onAttachPhotos?: () => void;
  onAttachCamera?: () => void;
  onAttachLocation?: () => void;
}

export const AttachmentDropdown = ({
  onAttachDocument,
  onAttachPhotos,
  onAttachCamera,
  onAttachLocation,
}: AttachmentDropdownProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          aria-label="Add options"
          variant="ghost"
          size="sm"
        >
          <FaPlus className="text-blue-500 text-lg" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Add Options">
        {/* Document Option */}
        <DropdownItem
          key="document"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          <div className="flex items-center gap-2">
            <FaFile className="text-gray-500" />
            <span>Document</span>
          </div>
        </DropdownItem>

        {/* Photos Option */}
        <DropdownItem
          key="photos"
          onClick={onAttachPhotos}
        >
          <div className="flex items-center gap-2">
            <FaImage className="text-blue-500" />
            <span>Photos</span>
          </div>
        </DropdownItem>

        {/* Camera Option */}
        <DropdownItem
          key="camera"
          onClick={onAttachCamera}
        >
          <div className="flex items-center gap-2">
            <FaCamera className="text-green-500" />
            <span>Camera</span>
          </div>
        </DropdownItem>

        {/* Location Option */}
        <DropdownItem
          key="location"
          onClick={onAttachLocation}
        >
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            <span>Location</span>
          </div>
        </DropdownItem>
      </DropdownMenu>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={(e) => onAttachDocument?.(e.target.files)}
      />
    </Dropdown>
  );
};