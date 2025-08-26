"use client";

export default function WeekToolbar({
    weekStartISO,
    onPrev,
    onNext,
}: {
    weekStartISO: string;
    onPrev?: () => void;
    onNext?: () => void;
}) {
    return (
        <div className="flex items-center justify-between mb-4">
            <button
                onClick={onPrev}
                className="bg-highlight hover:bg-highlight-dark text-white px-3 py-1 rounded shadow"
            >
                ‹ Prev
            </button>
            <div className="text-sm text-gray-700">
                Week of <span className="font-semibold">{weekStartISO}</span>
            </div>
            <button
                onClick={onNext}
                className="bg-highlight hover:bg-highlight-dark text-white px-3 py-1 rounded shadow"
            >
                Next ›
            </button>
        </div>
    );
}
