import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Rankings from "./pages/Rankings";
import Create from "./pages/Create";
import CreateImg from "./pages/CreateImg";
import CreateVideo from "./pages/CreateVideo";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import EditGame from "./pages/EditGame";
import NoPage from "./pages/NoPage";
import "react-toastify/dist/ReactToastify.css";
import "./css/Profile.css";
import "./css/SignUp.css";
import "./css/App.css";
import "./css/Home.css";
import "./css/Game.css";
import "./css/Create_Edit.css";
import { useQuery } from "@tanstack/react-query";
import { getAllGameData } from "./api/getAllGameData";
import { ToastContainer } from "react-toastify";

export default function App() {
	const allGamesDataQuery = useQuery({
		queryKey: ["allGamesData"],
		queryFn: () => getAllGameData(),
	});

	if (allGamesDataQuery.isLoading) return <h1 className="m-6">Loading...</h1>;
	if (allGamesDataQuery.isError) {
		return (
			<h1 className="m-6">
				An error occurred. Please try refreshing the page.
			</h1>
		);
	}

	return (
		<>
			<ToastContainer theme="dark" style={{ zIndex: 10001 }} />
			<Navbar />
			<Routes>
				<Route
					index
					element={
						<Home
							allGamesData={allGamesDataQuery.data.allGamesData}
						/>
					}
				/>
				<Route path="/create" element={<Create />} />
				<Route path="/create-img" element={<CreateImg />} />
				<Route path="/create-video" element={<CreateVideo />} />
				<Route path="/sign-up" element={<SignUp />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route path="/profile" element={<Profile />} />
				{allGamesDataQuery.data.allGameIds.map((id) => (
					<Route
						key={id}
						path={`/edit-game/${id}`}
						element={<EditGame key={id} gameId={id} />}
					/>
				))}
				{allGamesDataQuery.data.allGamesData.map((gameData) => (
					<Route
						key={gameData.id}
						path={`/game/${gameData.id}`}
						element={<Game key={gameData.id} gameData={gameData} />}
					/>
				))}
				{allGamesDataQuery.data.allGamesData.map((gameData) => (
					<Route
						key={gameData.id}
						path={`/stats/${gameData.id}`}
						element={
							<Rankings key={gameData.id} gameData={gameData} />
						}
					/>
				))}
				<Route path="*" element={<NoPage />} />
			</Routes>
		</>
	);
}
