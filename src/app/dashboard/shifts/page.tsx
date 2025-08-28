import { startOfISOWeek, toDateOnlyLocal, addDays } from "@/lib/dates";
import {
    getCalendarRange,
    getMyWeekShifts,
    requireBoardMember,
} from "@/server/ohActions";
import PlannerClient from "./PlannerClient";
import { Suspense } from "react";

export default async function ShiftsPage({
    searchParams,
}: {
    searchParams: Promise<{ week?: string }>;
}) {
    await requireBoardMember();

    const { week } = await searchParams;
    const base = week ? new Date(`${week}T00:00:00`) : new Date();
    const weekStart = startOfISOWeek(base);
    const startISO = toDateOnlyLocal(weekStart);
    const endISO = toDateOnlyLocal(addDays(weekStart, 4));

    const [cells, myShifts] = await Promise.all([
        getCalendarRange(startISO, endISO),
        getMyWeekShifts(startISO),
    ]);

    return (
        <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
            <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                My Shift Schedule
            </h1>
            <Suspense fallback={<div>Loading...</div>}>
                <PlannerClient
                    weekStartISO={startISO}
                    grid={cells}
                    myShifts={myShifts}
                />
            </Suspense>
        </main>
    );
}
