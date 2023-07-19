import { useState } from "react";
import { _ } from 'lodash';
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc}  from "firebase/firestore";
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts"
import { getTwoChoicesFromCurrentChoices } from "../utils/helper_functions";
import GameScreenImage from "./GameScreenImage"
import GameScreenYoutube from "./GameScreenYoutube"

export default function GameScreen(props) {
    const [roundNum, setRoundNum] = useState(1);   
   
    // counter function for choice stats (numGames, numWins, numFirst) when choice is clicked
    async function updateChoiceStats(winId, loseId, isFinalRound) {
        const gameDocRef = doc(db, FIRESTORE_COLLECTION_NAME, props.gameData.id);
        const gameDocSnap = await getDoc(gameDocRef);
        const gameDocData = gameDocSnap.data();
        
        const winIndex = gameDocData.choices.findIndex(obj => obj.id === winId);
        const loseIndex = gameDocData.choices.findIndex(obj => obj.id === loseId);
        gameDocData.choices[winIndex].numGames += 1;
        gameDocData.choices[winIndex].numWins += 1;
        gameDocData.choices[loseIndex].numGames += 1;

        if (isFinalRound) {
            gameDocData.choices[winIndex].numFirst += 1; 
            gameDocData.numCompletes += 1;
        }

        await setDoc(doc(db, FIRESTORE_COLLECTION_NAME, props.gameData.id), gameDocData);
    };
   
    function handleLeft() {  
        let isFinalRound = false;
        // final round  
        if (props.gameSize === 2) {
            props.setGameActive(false);
            props.setWinner(props.leftChoice);
            props.setGameCompleted(true);
            isFinalRound = true; 
        
        // last round of a bracket (ex. round 4/4 or round 8/8)
        } else if (props.currChoices.length === 0) {      
            props.setNextChoices(prev => [...prev, props.leftChoice]);
            props.setNextChoices(newChoices => {                
                const copyNewChoices = _.cloneDeep(newChoices);                
                const [newLeft, newRight] = getTwoChoicesFromCurrentChoices(copyNewChoices, props.setCurrChoices);
                props.setLeftChoice(newLeft);
                props.setRightChoice(newRight);  
                return [];
            });
            props.setGameSize(prevGameSize => prevGameSize/2);
            setRoundNum(1);  

        } else {
            setRoundNum(prevRoundNum => prevRoundNum + 1);
            props.setNextChoices(prev => [...prev, props.leftChoice]);
            const copyCurrChoices = _.cloneDeep(props.currChoices);
            const [newLeft, newRight] = getTwoChoicesFromCurrentChoices(copyCurrChoices, props.setCurrChoices);
            props.setLeftChoice(newLeft);
            props.setRightChoice(newRight);
        }; 

        updateChoiceStats(props.leftChoice.id, props.rightChoice.id, isFinalRound);                
    };
    
    function handleRight() {
        let isFinalRound = false;
        // final round
        if (props.gameSize === 2) {
            props.setGameActive(false);
            props.setWinner(props.rightChoice);  
            props.setGameCompleted(true);        
            isFinalRound = true;
        
        // last round of a bracket (ex. round 4/4 or round 8/8)
        } else if (props.currChoices.length === 0) {      
            props.setNextChoices(prev => [...prev, props.rightChoice]);
            props.setNextChoices(newChoices => {                  
                const copyNewChoices = _.cloneDeep(newChoices);              
                const [newLeft, newRight] = getTwoChoicesFromCurrentChoices(copyNewChoices, props.setCurrChoices);
                props.setLeftChoice(newLeft);
                props.setRightChoice(newRight);
                return [];
            });
            
            props.setGameSize(prevGameSize => prevGameSize/2);
            setRoundNum(1);            

        } else {
            setRoundNum(prevRoundNum => prevRoundNum + 1);      
            props.setNextChoices(prev => [...prev, props.rightChoice]);
            const copyCurrChoices = _.cloneDeep(props.currChoices);
            const [newLeft, newRight] = getTwoChoicesFromCurrentChoices(copyCurrChoices, props.setCurrChoices);
            props.setLeftChoice(newLeft);
            props.setRightChoice(newRight);
        };          

        updateChoiceStats(props.rightChoice.id, props.leftChoice.id, isFinalRound);
    };
      
    return (    
        <div className="w-full h-vh-nav">
            <h3 className="m-4 md:text-2xl lg:text-3xl">{`TOP ${props.gameSize} (Round ${roundNum}/${props.gameSize/2}) : [${props.gameData.mainCategory}] ${props.gameData.title}`}</h3>  
            {props.gameData.gameType === "image" ? 
            <GameScreenImage 
                leftChoice={props.leftChoice} 
                rightChoice={props.rightChoice}
                handleLeft={handleLeft}
                handleRight={handleRight}
            /> 
            :<GameScreenYoutube 
                leftChoice={props.leftChoice} 
                rightChoice={props.rightChoice} 
                handleLeft={handleLeft}
                handleRight={handleRight}
            />}  
        </div>
    );
};