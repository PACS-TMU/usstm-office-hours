"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import WeekToolbar from "@/components/calendar/WeekToolbar";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import { bookShift, unbookShift } from "@/server/ohActions";
import { addWeeksFromISO, startOfISOWeek, toDateOnlyLocal } from "@/lib/dates";

export default function PlannerClient({
    weekStartISO,
    grid,
    myShifts,
}: {
    weekStartISO: string;
    grid: any[];
    myShifts: { id: string; shift_date: string; slot_id: number }[];
}) {
    const [isPending, startTransition] = useTransition();
    const [mine, setMine] = useOptimistic(myShifts);

    const router = useRouter();
    const sp = useSearchParams();

    // week shown right now (prefer URL, fallback to server-provided)
    const currentWeek = sp.get("week") ?? weekStartISO;

    const pushWeek = (w: string) => {
        const qs = new URLSearchParams(sp.toString());
        qs.set("week", w);
        router.push(`/dashboard/shifts?${qs.toString()}`);
    };

    const go = (delta: number) => {
        if (delta === 0) {
            // jump to THIS week (local)
            pushWeek(toDateOnlyLocal(startOfISOWeek(new Date())));
            return;
        }
        pushWeek(addWeeksFromISO(currentWeek, delta));
    };

    const isMine = (date: string, slotId: number) =>
        mine.some((s) => s.shift_date === date && s.slot_id === slotId);

    const handleToggle = (date: string, slotId: number) => {
        const existing = mine.find(
            (s) => s.shift_date === date && s.slot_id === slotId
        );
        if (existing) {
            startTransition(async () => {
                setMine(
                    mine.filter(
                        (s) => !(s.shift_date === date && s.slot_id === slotId)
                    )
                );
                await unbookShift(existing.id);
            });
        } else {
            startTransition(async () => {
                setMine([
                    ...mine,
                    {
                        id: `temp-${date}-${slotId}`,
                        shift_date: date,
                        slot_id: slotId,
                    },
                ]);
                await bookShift(date, slotId);
            });
        }
    };

    const picked = mine.length;

    // mirror the window (current + next) on client; adjust easily later
    const MAX_WEEKS = 2;

    const isBookable = (dateISO: string) => {
        const [y, m, d] = dateISO.split("-").map(Number);
        const target = new Date(y, m - 1, d);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (target < today) return false; // no past

        const curStart = startOfISOWeek(today);
        const newStart = startOfISOWeek(target);
        const diffWeeks = Math.floor(
            (newStart.getTime() - curStart.getTime()) / (7 * 86400000)
        );
        return diffWeeks <= MAX_WEEKS - 1; // current + next only
    };

    return (
        <div className="space-y-4">
            <WeekToolbar
                weekStartISO={currentWeek} // label reflects URL week
                onPrev={() => go(-1)}
                onNext={() => go(1)}
            />
            <div className="text-sm text-gray-600">
                You have picked <b>{picked}</b> / 2 shifts this week.
            </div>
            <CalendarGrid
                cells={grid}
                onToggle={handleToggle}
                isMine={isMine}
                pending={isPending}
                isBookable={isBookable}
            />
            {currentWeek !== toDateOnlyLocal(startOfISOWeek(new Date())) && (
                <button
                    type="button"
                    onClick={() => go(0)}
                    className="inline-flex items-center px-3 py-1 rounded bg-highlight text-white hover:bg-highlight-dark transition"
                >
                    Back to This Week
                </button>
            )}
        </div>
    );
}
