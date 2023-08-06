import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import NewImgBox from "../components/Create_Edit/NewImgBox";
import AddGameDetails from "../components/Create_Edit/AddGameDetails";
import AddNewImage from "../components/Create_Edit/AddNewImage";
import NotSignedIn from "../components/NotSignedIn";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

export default function CreateImg() {
	const [choicesData, setChoicesData] = useState(null);
	const [formData, setFormData] = useState({ title: "", description: "" });
	const [selectedCategories, setSelectedCategories] = useState([]);
	const navigate = useNavigate();
	const user = useUser();
	const queryClient = useQueryClient();
	const { theme, setTheme } = useTheme();

	if (!user) {
		return <NotSignedIn />;
	}

	// create a new id for the game, or if game creation was in progress, restore saved id from local storage
	const storedGameId = localStorage.getItem("create-img-gameId");
	const gameId = storedGameId ? storedGameId : v4();
	localStorage.setItem("create-img-gameId", gameId);

	// final "create game" button submit - initialize game object on firestore database
	async function handleSubmit(event) {
		event.preventDefault();
		if (choicesData.length < 4) {
			toast(
				"The minimum game size is 4 choices. Make sure to have at least 4 choices."
			);
			return;
		}

		if (selectedCategories.length === 0) {
			toast("Please select at least 1 category");
			return;
		}

		localStorage.removeItem("create-img-gameId");
		localStorage.removeItem("create-img-choicesData");

		const fullFormData = {
			...formData,
			id: gameId,
			creatorId: user.uid,
			choices: choicesData,
			categories: selectedCategories,
			mainCategory: selectedCategories[0]?.label,
			numStarts: 0,
			numCompletes: 0,
			createdOn: Date.now(),
			gameType: "image",
		};
		await setDoc(doc(db, FIRESTORE_COLLECTION_NAME, gameId), fullFormData);
		await queryClient.invalidateQueries(["allGamesData"]);

		toast("Created game!");
		navigate(`/game/${gameId}`);
	}

	useEffect(() => {
		const storedChoicesData = localStorage.getItem(
			"create-img-choicesData"
		);
		if (storedChoicesData !== null) {
			setChoicesData(JSON.parse(storedChoicesData));
		}
	}, []);

	useEffect(() => {
		if (choicesData !== null) {
			localStorage.setItem(
				"create-img-choicesData",
				JSON.stringify(choicesData)
			);
		}
	}, [choicesData]);

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
					<AddNewImage
						gameId={gameId}
						setChoicesData={setChoicesData}
					/>
				</fieldset>
				<hr />
				<div className="flex flex-col w-full items-center px-6 mt-8">
					<div className="create-new-img-container">
						{choicesData &&
							choicesData.map((choiceData) => {
								return (
									<NewImgBox
										key={choiceData.id}
										choiceId={choiceData.id}
										gameId={gameId}
										url={choiceData.url}
										name={choiceData.name}
										setChoicesData={setChoicesData}
									/>
								);
							})}
					</div>
					<button
						className={`m-6 py-4 px-8 w-fit border-transparent rounded text-2xl md:text-3xl ${
							theme === "dark" ? "bg-green-700" : "bg-green-400"
						}`}
						type="submit"
					>
						Create Game! ({choicesData ? choicesData.length : 0}{" "}
						choices)
					</button>
				</div>
			</form>
		</div>
	);
}
