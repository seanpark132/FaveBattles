import { useState, useEffect } from "react"
import { _ } from 'lodash'

export default function GameScreen(props) {
    const [roundNum, setRoundNum] = useState(1)    

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
                return newChoices
            })

            props.setNextChoices([])
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

    function handleRight() {
        if (props.gameSize === 2) {
            props.setGameActive(false)
            props.setWinner(props.rightChoice)
            return
        }

        if (props.currChoices.length === 0) {      
            props.setNextChoices(prev => [...prev, props.leftChoice])
            props.setNextChoices(newChoices => {                  
                const copyNewChoices = _.cloneDeep(newChoices)              
                const [newLeft, newRight] = getTwoChoices(copyNewChoices)
                props.setLeftChoice(newLeft)
                props.setRightChoice(newRight)  
                return newChoices
            })

            props.setNextChoices([])
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