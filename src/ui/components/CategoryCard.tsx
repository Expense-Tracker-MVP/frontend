import { useState } from 'react'
import ExpenseCard from './ExpenseCard'
import AddExpenseForm from './AddExpenseForm'
import EditCategoryForm from './EditCategoryForm'
import EditExpenseForm from './EditExpenseForm'
import type { CategoryCardProps } from '@ui/lib/types/components'

const CategoryCard = ({ category, expenses, isExpanded, onToggleExpand, onExpenseAdded, onCategoryDeleted, onCategoryUpdated, onExpenseDeleted, onExpenseUpdated }: CategoryCardProps) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(false)
  const [editingExpense, setEditingExpense] = useState<string | null>(null)

  const categoryExpenses = expenses.filter(exp => exp.categoryId === category.id)
  const totalAmount = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  const handleDeleteCategory = () => {
    if (categoryExpenses.length > 0) {
      const confirmed = window.confirm(
        `This category has ${categoryExpenses.length} expense(s). Deleting it will also delete all expenses. Are you sure?`
      )
      if (!confirmed) return
    } else {
      const confirmed = window.confirm(`Delete category "${category.name}"?`)
      if (!confirmed) return
    }
    onCategoryDeleted?.()
  }

  const handleEditCategory = () => {
    setEditingCategory(true)
    setShowAddForm(false)
  }

  const handleEditExpense = (expenseId: string) => {
    setEditingExpense(expenseId)
    setShowAddForm(false)
  }

  return (
    <div className={`bg-surface border border-border rounded-lg shadow-md overflow-hidden flex flex-col ${!isExpanded ? 'h-full' : ''}`}>
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between shrink-0"
        style={{ backgroundColor: category.color || '#6366f1' }}
      >
        <div className="text-white">
          <h3 className="text-lg font-semibold">{category.name}</h3>
          {category.description && (
            <p className="text-sm opacity-90">{category.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggleExpand}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-sm transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '⬇️' : '⬆️'}
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl font-bold transition-colors"
            title="Add expense"
          >
            {showAddForm ? '×' : '+'}
          </button>
          <button
            onClick={handleEditCategory}
            className="w-8 h-8 bg-white/20 hover:bg-yellow-500/50 rounded-full flex items-center justify-center text-white text-sm transition-colors"
            title="Edit category"
          >
            ✏️
          </button>
          <button
            onClick={handleDeleteCategory}
            className="w-8 h-8 bg-white/20 hover:bg-red-500/50 rounded-full flex items-center justify-center text-white text-sm transition-colors"
            title="Delete category"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Edit Category Form */}
      {editingCategory && (
        <div className="p-4 bg-background border-b border-border">
          <EditCategoryForm 
            category={category}
            onSuccess={() => {
              setEditingCategory(false)
              onCategoryUpdated?.()
            }}
            onCancel={() => setEditingCategory(false)}
          />
        </div>
      )}

      {/* Add Expense Form */}
      {showAddForm && (
        <div className="p-4 bg-background border-b border-border">
          <AddExpenseForm 
            preSelectedCategoryId={category.id}
            onSuccess={() => {
              setShowAddForm(false)
              onExpenseAdded?.()
            }}
          />
        </div>
      )}

      {/* Summary */}
      <div className="p-4 bg-background/50">
        <div className="flex justify-between items-center text-sm">
          <span className="text-foreground/70">
            {categoryExpenses.length} {categoryExpenses.length === 1 ? 'expense' : 'expenses'}
          </span>
          <span className="font-semibold text-foreground">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Expenses List */}
      <div className={`p-4 space-y-2 overflow-y-auto ${isExpanded ? 'max-h-[600px]' : 'max-h-96'}`}>
        {categoryExpenses.length === 0 ? (
          <p className="text-center text-foreground/50 py-8">
            No expenses yet. Click + to add one.
          </p>
        ) : (
          categoryExpenses.map((expense) => (
            <div key={expense.id || `${expense.userId}-${expense.transactionDate}-${expense.name}`}>
              {editingExpense === expense.id ? (
                <div className="p-2 bg-background rounded border border-border">
                  <EditExpenseForm 
                    expense={expense}
                    onSuccess={() => {
                      setEditingExpense(null)
                      onExpenseUpdated?.()
                    }}
                    onCancel={() => setEditingExpense(null)}
                  />
                </div>
              ) : (
                <ExpenseCard 
                  expense={expense}
                  onEdit={() => expense.id && handleEditExpense(expense.id)}
                  onDelete={() => expense.id && onExpenseDeleted?.(expense.id)}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CategoryCard