import { _ } from "lodash";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

export default function NewVideoBox({
	choiceId,
	embedUrl,
	name,
	setChoicesData,
}) {
	const { theme, setTheme } = useTheme();

	function handleNameChange(event) {
		setChoicesData((prev) => {
			let newArray = _.cloneDeep(prev);
			const videoData = newArray.find((obj) => obj.id === choiceId);
			const index = newArray.findIndex((obj) => obj.id === choiceId);
			const newData = { ...videoData, name: event.target.value };
			newArray[index] = newData;
			return newArray;
		});
	}

	function deleteBtn(choiceId) {
		setChoicesData((prev) => {
			return prev.filter((choiceData) => choiceData.id !== choiceId);
		});
		toast("Choice deleted");
	}

	// Component viable for screens below 768 px
	const mdScreen = (
		<div id={theme} className="create-new-video-box-md">
			<iframe
				className="create-iframe-dimensions-md"
				src={embedUrl}
				title="YouTube video player"
				allow="accelerometer"
				allowFullScreen
			/>
			<div className="relative">
				<div className="py-2 px-4 w-11/12">
					<h3 className="my-4">Title:</h3>
					<input
						type="text"
						className="w-full text-lg p-2 rounded"
						onChange={(e) => handleNameChange(e)}
						value={name}
						id={theme}
					/>
				</div>
				<button
					type="button"
					className="absolute top-0 right-0 h-fit py-1 px-1.5 bg-red-500"
					onClick={() => deleteBtn(choiceId)}
				>
					<i className="fa-solid fa-xmark fa-lg text-white"></i>
				</button>
			</div>
		</div>
	);

	return (
		<>
			{mdScreen}
			<div id={theme} className="create-new-video-box">
				<iframe
					width="400"
					height="225"
					src={embedUrl}
					title="YouTube video player"
					allow="accelerometer;"
					allowFullScreen
				/>
				<div className="mx-4 mt-2 w-3/5 xxl:w-1/2">
					<h3 className="mt-4 mb-4">Title:</h3>
					<input
						type="text"
						className="w-full text-lg p-2 rounded"
						onChange={(e) => handleNameChange(e)}
						value={name}
						id={theme}
					/>
				</div>
				<button
					type="button"
					className="absolute top-0 right-0 border-transparent rounded h-fit py-1 px-1.5 bg-red-500"
					onClick={() => deleteBtn(choiceId)}
				>
					<i className="fa-solid fa-xmark fa-lg text-white"></i>
				</button>
			</div>
		</>
	);
}
