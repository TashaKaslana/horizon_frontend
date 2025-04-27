import React from 'react';
import {cn} from "@/lib/utils";

type MentionedTextProps = {
    content: string;
    className?: string;
    mentionStyle?: string
};

const MentionedText = ({content, className, mentionStyle}: MentionedTextProps) => {
    const mentionRegex = /@(\w+)/g; // Match words starting with "@"

    const renderTextWithMentions = (text: string) => {
        return text.split(mentionRegex).map((part, index) => {
            if (index % 2 === 1) {
                // This part is a mention (@username)
                return <span key={index} className={cn("text-sky-400 italic", mentionStyle)}>{`@${part}`}</span>;
            }
            return part; // Normal text, no styling needed
        });
    };

    return (
        <p className={cn("text-base", className)}>
            {renderTextWithMentions(content)}
        </p>
    );
};

export default MentionedText;
