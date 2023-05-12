export default function WinnerScreen(props) {
    return (
        <div className="winner-screen">
            <h1>The winner is: {props.winner.name}</h1>         
            <div className="winner-img-container">
                <img className="winner-img" src={props.winner.url} alt="winnerImg"/>   
            </div>              
         </div>
    )
}