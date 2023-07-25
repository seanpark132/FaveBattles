import Navbar from "../components/Navbar";
import Edit from "../components/Create_Edit/Edit";
import { useQuery } from "@tanstack/react-query";
import { getGameData } from "../api/getGameData";
import { useUser } from "../context/AuthContext";

export default function EditGame({ gameId }) {
	const user = useUser();

	if (!user) {
		return <NotSignedIn />;
	}

	const gameDataQuery = useQuery({
		queryKey: [`edit_${gameId}`],
		queryFn: () => getGameData(gameId),
	});

	if (gameDataQuery.isLoading) return <h1>Loading...</h1>;
	if (gameDataQuery.isError) {
		return <h1>An error occurred. Please try refreshing the page.</h1>;
	}

	return (
		<div className="w-full">
			<Navbar />
			<Edit gameData={gameDataQuery.data} />
		</div>
	);
}
