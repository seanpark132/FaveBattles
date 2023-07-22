import { db } from "../firebaseConfig";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getMyGames(authId) {
	if (authId) {
		const gamesRef = collection(db, FIRESTORE_COLLECTION_NAME);
		const q = query(gamesRef, where("creatorId", "==", authId));

		let gamesArray = [];
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			gamesArray.push(doc.data());
		});

		return gamesArray;
	}
	return [];
}
