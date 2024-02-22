import AppHeader from "./Layout/A. App Header";
import Container from "./Application/Container";

export default function TranslatePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	// Query
	const QueryDOC = searchParams.doc;

	return <Container DocId={QueryDOC} />;
}
