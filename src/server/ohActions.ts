"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { addDays } from "@/lib/dates";

const ok = (s: string, to = "/dashboard/shifts") =>
    redirect(`${to}?message=${encodeURIComponent(s)}`);
const fail = (s: string, to = "/dashboard/shifts") =>
    redirect(`${to}?error=${encodeURIComponent(s)}`);

export async function getCurrentUser() {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error || !user) fail("Please sign in.", "/login");
    return user!;
}

export async function requireBoardMember() {
    const supabase = await createClient();
    const user = await getCurrentUser();
    const { data, error } = await supabase
        .from("usstm_board")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
    if (error || !data) fail("Only board members can access shifts.");
    return user;
}

/** Public calendar: full grid for a date range (Mon–Fri x 4) */
export async function getCalendarRange(startISO: string, endISO: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("oh_calendar_range", {
        p_start: startISO,
        p_end: endISO,
    });
    if (error) throw error;
    return data ?? [];
}

/** My shifts for a given week (Mon..Fri window derived from startISO) */
export async function getMyWeekShifts(startISO: string) {
    const supabase = await createClient();
    const user = await getCurrentUser();
    const endISO = addDays(new Date(startISO), 4).toISOString().slice(0, 10);

    const { data, error } = await supabase
        .from("oh_shifts")
        .select("id, shift_date, slot_id")
        .eq("member_id", user.id)
        .gte("shift_date", startISO)
        .lte("shift_date", endISO);

    if (error) throw error;
    return data ?? [];
}

// server/ohActions.ts (add these helpers near the top)
const toLocalYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

const startOfWeek = (d: Date) => {
  const day = d.getDay() || 7;
  const r = new Date(d);
  r.setDate(d.getDate() - day + 1);
  r.setHours(0,0,0,0);
  return r;
};

function isBookableClientWindow(dateISO: string, maxWeeks = 2) {
  const [y,m,d] = dateISO.split("-").map(Number);
  const target = new Date(y, m-1, d);
  const today = new Date();
  today.setHours(0,0,0,0);

  // past?
  if (target < today) return false;

  const curStart = startOfWeek(today);
  const newStart = startOfWeek(target);
  const diffWeeks = Math.floor((newStart.getTime() - curStart.getTime()) / (7*86400000));
  return diffWeeks <= (maxWeeks - 1);
}

/** Book a shift (RLS + triggers enforce rules) */
export async function bookShift(shiftDateISO: string, slotId: number) {
  const supabase = await createClient();
  await requireBoardMember();

  // mirror DB rule for nicer errors (keep this value in sync with DB setting)
  const MAX_WEEKS = 2;
  if (!isBookableClientWindow(shiftDateISO, MAX_WEEKS)) {
    fail("You can only book the current week and next week.");
  }

  const { error } = await supabase
    .from("oh_shifts")
    .insert({ member_id: (await getCurrentUser()).id, shift_date: shiftDateISO, slot_id: slotId });

  if (error) fail(error.message);
  ok("Shift booked.");
}

/** Remove my shift */
export async function unbookShift(shiftId: string) {
    const supabase = await createClient();
    await requireBoardMember();

    const { error } = await supabase
        .from("oh_shifts")
        .delete()
        .eq("id", shiftId);

    if (error) fail(error.message);
    ok("Shift removed.");
}
