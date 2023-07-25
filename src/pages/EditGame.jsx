// Wrapper component for Edit page, handle data fetching on this component to pass down to "Edit" component, where data is used as initial state

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
			<Edit gameData={gameDataQuery.data} />
		</div>
	);
}
