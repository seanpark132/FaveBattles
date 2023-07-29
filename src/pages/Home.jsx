import DisplayGameBox from "../components/DisplayGameBox";
import { useState, useEffect } from "react";
import {
	filterGameDataByCategory,
	sortGameDataByProperty,
} from "../utils/helper_functions";
import { Dropdown } from "primereact/dropdown";
import { CATEGORY_OPTIONS } from "../utils/global_consts";

export default function Home({ allGamesData }) {
	const [sortedData, setSortedData] = useState([]);
	const [sortByProperty, setSortByProperty] = useState("Popularity");
	const [filterByCategory, setFilterByCategory] = useState("No Filter");
	const [searchInput, setSearchInput] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const filtered = filterGameDataByCategory(
			allGamesData,
			filterByCategory
		);
		const sorted = sortGameDataByProperty(
			filtered,
			sortByProperty,
			"descending"
		);

		setSortedData(sorted);
		if (isLoading) {
			setIsLoading(false);
		}
	}, [sortByProperty, filterByCategory]);

	if (isLoading) {
		return <h1 className="m-6">Loading...</h1>;
	}

	return (
		<main>
			<div className="flex px-6 pt-4 pb-2">
				<div className="mr-6">
					<p className="pl-1 font-semibold mb-1">Sort by:</p>
					<Dropdown
						value={sortByProperty}
						onChange={(e) => setSortByProperty(e.value)}
						options={["Popularity", "Latest"]}
						placeholder="Sort By"
					/>
				</div>
				<div>
					<p className="pl-1 font-semibold mb-1">Filter by:</p>
					<Dropdown
						value={filterByCategory}
						onChange={(e) => setFilterByCategory(e.value)}
						options={[
							"No Filter",
							...CATEGORY_OPTIONS.map((option) => option.label),
						]}
						placeholder="Category"
					/>
				</div>
			</div>
			<div className="mb-6 flex flex-wrap justify-center">
				{sortedData.map((gameData) => (
					<DisplayGameBox key={gameData.id} gameData={gameData} />
				))}
			</div>
		</main>
	);
}
