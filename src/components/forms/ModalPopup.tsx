import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-md';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600 text-white shadow-md';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white shadow-md';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white shadow-md';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-md';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 sm:max-w-md md:max-w-lg lg:max-w-xl rounded-lg shadow-xl bg-white overflow-hidden">
        <DialogHeader className="bg-blue-50 px-6 py-4 border-b border-blue-100">
          <DialogTitle className="text-xl font-semibold w-full flex items-center justify-center text-blue-800">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-8 text-gray-600 text-center bg-white">
          {typeof content === 'string' ? (
            <p className="text-base sm:text-lg mx-auto max-w-prose leading-relaxed">
              {content}
            </p>
          ) : (
            content
          )}
        </div>
        
        <DialogFooter className="bg-gray-100 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            {showCancelButton && (
              <Button
                onClick={onCancel}
                className={`w-full sm:w-32 rounded-md transition-all duration-200 ${getButtonColorClasses(cancelColor)}`}
              >
                {cancelLabel}
              </Button>
            )}
            <Button
              onClick={onConfirm}
              className={`w-full sm:w-32 rounded-md transition-all duration-200 ${getButtonColorClasses(confirmColor)}`}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPopup;