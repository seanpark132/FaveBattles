import { useState } from "react";
import { db, storage } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NewImgBox from "../components/Create/NewImgBox";
import NewVideoBox from "../components/Create/NewVideoBox";
import AddGameDetails from "../components/Create/AddGameDetails";
import AddNewImage from "../components/Create/AddNewImage";
import AddNewVideo from "../components/Create/AddNewVideo";
import { useQuery } from "@tanstack/react-query";
import { getGameData } from "../api/getGameData";
import { useUser } from "../context/AuthContext";

export default function EditGame({ gameId }) {
	const [choicesData, setChoicesData] = useState([]);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
	});
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [choiceIdsToRemove, setChoiceIdsToRemove] = useState([]);
	const navigate = useNavigate();
	const user = useUser();

	if (!user) {
		return <NotSignedIn />;
	}

	const gameDataQuery = useQuery({
		queryKey: ["gameData"],
		queryFn: () => getGameData(gameId),
	});

	if (gameDataQuery.isLoading) return <h1>Loading...</h1>;
	if (gameDataQuery.isError) {
		return <h1>An error occurred. Please try refreshing the page.</h1>;
	}
	const gameData = gameDataQuery.data;

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
			choiceIdsToRemove.forEach(async (choiceId) => {
				const imgRef = ref(
					storage,
					`all_games/${gameData.id}/${choiceId}`
				);
				const imgRef_384w = ref(
					storage,
					`all_games/${gameData.id}/${choiceId}_384w`
				);
				const imgRef_683w = ref(
					storage,
					`all_games/${gameData.id}/${choiceId}_683w`
				);
				await Promise.all([
					await deleteObject(imgRef),
					await deleteObject(imgRef_384w),
					await deleteObject(imgRef_683w),
				]);
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
