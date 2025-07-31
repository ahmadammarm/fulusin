import DesktopSidebar from "./DesktopSidebar";
import MobileNavbar from "./MobileNavbar";

export default function Navbar() {
    return (
        <>
            <div className="hidden md:block">
                <DesktopSidebar />
            </div>

            <div className="block md:hidden">
                <MobileNavbar />
            </div>
        </>
    )
}

