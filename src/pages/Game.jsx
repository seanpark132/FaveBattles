import {useState} from "react";
import Navbar from "../components/Navbar";
import FormBox from "../components/FormBox";
import GameScreen from "../components/GameScreen";
import WinnerScreen from "../components/WinnerScreen";
import "../css/Game.css";

export default function Game(props) {
    const [gameSize, setGameSize] = useState(4);
    const [gameActive, setGameActive] = useState(false);
    const [currChoices, setCurrChoices] = useState(props.gameData.choices);
    const [nextChoices, setNextChoices] = useState([]);
    const [leftChoice, setLeftChoice] = useState({});
    const [rightChoice, setRightChoice] = useState({});
    const [winner, setWinner] = useState(null);

    return(
        <div>
            <Navbar />  
            <div className="flex justify-center text-center">
                <FormBox                  
                    gameSize={gameSize}                    
                    setGameActive={setGameActive}
                    setGameSize={setGameSize}
                    currChoices={currChoices}
                    setCurrChoices={setCurrChoices}
                    setLeftChoice={setLeftChoice}
                    setRightChoice={setRightChoice}                    
                    {...props.gameData}
                />               
                {gameActive ? <GameScreen                                                   
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
                                    winner={winner}
                                    setWinner={setWinner}                                                              
                                    {...props.gameData}
                                />
                : null}   
                {winner ? <WinnerScreen
                                winner={winner}
                          /> 
                
                : null}            
            </div>                                              
        </div>
    );    
};