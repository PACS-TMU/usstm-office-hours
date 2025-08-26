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

    const todayWeekISO = useMemo(
        () => toDateOnlyLocal(startOfISOWeek(new Date())),
        []
    );

    const currentWeek = sp.get("week") ?? weekStartISO;

    const pushWeek = (weekISO: string) => {
        const qs = new URLSearchParams(sp.toString());
        qs.set("week", weekISO);
        router.push(`/calendar?${qs.toString()}`);
    };

    const go = (delta: number) => {
        if (delta === 0) {
            pushWeek(todayWeekISO);
            return;
        }
        const next = addWeeksFromISO(currentWeek, delta);
        pushWeek(next);
    };

    const isOnThisWeek = currentWeek === todayWeekISO;

    return (
        <>
            <WeekToolbar
                weekStartISO={currentWeek}
                onPrev={() => go(-1)}
                onNext={() => go(1)}
            />
            {!isOnThisWeek && (
                <div className="flex items-center justify-center my-2">
                    <button
                        type="button"
                        onClick={() => go(0)}
                        className="inline-flex items-center w-full sm:w-auto justify-center px-3 py-2 rounded bg-highlight text-white hover:bg-highlight-dark transition text-sm"
                    >
                        Back to This Week
                    </button>
                </div>
            )}
        </>
    );
}
