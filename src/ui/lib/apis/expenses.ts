import { fetchWithAuth } from '@ui/lib/utils/fetchWithAuth'
import type { Expense, ExpenseDTO, ExpenseResponse } from '@ui/lib/types/expense'
import { handleResponse, getAuthHeaders } from '@ui/lib/utils/apiHelpers'

const BASE_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL

export async function createExpenseApi(expense: ExpenseDTO): Promise<ExpenseDTO> {
	const res = await fetchWithAuth(`${BASE_URL}/api/v1/expenses`, {
		method: 'POST',
		...getAuthHeaders(),
		body: JSON.stringify(expense),
	})

	const data = await handleResponse<ExpenseResponse>(res)
	if (!data || !data.data) throw new Error('Invalid response from server')
	const dto = data.data as ExpenseDTO
	return dto
}

export async function getExpensesByUser(userId: string): Promise<ExpenseDTO[]> {
	const res = await fetchWithAuth(`${BASE_URL}/api/v1/expenses/user/${userId}`, {
		method: 'GET',
		...getAuthHeaders(),
	})
	const data: ExpenseResponse = await handleResponse<ExpenseResponse>(res)
	if (!data || !data.data || data.message) {
		throw new Error(data?.message ?? 'Unexpected response from server')
	}
	const dtos = data.data as ExpenseDTO[]
	return dtos
}

export async function updateExpenseApi(id: string, expense: ExpenseDTO): Promise<ExpenseDTO> {
	const res = await fetchWithAuth(`${BASE_URL}/api/v1/expenses/${id}`, {
		method: 'PUT',
		...getAuthHeaders(),
		body: JSON.stringify(expense),
	})
	const data = await handleResponse<ExpenseResponse>(res)
	if (!data || !data.data) throw new Error('Invalid response from server')
	const dto = data.data as ExpenseDTO
	return dto
}

export async function deleteExpenseApi(id: string): Promise<void> {
	const res = await fetchWithAuth(`${BASE_URL}/api/v1/expenses/${id}`, {
		method: 'DELETE',
		...getAuthHeaders(),
	})
	const data = await handleResponse<any>(res)

	if (!data || data.message) {
		throw new Error(data?.message ?? 'Unexpected response from server')
	}
	return
}

export async function getExpensesByDateRange(
	userId: string,
	startDate: string,
	endDate: string
): Promise<ExpenseDTO[]> {
	const res = await fetchWithAuth(
		`${BASE_URL}/api/v1/expenses/user/${userId}/date-range?startDate=${startDate}&endDate=${endDate}`,
		{
			method: 'GET',
			...getAuthHeaders(),
		}
	)
	const data: ExpenseResponse = await handleResponse<ExpenseResponse>(res)
	if (!data || !data.data || data.message) {
		throw new Error(data?.message ?? 'Unexpected response from server')
	}
	return data.data as ExpenseDTO[]
}

export async function getExpensesByCategory(
	userId: string,
	categoryId: string
): Promise<ExpenseDTO[]> {
	const res = await fetchWithAuth(
		`${BASE_URL}/api/v1/expenses/user/${userId}/category/${categoryId}`,
		{
			method: 'GET',
			...getAuthHeaders(),
		}
	)
	const data: ExpenseResponse = await handleResponse<ExpenseResponse>(res)
	if (!data || !data.data || data.message) {
		throw new Error(data?.message ?? 'Unexpected response from server')
	}
	return data.data as ExpenseDTO[]
}

export async function getTotalAmountByDateRange(
	userId: string,
	startDate: string,
	endDate: string
): Promise<number> {
	const res = await fetchWithAuth(
		`${BASE_URL}/api/v1/expenses/user/${userId}/total?startDate=${startDate}&endDate=${endDate}`,
		{
			method: 'GET',
			...getAuthHeaders(),
		}
	)
	const data = await handleResponse<{ status: string; data: number; message?: string }>(res)
	if (!data || data.message) {
		throw new Error(data?.message ?? 'Unexpected response from server')
	}
	return data.data
}

export async function getRecentExpenses(
	userId: string,
	days: number = 30
): Promise<ExpenseDTO[]> {
	const res = await fetchWithAuth(
		`${BASE_URL}/api/v1/expenses/user/${userId}/recent?days=${days}`,
		{
			method: 'GET',
			...getAuthHeaders(),
		}
	)
	const data: ExpenseResponse = await handleResponse<ExpenseResponse>(res)
	if (!data || !data.data || data.message) {
		throw new Error(data?.message ?? 'Unexpected response from server')
	}
	return data.data as ExpenseDTO[]
}

export async function getExpenseById(id: string): Promise<ExpenseDTO> {
	const res = await fetchWithAuth(`${BASE_URL}/api/v1/expenses/${id}`, {
		method: 'GET',
		...getAuthHeaders(),
	})
	const data: ExpenseResponse = await handleResponse<ExpenseResponse>(res)
	if (!data || !data.data || data.message) {
		throw new Error(data?.message ?? 'Unexpected response from server')
	}
	return data.data as ExpenseDTO
}