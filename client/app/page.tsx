"use client";

import Image from "next/image";
import BetaModal from "./Components/Modals/Beta.modal";
import Background from "./Components/A. Background";
import Header from "./Components/Layout/Header";
import Jumbotron from "./Components/B. Jumbotron";
import Footer from "./Components/Layout/Footer";
import BetaBanner from "./Components/Banners/Beta.banner";
import PageWrapper from "./PageWrapper";

export default function Home() {
    return (
        <PageWrapper>
            <BetaBanner />
            <Header />
            <Jumbotron />
            <BetaModal />
            <Footer />
        </PageWrapper>
    );
}
