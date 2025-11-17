import type { ExpenseCardProps } from '@ui/lib/types/components'

const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps) => {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete expense "${expense.name}" (${expense.currency || 'SGD'} $${expense.amount.toFixed(2)})?`
    )
    if (confirmed) {
      onDelete?.()
    }
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-[var(--foreground)]">{expense.name}</h4>
          {expense.description && (
            <p className="text-sm text-[var(--foreground)]/60 mt-1">{expense.description}</p>
          )}
          <p className="text-xs text-[var(--foreground)]/50 mt-2">
            {formatDate(expense.transactionDate)}
            {expense.source && ` · ${expense.source}`}
          </p>
        </div>
        <div className="text-right ml-4">
          <p className="font-semibold text-[var(--foreground)]">
            {expense.currency || 'SGD'} ${expense.amount.toFixed(2)}
          </p>
          {(onEdit || onDelete) && (
            <div className="flex gap-2 mt-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(expense)}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExpenseCard