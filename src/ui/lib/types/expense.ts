// Frontend representation
// TODO: decide if want to keep. Currently not used.
export type Expense = {
    id?: string
    name: string
    description?: string
    amount: number
    date: string // ISO date
    category: string
    currency: string
}

// DTO sent to backend
export type ExpenseDTO = {
    id?: string
    userId?: string | null
    categoryId?: string | null
    name: string
    description?: string | null
    amount: number
    currency?: string
    transactionDate: string // ISO date
    source?: string
    createdAt?: string
    updatedAt?: string
}

export type ExpenseResponse = {
    status: 'success' | 'error'
    data?: ExpenseDTO | ExpenseDTO[]
    message?: string
}

export type ExpenseStore = {
    expenses: ExpenseDTO[]
    loading: boolean
    errors: string | null

    fetchExpenses: (userId: string) => Promise<void>
    addExpense: (expense: ExpenseDTO) => Promise<void>
    updateExpense: (id: string, expense: ExpenseDTO) => Promise<void>
    deleteExpense: (expenseId: string) => Promise<void>
}