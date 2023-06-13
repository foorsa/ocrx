import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Steps } from "@/redux/store";

export default function Debugging() {
    // The `state` arg is correctly typed as `RootState` already
    const Step = useAppSelector((state) => state.Step);
    const DocType = useAppSelector((state) => state.DocType);
    const StateFile: File | any = useAppSelector((state) => state.File);

    const dispatch = useAppDispatch();

    // This component shows up only when the server is running in development mode
    if (process.env.NODE_ENV === "development") {
        return (
            <div className="relative w-full overflow-x-auto mt-10 sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                        Redux States
                        <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                            This is the current state of the Redux store
                            <br />
                            <span className="text-xs text-gray-400">
                                (This is for debugging purposes only)
                            </span>
                        </p>
                    </caption>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-medium">
                                State
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Value
                            </th>
                            <th scope="col" className="px-6 py-3 font-medium">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="w-max px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-400">
                                Step
                            </td>
                            <td className="w-max px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-400">
                                {Step ? Step : "No Step"}
                            </td>
                            <td className="w-max space-x-2 px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-400">
                                <button
                                    className="px-4 py-2 font-semibold text-white bg-violet-500 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75"
                                    onClick={() => {
                                        dispatch({
                                            type: "SET_STEP",
                                            payload: Steps.Upload,
                                        });
                                    }}
                                >
                                    Upload
                                </button>
                                <button
                                    className="px-4 py-2 font-semibold text-white bg-violet-500 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75"
                                    onClick={() => {
                                        dispatch({
                                            type: "SET_STEP",
                                            payload: Steps.Translate,
                                        });
                                    }}
                                >
                                    Translate
                                </button>
                                <button
                                    className="px-4 py-2 font-semibold text-white bg-violet-500 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75"
                                    onClick={() => {
                                        dispatch({
                                            type: "SET_STEP",
                                            payload: Steps.Validate,
                                        });
                                    }}
                                >
                                    Validate
                                </button>
                            </td>
                        </tr>
                        {/* Document Type */}
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="w-max px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-400">
                                Document Type
                            </td>
                            <td className="w-max px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-400">
                                {DocType ? DocType : "No Document Type"}
                            </td>
                            <td className="w-max space-x-2 px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-400">
                                <button
                                    className="px-4 py-2 font-semibold text-white bg-violet-500 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75"
                                    onClick={() => {
                                        dispatch({
                                            type: "SET_DOCTYPE",
                                            payload: "Baccaulaureate",
                                        });
                                    }}
                                >
                                    Baccaulaureate Degree
                                </button>
                                <button
                                    className="px-4 py-2 font-semibold text-white bg-violet-500 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75"
                                    onClick={() => {
                                        dispatch({
                                            type: "SET_DOCTYPE",
                                            payload: "Master",
                                        });
                                    }}
                                >
                                    Master Degree
                                </button>
                                <button
                                    className="px-4 py-2 font-semibold text-white bg-violet-500 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75"
                                    onClick={() => {
                                        dispatch({
                                            type: "SET_DOCTYPE",
                                            payload: "Language",
                                        });
                                    }}
                                >
                                    Language Degree
                                </button>
                            </td>
                        </tr>
                        {/* File */}
                        <tr className="bg-white dark:bg-gray-800">
                            <td className="w-max px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-400">
                                File
                            </td>
                            <td className="w-max px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-400">
                                {StateFile ? StateFile.name : "No File"}
                            </td>
                            <td className="w-max space-x-2 px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-400">
                                <button
                                    className="px-4 py-2 font-semibold text-white bg-violet-500 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75"
                                    onClick={() => {
                                        dispatch({
                                            type: "SET_FILE",
                                            payload: new File(
                                                ["Placeholder File"],
                                                "placeholder.png",
                                                { type: "image/png" }
                                            ),
                                        });
                                    }}
                                >
                                    Set File
                                </button>
                                <button
                                    className="px-4 py-2 font-semibold text-white bg-violet-500 rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75"
                                    onClick={() => {
                                        dispatch({
                                            type: "SET_FILE",
                                            payload: null,
                                        });
                                    }}
                                >
                                    Remove File
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return null;
}
