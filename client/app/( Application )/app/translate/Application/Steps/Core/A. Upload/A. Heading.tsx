import { LinkSquare } from "iconsax-react";
import Link from "next/link";

const Heading = () => {
	return (
		<>
			<h5 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
				Translate Your Document
			</h5>

			<p className="mb-6 text-xs font-normal text-zinc-700 dark:text-zinc-400">
				Begin the translation process by selecting the type of document
				you wish to translate, and then uploading it towards the server
				to be processed.
				<br />
				<Link
					href="#"
					className="inline-flex items-center text-sky-600 hover:underline p-2"
				>
					See our guideline
					<LinkSquare
						className="ml-1"
						color="currentColor"
						variant="Bulk"
					/>
				</Link>
			</p>
		</>
	);
};

export default Heading;
