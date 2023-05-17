import { useState } from "react"
import { _ } from 'lodash'
import {db} from "../firebaseConfig"
import {updateDoc, doc, increment} from "firebase/firestore"

export default function GameScreen(props) {
    const [roundNum, setRoundNum] = useState(1)    

    // remove 2 random choices from remaining choices, and set them as new left and right to be displayed
    function getTwoChoices(array) {
        const index1 = Math.floor(Math.random() * array.length)
        let index2 = Math.floor(Math.random() * array.length)        
        while (index2 === index1) {
            index2 = Math.floor(Math.random() * array.length)
        }
        
        let indexArray = []
        if (index1 > index2) {
            indexArray = [index1, index2]
        } else {
            indexArray = [index2, index1]
        }                    
        const lChoice = array.splice(indexArray[0], 1)
        const rChoice = array.splice(indexArray[1], 1)
        
        props.setCurrChoices(array)
        return [lChoice[0], rChoice[0]]
    }

    // handle left button click to proceed to next round
    function handleLeft() {    
        if (props.gameSize === 2) {
            props.setGameActive(false)
            props.setWinner(props.leftChoice)
            return
        }

        if (props.currChoices.length === 0) {      
            props.setNextChoices(prev => [...prev, props.leftChoice])
            props.setNextChoices(newChoices => {                
                const copyNewChoices = _.cloneDeep(newChoices)                
                const [newLeft, newRight] = getTwoChoices(copyNewChoices)
                props.setLeftChoice(newLeft)
                props.setRightChoice(newRight)  
                return []
            })

            props.setGameSize(prevGameSize => prevGameSize/2)
            setRoundNum(1)   
            return        
        }    

        setRoundNum(prevRoundNum => prevRoundNum + 1)
        props.setNextChoices(prev => [...prev, props.leftChoice])
        const copyCurrChoices = _.cloneDeep(props.currChoices)
        const [newLeft, newRight] = getTwoChoices(copyCurrChoices)
        props.setLeftChoice(newLeft)
        props.setRightChoice(newRight) 
    }

    // handle right button click to proceed to next round
    function handleRight() {
        if (props.gameSize === 2) {
            props.setGameActive(false)
            props.setWinner(props.rightChoice)
            return
        }

        if (props.currChoices.length === 0) {      
            props.setNextChoices(prev => [...prev, props.rightChoice])
            props.setNextChoices(newChoices => {                  
                const copyNewChoices = _.cloneDeep(newChoices)              
                const [newLeft, newRight] = getTwoChoices(copyNewChoices)
                props.setLeftChoice(newLeft)
                props.setRightChoice(newRight)  
                return []
            })
            
            props.setGameSize(prevGameSize => prevGameSize/2)
            setRoundNum(1)   
            return                      
        }   

        setRoundNum(prevRoundNum => prevRoundNum + 1)
        props.setNextChoices(prev => [...prev, props.rightChoice])
        const copyCurrChoices = _.cloneDeep(props.currChoices)
        const [newLeft, newRight] = getTwoChoices(copyCurrChoices)
        props.setLeftChoice(newLeft)
        props.setRightChoice(newRight)
    }

    async function updateWin(choiceId) {
        const gameDoc = doc(db, "all_games", props.id)
        await updateDoc(gameDoc, {
            "choices[0]": increment(1)
        })
    }

    return (
    <div className="gameScreen">
        <h1>{`[${props.mainCategory}] ${props.title} : TOP ${props.gameSize} (Round ${roundNum}/${props.gameSize/2})`}</h1>               
        <div className="game-imgs-container">
            <div className="img-container">
                <img className="game-lImg" src={props.leftChoice.url} alt="left img"/>
            </div>
            <div className="img-container">
               <img className="game-rImg" src={props.rightChoice.url} alt="right img"/>   
            </div>                            
        </div>
        <button className="gameScreen-btn" onClick={handleLeft}>{props.leftChoice.name}</button>
        <button className="gameScreen-btn" onClick={handleRight}>{props.rightChoice.name}</button>
    </div>
    )
}