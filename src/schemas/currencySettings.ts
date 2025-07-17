import { Currencies } from "@/lib/currencies";
import { z } from "zod";


export const UpdateUserCurrencySchema = z.object({
    currency: z.custom((inputCurrency) => {
        const isValidCurrency = Currencies.some((curr) => curr.value === inputCurrency);

        if (!isValidCurrency) {
            throw new Error("Invalid currency value");
        }

        return true;
    })
});