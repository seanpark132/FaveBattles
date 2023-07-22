import { useState } from "react";
import { db, auth, storage } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import Navbar from "../components/Navbar";
import NewImgBox from "../components/NewImgBox";
import NewVideoBox from "../components/NewVideoBox";
import AddGameDetails from "../components/AddGameDetails";
import AddNewImage from "../components/AddNewImage";
import AddNewVideo from "../components/AddNewVideo";

export default function EditGame({ gameData }) {
	const [choicesData, setChoicesData] = useState(gameData.choices);
	const [formData, setFormData] = useState({
		title: gameData.title,
		description: gameData.description,
	});
	const [selectedCategories, setSelectedCategories] = useState(
		gameData.categories
	);
	const [imgIdsToRemove, setImgIdsToRemove] = useState([]);

	// final "create game" button submit - initialize game object on firestore database
	async function handleSubmit(event) {
		event.preventDefault();

		if (choicesData.length < 4) {
			alert(
				"The minimum game size is 4 choices. Make sure to have at least 4 choices."
			);
			return;
		}

		if (selectedCategories.length === 0) {
			alert("Please select at least 1 category");
			return;
		}

		try {
			imgIdsToRemove.forEach(async (imgId) => {
				const imgRef = ref(storage, `all_games/${gameId}/${imgId}`);
				await deleteObject(imgRef);
			});

			const fullFormData = {
				...formData,
				id: gameData.gameId,
				creatorId: auth.currentUser.uid,
				choices: choicesData,
				categories: selectedCategories,
				mainCategory: selectedCategories[0]?.label,
				numStarts: 0,
				numCompletes: 0,
				gameType: gameData.gameType,
			};
			await setDoc(
				doc(db, FIRESTORE_COLLECTION_NAME, gameData.gameId),
				fullFormData
			);
			alert("Game Updated!");
		} catch (error) {
			console.error(error.message);
			alert(
				"An error has occured while updating your game. Please try again."
			);
		}
	}

	return (
		<div className="w-full">
			<Navbar />
			<form onSubmit={(e) => handleSubmit(e)}>
				<fieldset>
					<AddGameDetails
						formData={formData}
						setFormData={setFormData}
						selectedCategories={selectedCategories}
						setSelectedCategories={setSelectedCategories}
					/>
					{gameData.gameType === "image" ? (
						<AddNewImage
							gameId={gameData.gameId}
							setChoicesData={setChoicesData}
						/>
					) : (
						<AddNewVideo setChoicesData={setChoicesData} />
					)}
				</fieldset>
				<hr />
				<div className="flex flex-col w-full items-center px-6 mt-8">
					<div
						className={
							gameData.gameType === "image"
								? "create-new-img-container"
								: "create-new-video-container"
						}
					>
						{choicesData &&
							choicesData.map((choiceData) => {
								return gameData.gameType === "image" ? (
									<NewImgBox
										key={choiceData.id}
										choiceId={choiceData.id}
										gameId={gameData.gameId}
										url={choiceData.url}
										name={choiceData.name}
										setChoicesData={setChoicesData}
										setImgIdsToRemove={setImgIdsToRemove}
										page="edit"
									/>
								) : (
									<NewVideoBox
										key={choiceData.id}
										choiceId={choiceData.id}
										gameId={gameData.gameId}
										embedUrl={choiceData.embedUrl}
										name={choiceData.name}
										setChoicesData={setChoicesData}
									/>
								);
							})}
					</div>
					<button
						className="m-6 py-4 px-8 w-fit border-transparent rounded bg-green-600 text-2xl md:text-3xl"
						type="submit"
					>
						Save Changes!
					</button>
				</div>
			</form>
		</div>
	);
}
