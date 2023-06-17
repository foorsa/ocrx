import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FileType } from "@/redux/types/states/File";
import React from "react";

export default function Preview() {
    // Generate a preview of the uploaded file.
    const dispatch = useAppDispatch();
    const UploadedFile: FileType = useAppSelector((state) => state.file);
    const [Preview, setPreview] = React.useState<string>("");

    React.useEffect(() => {
        if (UploadedFile && UploadedFile.preview) {
            setPreview(UploadedFile.preview);
        }
    }, [UploadedFile]);

    return (
        <>
            {
                // If the file is not uploaded, show a placeholder.
                !UploadedFile.preview && (
                    <>
                        <div className="flex flex-col w-full h-48 min-h-none max-h-none justify-center items-center overflow-hidden blocksm p-6 bg-white border border-gray-200 shadow-2xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"></div>
                    </>
                )
            }
            {
                // If the file is uploaded, show the preview.
                UploadedFile.preview && (
                    <>
                        <img
                            className="h-auto w-full max-w-full rounded-lg mb-5 overflow-hidden blocksm bg-white border border-gray-200 shadow-2xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                            src={Preview ? Preview : "/images/placeholder.png"}
                            alt="Preview of the uploaded file."
                        />
                    </>
                )
            }
        </>
    );
}
