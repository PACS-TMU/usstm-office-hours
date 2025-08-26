export type CalendarMember = {
    member_id: string;
    name: string;
    position: string;
};

export type CalendarCell = {
    shift_date: string; // 'YYYY-MM-DD'
    slot_id: number; // 1..4
    slot_label: string; // '10:00–12:00', etc.
    start_time: string; // '10:00:00'
    end_time: string; // '12:00:00'
    members: CalendarMember[];
};
