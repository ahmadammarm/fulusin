import { Currencies } from '@/lib/currencies';
export function GetFormatterForCurrency(currency: string) {
    const locale = Currencies.find(c => c.value === currency)?.locale;
    if (!locale) {
        throw new Error(`No locale found for currency: ${currency}`);
    }
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}