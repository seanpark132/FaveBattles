import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Stats from "./pages/Stats";
import Create from "./pages/Create";
import CreateImg from "./pages/CreateImg";
import CreateVideo from "./pages/CreateVideo";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import EditGame from "./pages/EditGame";
import NoPage from "./pages/NoPage";
import { auth } from "./firebaseConfig";
import "./css/Profile.css";
import "./css/SignUp.css";
import "./css/App.css";
import "./css/Home.css";
import "./css/Game.css";
import "./css/Create.css";
import { useQuery } from "@tanstack/react-query";
import { getGameData } from "./api/getGameData";

export default function App() {
	const gameDataQuery = useQuery({
		queryKey: ["gameData"],
		queryFn: () => getGameData(auth.currentUser?.uid),
	});

	if (gameDataQuery.isLoading) return <h1>Loading...</h1>;
	if (gameDataQuery.isError) {
		return <h1>An error occurred. Please try refreshing the page.</h1>;
	}

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						index
						element={
							<Home
								allGamesData={gameDataQuery.data.allGamesData}
							/>
						}
					/>
					<Route path="/create" element={<Create />} />
					<Route path="/create-img" element={<CreateImg />} />
					<Route path="/create-video" element={<CreateVideo />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/reset-password" element={<ResetPassword />} />
					<Route
						path="/profile"
						element={
							<Profile
								myGamesData={gameDataQuery.data.myGamesData}
							/>
						}
					/>
					{gameDataQuery.data.myGamesData.map((gameData) => (
						<Route
							key={gameData.id}
							path={`/edit-game/${gameData.id}`}
							element={
								<EditGame
									key={gameData.id}
									gameData={gameData}
								/>
							}
						/>
					))}
					{gameDataQuery.data.allGamesData.map((gameData) => (
						<Route
							key={gameData.id}
							path={`/game/${gameData.id}`}
							element={
								<Game key={gameData.id} gameData={gameData} />
							}
						/>
					))}
					{gameDataQuery.data.allGamesData.map((gameData) => (
						<Route
							key={gameData.id}
							path={`/stats/${gameData.id}`}
							element={
								<Stats key={gameData.id} gameData={gameData} />
							}
						/>
					))}
					<Route path="*" element={<NoPage />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}
