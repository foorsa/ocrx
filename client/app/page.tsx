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
            <BetaBanner />
            <Header />
            <Jumbotron />
            <BetaModal />
            <Footer />
        </>
    );
}
