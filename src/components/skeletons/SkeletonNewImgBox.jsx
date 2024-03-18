import { useTheme } from "../../context/ThemeContext";

export default function SkeletonNewImgBox() {
  const { theme } = useTheme();

  return (
    <div
      className={`skeleton relative mb-8 flex h-32 w-full rounded border ${
        theme === "dark" ? "bg-slate-800" : "bg-sky-200"
      }`}
    >
      <div className="h-full w-32"></div>
      <div className="w-3/5 p-4">
        <label className="text-lg md:text-xl" htmlFor="choiceName">
          Name:
        </label>
        <input
          type="text"
          id="choiceName"
          className={`mt-2 w-full rounded border-2 p-2 text-sm md:text-lg ${theme}`}
          disabled
        />
      </div>
    </div>
  );
}
