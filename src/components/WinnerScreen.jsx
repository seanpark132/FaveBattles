export default function WinnerScreen(props) {
	return (
		<div className="flex flex-col items-center p-6">
			<h1 className="m-4">The winner is: {props.winner.name}</h1>
			{props.gameType === "image" ? (
				<img
					className="winner-img object-contain"
					src={props.winner.url}
					alt="winnerImg"
				/>
			) : (
				<iframe
					className="winner-video"
					src={props.winner.embedUrl}
					title="YouTube video player"
					allow="accelerometer;"
					allowFullScreen
				></iframe>
			)}
		</div>
	);
}
