// src/inngest/client.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "wealth" , name : "Wealth" ,
    retryFunction : async (attemt) => ({
        delay : Math.pow(2,attemt) * 1000,
        maxAttempts : 2
    })
});