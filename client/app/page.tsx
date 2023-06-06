import Image from "next/image";
import BetaModal from "./Components/Modals/Beta.modal";
import Background from "./Components/A. Background";
import Header from "./Components/Layout/Header";
import Jumbotron from "./Components/B. Jumbotron";
import Footer from "./Components/Layout/Footer";
import BetaBanner from "./Components/Banners/Beta.banner";

export default function Home() {
    return (
        <>
            <Background />

            <main className="flex min-h-screen flex-col items-center justify-between">
                <BetaBanner />
                <Header />
                <Jumbotron />
                <BetaModal />
                <Footer />
            </main>
        </>
    );
}
