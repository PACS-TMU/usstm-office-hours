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
        <div className="w-full overflow-x-auto md:overflow-x-visible">
            <p className="mb-2 text-[11px] sm:text-xs text-gray-500 md:hidden">
                Tip: scroll horizontally to see all days on smaller screens.
            </p>
            <table className="table-fixed w-full min-w-[620px] md:min-w-0 border border-gray-200 rounded-lg overflow-hidden">
                {/* Column widths: narrow first col; dates have a mobile min-width but grow on larger screens */}
                <colgroup>
                    <col className="w-24 sm:w-28 md:w-32" />
                    {dates.map((d) => (
                        <col
                            key={`col-${d}`}
                            className="w-40 sm:w-44 md:w-auto"
                        />
                    ))}
                </colgroup>

                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-2 text-left text-xs sm:text-sm text-gray-500 sticky left-0 bg-gray-50 z-10 whitespace-nowrap">
                            Slot
                        </th>
                        {dates.map((d) => (
                            <th
                                key={d}
                                className="p-2 text-xs sm:text-sm text-gray-500 whitespace-nowrap"
                            >
                                {d}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {[1, 2, 3, 4].map((slotId) => (
                        <tr key={slotId} className="border-t">
                            <td className="p-2 text-xs sm:text-sm font-medium text-gray-600 align-top sticky left-0 bg-white z-10">
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
                                const disabled =
                                    pending ||
                                    (isBookable ? !isBookable(d) : false);

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

            <div className="mt-2 text-[11px] sm:text-xs text-gray-500 md:hidden">
                Tip: scroll horizontally to see all days on smaller screens.
            </div>
        </div>
    );
}
