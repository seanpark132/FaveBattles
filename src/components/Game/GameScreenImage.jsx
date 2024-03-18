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
    <div className="game-image-height flex">
      <button
        className={`game-image-btn justify-end ${
          hideLeft && "fade-out"
        } ${!animationsInProgress && "fade-in"} ${leftChosen && "opacity-0"}`}
        onClick={handleLeft}
        aria-label="Left choice"
      >
        <div className="relative flex h-full w-fit justify-center">
          <img
            className="max-h-full max-w-full object-contain"
            src={leftChoice.url_lg}
            srcSet={`${leftChoice.url_sm} 384w, ${leftChoice.url_md} 683w, ${leftChoice.url_lg} 960w`}
            sizes="(max-width: 769px) 25vw, (max-width: 1367px) 35vw, 50vw"
            alt={`${leftChoice.name} image`}
          />
          <label className="game-image-label">{leftChoice.name}</label>
        </div>
      </button>
      <button
        className={`game-image-btn justify-start ${
          hideRight && "fade-out"
        } ${!animationsInProgress && "fade-in"} ${rightChosen && "opacity-0"}`}
        onClick={handleRight}
        aria-label="Right choice"
      >
        <div className="relative flex h-full w-fit justify-center">
          <img
            className="max-h-full max-w-full object-contain"
            src={rightChoice.url_lg}
            srcSet={`${rightChoice.url_sm} 384w, ${rightChoice.url_md} 683w, ${rightChoice.url_lg} 960w`}
            sizes="(max-width: 769px) 25vw, (max-width: 1367px) 35vw, 50vw"
            alt={`${rightChoice.name} image`}
          />
          <label className="game-image-label">{rightChoice.name}</label>
        </div>
      </button>
    </div>
  );
}
