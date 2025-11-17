import { useEffect, useState } from 'react'
import { useAuthState } from '@ui/lib/store/authStore'
import { useCategoryStore } from '@ui/lib/store/categoryStore'
import { useExpenseStore } from '@ui/lib/store/expenseStore'
import AddCategoryForm from '@ui/components/AddCategoryForm'
import CategoryCard from '../components/CategoryCard'

const ExpensesPage = () => {
  const { user } = useAuthState()
  const { categories, fetchCategories, deleteCategory, loading: categoriesLoading } = useCategoryStore()
  const { expenses, fetchExpenses, deleteExpense, loading: expensesLoading } = useExpenseStore()
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const loadData = async () => {
    if (!user?.id) return
    try {
      await Promise.all([
        fetchCategories(user.id),
        fetchExpenses(user.id)
      ])
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId)
      await loadData()
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Failed to delete category. Please try again.')
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpense(expenseId)
      await loadData()
    } catch (error) {
      console.error('Failed to delete expense:', error)
      alert('Failed to delete expense. Please try again.')
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.id])

  const loading = categoriesLoading || expensesLoading

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Expenses</h1>
            <p className="text-foreground/60 mt-1">
              Track your spending by category
            </p>
          </div>
          <button
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {showAddCategory ? 'Cancel' : '+ Add Category'}
          </button>
        </div>

        {/* Add Category Form */}
        {showAddCategory && (
          <div className="mb-6">
            <AddCategoryForm onCategoryAdded={loadData} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-foreground/60">Loading...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-12 bg-surface rounded-lg border border-border">
            <p className="text-foreground/60 mb-4">
              No categories yet. Create one to start tracking expenses.
            </p>
            <button
              onClick={() => setShowAddCategory(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Category
            </button>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const isExpanded = expandedCategories.has(category.id!)
              return (
                <div
                  key={category.id}
                  className={`${isExpanded ? 'md:col-span-2 lg:col-span-3' : 'col-span-1'} transition-all duration-300`}
                >
                  <CategoryCard
                    category={category}
                    expenses={expenses}
                    isExpanded={isExpanded}
                    onToggleExpand={() => {
                      setExpandedCategories(prev => {
                        const newSet = new Set(prev)
                        if (isExpanded) {
                          newSet.delete(category.id!)
                        } else {
                          newSet.add(category.id!)
                        }
                        return newSet
                      })
                    }}
                    onExpenseAdded={loadData}
                    onCategoryDeleted={() => handleDeleteCategory(category.id!)}
                    onCategoryUpdated={loadData}
                    onExpenseDeleted={handleDeleteExpense}
                    onExpenseUpdated={loadData}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpensesPage