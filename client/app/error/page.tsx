import React from "react";
import { BackSquare, Home, Link } from "iconsax-react";

export default function Page() {
    return (
        <main className="grid min-h-full place-items-center w-full px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-violet-600">500</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
                    Something went wrong!
                </h1>
                <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-500">
                    Please try again later. If the problem persists, please
                    contact us.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/"
                        className="rounded-md bg-violet-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                        <span className="mr-2 text-md font-semibold">
                            Go back home
                        </span>
                        <Home variant="Bulk" color="currentColor" />
                    </Link>
                    <a className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg text-violet-800 bg-violet-600/25 hover:bg-violet-600/50 dark:text-violet-600 dark:bg-violet-600/50 dark:hover:bg-violet-600/75">
                        <span className="mr-2 text-md font-semibold">
                            Retry
                        </span>
                        <BackSquare variant="Bulk" color="currentColor" />
                    </a>
                </div>
            </div>
        </main>
    );
}
