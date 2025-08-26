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
    const base = week ? new Date(week + "T00:00:00") : new Date();

    const weekStart = startOfISOWeek(base);
    const startISO = toDateOnlyLocal(weekStart);
    const endISO = toDateOnlyLocal(addDays(weekStart, 4));

    const cells = await getCalendarRange(startISO, endISO);

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
            <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                USSTM Office Hours Calendar
            </h1>

            {user ? (
                <p className="mb-4 text-gray-600 text-sm sm:text-base">
                    To schedule yourself for a shift, please go to the{" "}
                    <a
                        href="/dashboard/shifts"
                        className="text-blue-500 hover:underline"
                    >
                        Shift Management
                    </a>{" "}
                    page.
                </p>
            ) : (
                <p className="mb-4 text-gray-600 text-sm sm:text-base">
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
