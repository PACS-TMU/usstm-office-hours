export const dynamic = "force-dynamic";

import { getCalendarRange } from "@/server/ohActions";
import { startOfISOWeek, addDays, toDateOnlyLocal } from "@/lib/dates";
import CalendarClient from "./CalendarClient";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import { createClient } from "@/lib/supabase/server";

export default async function CalendarPage({
    searchParams,
}: {
    searchParams: { week?: string };
}) {
    const { week } = await searchParams;
    // parse as local date (avoid UTC)
    const base = week
        ? new Date(week + "T00:00:00")
        : new Date();

    const weekStart = startOfISOWeek(base);
    const startISO = toDateOnlyLocal(weekStart);
    const endISO = toDateOnlyLocal(addDays(weekStart, 4));

    const cells = await getCalendarRange(startISO, endISO);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <main className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">USSTM Office Hours Calendar</h1>
            {user ? (
                <p className="mb-4 text-gray-600">
                    To schedule yourself for a shift, please go to the{" "}
                    <a href="/dashboard/shifts" className="text-blue-500 hover:underline">
                        Shift Management
                    </a>{" "}
                    page.
                </p>
            ) : (
                <p className="mb-4 text-gray-600">
                    If you are a USSTM member, please{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        log in
                    </a>{" "}
                    to schedule yourself for shifts.
                </p>
            )}
            <CalendarClient weekStartISO={startISO} />
            <CalendarGrid cells={cells} />
        </main>
    );
}
