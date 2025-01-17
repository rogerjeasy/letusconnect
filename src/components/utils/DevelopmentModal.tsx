"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Construction } from 'lucide-react';

interface DevelopmentModalProps {
  buttonText: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  buttonClassName?: string;
  title?: string;
  description?: string;
  icon?: 'alert' | 'construction';
}

const DevelopmentModal = ({
  buttonText,
  buttonVariant = 'default',
  buttonClassName = '',
  title = 'Feature Under Development',
  description = 'This feature is currently under development and will be available soon. We appreciate your patience!',
  icon = 'construction'
}: DevelopmentModalProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const Icon = icon === 'alert' ? AlertCircle : Construction;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          className={`text-sm sm:text-base ${buttonClassName}`}
        >
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="fixed left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(calc(100vw-2rem),32rem)] rounded-lg shadow-xl bg-white overflow-hidden">
        <DialogHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex h-16 w-16 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-amber-100 shrink-0">
              <Icon className="h-8 w-8 sm:h-6 sm:w-6 text-amber-600" />
            </div>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base text-center sm:text-left leading-relaxed px-2 sm:px-0">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 sm:mt-8 px-2 sm:px-0">
        <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto text-sm sm:text-base px-4 py-2 sm:px-6 bg-blue-500 hover:bg-blue-600 text-white border-blue-600 hover:border-blue-700"
        >
            Got it, thanks!
        </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DevelopmentModal;