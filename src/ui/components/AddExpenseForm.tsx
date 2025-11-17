import React, { useState, useEffect } from 'react'
import { useAuthState } from '@ui/lib/store/authStore'
import { createExpenseApi } from '@ui/lib/apis/expenses'
import { getCategoriesByUser } from '@ui/lib/apis/categories'
import type { Category } from '@ui/lib/types/category'
import type { ExpenseFormState, AddExpenseFormProps } from '@ui/lib/types/components'
import type { ExpenseDTO } from '../lib/types/expense'

const defaultForm: ExpenseFormState = {
    name: '',
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    category: '',
    currency: 'SGD',
}

// will be loaded from backend for current user
// const categories = ['food', 'transport', 'entertainment', 'bills', 'other']
const currencies = ['SGD', 'USD', 'EUR', 'GBP', 'JPY', 'AUD']

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ preSelectedCategoryId, onSuccess }) => {
    const [form, setForm] = useState<ExpenseFormState>({
        ...defaultForm,
        category: preSelectedCategoryId || ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const { user } = useAuthState()
    const [categoriesList, setCategoriesList] = useState<Category[]>([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)

    // load categories for current user
    const load = async () => {
        if (!user?.id) return
        setCategoriesLoading(true)
        try {
            const cats = await getCategoriesByUser(user.id)
            setCategoriesList(cats)
            // if form category not set, set to first
            if (!form.category && cats.length) {
                setForm(prev => ({ ...prev, category: cats[0].id ?? '' }))
            }
        } catch (err: any) {
            console.warn('Failed to load categories', err)
        } finally {
            setCategoriesLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [user?.id])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value } as unknown as ExpenseFormState))
    }

    const validate = (data: ExpenseFormState) => {
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
        setSuccess(null)

        const validationError = validate(form)
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        try {
            const expenseRequest: ExpenseDTO = {
                userId: user?.id || null,
                categoryId: form.category || null,
                name: form.name,
                description: form.description || null,
                amount: parseFloat(form.amount),
                currency: form.currency || 'SGD',
                transactionDate: form.date,
                source: 'manual',
            }
            const created = await createExpenseApi(expenseRequest)
            setSuccess(
                `Saved expense "${created.name || created.description}" (${created.currency ?? ''} ${created.amount.toFixed(2)})`
            )
            setForm({
                ...defaultForm,
                category: preSelectedCategoryId || ''
            })
            onSuccess?.()
        } catch (err: any) {
            setError(err?.message ?? 'Unknown error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md p-4 bg-[var(--surface)] rounded shadow dark:text-slate-100">
            <h3 className="text-lg font-medium mb-3">Add Expense</h3>

            {error && (
                <div className="mb-3 text-sm text-red-700 bg-red-100 p-2 rounded dark:bg-red-900 dark:text-red-200">{error}</div>
            )}

            {success && (
                <div className="mb-3 text-sm text-green-700 bg-green-100 p-2 rounded dark:bg-green-900 dark:text-green-200">{success}</div>
            )}

            <label className="block mb-2">
                <span className="text-sm">Name</span>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border rounded p-2 bg-[var(--input)] border-[var(--border)] text-gray-900 dark:text-slate-100"
                    placeholder="Short title for expense, e.g. 'Lunch'"
                />
            </label>

            <label className="block mb-2">
                <span className="text-sm">Description (optional)</span>
                <input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded p-2 bg-[var(--input)] border-[var(--border)] text-gray-900 dark:text-slate-100"
                    placeholder="Coffee, groceries, ..."
                />
            </label>

            <label className="block mb-2">
                <span className="text-sm">Amount</span>
                <input
                    type="number"
                    step="0.01"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded p-2 border-[var(--border)] text-gray-900 bg-[var(--input)] dark:text-slate-100"
                    placeholder="0.00"
                />
            </label>

            <label className="block mb-2">
                <span className="text-sm">Currency</span>
                <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded p-2 border-[var(--border)] text-gray-900 bg-[var(--input)] dark:text-slate-100"
                >
                    {currencies.map(c => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block mb-2">
                <span className="text-sm">Date</span>
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded p-2 border-[var(--border)] text-gray-900 bg-[var(--input)] dark:text-slate-100"
                />
            </label>

            {!preSelectedCategoryId && (
                <label className="block mb-4">
                    <span className="text-sm">Category</span>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded p-2 border-[var(--border)] text-gray-900 bg-[var(--input)] dark:text-slate-100"
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
            )}

            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-60 dark:bg-blue-500"
                >
                    {loading ? 'Saving...' : 'Add Expense'}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setForm(defaultForm)
                        setError(null)
                        setSuccess(null)
                    }}
                    className="px-3 py-2 border rounded dark:text-slate-100"
                >
                    Reset
                </button>
            </div>
        </form>
    )
}

export default AddExpenseForm