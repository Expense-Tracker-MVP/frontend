import { AuthTokens } from "@ui/lib/utils/auth"

export type Category = {
    id?: string
    userId?: string
    name: string
    description?: string
    color?: string
}

type CreateCategoryResponse = {
    status: "success" | "error"
    message?: string
    data?: Category
}

const BASE_URL = `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/v1`;

export async function createCategoryApi(category: Category, token: string): Promise<Category> {
    const id = AuthTokens.getUserId()

    if (id) {
        category.userId = id
    }

    const res = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
		credentials: 'include',
        body: JSON.stringify(category),
    })

    if (!res.ok) {
        let msg: string | undefined = `Request failed with status ${res.status}`
        try {
            const json: CreateCategoryResponse = await res.json()
            if (json?.status === "error") {
                msg = json?.message
            }
        } catch (_err) {
            // ignore parse errors
        }
        throw new Error(msg)
    }

    const json: CreateCategoryResponse = await res.json()
    if (!json || json.message || !json.data) {
        throw new Error(json?.message ?? 'Unexpected response from server')
    }

    return json.data
}

export default {
    createCategoryApi,
}
