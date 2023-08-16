import { useTheme } from "../../context/ThemeContext";

export default function SkeletonNewImgBox() {
	const { theme, setTheme } = useTheme();

	return (
		<div
			className={`skeleton flex relative mb-8 border rounded w-full h-32 ${
				theme === "dark" ? "bg-slate-800" : "bg-sky-200"
			}`}
		>
			<div className="h-full w-32"></div>
			<div className="p-4 w-3/5">
				<label className="text-lg md:text-xl" htmlFor="choiceName">
					Name:
				</label>
				<input
					type="text"
					id="choiceName"
					className={`w-full mt-2 p-2 text-sm rounded border-2 md:text-lg ${theme}`}
				/>
			</div>
		</div>
	);
}
