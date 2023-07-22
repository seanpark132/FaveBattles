import { db } from "../firebaseConfig";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import { collection, getDocs } from "firebase/firestore";

export async function getGameData(authId) {
	const allGamesRef = collection(db, FIRESTORE_COLLECTION_NAME);
	const allDocs = await getDocs(allGamesRef);
	const allGamesData = allDocs.docs.map((doc) => {
		return { ...doc.data() };
	});

	const allGameIds = allGamesData.map((gameData) => gameData.id);
	const myGamesData = allGamesData.filter(
		(gameData) => gameData.creatorId === authId
	);

	return {
		allGamesData: allGamesData,
		allGameIds: allGameIds,
		myGamesData: myGamesData,
	};
}
