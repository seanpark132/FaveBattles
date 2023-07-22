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
	return (
		<div className="game-choices-height flex w-full">
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
					className="game-video-btn bg-sky-600 hover:bg-sky-400 hover:text-white"
					onClick={handleLeft}
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
					className="game-video-btn bg-rose-600 hover:bg-rose-500 hover:text-white"
					onClick={handleRight}
				>
					{rightChoice.name}
				</button>
			</section>
		</div>
	);
}
