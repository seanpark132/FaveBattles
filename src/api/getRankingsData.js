import { db } from "../firebaseConfig";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import { doc, getDoc } from "firebase/firestore";
import {
  addFirstAndWinPercentsToChoices,
  sortByFirstPercentThenWinPercent,
} from "../utils/sort_functions";

export async function getRankingsData(gameId) {
  const gameDocRef = doc(db, FIRESTORE_COLLECTION_NAME, gameId);
  const gameDoc = await getDoc(gameDocRef);
  const liveGameData = gameDoc.data();

  let numCompletes = liveGameData.numCompletes;
  if (numCompletes === 0) {
    numCompletes = 1;
  }

  let choicesArray = liveGameData.choices;

  addFirstAndWinPercentsToChoices(choicesArray, numCompletes);
  sortByFirstPercentThenWinPercent(choicesArray);

  let rank = 1;
  choicesArray.forEach((choice) => {
    choice.rank = rank;
    rank += 1;
  });

  return choicesArray;
}
