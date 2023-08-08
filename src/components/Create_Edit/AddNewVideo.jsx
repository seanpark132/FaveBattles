import { useState } from "react";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { useTheme } from "../../context/ThemeContext";

export default function AddNewVideo({ setChoicesData }) {
	const [inputUrl, setInputUrl] = useState("");
	const [inputTime, setInputTime] = useState("");
	const { theme, setTheme } = useTheme();

	function convertInputTimeToSeconds(timeString) {
		if (timeString.length === 0) {
			return 0;
		}
		const splitTimeArray = timeString.split(":");
		if (splitTimeArray.length === 3) {
			const hours = parseInt(splitTimeArray[0]);
			const minutes = parseInt(splitTimeArray[1]);
			const seconds = parseInt(splitTimeArray[2]);
			return hours * 60 * 60 + minutes * 60 + seconds;
		}

		if (splitTimeArray.length === 2) {
			const minutes = parseInt(splitTimeArray[0]);
			const seconds = parseInt(splitTimeArray[1]);
			return minutes * 60 + seconds;
		}
		return parseInt(timeString);
	}

	async function handleAddVideo() {
		const trimmedUrl = inputUrl.trim();
		if (trimmedUrl.length < 43) {
			toast(
				"Please enter a valid Youtube URL of the form:\nhttps://www.youtube.com/watch?v=9bZkp7q19f0"
			);
			return;
		}

		const startTime = convertInputTimeToSeconds(inputTime);
		if (isNaN(startTime)) {
			toast("Please enter a valid start time.");
			return;
		}

		const youtubeId = trimmedUrl.slice(32, 43);
		const actualUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
		const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?start=${startTime}&origin=https://favebattles.netlify.app`;
		const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
		const choiceId = v4();
		const res = await (
			await fetch(
				`https://noembed.com/embed?dataType=json&url=${actualUrl}`
			)
		).json();
		const youtubeTitle = res.title;

		setChoicesData((prev) =>
			prev
				? [
						...prev,
						{
							id: choiceId,
							thumbnailUrl: thumbnailUrl,
							embedUrl: embedUrl,
							name: youtubeTitle,
							numWins: 0,
							numGames: 0,
							numFirst: 0,
						},
				  ]
				: [
						{
							id: choiceId,
							thumbnailUrl: thumbnailUrl,
							embedUrl: embedUrl,
							name: youtubeTitle,
							numWins: 0,
							numGames: 0,
							numFirst: 0,
						},
				  ]
		);
		toast("Video added!");
		setInputUrl("");
		setInputTime("");
	}

	return (
		<section className="flex flex-col px-6 mb-6 max-w-4xl">
			<h2 className="mb-2">
				Add Youtube Videos by pasting their links below
			</h2>
			<label htmlFor="inputLink">Full Youtube Link:</label>
			<input
				type="text"
				className={`my-2 p-2 ${theme}`}
				value={inputUrl}
				onChange={(e) => setInputUrl(e.target.value)}
				name="inputLink"
				id="inputLink"
			/>
			<label htmlFor="inputTime">Start time (optional): </label>
			<input
				type="text"
				className={`my-2 p-2 w-24 ${theme}`}
				value={inputTime}
				onChange={(e) => setInputTime(e.target.value)}
				name="inputTime"
				id="inputTime"
			/>
			<button
				type="button"
				className={`mt-2 p-2 text-xl border-transparent rounded ${
					theme === "dark" ? "bg-blue-800" : "bg-blue-300"
				}`}
				onClick={handleAddVideo}
			>
				Add Video
			</button>
		</section>
	);
}
