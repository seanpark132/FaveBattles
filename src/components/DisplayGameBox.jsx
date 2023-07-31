import { Link } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import { deleteStoredImage } from "../api/deleteStoredImage";
import { useMemo } from "react";
import { getFirstAndSecondHighestFirstChoices } from "../utils/helper_functions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function DisplayGameBox({ type, gameData }) {
	const { firstHighest, secondHighest } = useMemo(
		() => getFirstAndSecondHighestFirstChoices(gameData.choices),
		[gameData]
	);
	const queryClient = useQueryClient();

	async function deleteGame(gameId) {
		try {
			const gameDoc = doc(db, FIRESTORE_COLLECTION_NAME, gameId);
			await deleteDoc(gameDoc);

			if (gameData.gameType === "image") {
				gameData.choices.forEach(async (choice) => {
					await deleteStoredImage(gameId, choice.id);
				});
			}
			queryClient.invalidateQueries(["myGames"]);
			queryClient.invalidateQueries(["allGamesData"]);
			toast("Game Deleted.");
		} catch (error) {
			console.error(error.message);
			toast("Error occurred in deleting game. Please try again.");
		}
	}

	return (
		<div className="home-box">
			<div className="h-48 w-full overflow-hidden flex select-none">
				<img
					className="h-full w-1/2 object-cover rounded-tl-lg"
					src={
						gameData.gameType === "video-youtube"
							? firstHighest.thumbnailUrl
							: firstHighest.url_384w
					}
					alt="left img"
				/>
				<img
					className="h-full w-1/2 object-cover rounded-tr-lg"
					src={
						gameData.gameType === "video-youtube"
							? secondHighest.thumbnailUrl
							: secondHighest.url_384w
					}
					alt="right img"
				/>
			</div>
			<div className="flex w-full mb-2 border-b-2 border-b-slate-200">
				<p className="home-box-img-label">{firstHighest.name}</p>
				<p className="home-box-img-label">{secondHighest.name}</p>
			</div>
			<h3 className="my-1 mx-2 max-h-16 overflow-hidden">
				[{gameData.mainCategory}] {gameData.title} (
				{gameData.choices.length} choices)
			</h3>
			<p className="home-box-desc">{gameData.description}</p>
			<div className="mt-auto">
				<Link
					to={`/game/${gameData.id}`}
					className="home-box-btn bg-green-700 hover:bg-green-500"
				>
					<i className="mr-2 fa-solid fa-play fa-xs"></i>Play!
				</Link>
				<Link
					to={`/stats/${gameData.id}`}
					className="home-box-btn bg-purple-900 hover:bg-purple-700"
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
