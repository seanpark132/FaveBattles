import DisplayGameBox from "./DisplayGameBox";

export default function ProfileMyGames({ myGamesData }) {
	return (
		<section className="flex flex-col w-full py-8">
			<h1 className="mb-4">My Games</h1>
			<div className="flex flex-wrap">
				{myGamesData.length === 0 ? (
					<h2>You have not created any games yet.</h2>
				) : (
					myGamesData.map((gameData) => (
						<DisplayGameBox
							key={gameData.id}
							type="profile"
							gameData={gameData}
						/>
					))
				)}
			</div>
		</section>
	);
}
