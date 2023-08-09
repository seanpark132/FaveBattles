import { _ } from "lodash";
import { Image } from "primereact/image";
import { deleteStoredImage } from "../../api/deleteStoredImage";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

export default function NewImgBox({
	choiceId,
	gameId,
	url,
	name,
	setChoicesData,
	setChoiceIdsToRemove,
	page,
}) {
	const { theme, setTheme } = useTheme();

	function handleNameChange(event) {
		setChoicesData((prev) => {
			let newArray = _.cloneDeep(prev);
			const imgData = newArray.find((obj) => obj.id === choiceId);
			const index = newArray.findIndex((obj) => obj.id === choiceId);
			const newData = { ...imgData, name: event.target.value };
			newArray[index] = newData;
			return newArray;
		});
	}

	async function deleteBtn(choiceId) {
		if (page === "edit") {
			setChoiceIdsToRemove((prev) => [...prev, choiceId]);

			setChoicesData((prev) => {
				return prev.filter((choiceData) => choiceData.id !== choiceId);
			});
			return;
		}

		try {
			await deleteStoredImage(gameId, choiceId);
			toast("Choice deleted");
			setChoicesData((prev) => {
				return prev.filter((choiceData) => choiceData.id !== choiceId);
			});
		} catch (error) {
			toast("An error has occurred");
		}
	}

	return (
		<div
			className={`flex relative mb-8 border rounded w-full h-32 ${
				theme === "dark" ? "bg-slate-800" : "bg-sky-200"
			}`}
		>
			<Image
				src={url}
				alt="choice-img"
				imageClassName="h-full w-32 object-cover"
				preview
			/>
			<div className="p-4 w-3/5">
				<label className="text-lg md:text-xl" htmlFor="choiceName">
					Name:
				</label>
				<input
					type="text"
					className={`w-full mt-2 p-2 text-sm rounded border-2 md:text-lg ${theme}`}
					onChange={(e) => handleNameChange(e)}
					name="choiceName"
					id="choiceName"
					value={name}
				/>
			</div>
			<button
				type="button"
				className="absolute top-0 right-0 border-transparent rounded h-fit py-1 px-1.5 bg-red-500"
				onClick={() => deleteBtn(choiceId)}
				aria-label="Delete image"
			>
				<i className="fa-solid fa-xmark fa-lg text-white"></i>
			</button>
		</div>
	);
}
