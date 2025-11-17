import React, { useState, useEffect } from 'react'
import { updateExpenseApi } from '@ui/lib/apis/expenses'
import { getCategoriesByUser } from '@ui/lib/apis/categories'
import { useAuthState } from '@ui/lib/store/authStore'
import type { ExpenseDTO } from '../lib/types/expense'
import type { Category } from '@ui/lib/types/category'
import type { EditExpenseFormProps } from '@ui/lib/types/components'

const currencies = ['SGD', 'USD', 'EUR', 'GBP', 'JPY', 'AUD']

const EditExpenseForm: React.FC<EditExpenseFormProps> = ({ expense, onSuccess, onCancel }) => {
    const { user } = useAuthState()
    const [form, setForm] = useState({
        name: expense.name || '',
        description: expense.description || '',
        amount: expense.amount.toString() || '',
        date: expense.transactionDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        category: expense.categoryId || '',
        currency: expense.currency || 'SGD',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [categoriesList, setCategoriesList] = useState<Category[]>([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const validate = (data: typeof form) => {
        if (!data.name.trim()) return 'Name is required'
        const amountNum = parseFloat(data.amount)
        if (!isFinite(amountNum) || amountNum <= 0) return 'Amount must be greater than 0'
        if (!data.date) return 'Date is required'
        if (!data.currency) return 'Currency is required'
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const validationError = validate(form)
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        try {
            const expenseRequest: ExpenseDTO = {
                ...expense,
                categoryId: form.category || null,
                name: form.name,
                description: form.description || null,
                amount: parseFloat(form.amount),
                currency: form.currency || 'SGD',
                transactionDate: form.date,
            }
            await updateExpenseApi(expense.id!, expenseRequest)
            onSuccess?.()
        } catch (err: any) {
            setError(err?.message ?? 'Unknown error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const load = async () => {
            if (!user?.id) return
            setCategoriesLoading(true)
            try {
                const cats = await getCategoriesByUser(user.id)
                setCategoriesList(cats)
            } catch (err: any) {
                console.warn('Failed to load categories', err)
            } finally {
                setCategoriesLoading(false)
            }
        }

        load()
    }, [user?.id])

    return (
        <form onSubmit={handleSubmit} className="p-3 bg-surface rounded shadow">
            <h4 className="text-md font-medium mb-2">Edit Expense</h4>

            {error && (
                <div className="mb-2 text-xs text-red-700 bg-red-100 p-2 rounded dark:bg-red-900 dark:text-red-200">
                    {error}
                </div>
            )}

            <label className="block mb-2">
                <span className="text-xs">Name</span>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border rounded p-1.5 text-sm bg-input border-border text-gray-900 dark:text-slate-100"
                    placeholder="Short title"
                />
            </label>

            <label className="block mb-2">
                <span className="text-xs">Description (optional)</span>
                <input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded p-1.5 text-sm bg-input border-border text-gray-900 dark:text-slate-100"
                    placeholder="Details"
                />
            </label>

            <div className="grid grid-cols-2 gap-2 mb-2">
                <label className="block">
                    <span className="text-xs">Amount</span>
                    <input
                        type="number"
                        step="0.01"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded p-1.5 text-sm bg-input border-border text-gray-900 dark:text-slate-100"
                        placeholder="0.00"
                    />
                </label>

                <label className="block">
                    <span className="text-xs">Currency</span>
                    <select
                        name="currency"
                        value={form.currency}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded p-1.5 text-sm bg-input border-border text-gray-900 dark:text-slate-100"
                    >
                        {currencies.map(c => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="block mb-2">
                <span className="text-xs">Date</span>
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded p-1.5 text-sm bg-input border-border text-gray-900 dark:text-slate-100"
                />
            </label>

            <label className="block mb-3">
                <span className="text-xs">Category</span>
                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded p-1.5 text-sm bg-input border-border text-gray-900 dark:text-slate-100"
                >
                    {categoriesLoading && <option>Loading...</option>}
                    {!categoriesLoading && categoriesList.length === 0 && (
                        <option value="">No categories</option>
                    )}
                    {!categoriesLoading && categoriesList.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </label>

            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-2 py-1.5 text-sm bg-blue-600 text-white rounded disabled:opacity-60 dark:bg-blue-500"
                >
                    {loading ? 'Saving...' : 'Update'}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="px-2 py-1.5 text-sm border border-border rounded dark:text-slate-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}

export default EditExpenseForm
