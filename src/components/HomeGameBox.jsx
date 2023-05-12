export default function HomeGameBox(props) {
    return (
        <div className="home-box">                         
            <div className="box-imgs-container">
                <img className="box-img" src={props.choices[0].url} alt="left img"/>
                <img className="box-img" src={props.choices[1].url} alt="right img"/>
            </div>
            <div className="box-label-container">
                <p className="box-img-label">{props.choices[0].name}</p>
                <p className="box-img-label">{props.choices[1].name}</p> 
            </div>
            <h3 className="box-title">[{props.mainCategory}] {props.title} ({props.choices.length} choices)</h3>
            <p className="box-desc">{props.description}</p>          
            <div className="stick-to-bottom">
                <a href={`/game/${props.id}`} target="_blank" className="box-btn" id="start-btn">
                    <i className="btn-icon fa-solid fa-play fa-xs"></i>Start!
                </a>            
                <a href="https://example.com" target="_blank" className="box-btn" id="stats-btn">
                    <i className="btn-icon fa-sharp fa-solid fa-square-poll-horizontal fa-sm"></i>Game Stats
                </a>
            </div>
        </div>
    )
}