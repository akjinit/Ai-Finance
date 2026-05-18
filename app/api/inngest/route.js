import { serve } from "inngest/next";
import { inngest } from "../../lib/inngest/client";
import { processTask } from "@/app/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [processTask],
});