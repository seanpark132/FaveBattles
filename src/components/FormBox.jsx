import {useState} from 'react'
import { _, random } from 'lodash'

export default function FormBox(props) {
    const [visible, setVisible] = useState(true)

    // when the form is submitted, visible goes from true to false => when this component is re-rendered, it's null
    if (!visible) { 
        return null
    }

    // remove two random choices from current array, return these two as left and right
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

    // at the start of the game, when the user selects the game size "n", randomly get n choices from pool
    function getRandomChoices(array, gameSize) {
        let randomChoices = []
        let totalLength = array.length

        while (randomChoices.length < gameSize) {
            let randomIndex = Math.floor(Math.random() * totalLength);
            let randomElement = array[randomIndex];
        
            if (!randomChoices.includes(randomElement)) {
              randomChoices.push(randomElement);
            }
        }

        return randomChoices
    }

    function handleChange(e) {
        const {name, value} = e.target
        props.setGameSize(value)
    }
    
    function handleSubmit(e) {
        e.preventDefault()
        setVisible(false)   
        props.setGameActive(true)     
        const copyCurrChoices = _.cloneDeep(props.currChoices)    

        const gameSizedChoices = props.gameSize === copyCurrChoices.length ? 
            copyCurrChoices: getRandomChoices(copyCurrChoices, props.gameSize)

        const [initialLeft, initialRight] = getTwoChoices(gameSizedChoices)
        props.setLeftChoice(initialLeft)
        props.setRightChoice(initialRight)
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

    const totalNumChoices = props.choices.length
    const choicesArray = generateChoicesArray(totalNumChoices)
    const selectOptions = choicesArray.map(numChoices =>
        <option key={numChoices} value={numChoices}>{numChoices} choices</option>
        )

    return (
        <div className='form-container'>
            <h2 className='form-title'>{`[${props.mainCategory}] ${props.title} (${props.choices.length} choices)`}</h2>
            <form className="form" onSubmit={handleSubmit}>
                <select 
                    value={props.gameSize}
                    onChange={handleChange}
                    name='startingOptions'
                    className='form-dropdown'
                >                    
                    {selectOptions} 
                </select>
                <br />
                <button className='form-btn'>Start game with {props.gameSize} choices!</button>
            </form>
        </div>
    )
}