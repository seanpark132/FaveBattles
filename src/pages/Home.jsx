import DisplayGameBox from "../components/DisplayGameBox";
import { useState, useEffect } from "react";
import { sortGameDataByProperty } from "../utils/sort_functions";
import FiltersAndSearch from "../components/FiltersAndSearch";

export default function Home({ allGamesData }) {
	const [sortedData, setSortedData] = useState([]);
	const [displayData, setDisplayData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const sorted = sortGameDataByProperty(allGamesData, "Popularity");
		setSortedData(sorted);
		setDisplayData(sorted);
		setIsLoading(false);
	}, []);

	if (isLoading) {
		return <h1 className="m-6">Loading...</h1>;
	}

	return (
		<main>
			<FiltersAndSearch
				allGamesData={allGamesData}
				sortedData={sortedData}
				setDisplayData={setDisplayData}
				setSortedData={setSortedData}
			/>
			<div className="home-box-container">
				{displayData.map((gameData) => (
					<DisplayGameBox key={gameData.id} gameData={gameData} />
				))}
			</div>
		</main>
	);
}
