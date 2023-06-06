"use client";

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function BetaModal() {
    const [open, setOpen] = useState(true);
    const cancelButtonRef = useRef(null);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={setOpen}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-violet-900 text-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-violet-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-violet-600 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-6"
                                            >
                                                Welcome to OCRX - Foorsa
                                                Translations (Beta)
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm font-light text-violet-300">
                                                    Thank you for using OCRX -
                                                    Foorsa Translations! Please
                                                    note that this web app is
                                                    currently in beta testing
                                                    phase, which means it is
                                                    still undergoing development
                                                    and refinement. While we
                                                    have taken every effort to
                                                    ensure accurate
                                                    translations, there may be
                                                    occasional errors or
                                                    limitations.
                                                </p>

                                                <p className="text-sm mt-2 font-light text-violet-300">
                                                    We value your feedback and
                                                    appreciate your patience as
                                                    we work towards improving
                                                    the app. If you encounter
                                                    any issues or have
                                                    suggestions for
                                                    enhancements, please let us
                                                    know through the provided
                                                    feedback channels.
                                                </p>

                                                <p className="text-sm mt-2 font-light text-violet-300">
                                                    By using this web app, you
                                                    acknowledge that it is in
                                                    the beta stage, and any
                                                    translations provided may
                                                    not be 100% perfect. We
                                                    encourage you to use the
                                                    translated results as
                                                    reference and verify them
                                                    for accuracy before making
                                                    any critical decisions.
                                                </p>

                                                <p className="text-sm mt-2 font-light text-violet-300">
                                                    Thank you for being a part
                                                    of the OCRX - Foorsa
                                                    Translations beta testing
                                                    phase. We hope you find the
                                                    app helpful and we look
                                                    forward to your valuable
                                                    feedback.
                                                </p>

                                                <p className="text-sm mt-4 font-light text-violet-300">
                                                    Best regards,
                                                </p>
                                                <p className="text-sm mt-1 font-light text-violet-300">
                                                    The OCRX - Foorsa
                                                    Translations Team
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-violet-950 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-violet-800 px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-violet-700 hover:bg-violet-700 sm:mt-0 sm:w-auto"
                                        onClick={() => setOpen(false)}
                                        ref={cancelButtonRef}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
