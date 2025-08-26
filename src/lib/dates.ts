export const startOfISOWeek = (d: Date) => {
    const day = d.getDay() || 7; // Sun=0 -> 7
    const res = new Date(d);
    res.setDate(d.getDate() - day + 1);
    res.setHours(0, 0, 0, 0);
    return res;
};

export const toDateOnlyLocal = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

export const addDays = (d: Date, n: number) =>
    new Date(d.getTime() + n * 86400000);
export const addWeeks = (d: Date, n: number) => addDays(d, n * 7);

/** add/subtract weeks from an ISO date string without touching UTC */
export const addWeeksFromISO = (isoDate: string, n: number) => {
    const [y, m, d] = isoDate.split("-").map(Number);
    const base = new Date(y, m - 1, d, 0, 0, 0, 0); // local midnight
    return toDateOnlyLocal(addWeeks(base, n));
};
