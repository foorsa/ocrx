"use client"; // Error components must be Client Components

import { Link } from "iconsax-react";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div>
            <h2>Something went wrong!</h2>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </button>
            <main className="grid min-h-full place-items-center w-full px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-violet-600">
                        500
                    </p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
                        Something went wrong!
                    </h1>
                    <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-500">
                        Sorry, we couldn’t find the page you’re looking for.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/"
                            className="rounded-md bg-violet-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                        >
                            Go back home
                        </Link>
                        <a
                            onClick={
                                // Attempt to recover by trying to re-render the segment
                                () => reset()
                            }
                            className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline"
                        >
                            Try Again <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
