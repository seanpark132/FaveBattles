import {useState} from 'react';
import { _ } from 'lodash';
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebaseConfig"

export default function FormBox(props) {
    const [visible, setVisible] = useState(true);

    // when the form is submitted, visible goes from true to false => when this component is re-rendered, it's null
    if (!visible) { 
        return null;
    };

    // remove two random choices from current array, return these two as left and right
    function getTwoChoicesFromCurrentChoices(array) {
        const index1 = Math.floor(Math.random() * array.length);
        let index2 = Math.floor(Math.random() * array.length);        
        while (index2 === index1) {
            index2 = Math.floor(Math.random() * array.length);
        };
        
        let indexArray = [];
        if (index1 > index2) {
            indexArray = [index1, index2];
        } else {
            indexArray = [index2, index1];
        };    
        const lChoice = array.splice(indexArray[0], 1);
        const rChoice = array.splice(indexArray[1], 1);
        
        props.setCurrChoices(array);
        return [lChoice[0], rChoice[0]];
    };

    // at the start of the game, when the user selects the game size "n", randomly get n choices from pool
    function getRandomChoices(array, gameSize) {
        let randomChoices = [];
        let totalLength = array.length;

        while (randomChoices.length < gameSize) {
            let randomIndex = Math.floor(Math.random() * totalLength);
            let randomElement = array[randomIndex];
        
            if (!randomChoices.includes(randomElement)) {
              randomChoices.push(randomElement);
            };
        };

        return randomChoices;
    };

    function handleGameSizeChange(e) {
        const {name, value} = e.target;
        props.setGameSize(value);
    };
    
    async function handleGameStart(e) {
        e.preventDefault();
        setVisible(false);
        props.setGameActive(true);   

        const copyCurrChoices = _.cloneDeep(props.currChoices);    
        const gameSizedChoices = props.gameSize === copyCurrChoices.length ? 
            copyCurrChoices: getRandomChoices(copyCurrChoices, props.gameSize);

        const [initialLeft, initialRight] = getTwoChoicesFromCurrentChoices(gameSizedChoices);
        props.setLeftChoice(initialLeft);
        props.setRightChoice(initialRight);

        const gameDocRef = doc(db, "all_games", props.gameData.id);
        await updateDoc(gameDocRef, {
            numStarts: increment(1)
        });
    };
  
    // function to create the dropdown options based on the total number of choices of the game (ex: if 65 choices, 4, 8, 16, 32, 64 will be options)
    function generateChoicesArray(x) {
        const result = [];
        let lastNum = 4;
        
        while (lastNum <= x) {
            result.push(lastNum);
            lastNum *= 2;
        }      
        return result;
    };

    const totalNumChoices = props.gameData.choices.length;
    const choicesArray = generateChoicesArray(totalNumChoices);
    const selectOptions = choicesArray.map(numChoices =>
        <option key={numChoices} value={numChoices}>{numChoices} choices</option>
    );

    return (
        <div className='formbox-container'>
            <h2 className='text-black m-3'>{`[${props.gameData.mainCategory}] ${props.gameData.title} (${props.gameData.choices.length} choices)`}</h2>
            <form className="flex" onSubmit={handleGameStart}>
                <select 
                    value={props.gameSize}
                    onChange={handleGameSizeChange}
                    name='startingOptions'
                    id='startingOptions'
                    className='formbox-dropdown'
                >                    
                    {selectOptions} 
                </select>
                <br />
                <button className='formbox-btn'>Start game with {props.gameSize} choices!</button>
            </form>
        </div>
    );
};