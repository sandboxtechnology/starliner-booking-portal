// API Configuration
export const API_BASE_URL = "https://starlinerdreamtours.com";
export const API_BASE_TOKEN = "K8Ma1oWnZVJbXeMPwlY542C3968088";

// Helper function to make API calls
export async function apiRequest<T>(callType: string = 'local', endpoint: string, options?: RequestInit): Promise<{ data?: T; error?: string }> {
    try {
        // Construct the full URL
        const endpointUrl = (callType == 'local') ? endpoint : `${API_BASE_URL}${endpoint}`;

        // Make the API request
        const response = await fetch(endpointUrl, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_BASE_TOKEN}`,
                ...options?.headers,
            },
        })

        // Handle the response
        if (!response.ok) {
            // Handle errors
            const errorData = await response.json().catch(() => ({}));

            // Return the error message
            return {
                error: errorData.message || `Request failed with status ${response.status}`
            };
        }

        // Return the data
        const data = await response.json();

        // Return the data
        return { data };
    } catch (error: any) {
        // Return the error
        return { error: error.message || "Network error occurred" };
    }
}
