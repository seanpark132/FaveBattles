import { Link } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";

import { deleteStoredImage } from "../api/deleteStoredImage";

export default function DisplayGameBox({ type, gameData }) {
	async function deleteGame(gameId) {
		try {
			const gameDoc = doc(db, FIRESTORE_COLLECTION_NAME, gameId);
			await deleteDoc(gameDoc);

			if (gameData.gameType === "image") {
				gameData.choices.forEach(async (choice) => {
					await deleteStoredImage(gameId, choice.id);
				});
			}

			alert("Game Deleted.");
		} catch (error) {
			console.error(error.message);
			alert("Error in deleting game.");
		}
	}

	return (
		<div className="home-box-container">
			<div className="h-48 w-full overflow-hidden flex">
				<img
					className="h-full w-1/2 object-cover"
					src={
						gameData.gameType === "video-youtube"
							? gameData.choices[0].thumbnailUrl
							: gameData.choices[0].url_384w
					}
					alt="left img"
				/>
				<img
					className="h-full w-1/2 object-cover"
					src={
						gameData.gameType === "video-youtube"
							? gameData.choices[1].thumbnailUrl
							: gameData.choices[1].url_384w
					}
					alt="right img"
				/>
			</div>
			<div className="flex w-full mb-2 border-b-2 border-b-slate-200">
				<p className="home-box-img-label">{gameData.choices[0].name}</p>
				<p className="home-box-img-label">{gameData.choices[1].name}</p>
			</div>
			<h3 className="my-1 mx-2 max-h-16 overflow-hidden">
				[{gameData.mainCategory}] {gameData.title} (
				{gameData.choices.length} choices)
			</h3>
			<p className="home-box-desc">{gameData.description}</p>
			<div className="mt-auto">
				<Link
					to={`/game/${gameData.id}`}
					className="home-box-btn bg-green-600"
				>
					<i className="mr-2 fa-solid fa-play fa-xs"></i>Play!
				</Link>
				<Link
					to={`/stats/${gameData.id}`}
					className="home-box-btn bg-purple-900"
				>
					<i className="mr-2 fa-sharp fa-solid fa-square-poll-horizontal fa-sm"></i>
					Rankings
				</Link>
				{type === "profile" && (
					<div>
						<Link
							to={`/edit-game/${gameData.id}`}
							className="home-box-btn bg-sky-600"
						>
							<i className="mr-2 fa-solid fa-pen-to-square"></i>
							Edit
						</Link>
						<button
							className="home-box-btn text-left bg-red-500"
							onClick={() => deleteGame(gameData.id)}
						>
							<i className="mr-2 fa-solid fa-trash"></i>DELETE
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
