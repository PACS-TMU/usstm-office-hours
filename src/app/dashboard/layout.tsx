import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?error=Please log in to access the dashboard.");
    }

    return (
        <div>
            <Navbar />
            <main>
                {children}
            </main>
            <div className="h-16" />
            <Footer />
        </div>
    );
}