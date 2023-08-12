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
import { deleteStoredImage } from "../api/deleteStoredImage";

export default function CreateImg() {
	const [gameId, setGameId] = useState(v4());
	const [choicesData, setChoicesData] = useState(null);
	const [formData, setFormData] = useState({ title: "", description: "" });
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [isClearable, setIsClearable] = useState(true);
	const navigate = useNavigate();
	const user = useUser();
	const queryClient = useQueryClient();
	const { theme, setTheme } = useTheme();

	if (!user) {
		return <NotSignedIn />;
	}

	useEffect(() => {
		const storedGameId = localStorage.getItem("create-img-gameId");
		if (storedGameId) {
			setGameId(storedGameId);
		} else {
			localStorage.setItem("create-img-gameId", gameId);
		}

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

	useEffect(() => {
		if (isClearable) {
			return;
		}

		const timer = setTimeout(() => {
			setIsClearable(true);
		}, 5000);

		return () => clearTimeout(timer);
	}, [isClearable]);

	async function clearChoices() {
		if (!isClearable) {
			toast(
				"You have recently added a choice. Please try again in 5 seconds."
			);
			return;
		}

		const isConfirmed = window.confirm(
			"Are you sure you want to delete all the current choices?"
		);

		if (!isConfirmed) {
			return;
		}

		try {
			choicesData.forEach(async (choice) => {
				await deleteStoredImage(gameId, choice.id);
			});
			setChoicesData([]);
			toast("Cleared all choices.");
		} catch (error) {
			toast("An error has occurred. Please try again.");
		}
	}

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

	return (
		<main className="w-full">
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
						setIsClearable={setIsClearable}
					/>
				</fieldset>
				<button
					type="button"
					onClick={() => clearChoices()}
					className={`ml-6 mb-4 py-2 px-18 text-lg w-fit border-transparent rounded ${
						theme === "dark" ? "bg-red-700" : "bg-red-400"
					} `}
				>
					Clear Choices
				</button>
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
		</main>
	);
}
