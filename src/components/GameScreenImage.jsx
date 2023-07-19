export default function GameScreenImage({leftChoice, rightChoice, handleLeft, handleRight}) { 
    return (
        <div className="game-choices-height flex relative">
            <button className="flex justify-end w-1/2 h-full hover:text-sky-400" onClick={handleLeft}>        
                    <div className="relative w-fit h-full flex justify-center">
                        <img className="max-h-full max-w-full object-contain" id="leftImg" src={leftChoice.url} alt="left"/>
                        <label className="absolute -translate-x-1/2 left-1/2 top-3/4 text-3xl text-black-outline lg:text-5xl" htmlFor="leftImg">{leftChoice.name}</label>        
                    </div>             
            </button>
            <button className="flex justify-start w-1/2 h-full hover:text-sky-400" onClick={handleRight}>           
                <div className="relative w-fit h-full flex justify-center">
                    <img className="max-h-full max-w-full object-contain" src={rightChoice.url} alt="right"/>   
                    <label className="absolute -translate-x-1/2 left-1/2 top-3/4 text-3xl text-black-outline lg:text-5xl" htmlFor="rightImg">{rightChoice.name}</label>
                </div>             
            </button>     
        </div>   
    );
};