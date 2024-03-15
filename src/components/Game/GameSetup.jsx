import cloneDeep from "lodash/cloneDeep"
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FIRESTORE_COLLECTION_NAME } from "../../utils/global_consts";
import { getTwoChoicesFromCurrentChoices } from "../../utils/game_functions";
import { useTheme } from "../../context/ThemeContext";

export default function GameSetup({
	gameSize,
	setGameActive,
	setGameSize,
	currChoices,
	setCurrChoices,
	setLeftChoice,
	setRightChoice,
	gameData,
}) {
	const { theme, setTheme } = useTheme();

	// at the start of the game, when the user selects the game size "n", randomly get n choices from pool
	function getRandomChoices(array, gameSize) {
		let randomChoices = [];
		let totalLength = array.length;

		while (randomChoices.length < gameSize) {
			let randomIndex = Math.floor(Math.random() * totalLength);
			let randomElement = array[randomIndex];

			if (!randomChoices.includes(randomElement)) {
				randomChoices.push(randomElement);
			}
		}

		return randomChoices;
	}

	async function handleGameStart(e) {
		e.preventDefault();
		const copyCurrChoices = cloneDeep(currChoices);
		const gameSizedChoices =
			gameSize === copyCurrChoices.length
				? copyCurrChoices
				: getRandomChoices(copyCurrChoices, gameSize);

		const [initialLeft, initialRight] = getTwoChoicesFromCurrentChoices(
			gameSizedChoices,
			setCurrChoices
		);
		setLeftChoice(initialLeft);
		setRightChoice(initialRight);

		setGameActive(true);

		const gameDocRef = doc(db, FIRESTORE_COLLECTION_NAME, gameData.id);
		await updateDoc(gameDocRef, {
			numStarts: increment(1),
		});
	}

	// function to create the dropdown options based on the total number of choices of the game (ex: if 65 choices, 4, 8, 16, 32, 64 will be options)
	function generateChoicesArray(x) {
		const result = [];
		let lastNum = 4;

		while (lastNum <= x) {
			result.push(lastNum);
			lastNum *= 2;
		}
		return result;
	}

	const totalNumChoices = gameData.choices.length;
	const choicesArray = generateChoicesArray(totalNumChoices);
	const selectOptions = choicesArray.map((numChoices) => (
		<option key={numChoices} value={numChoices}>
			{numChoices} choices
		</option>
	));

	return (
		<section
			className={`m-6 w-full p-4 max-w-screen-md border-transparent rounded mt-16 ${
				theme === "dark" ? "bg-violet-800" : "bg-violet-300"
			}`}
		>
			<h2 className="my-6">{`[${gameData.mainCategory}] ${gameData.title} (${gameData.choices.length} choices)`}</h2>
			<form onSubmit={handleGameStart}>
				<div className="flex">
					<select
						value={gameSize}
						onChange={(e) => setGameSize(e.target.value)}
						name="startingOptions"
						id="startingOptions"
						className={`mx-2 flex-1 font-semibold p-2 text-lg border-transparent rounded text-center ${
							theme === "dark" && "bg-neutral-700"
						}`}
					>
						{selectOptions}
					</select>
					<button
						className={`mx-2 flex-1 p-2 text-lg border-transparent rounded ${
							theme === "dark" ? "bg-green-800" : "bg-green-300"
						}`}
					>
						Start game!
					</button>
				</div>
			</form>
		</section>
	);
}
