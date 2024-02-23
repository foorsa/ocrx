import AppHeader from "./Layout/A. App Header";
import Container from "./Application/Container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import LoadingPage from "@/app/loading";

export default async function TranslatePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	// Query
	const QueryDOC = searchParams.doc;

	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/auth/sign-in");

		return <LoadingPage />;
	}

	return <Container DocId={QueryDOC} />;
}
