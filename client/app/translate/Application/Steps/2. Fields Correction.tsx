"use client";

import React, { useCallback, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Link, LinkSquare } from "iconsax-react";
import Heading from "./Core/B. Correct.tsx/A. Heading";
import Fields from "./Core/B. Correct.tsx/B. Fields";

// Selection for Document Type

export default function Second_CorrectData() {
    const dispatch = useAppDispatch();

    return (
        <div className="relative w-full">
            <Heading />
            <Fields />
        </div>
    );
}
