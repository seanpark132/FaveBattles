export default function GameScreenYoutube({leftChoice, rightChoice, handleLeft, handleRight}) { 
    return (       
        <div className="flex flex-col game-choices-height">
            <div className="grid grid-cols-2 flex-1">            
                <iframe        
                    className="h-full w-full" 
                    src={leftChoice.embedUrl}                   
                    title="YouTube video player"                 
                    allow="accelerometer;"                                
                    allowFullScreen               
                >                
                </iframe>             
                <iframe           
                    className="h-full w-full" 
                    src={rightChoice.embedUrl}                  
                    title="YouTube video player"                     
                    allow="accelerometer;"
                    allowFullScreen                
                >                
                </iframe>           
            </div>       
            <div className="grid grid-cols-2 gap-1">
                <button className="game-video-btn bg-sky-600 hover:bg-sky-400 hover:text-white" onClick={handleLeft}>{leftChoice.name}</button>
                <button className="game-video-btn bg-rose-600 hover:bg-rose-500 hover:text-white" onClick={handleRight}>{rightChoice.name}</button>      
            </div>     
                               
        </div>
    );
};