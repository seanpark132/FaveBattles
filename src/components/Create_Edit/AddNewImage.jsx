import { useState } from "react";
import { storage } from "../../firebaseConfig";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Compressor from "compressorjs";
import { BUCKET_NAME } from "../../utils/global_consts";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

export default function AddNewImage({
	gameId,
	setChoicesData,
	setIsClearable,
}) {
	const [inputtedImgs, setInputtedImgs] = useState([]);
	const { theme, setTheme } = useTheme();

	async function handleInputtedImgs(images) {
		if (!images) {
			return;
		}

		const imgsArray = Object.values(images);

		imgsArray.forEach((img) => {
			new Compressor(img, {
				quality: 0.8,
				mimeType: "image/webp",
				maxWidth: 960,
				maxHeight: 960,
				success(result) {
					setInputtedImgs((prev) => [...prev, result]);
				},
				error(error) {
					console.error(
						"An error occurred in adding your files.",
						error
					);
					toast(
						"An error occurred in adding your files. Please try again."
					);
				},
			});
		});
	}

	async function uploadImage(inputImages) {
		if (inputImages.length === 0) {
			toast("Please add a file first");
			return;
		}

		try {
			const uploadPromises = inputImages.map(async (img) => {
				const id = v4();
				const imagePath = `all_games/${gameId}/${id}`;
				const newImgRef = ref(storage, imagePath);
				await uploadBytes(newImgRef, img);
				const imgUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${imagePath}`;
				const url_384w = `${imgUrl}_384w`;
				const url_683w = `${imgUrl}_683w`;
				const charsToRemove = 5;

				const defaultName = (
					img.name.charAt(0).toUpperCase() + img.name.slice(1)
				).slice(0, img.name.length - charsToRemove);

				return {
					id: id,
					url: imgUrl,
					url_384w: url_384w,
					url_683w: url_683w,
					name: defaultName,
					numWins: 0,
					numGames: 0,
					numFirst: 0,
				};
			});

			const uploadedImagesData = await Promise.all(uploadPromises);
			setInputtedImgs([]);
			setChoicesData((prev) =>
				prev
					? [...prev, ...uploadedImagesData]
					: [...uploadedImagesData]
			);
			setIsClearable(false);
			toast("Image(s) uploaded");
		} catch (error) {
			console.error("Error occurred during image uploading:", error);
			toast(
				"An error has occurred in uploading image(s). Please try again."
			);
		}
	}

	return (
		<section className="flex flex-col px-6 mb-6 max-w-xs">
			<h2 className="mb-4">Choose images to add</h2>
			<input
				type="file"
				className={`create-file-btn ${theme}`}
				accept="image/png, image/jpeg, image/jpg, image/webp"
				multiple={true}
				onChange={(e) => {
					handleInputtedImgs(e.target.files);
				}}
			/>
			<button
				type="button"
				className={`mt-4 py-2 px-20 text-lg w-fit border-transparent rounded ${
					theme === "dark" ? "bg-sky-800" : "bg-sky-300"
				} `}
				onClick={() => uploadImage(inputtedImgs)}
			>
				Add Images
			</button>
			<p className="mt-2">
				<em>Accepts .png, .jpg, .jpeg, .webp types</em>
			</p>
		</section>
	);
}
