"use client";

import type { CalendarMember } from "@/lib/types";

export default function SlotCell({
    dateISO,
    slotId,
    members,
    mine,
    onToggle,
    disabled,
}: {
    dateISO: string;
    slotId: number;
    members: CalendarMember[];
    mine?: boolean;
    onToggle?: (date: string, slotId: number) => void;
    disabled?: boolean;
}) {
    return (
        <div
            className={`border border-gray-200 rounded-md p-2 h-auto min-h-[88px] md:min-h-0 md:h-24 flex flex-col justify-between ${
                mine
                    ? "bg-red-100"
                    : members.length === 0
                    ? "bg-yellow-50"
                    : "bg-blue-50"
            }`}
        >
            <div className="space-y-1 overflow-auto">
                {members.length === 0 ? (
                    <div className="text-[11px] sm:text-xs text-gray-400 italic">
                        {disabled
                            ? "This slot has either passed or is not within 2 weeks"
                            : "No one yet"}
                    </div>
                ) : (
                    members.map((m) => (
                        <div
                            key={m.member_id}
                            className="flex flex-col text-[11px] sm:text-xs mb-1"
                        >
                            <span className="font-medium text-gray-800">
                                {m.name}
                            </span>
                            <span className="text-gray-400">{m.position}</span>
                        </div>
                    ))
                )}
            </div>

            {onToggle && (
                <button
                    onClick={() => onToggle(dateISO, slotId)}
                    disabled={disabled}
                    className={`mt-2 text-[11px] sm:text-xs px-2 py-2 sm:py-1 rounded ${
                        mine
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-highlight hover:bg-highlight-dark"
                    } text-white disabled:opacity-60 ${
                        disabled ? "hidden" : "cursor-pointer"
                    } w-full sm:w-auto`}
                >
                    {mine ? "Remove me" : "Add me"}
                </button>
            )}
        </div>
    );
}
