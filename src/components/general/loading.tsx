import { FaSpinner } from "react-icons/fa";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/90 z-[9999]">
            <h1 className="text-center">Loading...</h1>
            <FaSpinner
                size={48}
                className="animate-spin text-gray-600"
            />
        </div>
    );
}
