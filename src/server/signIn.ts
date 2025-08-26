"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function signIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect(
            "/login?error=Could not authenticate user. Please check your credentials and try again."
        );
    }

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (userError || !userData) {
        return redirect(
            "/login?error=User not found. Please contact us to ensure that you are properly added to the system."
        );
    }

    return redirect("/dashboard");
}
