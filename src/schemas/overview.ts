import { MAX_DATE_RANGE_DAYS } from "@/lib/maxDateRangeConstant";
import { differenceInDays } from "date-fns";
import z from "zod";

export const overviewQuerySchema = z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
}).refine((args) => {
    const { from, to } = args;
    const days = differenceInDays(to, from);

    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;
    if (!isValidRange) {
        throw new Error(`The selected date range is too big. Max allowed is ${MAX_DATE_RANGE_DAYS} days.`);
    }
    return isValidRange;

})