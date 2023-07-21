import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import DisplayGameBox from "./DisplayGameBox";

export default function ProfileMyGames() {
	const [myGamesData, setMyGamesData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getMyGames = async () => {
			const gamesRef = collection(db, "all_games");
			const q = query(
				gamesRef,
				where("creatorId", "==", auth.currentUser.uid)
			);

			let gamesArray = [];
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				gamesArray.push(doc.data());
			});

			setMyGamesData(gamesArray);
			setIsLoading(false);
		};

		getMyGames();
	}, []);

	const myGameBoxes = myGamesData.map((gameData) => (
		<DisplayGameBox key={gameData.id} type="profile" {...gameData} />
	));

	return (
		<section className="flex flex-col w-full py-8">
			<h1 className="mb-4">My Games</h1>
			<div className="flex flex-wrap">
				{isLoading ? (
					<h1>Loading...</h1>
				) : myGamesData.length === 0 ? (
					<h2>You have not created any games yet.</h2>
				) : (
					myGameBoxes
				)}
			</div>
		</section>
	);
}
