"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function signIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { data: usstmData, error: usstmError } = await supabase
        .from("usstm_board")
        .select("*")
        .eq("email", email)
        .single();

    if (usstmError || !usstmData) {
        return redirect(
            "/login?error=User not found in USSTM board. Please contact us to ensure that you are properly added to the system."
        );
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect(
            "/login?error=Could not authenticate user. Please check your credentials and try again."
        );
    }

    return redirect("/calendar");
}
