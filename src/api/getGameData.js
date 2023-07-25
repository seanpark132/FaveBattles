import { db } from "../firebaseConfig";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import { doc, getDoc } from "firebase/firestore";

export async function getGameData(gameId) {
	const gameDocRef = doc(db, FIRESTORE_COLLECTION_NAME, gameId);
	const gameDoc = await getDoc(gameDocRef);
	const gameData = gameDoc.data();
	return gameData;
}
