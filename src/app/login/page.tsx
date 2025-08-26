import { SubmitButton } from "@/components/form/submitButton";
import signIn from "@/server/signIn";
import CopyEmailButton from "@/components/general/copyEmail";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Login(props: {
    searchParams: Promise<{ message: string }>;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // User is logged in, redirect to dashboard
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-theme-background">
            <h1 className="sr-only">USSTM Portal Login</h1>
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-theme-primary mb-6 text-center">
                    Log into the USSTM Portal
                </h2>
                <form className="space-y-5" method="post">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-1"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-2 border border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-dark"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-theme-secondary mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full px-4 py-2 border border-theme-border rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-dark"
                        />
                    </div>
                    <SubmitButton
                        type="submit"
                        formAction={signIn}
                        className="w-full cursor-pointer py-2 px-4 bg-highlight-dark text-background font-semibold rounded-md hover:bg-highlight ease-in-out duration-300 transition"
                        pendingText="Signing in..."
                    >
                        Sign In
                    </SubmitButton>
                </form>
                <div className="flex justify-between items-center mt-6">
                    <span className="text-sm">Don't have an account?</span>
                    <a href="mailto:vp.operations@usstm.ca;tech@usstm.ca" target="_blank" className="font-medium">
                        Contact Us!
                    </a>
                </div>
                <div className="mt-6 text-sm text-gray-600 text-center">
                    For login information, please contact us at
                    <br />
                    <CopyEmailButton email="vp.operations@usstm.ca" />
                </div>
            </div>
        </div>
    );
}
