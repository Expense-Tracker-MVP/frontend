import type { ExpenseDTO } from "@/ui/lib/types/expense";
import type { Category } from "@/ui/lib/types/category";
export interface GoogleButtonProps {
    onClick?: () => void;
    disabled?: boolean;
}

export interface AuthGuardProps {
    children: React.ReactNode
    fallback?: React.ReactNode
    redirectTo?: string
}

export type ExpenseFormState = {
    name: string
    description: string
    amount: string
    date: string
    category: string // categoryId
    currency: string
}

export type AddExpenseFormProps = {
    preSelectedCategoryId?: string
    onSuccess?: () => void
}

export interface AddCategoryFormProps {
    onCategoryAdded?: () => void
}

export type CategoryCardProps = {
    category: Category
    expenses: ExpenseDTO[]
    isExpanded?: boolean
    onToggleExpand?: () => void
    onExpenseAdded?: () => void
    onCategoryDeleted?: () => void
    onCategoryUpdated?: () => void
    onExpenseDeleted?: (expenseId: string) => void
    onExpenseUpdated?: () => void
}

export type EditCategoryFormProps = {
    category: Category
    onSuccess?: () => void
    onCancel?: () => void
}

export type EditExpenseFormProps = {
    expense: ExpenseDTO
    onSuccess?: () => void
    onCancel?: () => void
}

export type ExpenseCardProps = {
  expense: ExpenseDTO
  onEdit?: (expense: ExpenseDTO) => void
  onDelete?: () => void
}