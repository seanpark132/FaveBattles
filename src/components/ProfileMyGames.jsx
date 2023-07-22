import { auth } from "../firebaseConfig";
import DisplayGameBox from "./DisplayGameBox";
import { useQuery } from "@tanstack/react-query";
import { getMyGames } from "../api/getMyGames";

export default function ProfileMyGames() {
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

	const myGameBoxes = myGamesQuery.data.map((gameData) => (
		<DisplayGameBox key={gameData.id} type="profile" {...gameData} />
	));

	return (
		<section className="flex flex-col w-full py-8">
			<h1 className="mb-4">My Games</h1>
			<div className="flex flex-wrap">
				{myGamesQuery.data.length === 0 ? (
					<h2>You have not created any games yet.</h2>
				) : (
					myGameBoxes
				)}
			</div>
		</section>
	);
}
