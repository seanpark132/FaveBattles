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
			<div className="mt-6 mx-6 flex">
				<button
					className={`mx-2 py-3 px-4 border border-b-transparent rounded-t-lg ${
						currentTab === "my-account" &&
						"text-purple-300 bg-purple-950"
					}`}
					onClick={() => setCurrentTab("my-account")}
				>
					My Account
				</button>
				<button
					className={`mx-2 py-3 px-4 border border-b-transparent rounded-t-lg ${
						currentTab === "my-games" &&
						"text-purple-300 bg-purple-950"
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
