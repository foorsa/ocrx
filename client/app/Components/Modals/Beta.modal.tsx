"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";

export default function BetaModal() {
	const [open, setOpen] = useState(true);
	const [isBannerClosed, setIsBannerClosed] = useState(true);
	const cancelButtonRef = useRef(null);
	const { theme } = useTheme();

	const closeModal = () => {
		setOpen(false);
		sessionStorage.setItem("ModalClosed", "true");
	};

	// Use Effect
	useEffect(() => {
		if (sessionStorage.getItem("ModalClosed")) {
			setIsBannerClosed(true);
		} else {
			setOpen(true);
			setIsBannerClosed(false);
		}
	}, []);

	return (
		<Transition.Root show={open && !isBannerClosed} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-50"
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
					<div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm" />
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
							<Dialog.Panel
								className={`relative transform overflow-hidden rounded-xl transition-all sm:my-8 sm:w-full sm:max-w-lg bg-white dark:bg-zinc-950`}
							>
								<div
									className={`px-4 pb-4 pt-5 sm:p-6 sm:pb-4 bg-white dark:bg-zinc-950`}
								>
									<div className="sm:flex sm:items-start">
										<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100 sm:mx-0 sm:h-10 sm:w-10">
											<ExclamationTriangleIcon
												className="h-6 w-6"
												aria-hidden="true"
											/>
										</div>
										<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
											<Dialog.Title
												as="h3"
												className={`text-base font-semibold leading-6 text-zinc-800 dark:text-zinc-300`}
											>
												Welcome to OCRX - Foorsa
												Translations (Beta)
											</Dialog.Title>
											<div className="mt-2">
												<p
													className={`text-sm font-light text-zinc-800 dark:text-zinc-300`}
												>
													Thank you for choosing OCRX
													- Foorsa Translations! Our
													web app is currently in beta
													testing, undergoing
													development and refinement.
													While we strive for
													accuracy, occasional errors
													may occur.
												</p>

												<p
													className={`text-sm mt-2 font-light text-zinc-800 dark:text-zinc-300`}
												>
													Your feedback is invaluable
													to us as we enhance the app.
													Please share any issues or
													suggestions through the
													provided channels.
												</p>

												<p
													className={`text-sm mt-2 font-light text-zinc-800 dark:text-zinc-300`}
												>
													Please note that
													translations may not be
													perfect in this beta stage.
													We recommend using them as a
													reference and verifying
													accuracy.
												</p>

												<p
													className={`text-sm mt-2 font-light text-zinc-800 dark:text-zinc-300`}
												>
													Thank you for joining our
													beta testing phase. We hope
													you find the app helpful and
													await your valuable
													feedback.
												</p>

												<p
													className={`text-sm mt-4 font-light text-zinc-800 dark:text-zinc-300`}
												>
													Best regards,
												</p>
												<p
													className={`text-sm mt-1 font-light text-zinc-800 dark:text-zinc-300`}
												>
													The OCRX - Foorsa
													Translations Team
												</p>
											</div>
										</div>
									</div>
								</div>
								<div className="bg-zinc-100 dark:bg-black px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
									<button
										type="button"
										className={`mt-3 inline-flex w-full justify-center outline-none border-none rounded-xl px-3 py-2 text-sm text-zinc-600 dark:text-white font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-600 dark:hover:bg-zinc-700 sm:mt-0 sm:w-auto ring-0`}
										onClick={() => closeModal()}
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
