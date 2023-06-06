import Image from "next/image";
import BetaModal from "./Components/Modals/Beta.modal";
import Background from "./Components/A. Background";
import Header from "./Components/Layout/Header";

export default function Home() {
    return (
        <>
            <Background />

            <main className="flex min-h-screen flex-col items-center justify-between p-5">
                <Header />
                <BetaModal />
            </main>
        </>
    );
}
