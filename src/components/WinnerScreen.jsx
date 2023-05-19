export default function WinnerScreen(props) {
    return (
        <div>
            <h1 className="m-4">The winner is: {props.winner.name}</h1>         
            <div className="winner-img-container">
                <img className="h-full w-full object-contain" src={props.winner.url} alt="winnerImg"/>   
            </div>              
         </div>
    );
};