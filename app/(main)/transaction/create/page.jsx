import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import AddTransactionForm from "./transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function CreateTransactionPage({ searchParams }) {
    const accounts = await getUserAccounts();
    const resolvedSearchParams = await searchParams;
    const editId = resolvedSearchParams?.edit;

    let initialData = null;
    if (editId) {
        const transaction = await getTransaction(editId);
        initialData = transaction;
    }

    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="mb-6">
            <h1 className="text-3xl sm:text-5xl gradient-title">
                {editId ? "Edit Transaction" : "Add Transaction"}
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Capture income, expenses, recurring payments, and receipt details.
            </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <AddTransactionForm 
                accounts={accounts}
                categories={defaultCategories}
                editMode={!!editId}
                initialData={initialData}
            />
            </div>
        </div>
    );
}
