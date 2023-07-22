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
import { getMyGames } from "./api/getMyGames";
import { getAllGames } from "./api/getAllGames";

export default function App() {
	const allGamesQuery = useQuery({
		queryKey: ["allGames"],
		queryFn: () => {
			return getAllGames();
		},
	});

	const myGamesQuery = useQuery({
		queryKey: ["myGames"],
		queryFn: () => {
			return getMyGames(auth.currentUser?.uid);
		},
	});

	if (myGamesQuery.isLoading) return <h1>Loading...</h1>;
	if (myGamesQuery.isError) {
		return <pre>{JSON.stringify(myGamesQuery.error)}</pre>;
	}

	if (allGamesQuery.isLoading) return <h1>Loading...</h1>;
	if (allGamesQuery.isError) {
		return <pre>{JSON.stringify(allGamesQuery.error)}</pre>;
	}

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						index
						element={<Home allGamesData={allGamesQuery.data} />}
					/>
					<Route path="/create" element={<Create />} />
					<Route path="/create-img" element={<CreateImg />} />
					<Route path="/create-video" element={<CreateVideo />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/reset-password" element={<ResetPassword />} />
					<Route path="/profile" element={<Profile />} />
					{myGamesQuery.data.map((game) => (
						<Route
							key={game.id}
							path={`/edit-game/${game.id}`}
							element={<EditGame key={game.id} gameData={game} />}
						/>
					))}
					{allGamesQuery.data.map((game) => (
						<Route
							key={game.id}
							path={`/game/${game.id}`}
							element={<Game key={game.id} gameData={game} />}
						/>
					))}
					{allGamesQuery.data.map((game) => (
						<Route
							key={game.id}
							path={`/stats/${game.id}`}
							element={<Stats key={game.id} gameData={game} />}
						/>
					))}
					<Route path="*" element={<NoPage />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}
