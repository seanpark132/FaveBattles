import { useTheme } from "../../context/ThemeContext";

export default function GameScreenYoutube({
	leftChoice,
	rightChoice,
	handleLeft,
	handleRight,
	hideLeft,
	hideRight,
	leftChosen,
	rightChosen,
	animationsInProgress,
}) {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex-1 flex w-full pb-4">
			<section
				className={`w-1/2 flex flex-col mb-6 h-full justify-end ${
					hideLeft && "fade-out"
				} ${!animationsInProgress && "fade-in"} ${
					leftChosen && "opacity-0"
				}`}
			>
				<iframe
					className="flex-1 w-full"
					src={leftChoice.embedUrl}
					title="YouTube video player"
					allow="accelerometer;"
					allowFullScreen
				></iframe>
				<button
					className="game-video-btn left"
					onClick={handleLeft}
					id={theme}
				>
					{leftChoice.name}
				</button>
			</section>
			<section
				className={`w-1/2 flex flex-col mb-6 h-full justify-start ${
					hideRight && "fade-out"
				} ${!animationsInProgress && "fade-in"} ${
					rightChosen && "opacity-0"
				}`}
			>
				<iframe
					className="flex-1 w-full"
					src={rightChoice.embedUrl}
					title="YouTube video player"
					allow="accelerometer;"
					allowFullScreen
				></iframe>
				<button
					className="game-video-btn right"
					onClick={handleRight}
					id={theme}
				>
					{rightChoice.name}
				</button>
			</section>
		</div>
	);
}
