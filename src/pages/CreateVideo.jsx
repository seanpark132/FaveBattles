import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import { useNavigate } from "react-router-dom";
import AddGameDetails from "../components/Create_Edit/AddGameDetails";
import NewVideoBox from "../components/Create_Edit/NewVideoBox";
import AddNewVideo from "../components/Create_Edit/AddNewVideo";
import NotSignedIn from "../components/NotSignedIn";
import { useUser } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function CreateVideo() {
	const [choicesData, setChoicesData] = useState(null);
	const [formData, setFormData] = useState({ title: "", description: "" });
	const [selectedCategories, setSelectedCategories] = useState([]);
	const navigate = useNavigate();
	const user = useUser();

	if (!user) {
		return <NotSignedIn />;
	}

	// create a new id for the game, or if game creation was in progress, restore saved id from local storage
	const storedGameId = localStorage.getItem("create-video-gameId");
	const gameId = storedGameId ? storedGameId : v4();
	localStorage.setItem("create-video-GameId", gameId);

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

		localStorage.removeItem("create-video-gameId");
		localStorage.removeItem("create-video-choicesData");
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
			gameType: "video-youtube",
		};
		await setDoc(doc(db, FIRESTORE_COLLECTION_NAME, gameId), fullFormData);
		toast("Game created!");
		navigate(`/game/${gameId}`);
	}

	useEffect(() => {
		const storedChoicesData = localStorage.getItem(
			"create-video-choicesData"
		);
		if (storedChoicesData !== null) {
			setChoicesData(JSON.parse(storedChoicesData));
		}
	}, []);

	useEffect(() => {
		if (choicesData !== null) {
			localStorage.setItem(
				"create-video-choicesData",
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
					<AddNewVideo setChoicesData={setChoicesData} />
				</fieldset>
				<hr />
				<div className="flex flex-col w-full items-center px-6 mt-8">
					<div className="create-new-video-container">
						{choicesData &&
							choicesData.map((choiceData) => {
								return (
									<NewVideoBox
										key={choiceData.id}
										choiceId={choiceData.id}
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
						Create Game! ({choicesData ? choicesData.length : 0}{" "}
						choices)
					</button>
				</div>
			</form>
		</div>
	);
}
