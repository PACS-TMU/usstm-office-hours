"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";

const AUTO_DISMISS_MS = 5000; // how long the toast stays
const EXIT_MS = 350; // fade/slide out duration (matches Tailwind duration)

export default function MessageAcceptor() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [content, setContent] = useState("");
    const [type, setType] = useState<"success" | "error">("success");
    const [visible, setVisible] = useState(false); // mounted
    const [show, setShow] = useState(false); // anim state
    const [paused, setPaused] = useState(false);
    const [remaining, setRemaining] = useState(AUTO_DISMISS_MS);

    // Read from URL once and then clean the params
    useEffect(() => {
        const msg =
            searchParams.get("message") || searchParams.get("error") || "";
        if (!msg) return;

        const t = searchParams.get("error") ? "error" : "success";
        setContent(msg);
        setType(t);
        setRemaining(AUTO_DISMISS_MS);
        setPaused(false);
        setVisible(true);
        setShow(true);

        // Clear the params without pushing history
        const params = new URLSearchParams(searchParams.toString());
        params.delete("message");
        params.delete("error");
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, [searchParams, pathname, router]);

    // Countdown timer with pause support
    useEffect(() => {
        if (!visible || !show || paused) return;
        const tick = 50; // ms
        const id = setInterval(() => {
            setRemaining((prev) => {
                const next = prev - tick;
                if (next <= 0) {
                    // start exit animation
                    setShow(false);
                    // unmount after the transition
                    setTimeout(() => setVisible(false), EXIT_MS);
                    return 0;
                }
                return next;
            });
        }, tick);
        return () => clearInterval(id);
    }, [visible, show, paused]);

    if (!visible || !content) return null;

    const progressPct = Math.max(
        0,
        Math.min(100, (remaining / AUTO_DISMISS_MS) * 100)
    );

    return (
        <div
            role="status"
            aria-live={type === "error" ? "assertive" : "polite"}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className={[
                "fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md",
                "transition-all duration-300",
                show
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none",
            ].join(" ")}
        >
            <div
                className={[
                    "relative shadow-xl rounded-xl flex items-center px-6 py-4 border",
                    type === "error"
                        ? "bg-red-100 border-red-300"
                        : "bg-green-100 border-green-300",
                ].join(" ")}
            >
                <div className="flex-1">
                    <span
                        className={[
                            "text-base font-semibold tracking-tight",
                            type === "error"
                                ? "text-red-800"
                                : "text-green-800",
                        ].join(" ")}
                    >
                        {content}
                    </span>
                </div>

                <button
                    className="ml-4 p-2 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    onClick={() => {
                        // smooth close
                        setShow(false);
                        setTimeout(() => setVisible(false), EXIT_MS);
                    }}
                    aria-label="Dismiss"
                >
                    <AiOutlineClose className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors duration-300 ease-in-out" />
                </button>

                {/* Progress bar */}
                <div
                    className={[
                        "absolute left-0 bottom-0 h-1 rounded-b-xl",
                        type === "error" ? "bg-red-500" : "bg-green-500",
                    ].join(" ")}
                    style={{
                        width: `${progressPct}%`,
                        transition: paused ? "none" : "width 100ms linear",
                    }}
                    aria-hidden="true"
                />
            </div>
        </div>
    );
}
