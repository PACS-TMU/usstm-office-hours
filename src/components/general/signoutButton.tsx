"use client";
import { useRouter } from "next/navigation";
import { PiSignOut } from "react-icons/pi";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignoutButton() {
    const [signingOut, setSigningOut] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        setSigningOut(true);
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push("/login");
        } else {
            setSigningOut(false);
            console.error("Error signing out:", error.message);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            disabled={signingOut}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md
                bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium
                shadow hover:from-indigo-600 hover:to-purple-600 hover:cursor-pointer transition
                ease-in-out duration-300 disabled:opacity-60 disabled:cursor-not-allowed`}
        >
            <PiSignOut size={28} />
            {signingOut ? (
                <span className="animate-pulse">Signing out...</span>
            ) : (
                "Sign out"
            )}
        </button>
    );
}
