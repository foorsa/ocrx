"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import TaskWidget from "@/app/( Application )/app/components/TaskWidget";

export default function Modal({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(true);
	const cancelButtonRef = useRef(null);
	const Router = useRouter();

	// Track the last mousedown target in capture phase (fires before HeadlessUI's
	// outside-click detection regardless of whether HeadlessUI uses capture or bubble).
	const lastMousedownTargetRef = useRef<EventTarget | null>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			lastMousedownTargetRef.current = e.target;
		};
		document.addEventListener("mousedown", handler, { capture: true });
		return () => document.removeEventListener("mousedown", handler, { capture: true });
	}, []);

	const closeModal = () => {
		// Don't close the dialog if the click originated inside the task widget
		const widget = document.getElementById("task-widget");
		if (widget && widget.contains(lastMousedownTargetRef.current as Node)) {
			return;
		}
		setOpen(false);
		Router.back();
	};

	return (
		<AnimatePresence>
			<Transition.Root show={open} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-50"
					initialFocus={cancelButtonRef}
					onClose={() => {
						closeModal();
					}}
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
						<div className="fixed inset-0 transition-opacity bg-black dark:bg-opacity-50 bg-opacity-10 backdrop-blur-sm" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
							<AnimatePresence>
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
										className={`relative transform overflow-hidden rounded-3xl transition-all sm:my-8 sm:w-full sm:max-w-lg bg-white dark:bg-zinc-950`}
									>
										{children}
									</Dialog.Panel>
								</Transition.Child>
							</AnimatePresence>
						</div>
					</div>

					{/*
					  TaskWidget lives INSIDE the Dialog so HeadlessUI never marks it
					  as inert (HeadlessUI only marks #__next — the body > * element
					  containing the main React tree). The inDialog prop tells the
					  widget to render inline (no createPortal) so React event
					  delegation works exactly like it does for Dialog.Panel buttons.
					  position: fixed on the widget keeps it at bottom-left regardless.
					*/}
					<TaskWidget inDialog />
				</Dialog>
			</Transition.Root>
		</AnimatePresence>
	);
}
