"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        // Force redirect to /dashboard so that Next.js client-side router registers the URL change
        // instead of transparently following the middleware redirect from /login.
        const plainFormData = Object.fromEntries(formData);
        plainFormData.redirectTo = "/dashboard";
        await signIn("credentials", plainFormData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}
