"use client"

// Simple admin authentication utilities
// In production, replace with proper authentication (NextAuth, Supabase Auth, etc.)

let ADMIN_CREDENTIALS = {
    email: "admin@example.com",
    password: "admin123",
}

const AUTH_STORAGE_KEY = "admin_authenticated"
const CREDENTIALS_STORAGE_KEY = "admin_credentials"

if (typeof window !== "undefined") {
    const stored = localStorage.getItem(CREDENTIALS_STORAGE_KEY)
    if (stored) {
        try {
            ADMIN_CREDENTIALS = JSON.parse(stored)
        } catch (e) {
            // Use default credentials if parsing fails
        }
    }
}

export function login(email: string, password: string): boolean {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        if (typeof window !== "undefined") {
            localStorage.setItem(AUTH_STORAGE_KEY, "true")
        }
        return true
    }
    return false
}

export function logout(): void {
    if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_STORAGE_KEY)
    }
}

export function isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
        // Get cookie values
        if (!document.cookie) {
            return false
        }

        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith("admin_token=")) {
                return true;
            }
        }
    }
    return false;
}

export function changePassword(currentPassword: string, newPassword: string): boolean {
    if (currentPassword !== ADMIN_CREDENTIALS.password) {
        return false
    }

    ADMIN_CREDENTIALS.password = newPassword

    if (typeof window !== "undefined") {
        localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(ADMIN_CREDENTIALS))
    }

    return true
}

export function getAdminEmail(): string {
    return ADMIN_CREDENTIALS.email
}
