export function getTwoChoicesFromCurrentChoices(array, setCurrChoices) {
	const index1 = Math.floor(Math.random() * array.length);
	let index2 = Math.floor(Math.random() * array.length);
	while (index2 === index1) {
		index2 = Math.floor(Math.random() * array.length);
	}

	let indexArray = [];
	if (index1 > index2) {
		indexArray = [index1, index2];
	} else {
		indexArray = [index2, index1];
	}
	const lChoice = array.splice(indexArray[0], 1);
	const rChoice = array.splice(indexArray[1], 1);

	setCurrChoices(array);
	return [lChoice[0], rChoice[0]];
}

export function getFirstAndSecondHighestFirstChoices(choicesArray) {
	choicesArray.sort((a, b) => b.numFirst - a.numFirst);

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
		return lowerCaseTitle.includes(searchInput);
	});
	return filteredData;
}
