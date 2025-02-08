import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

interface LoginDialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ title, isOpen, onClose }) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
    onClose();
  };

  const handleRegister = () => {
    router.push('/register');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-sm mx-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>
            {title}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-24">
            Close
          </Button>
          <Button onClick={handleLogin} className="sm:w-24">
            Login
          </Button>
          <Button variant="destructive" onClick={handleRegister} className="sm:w-24">
            Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const NewApplicationDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter();

  const handleStartTracking = () => {
    router.push('/job-tracker');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-sm mx-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold">Create New Application</DialogTitle>
          <DialogDescription>
            Welcome to your job application tracking journey!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 px-1">
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground block">
              Click the button below to:
            </span>
            <ul className="list-disc pl-4 space-y-1.5 text-sm text-muted-foreground">
              <li>Log and organize your job applications</li>
              <li>Track application statuses and deadlines</li>
              <li>Store important details and notes</li>
              <li>Monitor your progress with analytics</li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center gap-2 pt-2">
            <Button
              size="default"
              className="w-full sm:w-auto gap-2"
              onClick={handleStartTracking}
            >
              <PlusCircle className="w-4 h-4" />
              New Application
            </Button>
            <span className="text-xs text-muted-foreground text-center">
              Click to open the job tracker and start managing your applications
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
