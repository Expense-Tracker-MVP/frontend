import { useAuth } from '@ui/lib/store/authStore'

export type Expense = {
	id?: string
	description: string
	amount: number
	date: string // ISO date
	category: string
	currency: string
}

type CreateExpenseResponse = {
	success: boolean
	data?: Expense
	error?: string
}

const BASE_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL

export async function createExpenseApi(expense: Expense): Promise<Expense> {
	const { token } = useAuth()

    const res = await fetch(`${BASE_URL}/api/v1/expenses`, {
		method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
		credentials: 'include',
		body: JSON.stringify(expense),
	})

	if (!res.ok) {
		let msg = `Request failed with status ${res.status}`
		try {
			const json: CreateExpenseResponse = await res.json()
			if (json?.error) msg = json.error
		} catch (_err) {
			// ignore parse errors
		}
		throw new Error(msg)
	}

	// Expect a JSON body with the created expense
	const json: CreateExpenseResponse = await res.json()
	if (!json || !json.success || !json.data) {
		throw new Error(json?.error ?? 'Unexpected response from server')
	}

	return json.data
}

// Export a default object for convenience imports
export default {
	createExpenseApi,
}
