import Modal from "@/app/Components/Modals/Modal";
import TranslatePage from "../../translate/page";

export default async function TranslateModal({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Query
    const resolvedParams = await searchParams;
    const QueryDOC = resolvedParams.doc;

    return (
        <Modal>
            <TranslatePage
                searchParams={{
                    doc: QueryDOC,
                }}
            />
        </Modal>
    );
}
