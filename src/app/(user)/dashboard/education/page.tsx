"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EducationPage() {

    const router = useRouter()

    const handleDashboard = () => {
        router.push("/dashboard");
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            Maaf halaman ini masih dalam tahap pengembangan
            <Button onClick={handleDashboard} className="mt-4">
                Kembali ke Dashboard
            </Button>
        </div>
    )
}