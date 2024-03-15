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
import { useTheme } from "../context/ThemeContext";

export default function CreateVideo() {
  const [gameId, setGameId] = useState(v4());
  const [choicesData, setChoicesData] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();
  const user = useUser();
  const { theme, setTheme } = useTheme();

  if (!user) {
    return <NotSignedIn />;
  }

  useEffect(() => {
    const storedGameId = localStorage.getItem("create-video-gameId");
    if (storedGameId) {
      setGameId(storedGameId);
    } else {
      localStorage.setItem("create-video-gameId", gameId);
    }

    const storedChoicesData = localStorage.getItem("create-video-choicesData");
    if (storedChoicesData !== null) {
      setChoicesData(JSON.parse(storedChoicesData));
    }
  }, []);

  useEffect(() => {
    if (choicesData !== null) {
      localStorage.setItem(
        "create-video-choicesData",
        JSON.stringify(choicesData),
      );
    }
  }, [choicesData]);

  async function clearChoices() {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all the current choices?",
    );

    if (isConfirmed) {
      setChoicesData([]);
      toast("Cleared all choices.");
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

    if (selectedCategories.length === 0) {
      toast("Please select at least 1 category");
      return;
    }

    if (formData.title.length < 1) {
      toast("Please enter a game title.");
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
          <AddNewVideo setChoicesData={setChoicesData} />
        </fieldset>
        <button
          type="button"
          onClick={clearChoices}
          className={`mb-4 ml-6 w-fit rounded border-transparent px-18.5 py-2 text-lg ${
            theme === "dark" ? "bg-red-700" : "bg-red-400"
          } `}
        >
          Clear Choices
        </button>
        <hr />
        <div className="mt-8 flex w-full flex-col items-center px-6">
          <div className="create-new-video-container">
            {choicesData &&
              choicesData.map((choiceData) => {
                return (
                  <NewVideoBox
                    key={choiceData.id}
                    choiceData={choiceData}
                    setChoicesData={setChoicesData}
                  />
                );
              })}
          </div>
          <button
            className={`m-6 w-fit rounded border-transparent px-8 py-4 ${
              theme === "dark" ? "bg-green-700" : "bg-green-400"
            }  text-2xl md:text-3xl`}
            type="submit"
          >
            Create Game! ({choicesData ? choicesData.length : 0} choices)
          </button>
        </div>
      </form>
    </main>
  );
}
