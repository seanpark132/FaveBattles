export default function GameScreenImage({
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
		<div className="flex game-image-height">
			<button
				className={`game-image-btn justify-end ${
					hideLeft && "fade-out"
				} ${!animationsInProgress && "fade-in"} ${
					leftChosen && "opacity-0"
				}`}
				onClick={handleLeft}
			>
				<div className="relative w-fit h-full flex justify-center">
					<img
						className="max-h-full max-w-full object-contain"
						src={leftChoice.url}
						srcSet={`${leftChoice.url_384w} 384w, ${leftChoice.url_683w} 683w, ${leftChoice.url} 960w`}
						sizes="(max-width: 769px) 25vw, (max-width: 1367px) 35vw, 50vw"
						alt={leftChoice.name}
					/>
					<label className="game-image-label">
						{leftChoice.name}
					</label>
				</div>
			</button>
			<button
				className={`game-image-btn justify-start ${
					hideRight && "fade-out"
				} ${!animationsInProgress && "fade-in"} ${
					rightChosen && "opacity-0"
				}`}
				onClick={handleRight}
			>
				<div className="relative w-fit h-full flex justify-center">
					<img
						className="max-h-full max-w-full object-contain"
						src={rightChoice.url}
						srcSet={`${rightChoice.url_384w} 384w, ${rightChoice.url_683w} 683w, ${rightChoice.url} 960w`}
						sizes="(max-width: 769px) 25vw, (max-width: 1367px) 35vw, 50vw"
						alt={rightChoice.name}
					/>
					<label className="game-image-label">
						{rightChoice.name}
					</label>
				</div>
			</button>
		</div>
	);
}
