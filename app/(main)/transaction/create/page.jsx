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
        <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl gradient-title mb-8">
                {editId ? "Edit Transaction" : "Add Transaction"}
            </h1>
            {/* Form to create a transaction */}
            <AddTransactionForm 
                accounts={accounts}
                categories={defaultCategories}
                editMode={!!editId}
                initialData={initialData}
            />
        </div>
    );
}