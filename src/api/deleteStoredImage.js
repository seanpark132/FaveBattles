import { storage, formattedStorage } from "../firebaseConfig";
import { ref, deleteObject } from "firebase/storage";

export async function deleteStoredImage(gameId, imageId) {
  const baseImgPath = `all_games/${gameId}/${imageId}`;

  const originalImgRef = ref(storage, baseImgPath);
  const imgRef = ref(formattedStorage, baseImgPath);
  const imgRef_sm = ref(formattedStorage, `${baseImgPath}_sm`);
  const imgRef_md = ref(formattedStorage, `${baseImgPath}_md`);
  const imgRef_lg = ref(formattedStorage, `${baseImgPath}_lg`);

  await Promise.all([
    await deleteObject(originalImgRef),
    await deleteObject(imgRef),
    await deleteObject(imgRef_sm),
    await deleteObject(imgRef_md),
    await deleteObject(imgRef_lg),
  ]);
}
