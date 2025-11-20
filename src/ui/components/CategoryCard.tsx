import { useState, useMemo } from 'react'
import ExpenseCard from './ExpenseCard'
import AddExpenseForm from './AddExpenseForm'
import EditCategoryForm from './EditCategoryForm'
import EditExpenseForm from './EditExpenseForm'
import type { CategoryCardProps, CategoryCardSortOption } from '@ui/lib/types/components'

const CategoryCard = ({ category, expenses, isExpanded, onToggleExpand, onExpenseAdded, onCategoryDeleted, onCategoryUpdated, onExpenseDeleted, onExpenseUpdated }: CategoryCardProps) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(false)
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<CategoryCardSortOption>('recent')
  const [sortReversed, setSortReversed] = useState(false)

  const categoryExpenses = expenses.filter(exp => exp.categoryId === category.id)
  const totalAmount = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = categoryExpenses

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(expense => 
        expense.name.toLowerCase().includes(query) ||
        (expense.description?.toLowerCase() || '').includes(query)
      )
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'alphabetical':
          comparison = a.name.localeCompare(b.name)
          break
        case 'recent':
          comparison = new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
          break
        case 'expensive':
          comparison = b.amount - a.amount
          break
        default:
          comparison = 0
      }
      
      return sortReversed ? -comparison : comparison
    })

    return sorted
  }, [categoryExpenses, searchQuery, sortBy, sortReversed])

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

  const handleToggleExpand = () => {
    // Reset search and sort state when collapsing
    if (isExpanded) {
      setSearchQuery('')
      setSortReversed(false)
    }
    onToggleExpand?.()
  }

  const handleSortChange = (newSortBy: CategoryCardSortOption) => {
    if (sortBy === newSortBy) {
      setSortReversed(!sortReversed)
    } else {
      setSortBy(newSortBy)
      setSortReversed(false)
    }
  }

  const handleDoubleClickToExpandCategory = (e: React.MouseEvent) => {
    // Don't expand if double-clicking on these elements
    const target = e.target as HTMLElement
    const interactiveElements = ['BUTTON', 'INPUT', 'A', 'TEXTAREA', 'SELECT']
    
    if (interactiveElements.includes(target.tagName) || 
        target.closest('button') || 
        target.closest('input') || 
        target.closest('a') || 
        target.closest('[contenteditable]')) {
      return
    }
    
    handleToggleExpand()
  }

  return (
    <div 
      className={`bg-surface border border-border rounded-lg shadow-md overflow-hidden flex flex-col ${!isExpanded ? 'h-full' : ''}`}
      onDoubleClick={handleDoubleClickToExpandCategory}
    >
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
            onClick={handleToggleExpand}
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

      {/* Search and Sort Controls - Only visible when expanded */}
      {isExpanded && (
        <div className="p-4 bg-background border-b border-border space-y-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-9 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-foreground placeholder:text-foreground/50"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground/70 font-medium">Sort by:</span>
            <div className="flex gap-1">
              <button
                onClick={() => handleSortChange('recent')}
                title={`Sort by date ${sortBy === 'recent' ? (sortReversed ? '(oldest first)' : '(newest first)') : ''}`}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  sortBy === 'recent' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-surface border border-border text-foreground/70 hover:bg-background'
                }`}
              >
                {sortBy === 'recent' && sortReversed ? 'Oldest First' : 'Most Recent'}
                {sortBy === 'recent' && (
                  <span className="text-xs">
                    {sortReversed ? '↑' : '↓'}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleSortChange('expensive')}
                title={`Sort by amount ${sortBy === 'expensive' ? (sortReversed ? '(lowest first)' : '(highest first)') : ''}`}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  sortBy === 'expensive' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-surface border border-border text-foreground/70 hover:bg-background'
                }`}
              >
                {sortBy === 'expensive' && sortReversed ? 'Least Expensive' : 'Most Expensive'}
                {sortBy === 'expensive' && (
                  <span className="text-xs">
                    {sortReversed ? '↑' : '↓'}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleSortChange('alphabetical')}
                title={`Sort alphabetically ${sortBy === 'alphabetical' ? (sortReversed ? '(Z to A)' : '(A to Z)') : ''}`}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  sortBy === 'alphabetical' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-surface border border-border text-foreground/70 hover:bg-background'
                }`}
              >
                {sortBy === 'alphabetical' && sortReversed ? 'Z-A' : 'A-Z'}
                {sortBy === 'alphabetical' && (
                  <span className="text-xs">
                    {sortReversed ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </div>
            <span className="text-xs text-foreground/50 italic">
              Click again to reverse
            </span>
          </div>

          {/* Search Results Info */}
          {searchQuery.trim() && (
            <div className="text-xs text-foreground/60">
              Showing {filteredAndSortedExpenses.length} of {categoryExpenses.length} expenses
              {searchQuery.trim() && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-blue-600 hover:text-blue-700 underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Expenses List */}
      <div className={`p-4 space-y-2 overflow-y-auto ${isExpanded ? 'max-h-[600px]' : 'max-h-96'}`}>
        {isExpanded && filteredAndSortedExpenses.length === 0 && categoryExpenses.length > 0 ? (
          <p className="text-center text-foreground/50 py-8">
            No expenses match your search.
          </p>
        ) : categoryExpenses.length === 0 ? (
          <p className="text-center text-foreground/50 py-8">
            No expenses yet. Click + to add one.
          </p>
        ) : (
          (isExpanded ? filteredAndSortedExpenses : categoryExpenses).map((expense) => (
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