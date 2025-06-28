// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

// Get the database connection
export function getDatabase() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined in environment variables");
    }
    return neon(process.env.DATABASE_URL);
}

//