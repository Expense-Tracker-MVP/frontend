import { fetchWithAuth } from '@ui/lib/utils/fetchWithAuth'
import type { Category, CategoryResponse } from '@ui/lib/types/category'
import { handleResponse, getAuthHeaders } from '@ui/lib/utils/apiHelpers'

const BASE_URL = `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/v1`;

export async function createCategoryApi(category: Category): Promise<Category> {
    const res = await fetchWithAuth(`${BASE_URL}/categories`, {
        method: 'POST',
        ...getAuthHeaders(),
        body: JSON.stringify(category),
    })

    const data: CategoryResponse = await handleResponse<CategoryResponse>(res)

    if (!data || data.message || !data.data) {
        throw new Error(data?.message ?? 'Unexpected response from server')
    }

    return data.data as Category
}

export async function getCategoriesByUser(userId: string): Promise<Category[]> {
    const res = await fetchWithAuth(`${BASE_URL}/categories/user/${userId}`, {
        method: 'GET',
        ...getAuthHeaders()
    })

    const data: CategoryResponse = await handleResponse<CategoryResponse>(res)
    if (!data || !data.data || data.message) {
        throw new Error(data?.message ?? 'Unexpected response from server')
    }

    return data.data as Category[]
}

export async function updateCategoryApi(id: string, category: Category): Promise<Category> {
    const res = await fetchWithAuth(`${BASE_URL}/categories/${id}`, {
        method: 'PUT',
        ...getAuthHeaders(),
        body: JSON.stringify(category),
    })

    const data: CategoryResponse = await handleResponse<CategoryResponse>(res)

    if (!data || data.message || !data.data) {
        throw new Error(data?.message ?? 'Unexpected response from server')
    }

    return data.data as Category
}

export async function deleteCategoryApi(id: string): Promise<void> {
    const res = await fetchWithAuth(`${BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        ...getAuthHeaders(),
    })

    const data = await handleResponse<any>(res)

    if (!data || data.message) {
        throw new Error(data?.message ?? 'Unexpected response from server')
    }

    return
}
