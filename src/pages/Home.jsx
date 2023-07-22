import Navbar from "../components/Navbar";
import DisplayGameBox from "../components/DisplayGameBox";

export default function Home({ allGamesData }) {
	return (
		<>
			<Navbar />
			<div className="my-4 flex flex-wrap justify-center">
				{allGamesData.map((gameData) => (
					<DisplayGameBox key={gameData.id} gameData={gameData} />
				))}
			</div>
		</>
	);
}
