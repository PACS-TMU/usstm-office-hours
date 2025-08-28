import { createClient } from "@/lib/supabase/server";
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
        // No custom layout, just render children (inherits root layout)
        return <>{children}</>;
    }

    // Logged in: show dashboard layout
    return (
        <div>
            <Navbar />
            <main>{children}</main>
            <div className="h-16" />
            <Footer />
        </div>
    );
}
