import { useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { FIRESTORE_COLLECTION_NAME } from "../../utils/global_consts";
import { useNavigate } from "react-router-dom";
import NewImgBox from "./NewImgBox";
import NewVideoBox from "./NewVideoBox";
import AddGameDetails from "./AddGameDetails";
import AddNewImage from "./AddNewImage";
import AddNewVideo from "./AddNewVideo";
import { deleteStoredImage } from "../../api/deleteStoredImage";
import { useUser } from "../../context/AuthContext";

export default function Edit({ gameData }) {
	const [choicesData, setChoicesData] = useState(gameData.choices);
	const [formData, setFormData] = useState({
		title: gameData.title,
		description: gameData.description,
	});
	const [selectedCategories, setSelectedCategories] = useState(
		gameData.categories
	);
	const [choiceIdsToRemove, setChoiceIdsToRemove] = useState([]);
	const navigate = useNavigate();
	const user = useUser();

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
			choiceIdsToRemove.forEach(async (choiceId) => {
				await deleteStoredImage(gameData.id, choiceId);
			});

			const fullFormData = {
				...formData,
				id: gameData.id,
				creatorId: user.uid,
				choices: choicesData,
				categories: selectedCategories,
				mainCategory: selectedCategories[0]?.label,
				numStarts: 0,
				numCompletes: 0,
				createdOn: Date.now(),
				gameType: gameData.gameType,
			};
			await setDoc(
				doc(db, FIRESTORE_COLLECTION_NAME, gameData.id),
				fullFormData
			);
			alert("Game Updated!");
			navigate("/profile");
		} catch (error) {
			console.error(error.message);
			alert(
				"An error has occured while updating your game. Please try again."
			);
		}
	}

	return (
		<div className="w-full">
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
							gameId={gameData.id}
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
										gameId={gameData.id}
										url={choiceData.url}
										name={choiceData.name}
										setChoicesData={setChoicesData}
										setChoiceIdsToRemove={
											setChoiceIdsToRemove
										}
										page="edit"
									/>
								) : (
									<NewVideoBox
										key={choiceData.id}
										choiceId={choiceData.id}
										gameId={gameData.id}
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