export default function GameScreenImage(props) { 
    return (       
        <section className="game-imgs-container">
            <div className="h-full w-1/2">
                <img className="h-full max-w-full object-contain float-right" src={props.leftUrl} alt="left"/>
            </div>
            <div className="h-full w-1/2">
                <img className="h-full max-w-full object-contain float-left" src={props.rightUrl} alt="right"/>   
            </div>                            
        </section>
    );
};