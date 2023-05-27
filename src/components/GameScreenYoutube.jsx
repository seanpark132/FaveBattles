export default function GameScreenYoutube(props) { 
    return (       
        <section className="game-imgs-container">
            <div className="w-1/2">
                <iframe        
                    className="h-full w-full" 
                    src={props.leftEmbedUrl}
                    frameBorder="0" 
                    title="YouTube video player"                 
                    allow="accelerometer;"                                
                    allowFullScreen               
                >                
                </iframe> 
            </div>
            <div className="w-1/2">
                <iframe           
                    className="h-full w-full" 
                    src={props.rightEmbedUrl}
                    frameBorder="0" 
                    title="YouTube video player"                     
                    allow="accelerometer;"
                    allowFullScreen                
                >                
                </iframe>   
            </div>                            
        </section>
    );
};