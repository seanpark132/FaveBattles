import { Link } from "react-router-dom";
import { useMemo } from "react";
import { getFirstAndSecondHighestFirstChoices } from "../utils/sort_functions";
import { useTheme } from "../context/ThemeContext";
import { deleteGame } from "../api/deleteGame";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useUser } from "../context/AuthContext";

export default function DisplayGameBox({ type, gameData }) {
	const { firstHighest, secondHighest } = useMemo(
		() =>
			getFirstAndSecondHighestFirstChoices(
				gameData.choices,
				gameData.numCompletes
			),
		[gameData]
	);
	const queryClient = useQueryClient();
	const user = useUser();
	const { theme, setTheme } = useTheme();

	async function handleDelete(gameId) {
		if (user.uid !== gameData.creatorId) {
			("You are not authorized to delete this game.");
		}

		const isConfirmed = window.confirm(
			"Are you sure you want to delete this game and all it's rankings data?"
		);

		if (isConfirmed) {
			deleteGame(gameId, gameData);
			queryClient.invalidateQueries(["myGames"]);
			queryClient.invalidateQueries(["allGamesData"]);
			toast("Game Deleted.");
		}
	}

	return (
		<article className="flex flex-col my-3 border border-neutral-300 rounded-lg">
			<div className={`h-48 w-full overflow-hidden flex select-none`}>
				<img
					className="h-full w-1/2 object-cover rounded-tl-lg"
					src={
						gameData.gameType === "video-youtube"
							? firstHighest.thumbnailUrl
							: firstHighest.url_384w
					}
					alt={`${firstHighest.name} image`}
					loading="lazy"
				/>
				<img
					className="h-full w-1/2 object-cover rounded-tr-lg"
					src={
						gameData.gameType === "video-youtube"
							? secondHighest.thumbnailUrl
							: secondHighest.url_384w
					}
					alt={`${secondHighest.name} image`}
					loading="lazy"
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
			<p className={`home-box-desc ${theme}`}>{gameData.description}</p>
			<div className="mt-auto">
				<Link
					to={`/game/${gameData.id}`}
					className={`border-transparent rounded-lg inline-block py-2 pl-3 m-3 w-28 ${
						theme === "dark" ? "bg-green-800" : "bg-green-300"
					} hover:bg-green-500 hover:text-inherit`}
				>
					<i className="mr-2 fa-solid fa-play fa-xs"></i>Play!
				</Link>
				<Link
					to={`/rankings/${gameData.id}`}
					className={`border-transparent rounded-lg inline-block py-2 pl-3 m-3 w-28 ${
						theme === "dark" ? "bg-purple-800" : "bg-purple-300"
					} hover:bg-purple-500 hover:text-inherit`}
				>
					<i className="mr-2 fa-sharp fa-solid fa-square-poll-horizontal fa-sm"></i>
					Rankings
				</Link>
				{type === "profile" && (
					<div>
						<Link
							to={`/edit-game/${gameData.id}`}
							className={`border-transparent rounded-lg inline-block py-2 pl-3 m-3 w-28 ${
								theme === "dark" ? "bg-sky-700" : "bg-sky-300"
							} hover:bg-sky-500 hover:text-inherit`}
						>
							<i className="mr-2 fa-solid fa-pen-to-square"></i>
							Edit
						</Link>
						<button
							className={`font-normal border-transparent rounded-lg inline-block py-2 pl-3 m-3 w-28 text-left ${
								theme === "dark" ? "bg-red-700" : "bg-red-300"
							} hover:bg-red-500 hover:text-inherit`}
							onClick={() => handleDelete(gameData.id)}
						>
							<i className="mr-2 fa-solid fa-trash"></i>DELETE
						</button>
					</div>
				)}
			</div>
		</article>
	);
}
