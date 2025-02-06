"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CreateJobWithAIProps {
  onClose?: () => void;
}

const CreateJobWithAI: React.FC<CreateJobWithAIProps> = ({ onClose }) => {
  const [loading, setLoading] = React.useState(false);
  const [input, setInput] = React.useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // AI processing logic here
      console.log("Processing:", input);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jobInput" className="text-sm md:text-base">
            Job URL or Description
          </Label>
          <Textarea
            id="jobInput"
            placeholder="Paste job posting URL or full job description..."
            className="h-48 text-sm md:text-base resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="text-sm md:text-base"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="text-sm md:text-base"
          >
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobWithAI;