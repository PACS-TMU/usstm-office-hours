"use client";

import { useState, useEffect } from "react";

export default function CopyEmailButton({ email }: { email: string }) {
    const [copied, setCopied] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Using matchMedia for better responsiveness
        const mobileQuery = window.matchMedia("(max-width: 1024px)"); // md breakpoint, adjust if needed
        setIsMobile(mobileQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mobileQuery.addEventListener("change", handler);

        return () => mobileQuery.removeEventListener("change", handler);
    }, []);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy email:", err);
        }
    }

    if (isMobile) {
        // Mobile: show mailto link instead of copy button
        return (
            <a
                href={`mailto:${email}`}
                className="text-highlight underline hover:text-highlight-dark transition break-all"
            >
                {email}
            </a>
        );
    }

    // Desktop: copy button
    return (
        <div className="inline-block">
            <button
                type="button"
                onClick={handleCopy}
                className="text-highlight underline hover:text-highlight-dark transition"
                aria-label={`Copy email address ${email}`}
            >
                {email}
            </button>
            {copied && (
                <span className="block mt-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    Email copied successfully
                </span>
            )}
        </div>
    );
}
