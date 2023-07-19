import {useState} from "react";
import Navbar from "../components/Navbar";
import GameSetup from "../components/GameSetup";
import GameScreen from "../components/GameScreen";
import WinnerScreen from "../components/WinnerScreen";

export default function Game(props) {
    const [gameSize, setGameSize] = useState(4);
    const [gameActive, setGameActive] = useState(false);
    const [currChoices, setCurrChoices] = useState(props.gameData.choices);
    const [nextChoices, setNextChoices] = useState([]);
    const [leftChoice, setLeftChoice] = useState({});
    const [rightChoice, setRightChoice] = useState({});
    const [winner, setWinner] = useState({});
    const [gameCompleted, setGameCompleted] = useState(false);

    return(
        <div>
            <Navbar />  
            <div className="flex justify-center text-center">
                <GameSetup                 
                    gameSize={gameSize}                    
                    setGameActive={setGameActive}
                    setGameSize={setGameSize}
                    currChoices={currChoices}
                    setCurrChoices={setCurrChoices}
                    setLeftChoice={setLeftChoice}
                    setRightChoice={setRightChoice}       
                    gameData={props.gameData}                  
                />               
                {gameActive && <GameScreen                                                   
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
                                    setWinner={setWinner}    
                                    setGameCompleted={setGameCompleted}                                                          
                                    gameData={props.gameData}
                                />
                }   
                {gameCompleted && <WinnerScreen
                                gameType={props.gameData.gameType}
                                winner={winner}
                          />                 
                }            
            </div>                                              
        </div>
    );    
};