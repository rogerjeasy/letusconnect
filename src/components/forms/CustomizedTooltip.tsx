"use client";
import React from 'react';
import { Tooltip, Button, TooltipProps } from "@nextui-org/react";

interface CustomizedTooltipProps extends Partial<TooltipProps> {
  placement?: 'top' | 'right' | 'bottom' | 'left';
  tooltipContent?: React.ReactNode;
  buttonText?: string | React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  buttonColor?: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
  isDisabled?: boolean;
}

const CustomizedTooltip: React.FC<CustomizedTooltipProps> = ({
  tooltipContent = 'I am a tooltip',
  placement = "right",
  buttonText = 'Hover me',
  children,
  onClick,
  isDisabled = false,
  buttonColor = "primary",
  ...props
}) => {
  const buttonContent = children || (
    <Button
      variant="bordered"
      className={`bg-gradient-to-br from-neutral-50 to-neutral-200 ${
        isDisabled ? "opacity-70" : "hover:from-neutral-100 hover:to-neutral-300"
      }`}
      onPress={onClick}
      isDisabled={isDisabled}
      color={buttonColor}
      size="sm"
    >
      {buttonText}
    </Button>
  );

  if (isDisabled) {
    return buttonContent;
  }

  return (
    <Tooltip
      showArrow
      placement={placement}
      closeDelay={0}
      content={
        <div className="px-1 py-2">
          <div className="text-small text-foreground">{tooltipContent}</div>
        </div>
      }
      classNames={{
        base: [
          "before:bg-neutral-400 dark:before:bg-white",
        ],
        content: [
          "py-2 px-4 shadow-xl",
          "text-black bg-gradient-to-br from-white to-neutral-200"
        ],
      }}
      {...props}
    >
      {buttonContent}
    </Tooltip>
  );
};

export default CustomizedTooltip;