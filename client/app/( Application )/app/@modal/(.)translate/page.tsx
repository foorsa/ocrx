import Modal from "@/app/Components/Modals/Modal";
import TranslatePage from "../../translate/page";

export default function TranslateModal({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Query
    const QueryDOC = searchParams.doc;

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
