
import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * A simple formatter to convert Markdown-like text from AI into readable JSX.
 * Handles: Bold (**), Headers (###), and Bullet points (- or *)
 */
const FormattedText: React.FC<FormattedTextProps> = ({ text, className = "" }) => {
  const lines = text.split('\n');

  return (
    <div className={`ai-result-content ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        if (!trimmed) return <br key={idx} />;

        // Header Check
        if (trimmed.startsWith('###')) {
          return <h3 key={idx}>{trimmed.replace(/^###\s*/, '')}</h3>;
        }

        // List Item Check
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <li key={idx} className="ml-4">
              {formatBold(trimmed.replace(/^[-*]\s*/, ''))}
            </li>
          );
        }

        // Default Paragraph
        return <p key={idx}>{formatBold(trimmed)}</p>;
      })}
    </div>
  );
};

// Helper to handle **bold** text
function formatBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default FormattedText;
