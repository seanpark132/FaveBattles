import { useState } from "react";
import ProfileMyGames from "../components/Profile/ProfileMyGames";
import NotSignedIn from "../components/NotSignedIn";
import { useUser } from "../context/AuthContext";
import ProfileMyAccount from "../components/Profile/ProfileMyAccount";

export default function Profile() {
  const [currentTab, setCurrentTab] = useState("my-account");
  const user = useUser();

  if (!user) {
    return <NotSignedIn />;
  }

  return (
    <main className="w-full">
      <div className="mx-6 mt-6 flex">
        <button
          className={`mx-2 rounded-t-lg border border-b-transparent px-4 py-3 ${
            currentTab === "my-account" && "bg-purple-950 text-purple-300"
          }`}
          onClick={() => setCurrentTab("my-account")}
        >
          My Account
        </button>
        <button
          className={`mx-2 rounded-t-lg border border-b-transparent px-4 py-3 ${
            currentTab === "my-games" && "bg-purple-950 text-purple-300"
          }`}
          onClick={() => setCurrentTab("my-games")}
        >
          My Games
        </button>
      </div>
      <hr className="mb-6" />

      {currentTab === "my-account" && <ProfileMyAccount />}
      {currentTab === "my-games" && <ProfileMyGames />}
    </main>
  );
}
