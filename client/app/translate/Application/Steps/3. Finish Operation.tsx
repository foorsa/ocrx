"use client";

import React, { useCallback, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Link, LinkSquare } from "iconsax-react";

// Selection for Document Type

export default function Third_FinishOperation() {
    const dispatch = useAppDispatch();

    return (
        <div className="relative w-full">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Finish the Operation
            </h5>

            <p className="mb-6 text-xs font-normal text-gray-700 dark:text-gray-400">
                Please review the document and make sure that all the fields are
                correct, and then click on the button below to finish the
                operation and get your translated document.
            </p>
        </div>
    );
}
