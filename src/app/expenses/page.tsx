"use client"

import AddCategoryForm from '@/components/AddCategoryForm';
import AddExpenseForm from '@/components/AddExpenseForm';

const ExpensesPage = () => {

  return (
    <div className="flex p-4 justify-between">
      <div className="flex-1 max-w">
        <AddExpenseForm />
      </div>
      <div className="flex-1 max-w">
        <AddCategoryForm />
      </div>
    </div>
  )
}

export default ExpensesPage