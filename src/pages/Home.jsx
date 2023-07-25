import DisplayGameBox from "../components/DisplayGameBox";

export default function Home({ allGamesData }) {
	return (
		<>
			<div className="my-4 flex flex-wrap justify-center">
				{allGamesData.map((gameData) => (
					<DisplayGameBox key={gameData.id} gameData={gameData} />
				))}
			</div>
		</>
	);
}
