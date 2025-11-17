export const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getAuthHeaders = () => ({
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include' as RequestCredentials,
});