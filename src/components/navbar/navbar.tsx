"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import SignOutButton from "@/components/general/signoutButton";
import { Sling as Hamburger } from "hamburger-react";
import { FaUser } from "react-icons/fa";

const NAV_LEFT_ITEMS = [
    { label: "Events", href: "/dashboard/events" },
    { label: "Finances", href: "/dashboard/finance" },
    { label: "Contact", href: "/dashboard/contact" },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <nav className="bg-highlight-dark text-background w-full shadow-md">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="text-2xl pr-2 font-bold text-background hover:text-gray-300 ease-in-out duration-300 transition-colors">
                            USSTM Portal
                        </Link>
                        <div className="hidden md:block border-l border-gray-400 h-10 mx-2" />
                        <div className="hidden md:flex space-x-2">
                            {NAV_LEFT_ITEMS.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="relative px-3 py-2 rounded-lg font-medium transition-all duration-300
                                        hover:bg-highlight-blue hover:text-highlight-dark ease-in-out focus:outline-none focus:ring-2 focus:ring-highlight
                                        active:scale-95"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <SignOutButton />
                        <Link
                            href="/dashboard/account"
                            className="flex items-center px-3 py-2 rounded-lg hover:bg-highlight-blue hover:text-highlight-dark ease-in-out duration-300 transition-colors"
                            aria-label="Account"
                        >
                            <FaUser size={20} />
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden flex items-center" ref={menuRef}>
                        <Hamburger toggled={menuOpen} toggle={setMenuOpen} size={24} color="#fff" />
                        {menuOpen && (
                            <div className="absolute top-16 right-4 w-48 bg-background text-highlight-dark rounded-lg shadow-lg z-50 py-2 animate-fade-in">
                                {NAV_LEFT_ITEMS.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="block px-4 py-2 hover:bg-highlight-blue hover:text-highlight-dark rounded transition-colors ease-in-out duration-300"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <Link
                                    href="/dashboard/account"
                                    className="flex items-center px-4 py-2 hover:bg-highlight-blue hover:text-highlight-dark rounded transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <FaUser className="mr-2" /> Account
                                </Link>
                                <div className="border-t my-1" />
                                <div className="px-4 py-2">
                                    <SignOutButton />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
