"use client";

import React from 'react';
import { Button } from '@nextui-org/react';
import { useRouter } from "next/navigation";

interface RenderBotMessageProps {
  message: string;
}

const RenderBotMessage: React.FC<RenderBotMessageProps> = ({ message }) => {
  const router = useRouter();
  const getHeadingComponent = (level: number, content: string, key: string) => {
    const className = {
      1: "text-2xl font-bold mb-4",
      2: "text-xl font-bold mb-3",
      3: "text-lg font-bold mb-2",
      4: "text-base font-bold mb-2",
      5: "text-sm font-bold mb-2",
      6: "text-xs font-bold mb-2"
    }[level] || "text-base font-bold mb-2";

    return <div key={key} className={className}>{content}</div>;
  };
  const processMessageParts = (text: string) => {
    // Split the text into lines first
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Check if the line starts with a number
      const numberedItemMatch = line.match(/^(\d+)\.\s+(.+)$/);
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const headingLevel = headingMatch[1].length;
        const headingContent = headingMatch[2];
        return getHeadingComponent(headingLevel, headingContent, `heading-${lineIndex}`);
      }
      
      if (numberedItemMatch) {
        const [_, number, content] = numberedItemMatch;
        
        // Process the content part for bold text and colons
        const processedContent = content.split(/(\*\*[^*]+\*\*)/).map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // For bold text, we want to keep any following colon attached
            const boldText = part.slice(2, -2);
            const hasColon = boldText.includes(':');
            if (hasColon) {
              const [text, ...rest] = boldText.split(':');
              return (
                <React.Fragment key={`bold-${lineIndex}-${partIndex}`}>
                  <strong>{text}</strong>:
                  {rest.join(':')}
                </React.Fragment>
              );
            }
            return <strong key={`bold-${lineIndex}-${partIndex}`}>{boldText}</strong>;
          }
          
          // Handle URLs in the remaining text
          const words = part.split(/\s+/);
          return words.map((word, wordIndex) => {
            const elementKey = `${lineIndex}-${partIndex}-${wordIndex}`;
            // Check if the word is a URL (either starting with http/https or with /)
            if (word.startsWith('http://') || word.startsWith('https://')) {
              try {
                const url = new URL(word);
                const path = url.pathname;
                return (
                  <React.Fragment key={`fragment-${elementKey}`}>
                    <Button
                      key={`link-${elementKey}`}
                      size="sm"
                      variant="light"
                      color="success"
                      className="px-0 min-w-0 h-auto font-normal"
                      onClick={() => router.push(path)}
                    >
                      {word}
                    </Button>
                    <span key={`space-${elementKey}`}> </span>
                  </React.Fragment>
                );
              } catch {
                return <span key={`text-${elementKey}`}>{word} </span>;
              }
            } else if (word.startsWith('/') && !word.includes('//')) {
              return (
                <React.Fragment key={`fragment-${elementKey}`}>
                  <Button
                    key={`link-${elementKey}`}
                    size="sm"
                    variant="light"
                    color="success"
                    className="px-0 min-w-0 h-auto font-normal"
                    onClick={() => router.push(word)}
                  >
                    {word}
                  </Button>
                  <span key={`space-${elementKey}`}> </span>
                </React.Fragment>
              );
            }
            return <span key={`text-${elementKey}`}>{word} </span>;
          });
        });

        // Return the numbered item with proper spacing
        return (
          <div key={`line-${lineIndex}`} className="flex items-start space-x-2 mb-2">
            <span className="flex-shrink-0">{number}.</span>
            <span className="flex-1">
              {processedContent}
            </span>
          </div>
        );
      }

      // For non-numbered lines, just process bold text and paths
      return (
        <div key={`line-${lineIndex}`} className="mb-2">
          {line.split(/(\*\*[^*]+\*\*)/).map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={`bold-${lineIndex}-${partIndex}`}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </div>
      );
    });
  };

  return (
    <span className="whitespace-pre-wrap break-words">
      {processMessageParts(message)}
    </span>
  );
};

export default RenderBotMessage;