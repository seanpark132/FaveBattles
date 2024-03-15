import { storage } from "../firebaseConfig";
import { ref, deleteObject } from "firebase/storage";

export async function deleteStoredImage(gameId, imageId) {
  const imgRef = ref(storage, `all_games/${gameId}/${imageId}`);
  const imgRef_384w = ref(storage, `all_games/${gameId}/${imageId}_384w`);
  const imgRef_683w = ref(storage, `all_games/${gameId}/${imageId}_683w`);

  await Promise.all([
    await deleteObject(imgRef),
    await deleteObject(imgRef_384w),
    await deleteObject(imgRef_683w),
  ]);
}
