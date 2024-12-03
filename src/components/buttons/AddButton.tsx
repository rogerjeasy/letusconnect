import React from "react";
import { PlusCircleIcon } from "../icons/PlusCircleIcon";

interface AddButtonIconProps {
  text?: string;
}

const AddButtonIcon: React.FC<AddButtonIconProps> = ({ text = "Add New Item" }) => {
  return (
    <div className="flex items-center gap-2">
      <PlusCircleIcon style={{ width: "24px", height: "24px" }} />
      <span>{text}</span>
    </div>
  );
};

export default AddButtonIcon;