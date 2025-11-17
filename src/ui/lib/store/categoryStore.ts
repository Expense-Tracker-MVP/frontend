// store/useCategoryStore.ts
import { create } from "zustand"
import type { Category, CategoryStore } from '@ui/lib/types/category'
import { getCategoriesByUser, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '@ui/lib/apis/categories'

export const useCategoryStore = create<CategoryStore>((set) => ({
    categories: [],
    loading: false,
    errors: null,

    fetchCategories: async (userId: string) => {
        set({ loading: true, errors: null })
        try {
            const data = await getCategoriesByUser(userId)
            set({ categories: data, loading: false, errors: null })
        } catch (error) {
            set({ 
                loading: false, 
                errors: error instanceof Error ? error.message : 'Failed to fetch categories'
            })
            throw error
        }
    },

    addCategory: async (category) => {
        set({ loading: true, errors: null })
        try {
            const res = await createCategoryApi(category)
            set(state => ({
                categories: [...state.categories, res],
                loading: false,
                errors: null
            }))
        } catch (error) {
            set({ 
                loading: false, 
                errors: error instanceof Error ? error.message : 'Failed to add category'
            })
            throw error
        }
    },

    updateCategory: async (updatedCategory: Category) => {
        set({ loading: true, errors: null })
        try {
            const res = await updateCategoryApi(updatedCategory.id!, updatedCategory)
            set(state => ({
                categories: state.categories.map(cat => cat.id === res.id ? res : cat),
                loading: false,
                errors: null
            }))
        } catch (error) {
            set({ 
                loading: false, 
                errors: error instanceof Error ? error.message : 'Failed to update category'
            })
            throw error
        }
    },

    deleteCategory: async (categoryId: string) => {
        set({ loading: true, errors: null })
        try {
            await deleteCategoryApi(categoryId)
            set(state => ({
                categories: state.categories.filter(cat => cat.id !== categoryId),
                loading: false,
                errors: null
            }))
        } catch (error) {
            set({ 
                loading: false, 
                errors: error instanceof Error ? error.message : 'Failed to delete category'
            })
            throw error
        }
    }
}))