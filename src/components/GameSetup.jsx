import { _ } from "lodash";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts";
import { getTwoChoicesFromCurrentChoices } from "../utils/helper_functions";

export default function GameSetup(props) {
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
		const copyCurrChoices = _.cloneDeep(props.currChoices);
		const gameSizedChoices =
			props.gameSize === copyCurrChoices.length
				? copyCurrChoices
				: getRandomChoices(copyCurrChoices, props.gameSize);

		const [initialLeft, initialRight] = getTwoChoicesFromCurrentChoices(
			gameSizedChoices,
			props.setCurrChoices
		);
		props.setLeftChoice(initialLeft);
		props.setRightChoice(initialRight);

		props.setGameActive(true);

		const gameDocRef = doc(
			db,
			FIRESTORE_COLLECTION_NAME,
			props.gameData.id
		);
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

	const totalNumChoices = props.gameData.choices.length;
	const choicesArray = generateChoicesArray(totalNumChoices);
	const selectOptions = choicesArray.map((numChoices) => (
		<option key={numChoices} value={numChoices}>
			{numChoices} choices
		</option>
	));

	return (
		<div className="m-6 w-full p-4 max-w-screen-md border-transparent rounded bg-violet-300 mt-16">
			<h2 className="text-black m-3">{`[${props.gameData.mainCategory}] ${props.gameData.title} (${props.gameData.choices.length} choices)`}</h2>
			<form onSubmit={handleGameStart}>
				<div className="flex">
					<select
						value={props.gameSize}
						onChange={(e) => props.setGameSize(e.target.value)}
						name="startingOptions"
						id="startingOptions"
						className="mx-2 flex-1 text-black bg-white font-semibold p-2 border-transparent rounded text-center"
					>
						{selectOptions}
					</select>
					<button className="mx-2 flex-1 text-black bg-green-500 p-2 border-transparent rounded">
						Start game with {props.gameSize} choices!
					</button>
				</div>
			</form>
		</div>
	);
}
