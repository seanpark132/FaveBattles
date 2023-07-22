import { db } from "../firebaseConfig";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import { doc, getDoc } from "firebase/firestore";

function addFirstAndWinPercentsToChoices(choicesArray, gameNumCompletes) {
	choicesArray.forEach((choice) => {
		if (choice.numGames !== 0) {
			const firstPercent = parseFloat(
				((100 * choice.numFirst) / gameNumCompletes).toFixed(1)
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

function sortByFirstPercentThenWinPercent(choicesArray) {
	choicesArray.sort((a, b) => {
		if (b.firstPercent === a.firstPercent) {
			return b.winPercent - a.winPercent;
		}

		return b.firstPercent - a.firstPercent;
	});
}

export async function getRankingsData(gameId) {
	const gameDocRef = doc(db, FIRESTORE_COLLECTION_NAME, gameId);
	const gameDoc = await getDoc(gameDocRef);
	const liveGameData = gameDoc.data();

	let gameNumCompletes = liveGameData.numCompletes;
	if (gameNumCompletes === 0) {
		gameNumCompletes = 1;
	}

	let choicesArray = liveGameData.choices;

	addFirstAndWinPercentsToChoices(choicesArray, gameNumCompletes);
	sortByFirstPercentThenWinPercent(choicesArray);

	let rank = 1;
	choicesArray.forEach((choice) => {
		choice.rank = rank;
		rank += 1;
	});

	return choicesArray;
}
