"use client";

export default function footer() {
    return (
        <footer className="w-full bg-highlight-dark text-background text-sm font-medium py-4 flex justify-center items-center font-sans border-t border-gray-800 fixed bottom-0 left-0 z-50">
            <span>&copy; {new Date().getFullYear()} Created by PACS. All rights reserved.</span>
        </footer>
    );
}