import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, ArrowRight, SearchIcon, Send, Check } from 'lucide-react';

const AnimatedHowToConnectProcess = () => {
  const [step, setStep] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
      if (step === 2) setIsDialogOpen(true);
      if (step === 3) setIsDialogOpen(false);
    }, 3000);
    return () => clearInterval(timer);
  }, [step]);

  const mockUsers = [
    {
      name: "Sarah Chen",
      role: "Data Scientist",
      avatar: "/api/placeholder/32/32",
    },
    {
      name: "Alex Thompson",
      role: "ML Engineer",
      avatar: "/api/placeholder/32/32",
    },
    {
      name: "Maya Patel",
      role: "AI Researcher",
      avatar: "/api/placeholder/32/32",
    }
  ];

  const variants = {
    enter: {
      x: 1000,
      opacity: 0
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: {
      zIndex: 0,
      x: -1000,
      opacity: 0
    }
  };

  const RegistrationForm = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Full Name" />
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        <Button className="w-full">Register</Button>
      </CardContent>
    </Card>
  );

  const UserDirectory = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SearchIcon className="h-5 w-5" />
          Find Connections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Search users..." className="mb-4" />
        <div className="space-y-4">
          {mockUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.role}</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const ConnectionDialog = () => (
    <Dialog open={isDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Connection Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Maya Patel</div>
              <div className="text-sm text-gray-500">AI Researcher</div>
            </div>
          </div>
          <Textarea
            placeholder="Add a personal note to your connection request..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Send Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const SuccessCard = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Check className="h-8 w-8 text-green-600" />
          </motion.div>
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">Request Sent!</h3>
        <p className="text-gray-600">Your connection request has been sent successfully.</p>
      </CardContent>
    </Card>
  );

  const components = [
    <RegistrationForm key="register" />,
    <UserDirectory key="directory" />,
    <UserDirectory key="connect" />,
    <ConnectionDialog key="dialog" />,
    <SuccessCard key="success" />
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Connection Process
          </h1>
          <div className="flex justify-center gap-2">
            {Array(5).fill(0).map((_, i) => (
              <motion.div
                key={i}
                className={`h-2 w-2 rounded-full ${i === step ? 'bg-blue-600' : 'bg-gray-300'}`}
                animate={{
                  scale: i === step ? [1, 1.2, 1] : 1
                }}
                transition={{
                  duration: 0.5,
                  repeat: i === step ? Infinity : 0
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative h-[600px] flex items-center justify-center">
          <AnimatePresence initial={false}>
            <motion.div
              key={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full"
            >
              {components[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AnimatedHowToConnectProcess;