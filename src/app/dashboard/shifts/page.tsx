import { startOfISOWeek, toDateOnlyLocal, addDays } from "@/lib/dates";
import {
    getCalendarRange,
    getMyWeekShifts,
    requireBoardMember,
} from "@/server/ohActions";
import PlannerClient from "./PlannerClient";

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
        <main className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Shift Schedule</h1>
            <PlannerClient
                weekStartISO={startISO}
                grid={cells}
                myShifts={myShifts}
            />
        </main>
    );
}
