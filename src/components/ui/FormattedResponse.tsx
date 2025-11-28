import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface FormattedResponseProps {
  content: string;
  className?: string;
}

export const FormattedResponse: React.FC<FormattedResponseProps> = ({
  content,
  className
}) => {
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeContent: string[] = [];
    let listItems: string[] = [];
    let currentListType: 'bullet' | 'numbered' | null = null;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <div key={`list-${elements.length}`} className="my-3">
            {currentListType === 'numbered' ? (
              <ol className="list-decimal list-inside space-y-1">
                {listItems.map((item, idx) => (
                  <li key={idx} className="text-gray-300 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc list-inside space-y-1">
                {listItems.map((item, idx) => (
                  <li key={idx} className="text-gray-300 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
        listItems = [];
        currentListType = null;
      }
    };

    const flushCodeBlock = () => {
      if (codeContent.length > 0) {
        elements.push(
          <div key={`code-${elements.length}`} className="my-4">
            <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
              {codeLanguage && (
                <div className="bg-gray-900 px-4 py-2 text-xs text-gray-400 border-b border-gray-800">
                  {codeLanguage}
                </div>
              )}
              <ScrollArea className="max-h-96">
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-gray-200 font-mono">
                    {codeContent.join('\n')}
                  </code>
                </pre>
              </ScrollArea>
            </div>
          </div>
        );
        codeContent = [];
        codeLanguage = '';
      }
    };

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock();
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Handle inline code
      if (line.includes('`') && !line.startsWith('```')) {
        flushList();
        const parts = line.split(/(`[^`]+`)/g);
        const formattedLine = parts.map((part, idx) => {
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code
                key={idx}
                className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-sm font-mono"
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        });

        elements.push(
          <p key={`inline-code-${index}`} className="text-gray-300 leading-relaxed my-2">
            {formattedLine}
          </p>
        );
        return;
      }

      // Handle headers
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4 first:mt-0">
            {line.slice(2)}
          </h1>
        );
        return;
      }

      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-semibold text-white mt-6 mb-3 first:mt-0">
            {line.slice(3)}
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-white mt-5 mb-2 first:mt-0">
            {line.slice(4)}
          </h3>
        );
        return;
      }

      if (line.startsWith('#### ')) {
        flushList();
        elements.push(
          <h4 key={index} className="text-lg font-semibold text-white mt-4 mb-2 first:mt-0">
            {line.slice(5)}
          </h4>
        );
        return;
      }

      // Handle bold text
      if (line.includes('**')) {
        flushList();
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const formattedLine = parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={idx} className="text-white font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        elements.push(
          <p key={`bold-${index}`} className="text-gray-300 leading-relaxed my-2">
            {formattedLine}
          </p>
        );
        return;
      }

      // Handle lists
      if (line.match(/^\d+\.\s/)) {
        if (currentListType !== 'numbered') {
          flushList();
          currentListType = 'numbered';
        }
        listItems.push(line.replace(/^\d+\.\s/, ''));
        return;
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        if (currentListType !== 'bullet') {
          flushList();
          currentListType = 'bullet';
        }
        listItems.push(line.slice(2));
        return;
      }

      // Handle blockquotes
      if (line.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={index} className="border-l-4 border-blue-500 pl-4 py-2 my-3 bg-gray-900/50 rounded-r">
            <p className="text-gray-300 italic">{line.slice(2)}</p>
          </blockquote>
        );
        return;
      }

      // Handle empty lines
      if (line.trim() === '') {
        flushList();
        elements.push(<div key={`space-${index}`} className="h-2" />);
        return;
      }

      // Handle regular paragraphs
      if (line.trim()) {
        flushList();
        elements.push(
          <p key={index} className="text-gray-300 leading-relaxed my-2">
            {line}
          </p>
        );
      }
    });

    // Flush any remaining content
    flushList();
    flushCodeBlock();

    return elements;
  };

  return (
    <div className={cn("prose prose-invert max-w-none", className)}>
      <ScrollArea className="max-h-[70vh]">
        <div className="space-y-1">
          {parseContent(content)}
        </div>
      </ScrollArea>
    </div>
  );
}; 