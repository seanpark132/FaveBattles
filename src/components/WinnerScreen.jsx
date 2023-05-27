export default function WinnerScreen(props) {
    const imgWinner =  
    <div className="winner-img-container">
        <img className="h-full w-full object-contain" src={props.winner.url} alt="winnerImg"/>   
    </div>

    const youtubeWinner =   
        <div className="winner-video-container">        
            <iframe    
                className="w-full h-full"
                src={props.winner.embedUrl}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer;"          
                allowFullScreen                
            >                
            </iframe> 
        </div>

    return (
        <div>
            <h1 className="m-4">The winner is: {props.winner.name}</h1>          
            {props.gameType === "image" ? imgWinner: youtubeWinner}                 
         </div>
    );
};