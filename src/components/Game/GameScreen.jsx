import { useState } from "react";
import cloneDeep from "lodash/cloneDeep"
import { db } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FIRESTORE_COLLECTION_NAME } from "../../utils/global_consts";
import { getTwoChoicesFromCurrentChoices } from "../../utils/game_functions";
import GameScreenImage from "./GameScreenImage";
import GameScreenYoutube from "./GameScreenYoutube";

export default function GameScreen({
	gameSize,
	setGameSize,
	setGameActive,
	currChoices,
	nextChoices,
	setCurrChoices,
	setNextChoices,
	leftChoice,
	rightChoice,
	setLeftChoice,
	setRightChoice,
	setWinner,
	setGameCompleted,
	gameData,
}) {
	const [roundNum, setRoundNum] = useState(1);
	const [hideLeft, setHideLeft] = useState(false);
	const [hideRight, setHideRight] = useState(false);
	const [leftChosen, setLeftChosen] = useState(false);
	const [rightChosen, setRightChosen] = useState(false);
	const [animationsInProgress, setAnimationsInProgress] = useState(false);

	// counter function for choice stats (numGames, numWins, numFirst) when choice is clicked
	async function updateChoiceStats(winId, loseId, isFinalRound) {
		const gameDocRef = doc(db, FIRESTORE_COLLECTION_NAME, gameData.id);
		const gameDocSnap = await getDoc(gameDocRef);
		const gameDocData = gameDocSnap.data();

		const winIndex = gameDocData.choices.findIndex(
			(obj) => obj.id === winId
		);
		const loseIndex = gameDocData.choices.findIndex(
			(obj) => obj.id === loseId
		);
		gameDocData.choices[winIndex].numGames += 1;
		gameDocData.choices[winIndex].numWins += 1;
		gameDocData.choices[loseIndex].numGames += 1;

		if (isFinalRound) {
			gameDocData.choices[winIndex].numFirst += 1;
			gameDocData.numCompletes += 1;
		}

		await setDoc(
			doc(db, FIRESTORE_COLLECTION_NAME, gameData.id),
			gameDocData
		);
	}

	function handleLeft() {
		if (animationsInProgress) {
			return;
		}

		// final round
		if (gameSize === 2) {
			setGameActive(false);
			setWinner(leftChoice);
			setGameCompleted(true);
			updateChoiceStats(leftChoice.id, rightChoice.id, true);
			return;

			// last round of a bracket (ex. round 4/4 or round 8/8)
		} else if (currChoices.length === 0) {
			setTimeout(() => {
				setLeftChosen(true);
				setNextChoices((prev) => [...prev, leftChoice]);
				setNextChoices((newChoices) => {
					const copyNewChoices = cloneDeep(newChoices);
					const [newLeft, newRight] = getTwoChoicesFromCurrentChoices(
						copyNewChoices,
						setCurrChoices
					);
					setLeftChoice(newLeft);
					setRightChoice(newRight);
					return [];
				});
				setGameSize((prevGameSize) => prevGameSize / 2);
				setRoundNum(1);
			}, 1000);
		} else {
			setTimeout(() => {
				setLeftChosen(true);
				setRoundNum((prevRoundNum) => prevRoundNum + 1);
				setNextChoices((prev) => [...prev, leftChoice]);
				const copyCurrChoices = cloneDeep(currChoices);
				const [newLeft, newRight] = getTwoChoicesFromCurrentChoices(
					copyCurrChoices,
					setCurrChoices
				);
				setLeftChoice(newLeft);
				setRightChoice(newRight);
			}, 1000);
		}

		setAnimationsInProgress(true);
		setHideRight(true);

		setTimeout(() => {
			setLeftChosen(false);
			setHideRight(false);
			setAnimationsInProgress(false);
		}, 1600);

		updateChoiceStats(leftChoice.id, rightChoice.id, false);
	}

	function handleRight() {
		if (animationsInProgress) {
			return;
		}

		// final round
		if (gameSize === 2) {
			setGameActive(false);
			setWinner(rightChoice);
			setGameCompleted(true);
			updateChoiceStats(rightChoice.id, leftChoice.id, true);
			return;
			// last round of a bracket (ex. round 4/4 or round 8/8)
		} else if (currChoices.length === 0) {
			setTimeout(() => {
				setRightChosen(true);
				setNextChoices((prev) => [...prev, rightChoice]);
				setNextChoices((newChoices) => {
					const copyNewChoices = cloneDeep(newChoices);
					const [newLeft, newRight] = getTwoChoicesFromCurrentChoices(
						copyNewChoices,
						setCurrChoices
					);
					setLeftChoice(newLeft);
					setRightChoice(newRight);
					return [];
				});

				setGameSize((prevGameSize) => prevGameSize / 2);
				setRoundNum(1);
			}, 1000);
		} else {
			setHideLeft(true);
			setTimeout(() => {
				setRightChosen(true);
				setRoundNum((prevRoundNum) => prevRoundNum + 1);
				setNextChoices((prev) => [...prev, rightChoice]);
				const copyCurrChoices = cloneDeep(currChoices);
				const [newLeft, newRight] = getTwoChoicesFromCurrentChoices(
					copyCurrChoices,
					setCurrChoices
				);
				setLeftChoice(newLeft);
				setRightChoice(newRight);
			}, 1000);
		}

		setAnimationsInProgress(true);
		setHideLeft(true);
		setTimeout(() => {
			setRightChosen(false);
			setHideLeft(false);
			setAnimationsInProgress(false);
		}, 1600);

		updateChoiceStats(rightChoice.id, leftChoice.id, false);
	}

	return (
		<div className="w-full h-vh-nav flex flex-col">
			<h3 className="m-4 line-clamp-2 flex-shrink-0 md:text-2xl lg:text-3xl">{`TOP ${gameSize} (Round ${roundNum}/${
				gameSize / 2
			}) : [${gameData.mainCategory}] ${gameData.title}`}</h3>
			{gameData.gameType === "image" ? (
				<GameScreenImage
					leftChoice={leftChoice}
					rightChoice={rightChoice}
					handleLeft={handleLeft}
					handleRight={handleRight}
					hideLeft={hideLeft}
					hideRight={hideRight}
					leftChosen={leftChosen}
					rightChosen={rightChosen}
					animationsInProgress={animationsInProgress}
				/>
			) : (
				<GameScreenYoutube
					leftChoice={leftChoice}
					rightChoice={rightChoice}
					handleLeft={handleLeft}
					handleRight={handleRight}
					hideLeft={hideLeft}
					hideRight={hideRight}
					leftChosen={leftChosen}
					rightChosen={rightChosen}
					animationsInProgress={animationsInProgress}
				/>
			)}
		</div>
	);
}
