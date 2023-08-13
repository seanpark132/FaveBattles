import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import { deleteStoredImage } from "./deleteStoredImage";

export async function deleteGame(gameId, gameData) {
	try {
		const gameDoc = doc(db, FIRESTORE_COLLECTION_NAME, gameId);
		await deleteDoc(gameDoc);

		if (gameData.gameType === "image") {
			gameData.choices.forEach(async (choice) => {
				await deleteStoredImage(gameId, choice.id);
			});
		}
	} catch (error) {
		console.error(error.message);
		toast("Error occurred in deleting game. Please try again.");
	}
}
