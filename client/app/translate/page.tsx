import Image from "next/image";
import Background from "@/app/Components/A. Background";

export default function Home() {
    return (
        <>
            <Background />
            <main className="flex min-h-screen flex-col items-center justify-between p-5 pb-0"></main>
        </>
    );
}
