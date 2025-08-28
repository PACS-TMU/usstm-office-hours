import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import MessageAcceptor from "@/components/general/messageAcceptor";
import { Suspense } from "react";

const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "USSTM Portal",
    description:
        "The Undergraduate Science Society (USSTM) Portal - You can find all the important links and details here for your USSTM student groups.",
};

const geistSans = Geist({
    variable: "--font-geist-sans",
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.className} antialiased`}>
                {children}
                <Suspense fallback={<div>Loading...</div>}>
                    <MessageAcceptor />
                </Suspense>
            </body>
        </html>
    );
}
