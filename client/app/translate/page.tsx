import AppHeader from "./Layout/A. App Header";
import Container from "./Application/Container";
import PageWrapper from "../PageWrapper";

export default function Home() {
    return (
        <PageWrapper>
            <AppHeader />
            <Container />
        </PageWrapper>
    );
}
