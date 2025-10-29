"use client"

import React, { useState } from 'react'
import { createCategoryApi, type Category } from '@/lib/apis/categories'

const defaultForm = { name: '', description: '', color: '#06b6d4' }

const AddCategoryForm: React.FC = () => {
    const [form, setForm] = useState(defaultForm)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as HTMLInputElement
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const validate = (d: typeof defaultForm) => {
        if (!d.name.trim()) return 'Name is required'
        if (d.name.length > 50) return 'Name is too long'
        if (d.color && !/^#([0-9A-F]{3}){1,2}$/i.test(d.color)) return 'Color must be a valid hex code'
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        const v = validate(form)
        if (v) {
            setError(v)
            return
        }

        setLoading(true)
        try {
            const created = await createCategoryApi(form as Category)
            setSuccess(`Created category "${created.name}"`)
            setForm(defaultForm)
        } catch (err: any) {
            console.log(`error in handleSubmit: ${err}`)
            setError(err?.message ?? 'Unknown error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md p-4 bg-white rounded shadow dark:bg-slate-800 dark:text-slate-100">
            <h3 className="text-lg font-medium mb-3">Add Category</h3>

            {error && <div className="mb-3 text-sm text-red-700 bg-red-100 p-2 rounded dark:bg-red-900 dark:text-red-200">{error}</div>}
            {success && <div className="mb-3 text-sm text-green-700 bg-green-100 p-2 rounded dark:bg-green-900 dark:text-green-200">{success}</div>}

            <label className="block mb-2">
                <span className="text-sm">Name</span>
                <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full border rounded p-2 bg-white border-gray-300 text-gray-900 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" placeholder="e.g. Groceries" />
            </label>

            <label className="block mb-2">
                <span className="text-sm">Description (optional)</span>
                <textarea name="description" value={form.description} onChange={handleChange} className="mt-1 block w-full border rounded p-2 bg-white border-gray-300 text-gray-900 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" rows={3} />
            </label>

            <label className="block mb-4">
                <p className="text-sm">Color</p>
                <input type="color" name="color" value={form.color} onChange={handleChange} className="mt-1 h-10 w-16 p-0 border-none" />
            </label>

            <div className="flex items-center gap-2">
                <button type="submit" disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-60 dark:bg-blue-500">{loading ? 'Saving...' : 'Add Category'}</button>
                <button type="button" onClick={() => { setForm(defaultForm); setError(null); setSuccess(null) }} className="px-3 py-2 border rounded dark:border-slate-600 dark:text-slate-100">Reset</button>
            </div>
        </form>
    )
}

export default AddCategoryForm
