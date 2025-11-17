import { create } from "zustand"
import type { ExpenseDTO, ExpenseStore } from '@ui/lib/types/expense'
import { getExpensesByUser, createExpenseApi, updateExpenseApi, deleteExpenseApi } from '@ui/lib/apis/expenses'

export const useExpenseStore = create<ExpenseStore>((set) => ({
    expenses: [],
    loading: false,
    errors: null,

    fetchExpenses: async (userId: string) => {
        set({ loading: true, errors: null })
        try {
            const data = await getExpensesByUser(userId)
            set({ expenses: data, loading: false, errors: null })
        } catch (error) {
            set({ 
                loading: false, 
                errors: error instanceof Error ? error.message : 'Failed to fetch expenses'
            })
            throw error
        }
    },

    addExpense: async (expense: ExpenseDTO) => {
        set({ loading: true, errors: null })
        try {
            const res = await createExpenseApi(expense)
            set(state => ({
                expenses: [...state.expenses, res],
                loading: false,
                errors: null
            }))
        } catch (error) {
            set({ 
                loading: false, 
                errors: error instanceof Error ? error.message : 'Failed to add expense'
            })
            throw error
        }
    },

    updateExpense: async (id: string, updatedExpense: ExpenseDTO) => {
        set({ loading: true, errors: null })
        try {
            const res = await updateExpenseApi(id, updatedExpense)
            set(state => ({
                expenses: state.expenses.map(exp => 
                    (exp.userId === res.userId && exp.name === res.name) ? res : exp
                ),
                loading: false,
                errors: null
            }))
        } catch (error) {
            set({ 
                loading: false, 
                errors: error instanceof Error ? error.message : 'Failed to update expense'
            })
            throw error
        }
    },

    deleteExpense: async (expenseId: string) => {
        set({ loading: true, errors: null })
        try {
            await deleteExpenseApi(expenseId)
            set(state => ({
                expenses: state.expenses.filter(exp => exp.userId !== expenseId),
                loading: false,
                errors: null
            }))
        } catch (error) {
            set({ 
                loading: false, 
                errors: error instanceof Error ? error.message : 'Failed to delete expense'
            })
            throw error
        }
    }
}))