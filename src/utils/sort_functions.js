export function addFirstAndWinPercentsToChoices(choicesArray, numCompletes) {
	choicesArray.forEach((choice) => {
		if (choice.numGames !== 0) {
			const firstPercent = parseFloat(
				((100 * choice.numFirst) / numCompletes).toFixed(1)
			);
			const winPercent = parseFloat(
				((100 * choice.numWins) / choice.numGames).toFixed(1)
			);

			choice.firstPercent = firstPercent;
			choice.winPercent = winPercent;
		} else {
			choice.firstPercent = 0;
			choice.winPercent = 0;
		}
	});
}

export function sortByFirstPercentThenWinPercent(choicesArray) {
	choicesArray.sort((a, b) => {
		if (b.firstPercent === a.firstPercent) {
			return b.winPercent - a.winPercent;
		}

		return b.firstPercent - a.firstPercent;
	});
}

export function getFirstAndSecondHighestFirstChoices(
	choicesArray,
	numCompletes
) {
	if (numCompletes === 0) {
		numCompletes = 1;
	}

	addFirstAndWinPercentsToChoices(choicesArray, numCompletes);
	sortByFirstPercentThenWinPercent(choicesArray);

	const firstHighest = choicesArray[0];
	const secondHighest = choicesArray[1];

	return { firstHighest, secondHighest };
}

export function sortGameDataByProperty(gamesData, sortByProperty, sortOrder) {
	let property = "";
	switch (sortByProperty) {
		case "Popularity":
			property = "numStarts";
			break;
		case "Latest":
			property = "createdOn";
			break;
	}

	const sortedData = gamesData.toSorted((a, b) => {
		if (sortOrder === "ascending") {
			return a[property] - b[property];
		}
		return b[property] - a[property];
	});

	return sortedData;
}

export function filterGameDataByCategory(gameData, filterByCategory) {
	if (filterByCategory === "No Filter") {
		return gameData;
	}
	const filteredData = gameData.filter(
		(game) => game.mainCategory === filterByCategory
	);
	return filteredData;
}

export function filterGameDataByTitle(gameData, searchInput) {
	const filteredData = gameData.filter((game) => {
		const lowerCaseTitle = game.title.toLowerCase();
		return lowerCaseTitle.includes(searchInput.toLowerCase());
	});
	return filteredData;
}
