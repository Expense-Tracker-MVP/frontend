export type Category = {
    id?: string
    userId?: string
    name: string
    description?: string
    color?: string
}

export type CategoryResponse = {
    status: "success" | "error"
    message?: string
    data?: Category | Category[]
}

export type CategoryStore = {
    categories: Category[]
    loading: boolean
    errors: string | null

    fetchCategories: (userId: string) => Promise<void>
    addCategory: (cat: Category) => Promise<void>
    updateCategory: (cat: Category) => Promise<void>
    deleteCategory: (categoryId: string) => Promise<void>
}