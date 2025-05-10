import {useState} from 'react';
import {cn} from "@/lib/utils";

export default function TruncatedText({text, maxWidth = '600px', textClassName}: {
    text: string,
    maxWidth?: string,
    textClassName?: string
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={cn(`flex items-center `,
                expanded ? 'whitespace-normal ' : 'whitespace-nowrap overflow-hidden text-ellipsis ',
                textClassName
            )}
            style={{maxWidth}}
        >
            <span className="overflow-hidden text-ellipsis">{text}</span>
            {!expanded && (
                <button
                    onClick={() => setExpanded(true)}
                    className="ml-2 flex-shrink-0 text-blue-500 hover:underline"
                >
                    See more
                </button>
            )}
        </div>
    );
}
