import { useState } from "react";
import { _ } from 'lodash';
import {db} from "../firebaseConfig";
import {doc, getDoc, setDoc} from "firebase/firestore";

export default function GameScreen(props) {
    const [roundNum, setRoundNum] = useState(1);    

    // remove 2 random choices from remaining choices, and set them as new left and right to be displayed
    function getTwoChoices(array) {
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
    
    // counter function for choice stats (numGames, numWins, numFirst) when choice is clicked
    async function updateChoiceStats(winId, loseId, isFinalRound) {
        const gameDocRef = doc(db, "all_games", props.id);
        const gameDocSnap = await getDoc(gameDocRef);
        const gameDocData = gameDocSnap.data();
        
        const winIndex = gameDocData.choices.findIndex(obj => obj.id === winId);
        const loseIndex = gameDocData.choices.findIndex(obj => obj.id === loseId);
        gameDocData.choices[winIndex].numGames += 1;
        gameDocData.choices[winIndex].numWins += 1;
        gameDocData.choices[loseIndex].numGames += 1;

        if (isFinalRound) {
            gameDocData.choices[winIndex].numFirst += 1; 
        }

        await setDoc(doc(db, "all_games", props.id), gameDocData);
    };

    // handle left button click to proceed to next round
    function handleLeft() {  
        let isFinalRound = false;
        // final round  
        if (props.gameSize === 2) {
            props.setGameActive(false);
            props.setWinner(props.leftChoice);
            isFinalRound = true; 
        
        // last round of a bracket (ex. round 4/4 or round 8/8)
        } else if (props.currChoices.length === 0) {      
            props.setNextChoices(prev => [...prev, props.leftChoice]);
            props.setNextChoices(newChoices => {                
                const copyNewChoices = _.cloneDeep(newChoices);                
                const [newLeft, newRight] = getTwoChoices(copyNewChoices);
                props.setLeftChoice(newLeft);
                props.setRightChoice(newRight);  
                return [];
            });

            props.setGameSize(prevGameSize => prevGameSize/2);
            setRoundNum(1);       

        // any other round
        } else {
            setRoundNum(prevRoundNum => prevRoundNum + 1);
            props.setNextChoices(prev => [...prev, props.leftChoice]);
            const copyCurrChoices = _.cloneDeep(props.currChoices);
            const [newLeft, newRight] = getTwoChoices(copyCurrChoices);
            props.setLeftChoice(newLeft);
            props.setRightChoice(newRight);
        }; 

        updateChoiceStats(props.leftChoice.id, props.rightChoice.id, isFinalRound);
                
    };

    // handle right button click to proceed to next round
    function handleRight() {
        let isFinalRound = false;
        // final round
        if (props.gameSize === 2) {
            props.setGameActive(false);
            props.setWinner(props.rightChoice);            
            isFinalRound = true;
        
        // last round of a bracket (ex. round 4/4 or round 8/8)
        } else if (props.currChoices.length === 0) {      
            props.setNextChoices(prev => [...prev, props.rightChoice]);
            props.setNextChoices(newChoices => {                  
                const copyNewChoices = _.cloneDeep(newChoices);              
                const [newLeft, newRight] = getTwoChoices(copyNewChoices);
                props.setLeftChoice(newLeft);
                props.setRightChoice(newRight);
                return [];
            });
            
            props.setGameSize(prevGameSize => prevGameSize/2);
            setRoundNum(1);            
        
        // any other round
        } else {
            setRoundNum(prevRoundNum => prevRoundNum + 1);      
            props.setNextChoices(prev => [...prev, props.rightChoice]);
            const copyCurrChoices = _.cloneDeep(props.currChoices);
            const [newLeft, newRight] = getTwoChoices(copyCurrChoices);
            props.setLeftChoice(newLeft);
            props.setRightChoice(newRight);
        };          

        updateChoiceStats(props.rightChoice.id, props.leftChoice.id, isFinalRound);
    };

    return (    
    <div className="w-full">
        <h1 className="m-4">{`[${props.mainCategory}] ${props.title} : TOP ${props.gameSize} (Round ${roundNum}/${props.gameSize/2})`}</h1>               
        <div className="game-imgs-container">
            <div className="h-full w-1/2">
                <img className="h-full max-w-full object-contain float-right" src={props.leftChoice.url} alt="left img"/>
            </div>
            <div className="h-full w-1/2">
                <img className="h-full max-w-full object-contain float-left" src={props.rightChoice.url} alt="right img"/>   
            </div>                            
        </div>
        <button className="gameScreen-btn" onClick={handleLeft}>{props.leftChoice.name}</button>
        <button className="gameScreen-btn" onClick={handleRight}>{props.rightChoice.name}</button>
    </div>
    );
};