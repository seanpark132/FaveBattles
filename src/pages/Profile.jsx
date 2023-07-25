import Navbar from "../components/Navbar";
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
		<div className="w-screen">
			<Navbar />
			<div className="p-6 w-full">
				<div className="flex border-b mb-6">
					<button
						className={
							currentTab === "my-account"
								? "profile-tab text-purple-300 bg-purple-950"
								: "profile-tab"
						}
						onClick={() => setCurrentTab("my-account")}
					>
						My Account
					</button>
					<button
						className={
							currentTab === "my-games"
								? "profile-tab text-purple-300 bg-purple-950"
								: "profile-tab"
						}
						onClick={() => setCurrentTab("my-games")}
					>
						My Games
					</button>
				</div>
				{currentTab === "my-account" && <ProfileMyAccount />}
				{currentTab === "my-games" && <ProfileMyGames />}
			</div>
		</div>
	);
}
