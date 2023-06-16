import React, { useState, useEffect } from "react";

export default function Processing({ Process }: { Process: any }) {
    const [ProcessInfos, setProcessInfos] = useState({} as any);

    useEffect(() => {
        setProcessInfos(JSON.parse(Process));
    }, []);

    return (
        <>
            {/* Information about the Operation Process */}
            {/* Could be:  */}
            {/* Uploading File... , OCR is detecting..., AI is translating the Output, JSON the Data... */}
            <div className="text-center">
                <h1 className="text-2xl font-bold">Processing</h1>
                <p className="text-lg font-semibold">{ProcessInfos.Process}</p>
            </div>
        </>
    );
}
