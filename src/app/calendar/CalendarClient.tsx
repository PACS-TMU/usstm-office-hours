"use client";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WeekToolbar from "@/components/calendar/WeekToolbar";
import { addWeeksFromISO, startOfISOWeek, toDateOnlyLocal } from "@/lib/dates";

export default function CalendarClient({
    weekStartISO,
}: {
    weekStartISO: string;
}) {
    const router = useRouter();
    const sp = useSearchParams();

    // Week (YYYY-MM-DD) for "this week" in LOCAL time
    const todayWeekISO = useMemo(
        () => toDateOnlyLocal(startOfISOWeek(new Date())),
        []
    );

    // Current week shown (prefer URL param, fallback to prop)
    const currentWeek = sp.get("week") ?? weekStartISO;

    const pushWeek = (weekISO: string) => {
        const qs = new URLSearchParams(sp.toString());
        qs.set("week", weekISO);
        router.push(`/calendar?${qs.toString()}`);
    };

    const go = (delta: number) => {
        // delta 0 means: jump to "this week"
        if (delta === 0) {
            pushWeek(todayWeekISO);
            return;
        }
        const next = addWeeksFromISO(currentWeek, delta); // local-safe add
        pushWeek(next);
    };

    const isOnThisWeek = currentWeek === todayWeekISO;

    return (
        <>
            <WeekToolbar
                weekStartISO={currentWeek} // show the week currently in the URL
                onPrev={() => go(-1)}
                onNext={() => go(1)}
            />
            {!isOnThisWeek && (
                <div className="flex items-center justify-center my-2">
                    <button
                        type="button"
                        onClick={() => go(0)}
                        className="inline-flex items-center mx-auto px-3 py-1 rounded bg-highlight text-white hover:bg-highlight-dark transition"
                    >
                        Back to This Week
                    </button>
                </div>
            )}
        </>
    );
}
