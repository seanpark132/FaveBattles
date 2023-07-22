export default function WinnerScreen({ gameType, winner }) {
	return (
		<div className="flex flex-col items-center p-6">
			<h1 className="m-4">The winner is: {winner.name}</h1>
			{gameType === "image" ? (
				<img
					className="winner-img object-contain"
					src={winner.url}
					alt="winnerImg"
				/>
			) : (
				<iframe
					className="winner-video"
					src={winner.embedUrl}
					title="YouTube video player"
					allow="accelerometer;"
					allowFullScreen
				></iframe>
			)}
		</div>
	);
}
