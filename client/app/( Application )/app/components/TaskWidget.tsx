"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Steps } from "@/redux/types/states/Step";
import {
	clearBatch,
	setSession,
	BatchItemProgress,
} from "@/redux/slices/sessionSlice";
import { setStep } from "@/redux/actions/stepActions";
import {
	ArrowDown2,
	ArrowUp2,
	TickCircle,
	CloseCircle,
	CloseSquare,
	Timer,
	Eye,
} from "iconsax-react";

type BgTask = {
	id: string;
	status: "processing" | "done" | "failed";
	phase?: string;
	docLabel: string;
};

export default function TaskWidget({ inDialog = false }: { inDialog?: boolean }) {
	const Doctype = useAppSelector((state) => state.documentType);
	const Session = useAppSelector((state) => state.session);
	const Dispatch = useAppDispatch();

	const [mounted, setMounted] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [widgetDismissed, setWidgetDismissed] = useState(false);

	const [bgTasks, setBgTasks] = useState<BgTask[]>([]);
	const wasLoadingRef = useRef(false);
	const docLabelRef = useRef<string>("");

	// When rendered outside the Dialog (layout.tsx), track if the Next.js root
	// element gets marked `inert` by HeadlessUI (dialog opened). If it does, we
	// hide this instance so the inDialog instance (inside the Dialog) is the
	// only one visible, avoiding duplicates.
	const [parentInerted, setParentInerted] = useState(false);

	useEffect(() => { setMounted(true); }, []);

	useEffect(() => {
		if (inDialog) return; // inDialog instance never needs this guard
		const root = document.getElementById("__next") as HTMLElement | null;
		if (!root) return;
		const check = () => setParentInerted(root.hasAttribute("inert"));
		check();
		const obs = new MutationObserver(check);
		obs.observe(root, { attributes: true, attributeFilter: ["inert"] });
		return () => obs.disconnect();
	}, [mounted, inDialog]);

	useEffect(() => {
		docLabelRef.current = (Doctype as any)?.title || "Document";
	}, [Doctype]);

	useEffect(() => {
		const isLoading = Session.isLoading && !Session.isBatch;
		if (isLoading && !wasLoadingRef.current) {
			setBgTasks((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					status: "processing",
					phase: Session.phase || undefined,
					docLabel: docLabelRef.current,
				},
			]);
			setWidgetDismissed(false);
		}
		wasLoadingRef.current = isLoading;
	}, [Session.isLoading, Session.isBatch]);

	useEffect(() => {
		if (Session.isLoading && !Session.isBatch && Session.phase) {
			setBgTasks((prev) => {
				const lastIdx = prev
					.map((t, i) => ({ t, i }))
					.filter(({ t }) => t.status === "processing")
					.pop()?.i;
				if (lastIdx === undefined) return prev;
				return prev.map((t, i) =>
					i === lastIdx ? { ...t, phase: Session.phase || t.phase } : t
				);
			});
		}
	}, [Session.phase, Session.isLoading, Session.isBatch]);

	useEffect(() => {
		if (!Session.isLoading && !Session.isBatch) {
			setBgTasks((prev) => {
				const lastProcessingIdx = prev
					.map((t, i) => ({ t, i }))
					.filter(({ t }) => t.status === "processing")
					.pop()?.i;
				if (lastProcessingIdx === undefined) return prev;
				return prev.map((t, i) =>
					i === lastProcessingIdx
						? { ...t, status: "done", phase: undefined }
						: t
				);
			});
		}
	}, [Session.isLoading, Session.isBatch]);

	useEffect(() => {
		if (Session.isLoading && Session.isBatch) {
			setWidgetDismissed(false);
			setExpanded(true);
		}
	}, [Session.isLoading, Session.isBatch]);

	const batchProgress = Session.batchProgress || {};
	const progressEntries = Object.values(batchProgress) as BatchItemProgress[];
	const completedCount = progressEntries.filter((p) => p.status === "completed").length;
	const failedCount = progressEntries.filter((p) => p.status === "failed").length;
	const processingCount = progressEntries.filter((p) => p.status === "processing").length;
	const totalCount = progressEntries.length;

	const showBatchWidget = Session.isBatch && totalCount > 0 && !widgetDismissed;
	const showSingleWidget = !Session.isBatch && bgTasks.length > 0 && !widgetDismissed;
	const showWidget = showBatchWidget || showSingleWidget;

	const processingBgCount = bgTasks.filter((t) => t.status === "processing").length;
	const doneBgCount = bgTasks.filter((t) => t.status === "done").length;
	const latestBgTask = bgTasks[bgTasks.length - 1];

	const handleViewDoc = (item: BatchItemProgress) => {
		if (item.session) {
			Dispatch(setSession(item.session));
			Dispatch(setStep(Steps.Correct));
		}
	};

	const handleDismiss = () => {
		setWidgetDismissed(true);
		setExpanded(false);
		setBgTasks([]);
		Dispatch(clearBatch());
	};

	// Non-dialog instance hides itself when the Dialog is open (HeadlessUI marks
	// #__next as inert), so the inDialog instance is the sole visible copy.
	if (!mounted || !showWidget) return null;
	if (!inDialog && parentInerted) return null;

	const widgetContent = (
		<div
			id="task-widget"
			style={{
				position: "fixed",
				bottom: 16,
				left: 16,
				width: 340,
				zIndex: 2147483647,
				pointerEvents: "auto",
				isolation: "isolate",
			}}
			className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
		>
			{/* ── Single-doc task list ────────────────────────────────────── */}
			{showSingleWidget && (
				<>
					<div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
						<div className="flex items-center gap-2.5">
							{processingBgCount > 0 ? (
								<svg className="w-4 h-4 text-sky-500 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
								</svg>
							) : (
								<TickCircle color="currentColor" variant="Bold" className="w-4 h-4 text-green-500 flex-shrink-0" />
							)}
							<div className="flex flex-col">
								<span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
									{processingBgCount > 0
										? `Processing ${doneBgCount + 1} of ${bgTasks.length}…`
										: `${doneBgCount} of ${bgTasks.length} ${bgTasks.length === 1 ? "document" : "documents"} ready`}
								</span>
								{processingBgCount > 0 && latestBgTask?.phase && (
									<span className="text-xs text-zinc-500 capitalize">{latestBgTask.phase}</span>
								)}
							</div>
						</div>
						<button onClick={handleDismiss} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-0.5" type="button" title="Close">
							<CloseSquare color="currentColor" variant="Bulk" className="w-4 h-4" />
						</button>
					</div>
					<div className="px-3 py-2 flex flex-col gap-1.5 max-h-48 overflow-y-auto">
						{bgTasks.map((task, idx) => (
							<div key={task.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
								{task.status === "processing" && (
									<svg className="w-3.5 h-3.5 text-sky-500 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
									</svg>
								)}
								{task.status === "done" && <TickCircle color="currentColor" variant="Bold" className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />}
								{task.status === "failed" && <CloseCircle color="currentColor" variant="Bold" className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
								<span className="text-xs flex-1 truncate text-zinc-700 dark:text-zinc-300">{task.docLabel || `Document ${idx + 1}`}</span>
								{task.status === "processing" && task.phase && <span className="text-xs text-zinc-400 capitalize flex-shrink-0">{task.phase}</span>}
								{task.status === "done" && <span className="text-xs text-green-600 font-medium flex-shrink-0">Ready</span>}
								{task.status === "failed" && <span className="text-xs text-red-500 font-medium flex-shrink-0">Failed</span>}
							</div>
						))}
					</div>
				</>
			)}

			{/* ── Batch progress widget ───────────────────────────────────── */}
			{showBatchWidget && (
				<>
					<div className="flex items-center">
						<button onClick={() => setExpanded(!expanded)} className="flex-1 flex items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors" type="button">
							<div className="flex items-center gap-3">
								{processingCount > 0 && (
									<svg className="w-4 h-4 text-sky-500 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
									</svg>
								)}
								{processingCount === 0 && completedCount > 0 && (
									<TickCircle color="currentColor" variant="Bold" className="w-4 h-4 text-green-500 flex-shrink-0" />
								)}
								<div className="flex flex-col items-start">
									<span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
										{processingCount > 0
											? `Processing ${completedCount + failedCount + 1}/${totalCount}…`
											: `${completedCount}/${totalCount} documents ready`}
									</span>
									{failedCount > 0 && <span className="text-xs text-red-500 font-medium">{failedCount} failed</span>}
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-16 bg-zinc-200 rounded-full h-1.5 dark:bg-zinc-700">
									<div className="bg-sky-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${totalCount > 0 ? ((completedCount + failedCount) / totalCount) * 100 : 0}%` }} />
								</div>
								{expanded ? <ArrowDown2 color="currentColor" className="w-4 h-4 text-zinc-500" /> : <ArrowUp2 color="currentColor" className="w-4 h-4 text-zinc-500" />}
							</div>
						</button>
						<button onClick={handleDismiss} className="px-3 py-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" type="button" title="Dismiss">
							<CloseSquare color="currentColor" variant="Bulk" className="w-4 h-4" />
						</button>
					</div>
					{expanded && (
						<div className="px-3 pb-3 max-h-48 overflow-y-auto flex flex-col gap-1.5">
							{progressEntries.map((item) => (
								<div key={item.fileId} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
									{item.status === "completed" && <TickCircle color="currentColor" variant="Bold" className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />}
									{item.status === "failed" && <CloseCircle color="currentColor" variant="Bold" className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
									{item.status === "processing" && (
										<svg className="w-3.5 h-3.5 text-sky-500 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
										</svg>
									)}
									{item.status === "pending" && <Timer color="currentColor" variant="Bulk" className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />}
									<span className="text-xs truncate flex-1 text-zinc-700 dark:text-zinc-300">{item.fileName}</span>
									{item.status === "completed" && item.session && (
										<button onClick={() => handleViewDoc(item)} className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-medium flex-shrink-0" type="button">
											<Eye color="currentColor" variant="Bulk" className="w-3.5 h-3.5" />
											View
										</button>
									)}
									{item.status !== "completed" && (
										<span className="text-xs text-zinc-500 capitalize flex-shrink-0">
											{item.status === "processing" ? item.phase : item.status}
										</span>
									)}
								</div>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);

	// inDialog: render inline (no portal) — the widget lives inside the HeadlessUI
	// Dialog's DOM tree so HeadlessUI never marks it inert, and React events work
	// the same way they do for Dialog.Panel buttons.
	if (inDialog) return widgetContent;

	// Default: portal to documentElement so the widget is never a body > * sibling
	// that HeadlessUI could target.
	return createPortal(widgetContent, document.documentElement);
}
