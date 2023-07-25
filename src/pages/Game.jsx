import { useState } from "react";

import GameSetup from "../components/Game/GameSetup";
import GameScreen from "../components/Game/GameScreen";
import WinnerScreen from "../components/Game/WinnerScreen";

export default function Game({ gameData }) {
	const [gameSize, setGameSize] = useState(4);
	const [gameActive, setGameActive] = useState(false);
	const [currChoices, setCurrChoices] = useState(gameData.choices);
	const [nextChoices, setNextChoices] = useState([]);
	const [leftChoice, setLeftChoice] = useState({});
	const [rightChoice, setRightChoice] = useState({});
	const [winner, setWinner] = useState({});
	const [gameCompleted, setGameCompleted] = useState(false);

	return (
		<div>
			<div className="flex justify-center text-center">
				{!gameActive && !gameCompleted && (
					<GameSetup
						gameSize={gameSize}
						setGameActive={setGameActive}
						setGameSize={setGameSize}
						currChoices={currChoices}
						setCurrChoices={setCurrChoices}
						setLeftChoice={setLeftChoice}
						setRightChoice={setRightChoice}
						gameData={gameData}
					/>
				)}
				{gameActive && (
					<GameScreen
						gameSize={gameSize}
						setGameSize={setGameSize}
						setGameActive={setGameActive}
						currChoices={currChoices}
						nextChoices={nextChoices}
						setCurrChoices={setCurrChoices}
						setNextChoices={setNextChoices}
						leftChoice={leftChoice}
						rightChoice={rightChoice}
						setLeftChoice={setLeftChoice}
						setRightChoice={setRightChoice}
						setWinner={setWinner}
						setGameCompleted={setGameCompleted}
						gameData={gameData}
					/>
				)}
				{gameCompleted && (
					<WinnerScreen
						gameType={gameData.gameType}
						winner={winner}
					/>
				)}
			</div>
		</div>
	);
}
