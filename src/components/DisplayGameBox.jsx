import { Link } from "react-router-dom";
import { useMemo } from "react";
import { getFirstAndSecondHighestFirstChoices } from "../utils/sort_functions";
import { useTheme } from "../context/ThemeContext";
import { deleteGame } from "../api/deleteGame";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useUser } from "../context/AuthContext";
import Icon from "./Icon";

export default function DisplayGameBox({ type, gameData }) {
  const { firstHighest, secondHighest } = useMemo(
    () =>
      getFirstAndSecondHighestFirstChoices(
        gameData.choices,
        gameData.numCompletes,
      ),
    [gameData],
  );
  const queryClient = useQueryClient();
  const user = useUser();
  const { theme } = useTheme();

  async function handleDelete(gameId) {
    if (user.uid !== gameData.creatorId) {
      ("You are not authorized to delete this game.");
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this game and all it's rankings data?",
    );

    if (isConfirmed) {
      deleteGame(gameId, gameData);
      queryClient.invalidateQueries(["myGames"]);
      queryClient.invalidateQueries(["allGamesData"]);
      toast("Game Deleted.");
    }
  }

  return (
    <article className="my-3 flex flex-col rounded-lg border border-neutral-300">
      <div className={`flex h-48 w-full select-none overflow-hidden`}>
        <img
          className="h-full w-1/2 rounded-tl-lg object-cover"
          src={
            gameData.gameType === "video-youtube"
              ? firstHighest.thumbnailUrl
              : firstHighest.url_sm
          }
          alt={`${firstHighest.name} image`}
          loading="lazy"
        />
        <img
          className="h-full w-1/2 rounded-tr-lg object-cover"
          src={
            gameData.gameType === "video-youtube"
              ? secondHighest.thumbnailUrl
              : secondHighest.url_sm
          }
          alt={`${secondHighest.name} image`}
          loading="lazy"
        />
      </div>
      <div className="mb-2 flex w-full border-b-2 border-b-slate-200">
        <p className="home-box-img-label">{firstHighest.name}</p>
        <p className="home-box-img-label">{secondHighest.name}</p>
      </div>
      <h3 className="mx-2 my-1 max-h-16 overflow-hidden">
        [{gameData.mainCategory}] {gameData.title} ({gameData.choices.length}{" "}
        choices)
      </h3>
      <p className={`home-box-desc ${theme}`}>{gameData.description}</p>
      <div className="mt-auto">
        <div className="flex">
          <Link
            to={`/game/${gameData.id}`}
            className={`m-3 flex w-28 items-center rounded-lg border-transparent py-2 pl-3 ${
              theme === "dark" ? "bg-green-800" : "bg-green-300"
            } hover:bg-green-500 hover:text-inherit`}
          >
            <Icon name="play3" styles="mr-2" />
            Play!
          </Link>
          <Link
            to={`/rankings/${gameData.id}`}
            className={`m-3 flex w-28 items-center rounded-lg border-transparent py-2 pl-3 ${
              theme === "dark" ? "bg-purple-800" : "bg-purple-300"
            } hover:bg-purple-500 hover:text-inherit`}
          >
            <Icon name="table2" styles="mr-2" />
            Rankings
          </Link>
        </div>
        {type === "profile" && (
          <div className="flex">
            <Link
              to={`/edit-game/${gameData.id}`}
              className={`m-3 flex w-28 items-center rounded-lg border-transparent py-2 pl-3 ${
                theme === "dark" ? "bg-sky-700" : "bg-sky-300"
              } hover:bg-sky-500 hover:text-inherit`}
            >
              <Icon name="pencil" styles="mr-2" />
              Edit
            </Link>
            <button
              className={`m-3 flex w-28 items-center rounded-lg border-transparent py-2 pl-3 text-left font-normal ${
                theme === "dark" ? "bg-red-700" : "bg-red-300"
              } hover:bg-red-500 hover:text-inherit`}
              onClick={() => handleDelete(gameData.id)}
            >
              <Icon name="bin2" styles="mr-2" />
              DELETE
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
