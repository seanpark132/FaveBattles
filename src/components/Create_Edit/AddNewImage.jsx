import { useEffect, useState } from "react";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";
import {
  GOOGLE_CLOUD_STORAGE_BASE_URL,
  FORMATTED_BUCKET_NAME,
} from "../../utils/global_consts";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

export default function AddNewImage({
  gameId,
  setChoicesData,
  setIsRecentlyAdded,
}) {
  const [inputtedImgs, setInputtedImgs] = useState([]);
  const [isAddImagesDisabled, setIsAddImagesDisabled] = useState(false);
  const [uploadedImageCount, setUploadedImageCount] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (isAddImagesDisabled) {
      const timer = setTimeout(() => {
        setIsAddImagesDisabled(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAddImagesDisabled]);

  async function handleInputtedImgs(images) {
    if (!images) {
      return;
    }
    setIsAddImagesDisabled(true);
    setInputtedImgs([]);

    const imgsArray = Object.values(images);
    setInputtedImgs(imgsArray);
  }

  async function uploadImage() {
    if (inputtedImgs.length === 0) {
      toast("Please add a file first");
      return;
    }

    try {
      setIsAddImagesDisabled(true);
      const uploadPromises = inputtedImgs.map(async (img) => {
        const fileName = img.name;
        const nameOnly = fileName.split(".").slice(0, -1).join(".");
        const name_count = `${nameOnly}_${uploadedImageCount}`;
        setUploadedImageCount((prev) => prev + 1);

        const imagePath = `all_games/${gameId}/${name_count}`;
        const newImgRef = ref(storage, imagePath);
        await uploadBytes(newImgRef, img);
        const originalFormattedUrl = `${GOOGLE_CLOUD_STORAGE_BASE_URL}/${FORMATTED_BUCKET_NAME}/${imagePath}`;
        const url_sm = `${originalFormattedUrl}_sm`;
        const url_md = `${originalFormattedUrl}_md`;
        const url_lg = `${originalFormattedUrl}_lg`;

        return {
          id: name_count,
          url: originalFormattedUrl,
          url_sm: url_sm,
          url_md: url_md,
          url_lg: url_lg,
          name: nameOnly,
          numWins: 0,
          numGames: 0,
          numFirst: 0,
        };
      });

      const uploadedImagesData = await Promise.all(uploadPromises);

      setChoicesData((prev) =>
        prev ? [...prev, ...uploadedImagesData] : [...uploadedImagesData],
      );

      setIsRecentlyAdded(true);

      setTimeout(() => {
        toast("Image(s) uploaded");
      }, 4000);
    } catch (error) {
      console.error("Error occurred during image uploading:", error);
      toast("An error has occurred in uploading image(s). Please try again.");
    }
  }

  return (
    <section className="mb-6 flex max-w-xs flex-col px-6">
      <h2 className="mb-4">Choose images to add</h2>
      <input
        type="file"
        className={`create-file-btn ${theme}`}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        multiple={true}
        onChange={(e) => {
          handleInputtedImgs(e.target.files);
        }}
      />
      <button
        type="button"
        className={`${
          isAddImagesDisabled
            ? "bg-neutral-500"
            : theme === "dark"
              ? "bg-sky-800"
              : "bg-sky-300"
        } mt-4 w-fit rounded border-transparent px-20 py-2 text-lg`}
        onClick={() => {
          uploadImage();
        }}
        disabled={isAddImagesDisabled}
      >
        Add Images
      </button>
      <p className="mt-2">
        <em>Accepts .png, .jpg, .jpeg, .webp types</em>
      </p>
    </section>
  );
}
