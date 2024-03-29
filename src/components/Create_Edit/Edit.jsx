import { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "../../context/ThemeContext";

export default function Edit({ gameData }) {
  const [choicesData, setChoicesData] = useState(gameData.choices);
  const [formData, setFormData] = useState({
    title: gameData.title,
    description: gameData.description,
  });
  const [selectedCategories, setSelectedCategories] = useState(
    gameData.categories,
  );
  const [choiceIdsToRemove, setChoiceIdsToRemove] = useState([]);
  const [numCompletesToDeduct, setNumCompletesToDeduct] = useState(0);
  const [isRecentlyAdded, setIsRecentlyAdded] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  const { theme } = useTheme();
  const navigate = useNavigate();
  const user = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsRendered(true);
  }, []);

  useEffect(() => {
    if (!isRecentlyAdded) {
      return;
    }

    const timer = setTimeout(() => {
      setIsRecentlyAdded(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isRecentlyAdded]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (choicesData.length < 4) {
      toast(
        "The minimum game size is 4 choices. Make sure to have at least 4 choices.",
      );
      return;
    }

    if (selectedCategories.length === 0) {
      toast("Please select at least 1 category");
      return;
    }

    if (formData.title.length < 1) {
      toast("Please enter a game title.");
      return;
    }

    if (user.uid !== gameData.creatorId) {
      toast("You are not authorized to edit this game. ");
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
        numStarts: gameData.numStarts,
        numCompletes: gameData.numCompletes - numCompletesToDeduct,
        createdOn: gameData.createdOn,
        gameType: gameData.gameType,
      };

      await setDoc(
        doc(db, FIRESTORE_COLLECTION_NAME, gameData.id),
        fullFormData,
      );
      await queryClient.invalidateQueries([
        `edit_${gameData.id}`,
        "allGamesData",
      ]);
      toast("Game Updated!");
      navigate("/profile");
    } catch (error) {
      console.error(error.message);
      toast("An error has occured while updating your game. Please try again.");
    }
  }

  return (
    <>
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
              setIsRecentlyAdded={setIsRecentlyAdded}
            />
          ) : (
            <AddNewVideo setChoicesData={setChoicesData} />
          )}
        </fieldset>
        <hr />
        <div className="mt-8 flex w-full flex-col items-center px-6">
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
                    gameId={gameData.id}
                    choiceData={choiceData}
                    setChoicesData={setChoicesData}
                    setChoiceIdsToRemove={setChoiceIdsToRemove}
                    setNumCompletesToDeduct={setNumCompletesToDeduct}
                    isRecentlyAdded={isRecentlyAdded}
                    isRendered={isRendered}
                    isEditPage={true}
                  />
                ) : (
                  <NewVideoBox
                    key={choiceData.id}
                    choiceData={choiceData}
                    setChoicesData={setChoicesData}
                    setNumCompletesToDeduct={setNumCompletesToDeduct}
                    isEditPage={true}
                  />
                );
              })}
          </div>
          <button
            className={`m-6 w-fit rounded border-transparent px-8 py-4 text-2xl md:text-3xl ${
              theme === "dark" ? "bg-green-700" : "bg-green-400"
            }`}
            type="submit"
          >
            Save Changes!
          </button>
        </div>
      </form>
    </>
  );
}
