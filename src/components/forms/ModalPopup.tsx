import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ModalPopupProps {
  isOpen: boolean;
  title: string;
  content: string | React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  confirmColor?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  cancelColor?: 'primary' | 'secondary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  showCancelButton?: boolean;
}

const ModalPopup: React.FC<ModalPopupProps> = ({
  isOpen,
  title,
  content,
  confirmLabel,
  cancelLabel = 'Cancel',
  confirmColor = 'primary',
  cancelColor = 'secondary',
  onConfirm,
  onCancel,
  showCancelButton = true,
}) => {
  const getButtonColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 text-gray-600">
          {typeof content === 'string' ? (
            <p className="text-base sm:text-lg">{content}</p>
          ) : (
            content
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 p-4 mt-4 border-t">
          {showCancelButton && (
            <Button
              onClick={onCancel}
              className={`w-full sm:w-auto ${getButtonColorClasses(cancelColor)}`}
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            onClick={onConfirm}
            className={`w-full sm:w-auto ${getButtonColorClasses(confirmColor)}`}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPopup;