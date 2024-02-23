import Header from "./Components/Layout/Header";
import Jumbotron from "./Components/B. Jumbotron";
import Footer from "./Components/Layout/Footer";

export default async function Home() {
	return (
		<div className="flex flex-col items-center justify-between flex-1 h-full min-h-screen">
			<Header />
			<Jumbotron />
			<Footer />
		</div>
	);
}
