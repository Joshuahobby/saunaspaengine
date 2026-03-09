"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="material-symbols-outlined text-slate-400 text-sm cursor-pointer hover:text-white transition-colors border-none bg-transparent p-0"
            aria-label="Copy to clipboard"
            title="Copy to clipboard"
        >
            {copied ? "check" : "content_copy"}
        </button>
    );
}
