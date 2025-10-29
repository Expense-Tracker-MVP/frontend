"use client"

import React, { useState } from 'react'
import { useAuth } from '@/lib/store/authStore'
import { createExpenseApi } from '@/lib/apis/expenses'

type Expense = {
    id?: string
    description: string
    amount: number
    date: string // ISO date
    category: string
    currency: string
}

type FormState = {
    description: string
    amount: string
    date: string
    category: string
    currency: string
}



const defaultForm: FormState = {
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    category: 'other',
    currency: 'SGD',
}

const categories = ['food', 'transport', 'entertainment', 'bills', 'other']
const currencies = ['SGD', 'USD', 'EUR', 'GBP', 'JPY', 'AUD']

const AddExpenseForm: React.FC = () => {
    const [form, setForm] = useState<FormState>(defaultForm)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const { user } = useAuth()

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value } as unknown as FormState))
    }

    const validate = (data: FormState) => {
        if (!data.description.trim()) return 'Description is required'
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
            const expenseToCreate: Expense = {
                id: user?.id || '',
                description: form.description,
                amount: parseFloat(form.amount),
                date: form.date,
                category: form.category,
                currency: form.currency,
            }

            const created = await createExpenseApi(expenseToCreate)
            setSuccess(
                `Saved expense "${created.description}" (${created.currency ?? ''} ${created.amount.toFixed(2)})`
            )
            setForm(defaultForm)
        } catch (err: any) {
            setError(err?.message ?? 'Unknown error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md p-4 bg-white rounded shadow dark:bg-slate-800 dark:text-slate-100">
            <h3 className="text-lg font-medium mb-3">Add Expense</h3>

            {error && (
                <div className="mb-3 text-sm text-red-700 bg-red-100 p-2 rounded dark:bg-red-900 dark:text-red-200">{error}</div>
            )}

            {success && (
                <div className="mb-3 text-sm text-green-700 bg-green-100 p-2 rounded dark:bg-green-900 dark:text-green-200">{success}</div>
            )}

            <label className="block mb-2">
                <span className="text-sm">Description</span>
                <input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded p-2 bg-white border-gray-300 text-gray-900 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
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
                    className="mt-1 block w-full border rounded p-2 bg-white border-gray-300 text-gray-900 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                    placeholder="0.00"
                />
            </label>

            <label className="block mb-2">
                <span className="text-sm">Currency</span>
                <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded p-2 bg-white border-gray-300 text-gray-900 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
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
                    className="mt-1 block w-full border rounded p-2 bg-white border-gray-300 text-gray-900 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                />
            </label>

            <label className="block mb-4">
                <span className="text-sm">Category</span>
                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded p-2 bg-white border-gray-300 text-gray-900 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                >
                    {categories.map(c => (
                        <option key={c} value={c}>
                            {c[0].toUpperCase() + c.slice(1)}
                        </option>
                    ))}
                </select>
            </label>

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
                    className="px-3 py-2 border rounded dark:border-slate-600 dark:text-slate-100"
                >
                    Reset
                </button>
            </div>
        </form>
    )
}

export default AddExpenseForm