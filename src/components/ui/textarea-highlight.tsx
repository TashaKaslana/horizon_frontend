import * as React from "react";
import {cn} from "@/lib/utils";
import {HighlightWithinTextarea} from "react-highlight-within-textarea";
import {type HWTAProps} from "react-highlight-within-textarea/lib/esm/HighlightWithinTextarea";

type Highlight =
    | string
    | RegExp
    | (string | RegExp)[]
    | ((value: string) => string | RegExp | (string | RegExp)[]);

const TextareaHighlight = ({
                               value,
                               highlightString,
                               onChange,
                               className,
                               ...restProps
                           }: {
    value: string;
    highlightString: Highlight;
    onChange: (value: string) => void;
    className?: string;
} & HWTAProps) => {
    return (
        <div
            className={cn(
                "relative rounded border border-input p-1 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                className,
            )}
        >
            <HighlightWithinTextarea
                value={value}
                highlight={highlightString}
                onChange={onChange}
                {...restProps}
            />
        </div>
    );
};

TextareaHighlight.displayName = "TextareaHighlight";

export {TextareaHighlight};