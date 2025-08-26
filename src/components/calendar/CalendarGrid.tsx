"use client";

import SlotCell from "@/components/calendar/SlotCell";
import type { CalendarCell } from "@/lib/types";

export default function CalendarGrid({
    cells,
    onToggle,
    isMine,
    pending,
    isBookable,
}: {
    cells: CalendarCell[];
    onToggle?: (date: string, slotId: number) => void;
    isMine?: (date: string, slotId: number) => boolean;
    pending?: boolean;
    isBookable?: (dateISO: string) => boolean;
}) {
    const key = (d: string, s: number) => `${d}|${s}`;
    const map = new Map(cells.map((c) => [key(c.shift_date, c.slot_id), c]));
    const dates = [...new Set(cells.map((c) => c.shift_date))]
        .sort()
        .slice(0, 5);

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-2 text-left text-sm text-gray-500">
                            Slot
                        </th>
                        {dates.map((d) => (
                            <th key={d} className="p-2 text-sm text-gray-500">
                                {d}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[1, 2, 3, 4].map((slotId) => (
                        <tr key={slotId} className="border-t">
                            <td className="p-2 text-sm font-medium text-gray-600">
                                {map.get(key(dates[0], slotId))?.slot_label ??
                                    ""}
                            </td>
                            {dates.map((d) => {
                                const cell = map.get(key(d, slotId)) ?? {
                                    shift_date: d,
                                    slot_id: slotId,
                                    slot_label: "",
                                    start_time: "",
                                    end_time: "",
                                    members: [],
                                };
                                const disabled = pending || (isBookable ? !isBookable(d) : false);
                                return (
                                    <td key={d} className="p-2 align-top">
                                        <SlotCell
                                            dateISO={d}
                                            slotId={slotId}
                                            members={cell.members}
                                            mine={isMine?.(d, slotId)}
                                            onToggle={onToggle}
                                            disabled={disabled}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
