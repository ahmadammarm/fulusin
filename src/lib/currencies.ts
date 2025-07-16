export const Currencies = [
    {
        value: "USD",
        label: "$ Dollar",
        locale: "en-US",
    },
    {
        value: "EUR",
        label: "€ Euro",
        locale: "de-DE",
    },
    {
        value: "IDR",
        label: "Rp Indonesian Rupiah",
        locale: "id-ID",
    },
    {
        value: "JPY",
        label: "¥ Japanese Yen",
        locale: "ja-JP",
    },
]

export type Currency = (typeof Currencies)[0];