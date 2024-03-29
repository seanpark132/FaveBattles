import { db } from "../firebaseConfig";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import { collection, getDocs } from "firebase/firestore";

export async function getAllGameData() {
  const allGamesRef = collection(db, FIRESTORE_COLLECTION_NAME);
  const allDocs = await getDocs(allGamesRef);
  const allGamesData = allDocs.docs.map((doc) => {
    return { ...doc.data() };
  });

  const allGameIds = allGamesData.map((gameData) => gameData.id);

  return {
    allGamesData: allGamesData,
    allGameIds: allGameIds,
  };
}
