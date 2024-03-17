import cloneDeep from "lodash.clonedeep";
import { useState, useEffect } from "react";
import { Image } from "primereact/image";
import { deleteStoredImage } from "../../api/deleteStoredImage";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";
import SkeletonNewImgBox from "../skeletons/SkeletonNewImgBox";
import Icon from "../Icon";

export default function NewImgBox({
  gameId,
  choiceData,
  setChoicesData,
  setChoiceIdsToRemove,
  setNumCompletesToDeduct,
  isRecentlyAdded,
  isRendered,
  isEditPage,
}) {
  const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!isRendered) {
      setIsAlreadyAdded(true);
    }
  }, []);

  useEffect(() => {
    if (isAlreadyAdded) {
      return;
    } else {
      const timer = setTimeout(() => {
        setIsAlreadyAdded(true);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isRecentlyAdded]);

  if (isRecentlyAdded && !isAlreadyAdded) {
    return <SkeletonNewImgBox />;
  }

  function handleNameChange(event) {
    setChoicesData((prev) => {
      let newArray = cloneDeep(prev);
      const imgData = newArray.find((obj) => obj.id === choiceData.id);
      const index = newArray.findIndex((obj) => obj.id === choiceData.id);
      const newData = { ...imgData, name: event.target.value };
      newArray[index] = newData;
      return newArray;
    });
  }

  function handleImageError() {
    if (retryCount < 6) {
      setTimeout(() => setRetryCount((prev) => prev + 1), 2000);
    } else {
      toast(
        `Error in loading preview image for ${choiceData.name}. Please try refreshing the page.`,
      );
    }
  }

  async function handleDeleteBtn() {
    if (isEditPage) {
      setChoiceIdsToRemove((prev) => [...prev, choiceData.id]);
      setNumCompletesToDeduct((prev) => prev + choiceData.numFirst);
      setChoicesData((prev) => {
        return prev.filter((choice) => choice.id !== choiceData.id);
      });
      return;
    }

    try {
      await deleteStoredImage(gameId, choiceData.id);
      toast("Choice deleted");
      setChoicesData((prev) => {
        return prev.filter((choice) => choice.id !== choiceData.id);
      });
    } catch (error) {
      toast("An error has occurred");
    }
  }

  return (
    <div
      className={`relative mb-8 flex h-32 w-full rounded border ${
        theme === "dark" ? "bg-slate-800" : "bg-sky-200"
      }`}
    >
      <Image
        src={
          retryCount > 0
            ? `${choiceData.url_384w}?retry=${retryCount}`
            : choiceData.url_384w
        }
        zoomSrc={choiceData.url}
        onError={handleImageError}
        alt={`${choiceData.name} image`}
        loading="lazy"
        imageClassName="h-full w-32 object-cover"
        preview
      />
      <div className="w-3/5 p-4">
        <label className="text-lg md:text-xl" htmlFor="choiceName">
          Name:
        </label>
        <input
          type="text"
          className={`mt-2 w-full rounded border-2 p-2 text-sm md:text-lg ${theme}`}
          onChange={(e) => handleNameChange(e)}
          name="choiceName"
          id="choiceName"
          value={choiceData.name}
        />
      </div>
      <button
        type="button"
        className="absolute right-0 top-0 h-fit rounded border-transparent bg-red-500 px-1.5 pb-1 pt-0.5"
        onClick={handleDeleteBtn}
        aria-label="Delete image"
      >
        <Icon name="cross" styles="text-white" />
      </button>
    </div>
  );
}
