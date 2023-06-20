import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FileType } from "@/redux/types/states/File";
import { getApiServerUrl } from "@/utils/getApiServerUrl";
import { Maximize1, Maximize2, TableDocument } from "iconsax-react";
import React, {
    ElementType,
    ImgHTMLAttributes,
    ReactElement,
    ReactNode,
    useLayoutEffect,
    useState,
} from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function Preview() {
    // Generate a preview of the uploaded file.
    const dispatch = useAppDispatch();
    const UploadedFile: FileType = useAppSelector((state) => state.file);
    const SessionFile: string | undefined = useAppSelector(
        (state) => state.session.publicFilePath
    );
    const [Preview, setPreview] = React.useState<string>("");

    const PYTHON_PUBLIC_URL = getApiServerUrl();

    React.useEffect(() => {
        if (SessionFile && SessionFile.length > 0) {
            setPreview(PYTHON_PUBLIC_URL + SessionFile);
        } else {
            if (UploadedFile && UploadedFile.preview) {
                setPreview(UploadedFile.preview);
            }
        }
    }, [UploadedFile, UploadedFile]);

    return (
        <>
            {
                // If the file is not uploaded, show a placeholder.
                !UploadedFile.preview && (
                    <div className="flex flex-col w-full h-48 min-h-none max-h-none justify-center items-center overflow-hidden blocksm p-6 bg-gray-100 text-gray-400 dark:text-gray-400 border border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 rounded-lg mb-5">
                        <TableDocument
                            size="64"
                            variant="Bulk"
                            color="currentColor"
                        />
                    </div>
                )
            }
            {
                // If the file is uploaded, show the preview.
                UploadedFile.preview && (
                    <>
                        <Zoom classDialog="w-full h-full backdrop:blur-3xl bg-gray-50/50 dark:bg-gray-800/50">
                            <img
                                className="flex flex-col w-full h-auto max-h-96 min-h-none justify-center items-center overflow-hidden blocksm bg-white border border-gray-200 shadow-2xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 relative rounded-lg mb-5"
                                alt="That Wanaka Tree, New Zealand by Laura Smetsers"
                                src={Preview}
                                width="500"
                            />
                        </Zoom>
                    </>
                )
            }
        </>
    );
}
