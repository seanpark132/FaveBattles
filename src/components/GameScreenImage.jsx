export default function GameScreenImage({leftChoice, rightChoice, handleLeft, handleRight, hideLeft, hideRight, leftChosen, rightChosen, animationsInProgress}) {
    return (
        <div className="game-choices-height px-6 flex relative">
            <button 
                className={`game-choice-btn justify-end ${hideLeft && "fade-out"} ${!animationsInProgress && "fade-in"} ${leftChosen && "opacity-0"}`} 
                onClick={handleLeft}
            >        
                    <div className="relative w-fit h-full flex justify-center">
                        <img className="max-h-full max-w-full object-contain" id="leftImg" src={leftChoice.url} alt="left"/>
                        <label className="game-choice-label" htmlFor="leftImg">{leftChoice.name}</label>        
                    </div>             
            </button>
            <button 
                className={`game-choice-btn justify-start ${hideRight && "fade-out"} ${!animationsInProgress && "fade-in"} ${rightChosen && "opacity-0"}`} 
                onClick={handleRight}
            >           
                <div className="relative w-fit h-full flex justify-center">
                    <img className="max-h-full max-w-full object-contain" src={rightChoice.url} alt="right"/>   
                    <label className="game-choice-label" htmlFor="rightImg">{rightChoice.name}</label>
                </div>             
            </button>     
        </div>   
    );
};