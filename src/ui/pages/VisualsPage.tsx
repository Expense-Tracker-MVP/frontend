import React, { useEffect, useState } from 'react'
import AddExpenseForm from '../components/AddExpenseForm'
import ExpenseCard from '../components/ExpenseCard'
import { useAuthState } from '@ui/lib/store/authStore'
import { getRecentExpenses, getTotalAmountByDateRange } from '@ui/lib/apis/expenses'
import type { ExpenseDTO } from '@ui/lib/types/expense'

const VisualsPage: React.FC = () => {
  const { user } = useAuthState()
  const [recent, setRecent] = useState<ExpenseDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [totalThisMonth, setTotalThisMonth] = useState<number | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const fetchData = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
      const end = now.toISOString().slice(0, 10)

      const [recentRes, totalRes] = await Promise.all([
        getRecentExpenses(user.id, 30),
        getTotalAmountByDateRange(user.id, start, end),
      ])

      setRecent(recentRes || [])
      setTotalThisMonth(typeof totalRes === 'number' ? totalRes : 0)
    } catch (err) {
      console.warn('Failed to load expenses', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user?.id])

  const handleAddSuccess = () => {
    setShowAdd(false)
    fetchData()
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount == null) return '-'
    return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
  }

  const recentCount = recent.length

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Expense Tracker MVP</h1>
          <p className="text-foreground/70 mt-1">Quick overview of your recent activity</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-surface border border-border rounded">
            <div className="text-sm text-foreground/60">This month</div>
            <div className="mt-2 text-2xl font-semibold">{formatCurrency(totalThisMonth)}</div>
            <div className="text-xs text-foreground/50 mt-1">{recentCount} recent expenses</div>
          </div>

          <div className="p-4 bg-surface border border-border rounded md:col-span-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-foreground/60">Add Expense</div>
                <div className="text-sm text-foreground/50">Quickly add a new transaction</div>
              </div>
              <div>
                <button
                  onClick={() => setShowAdd(s => !s)}
                  className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-60 dark:bg-blue-500"
                >
                  {showAdd ? 'Close' : 'New Expense'}
                </button>
              </div>
            </div>

            {showAdd && (
              <div className="mt-4">
                <AddExpenseForm onSuccess={handleAddSuccess} />
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-3">Recent Expenses</h2>

          {loading && <div className="text-sm text-foreground/60">Loading...</div>}

          {!loading && recent.length === 0 && (
            <div className="p-4 bg-surface border border-border rounded text-foreground/70">
              No recent expenses. Add one to get started.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recent.map(exp => (
              <ExpenseCard
                key={exp.id}
                expense={exp}
                onDelete={async () => {
                  // Refresh after delete is handled in the card's confirm flow
                  fetchData()
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default VisualsPage