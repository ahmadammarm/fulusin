import { CurrencySettings } from "@prisma/client"

interface CategoriesStatisticsProps {
    currencySettings: CurrencySettings;
    from: Date;
    to: Date;
}


export default function CategoriesStatistics({ currencySettings, from, to }: CategoriesStatisticsProps) {

    

    return (
        <div>

        </div>
    )
}