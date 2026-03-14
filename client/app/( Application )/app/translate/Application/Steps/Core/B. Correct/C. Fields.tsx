import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDocumentType } from "@/redux/actions/documentTypeActions";
import { Doctype, Field } from "@/redux/types/states/Document Type";
import { setSession } from "@/redux/slices/sessionSlice";
import { Translate } from "iconsax-react";
import translate from "translate";
import toast from "react-hot-toast";

export default function Fields() {
	const dispatch = useAppDispatch();
	const Doctype: Doctype | null = useAppSelector(
		(state) => state.documentType
	);
	const Session = useAppSelector((state) => state.session);
	const Values = Session?.Data?.Translation?.Text;

	return (
		<div className="relative w-full text-left">
			{/* If there's a selected Doctype, Display its fields. */}
			{Doctype && Doctype.fields
				? Doctype.fields.map((field) => {
						return <DynamicField XField={field} key={field.name} />;
				  })
				: null}
		</div>
	);
}

const DynamicField = ({ XField }: { XField: Field }) => {
	const dispatch = useAppDispatch();
	const Session = useAppSelector((state) => state.session);
	const InputRef = useRef<HTMLInputElement>(null);
	const Values: {
		[key: string]: string;
	} = Session?.Data?.Translation?.Text || {};

	const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		// Set the value in the session
		if (Session?.Data?.Translation?.Text) {
			// Disptach
			dispatch(
				setSession({
					...Session?.Data,
					Translation: {
						...Session?.Data?.Translation,
						Text: {
							...Session?.Data?.Translation?.Text,
							[name]: value,
						},
					},
				})
			);
		}
	};

	const handleValueTranslation = async (Name: string, Value: string) => {
		const translateApiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

		if (!translateApiKey) {
			toast.error("Google Translate API key is not configured. Please set NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY in your environment.");
			return;
		}

		if (!Value || Value.trim() === "") {
			toast.error(`No value to translate for ${Name}.`);
			return;
		}

		let TranslatedValue: string;
		try {
			TranslatedValue = await toast
				.promise(
					translate(Value, {
						from: "fr",
						to: "en",
						engine: "google",
						key: translateApiKey,
					}),
					{
						loading: `Translating ${Name}...`,
						success: `${Name} translated successfully.`,
						error: `Couldn't translate ${Name}. The Google Translate API key may be invalid.`,
					}
				)
				.then((res: string) => res);
		} catch (error: any) {
			console.error(`Translation failed for ${Name}:`, error);
			return;
		}

		toast(`Translated ${Name} from "${Value}" to "${TranslatedValue}".`, {
			icon: <Translate color="currentColor" variant="Bulk" />,
		});

		// Update input value
		if (InputRef && InputRef.current) {
			InputRef.current.value = TranslatedValue;
		}

		// Set the value in the session
		if (Session?.Data?.Translation?.Text) {
			// Disptach
			dispatch(
				setSession({
					...Session?.Data,
					Translation: {
						...Session?.Data?.Translation,
						Text: {
							...Session?.Data?.Translation?.Text,
							[Name]: TranslatedValue,
						},
					},
				})
			);
		}
	};

	return (
		<div className="mb-6" key={XField.name}>
			<label
				htmlFor={XField.name}
				className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white"
			>
				{XField.name}
			</label>
			<div className="flex relative gap-3">
				<input
					ref={InputRef}
					type={XField.type}
					placeholder={XField.description}
					defaultValue={Values ? Values[XField.name] : ""}
					id={XField.name}
					name={XField.name}
					required={XField.required}
					onChange={handleFieldChange}
					className="flex-1 bg-zinc-50 border min-h- border-zinc-300 text-zinc-900 text-sm rounded-xl focus:ring-sky-500 focus:border-sky-500 w-full px-2.5 dark:bg-zinc-900 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
				/>
				<button
					type="button"
					onClick={() =>
						handleValueTranslation(XField.name, Values[XField.name])
					}
					className="h-full text-zinc-500 ring-0 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:outline-none rounded-xl text-sm p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600"
				>
					<Translate variant="Bulk" />
				</button>
			</div>
		</div>
	);
};
