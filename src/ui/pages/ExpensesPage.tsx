import AddCategoryForm from '@ui/components/AddCategoryForm';
import AddExpenseForm from '@ui/components/AddExpenseForm';

const ExpensesPage = () => {

  return (
    <div className="flex p-4 justify-between bg--background)">
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