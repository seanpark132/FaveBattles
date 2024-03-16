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
  const { theme } = useTheme();

  return (
    <div className="flex w-full flex-1 pb-4">
      <section
        className={`mb-6 flex h-full w-1/2 flex-col justify-end ${
          hideLeft && "fade-out"
        } ${!animationsInProgress && "fade-in"} ${leftChosen && "opacity-0"}`}
      >
        <iframe
          className="w-full flex-1"
          src={leftChoice.embedUrl}
          title="YouTube video player"
          allow="accelerometer;"
          allowFullScreen
        ></iframe>
        <button className={`game-video-btn left ${theme}`} onClick={handleLeft}>
          {leftChoice.name}
        </button>
      </section>
      <section
        className={`mb-6 flex h-full w-1/2 flex-col justify-start ${
          hideRight && "fade-out"
        } ${!animationsInProgress && "fade-in"} ${rightChosen && "opacity-0"}`}
      >
        <iframe
          className="w-full flex-1"
          src={rightChoice.embedUrl}
          title="YouTube video player"
          allow="accelerometer;"
          allowFullScreen
        ></iframe>
        <button
          className={`game-video-btn right ${theme}`}
          onClick={handleRight}
        >
          {rightChoice.name}
        </button>
      </section>
    </div>
  );
}
