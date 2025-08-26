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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mb-4">
            <button
                onClick={onPrev}
                className="bg-highlight hover:bg-highlight-dark text-white px-3 py-2 sm:py-1 rounded shadow w-full sm:w-auto"
            >
                <span className="inline sm:hidden">‹ Prev Week</span>
                <span className="hidden sm:inline">‹ Prev</span>
            </button>

            <div className="text-sm sm:text-base text-gray-700 text-center">
                Week of <span className="font-semibold">{weekStartISO}</span>
            </div>

            <button
                onClick={onNext}
                className="bg-highlight hover:bg-highlight-dark text-white px-3 py-2 sm:py-1 rounded shadow w-full sm:w-auto"
            >
                <span className="inline sm:hidden">Next Week ›</span>
                <span className="hidden sm:inline">Next ›</span>
            </button>
        </div>
    );
}
