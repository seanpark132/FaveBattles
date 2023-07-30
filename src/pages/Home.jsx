import DisplayGameBox from "../components/DisplayGameBox";
import { useState, useEffect, useMemo } from "react";
import {
	filterGameDataByCategory,
	filterGameDataByTitle,
	sortGameDataByProperty,
} from "../utils/helper_functions";
import { Dropdown } from "primereact/dropdown";
import { CATEGORY_OPTIONS } from "../utils/global_consts";

export default function Home({ allGamesData }) {
	const [sortedData, setSortedData] = useState([]);
	const [displayData, setDisplayData] = useState([]);
	const [sortByProperty, setSortByProperty] = useState("Popularity");
	const [filterByCategory, setFilterByCategory] = useState("No Filter");
	const [searchInput, setSearchInput] = useState("");
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

	// make all of the dropdown onChanges it's own function

	function handleSort(e) {
		setSortByProperty(e.value);
		const sorted = sortGameDataByProperty(allGamesData, e.value);
		setSortedData(sorted);
		const categoryFiltered = filterGameDataByCategory(
			sorted,
			filterByCategory
		);
		setDisplayData(categoryFiltered);
		setSearchInput("");
	}

	function handleFilter(e) {
		setFilterByCategory(e.value);
		const categoryFiltered = filterGameDataByCategory(sortedData, e.value);
		setDisplayData(categoryFiltered);
		setSearchInput("");
	}

	function handleSearch(e) {
		if (e.key !== "Enter") {
			return;
		}

		const titleFiltered = filterGameDataByTitle(sortedData, searchInput);

		const categoryFiltered = filterGameDataByCategory(
			titleFiltered,
			filterByCategory
		);

		setDisplayData(categoryFiltered);
	}

	function handleSearchButton() {
		const titleFiltered = filterGameDataByTitle(sortedData, searchInput);

		const categoryFiltered = filterGameDataByCategory(
			titleFiltered,
			filterByCategory
		);

		setDisplayData(categoryFiltered);
	}

	return (
		<main>
			<div className="flex px-6 flex-wrap">
				<div className="mr-6 pt-4">
					<p className="pl-1 font-semibold mb-1">Sort by:</p>
					<Dropdown
						value={sortByProperty}
						onChange={(e) => handleSort(e)}
						options={["Popularity", "Latest"]}
						placeholder="Sort By"
						className="w-32"
					/>
				</div>
				<div className="mr-6 pt-4">
					<p className="pl-1 font-semibold mb-1">Filter by:</p>
					<Dropdown
						value={filterByCategory}
						onChange={(e) => handleFilter(e)}
						options={[
							"No Filter",
							...CATEGORY_OPTIONS.map((option) => option.label),
						]}
						placeholder="Category"
						className="w-40"
					/>
				</div>
				<div className="flex flex-col pt-4">
					<label htmlFor="search_input" className="mb-1">
						Search by title:
					</label>
					<div className="flex">
						<input
							type="text"
							className="home-search-input"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							onKeyDown={(e) => handleSearch(e)}
						/>
						<button
							onClick={handleSearchButton}
							className="home-search-btn"
						>
							<i className="fa-solid fa-magnifying-glass"></i>
						</button>
					</div>
				</div>
			</div>
			<div className="home-box-container">
				{displayData.map((gameData) => (
					<DisplayGameBox key={gameData.id} gameData={gameData} />
				))}
			</div>
		</main>
	);
}
