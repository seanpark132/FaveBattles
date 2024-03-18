export default function WinnerScreen({ gameType, winner }) {
  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="m-4">The winner is: {winner.name}</h1>
      {gameType === "image" ? (
        <img
          className="winner-img object-contain"
          src={winner.url_lg}
          srcSet={`${winner.url_sm} 384w, ${winner.url_md} 683w, ${winner.url_lg}`}
          sizes="(max-width: 769px) 35vw, (max-width: 1367px) 45vw, 60vw"
          alt="winner image"
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
