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
  const [isRecentlyAdded, setIsRecentlyAdded] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  const navigate = useNavigate();
  const user = useUser();
  const queryClient = useQueryClient();
  const { theme } = useTheme();

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

    const storedChoicesData = localStorage.getItem("create-img-choicesData");
    if (storedChoicesData !== null) {
      setChoicesData(JSON.parse(storedChoicesData));
    }
    setIsRendered(true);
  }, []);

  useEffect(() => {
    if (choicesData !== null) {
      localStorage.setItem(
        "create-img-choicesData",
        JSON.stringify(choicesData),
      );
    }
  }, [choicesData]);

  useEffect(() => {
    if (!isRecentlyAdded) {
      return;
    }

    const timer = setTimeout(() => {
      setIsRecentlyAdded(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isRecentlyAdded]);

  async function clearChoices() {
    if (isRecentlyAdded) {
      toast("You have recently added a choice. Please try again in 3 seconds.");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete all the current choices?",
    );

    if (isConfirmed) {
      // send choicesData to a Lambda and delete all from there
      
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
  }

  // final "create game" button submit - initialize game object on firestore database
  async function handleSubmit(event) {
    event.preventDefault();
    if (choicesData.length < 4) {
      toast(
        "The minimum game size is 4 choices. Make sure to have at least 4 choices.",
      );
      return;
    }

    if (selectedCategories.length < 1) {
      toast("Please select at least 1 category");
      return;
    }

    if (formData.title.length < 1) {
      toast("Please enter a game title.");
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
      mainCategory: selectedCategories[0].label,
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
            setIsRecentlyAdded={setIsRecentlyAdded}
          />
        </fieldset>
        <button
          type="button"
          onClick={() => clearChoices()}
          className={`mb-4 ml-6 rounded border-transparent px-18.5 py-2 text-lg ${
            theme === "dark" ? "bg-red-700" : "bg-red-400"
          } `}
        >
          Clear Choices
        </button>
        <hr />
        <div className="mt-8 flex w-full flex-col items-center px-6">
          <div className="create-new-img-container">
            {choicesData &&
              choicesData.map((choiceData) => {
                return (
                  <NewImgBox
                    key={choiceData.id}
                    gameId={gameId}
                    choiceData={choiceData}
                    setChoicesData={setChoicesData}
                    isRecentlyAdded={isRecentlyAdded}
                    isRendered={isRendered}
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
            Create Game! ({choicesData ? choicesData.length : 0} choices)
          </button>
        </div>
      </form>
    </main>
  );
}
