import { useState } from "react";
import { storage } from "../../firebaseConfig";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Compressor from "compressorjs";

export default function AddNewImage({ gameId, setChoicesData }) {
	const [inputtedImgs, setInputtedImgs] = useState([]);

	async function handleInputtedImgs(images) {
		if (!images) {
			return;
		}

		const imgsArray = Object.values(images);
		imgsArray.forEach((img) => {
			new Compressor(img, {
				quality: 0.8,
				maxWidth: 960,
				maxHeight: 960,
				convertSize: 1500000,
				success(result) {
					setInputtedImgs((prev) => [...prev, result]);
				},
			});
		});
	}

	async function uploadImage(addedImgs) {
		if (addedImgs.length === 0) {
			alert("Please add a file first");
			return;
		}

		try {
			const uploadPromises = addedImgs.map(async (img) => {
				const imgId = v4();
				const newImgRef = ref(storage, `all_games/${gameId}/${imgId}`);

				const uploadedImg = await uploadBytes(newImgRef, img);
				const imgUrl = await getDownloadURL(uploadedImg.ref);
				let charsToRemove = 4;
				if (img.type === "image/webp") {
					charsToRemove = 5;
				}
				const defaultName = (
					img.name.charAt(0).toUpperCase() + img.name.slice(1)
				).slice(0, img.name.length - charsToRemove);

				return {
					id: imgId,
					url: imgUrl,
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
			alert("Image(s) uploaded");
		} catch (error) {
			console.error("Error occurred during image uploaded:", error);
			alert(
				"An error has occurred in uploading image(s). Please try again."
			);
		}
	}

	return (
		<section className="flex flex-col px-6 mb-6 max-w-xs">
			<h2 className="mb-4">Choose images to add</h2>
			<input
				type="file"
				className="w-fit file:bg-blue-800"
				accept="image/png, image/jpeg, image/jpg, image/webp"
				multiple={true}
				onChange={(e) => {
					handleInputtedImgs(e.target.files);
					// setInputtedImgs(e.target.files);
				}}
				id="imgUpload"
			/>
			<button
				type="button"
				className="mt-4 py-2 px-20 w-fit bg-blue-400 border-transparent rounded"
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
