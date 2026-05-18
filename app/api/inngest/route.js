import { serve } from "inngest/next";
import { inngest } from "../../lib/inngest/client";
import { 
    processRecurringTransaction,
    triggerRecurringTransactions,
    generateMonthlyReports,
    checkBudgetAlerts
} from "@/app/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        processRecurringTransaction,
        triggerRecurringTransactions,
        generateMonthlyReports,
        checkBudgetAlerts
    ],
});