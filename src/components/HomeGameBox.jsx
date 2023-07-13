export default function HomeGameBox(props) { 
    return (
        <div className="home-box-container">                         
            <div className="h-48 w-full overflow-hidden flex">
                <img className="h-full w-1/2 object-cover" src={props.gameType === "video-youtube" ? props.choices[0].thumbnailUrl: props.choices[0].url} alt="left img"/>
                <img className="h-full w-1/2 object-cover" src={props.gameType === "video-youtube" ? props.choices[1].thumbnailUrl: props.choices[1].url} alt="right img"/>
            </div>
            <div className="flex w-full mb-2 border-b-2 border-b-slate-200">
                <p className="home-box-img-label">{props.choices[0].name}</p>
                <p className="home-box-img-label">{props.choices[1].name}</p> 
            </div>
            <h3 className="my-1 mx-2 max-h-16 overflow-hidden">[{props.mainCategory}] {props.title} ({props.choices.length} choices)</h3>
            <p className="home-box-desc">{props.description}</p>          
            <div className="mt-auto">
                <a href={`/game/${props.id}`} target="_blank" className="home-box-btn bg-green-600">
                    <i className="mr-2 fa-solid fa-play fa-xs"></i>Play!
                </a>            
                <a href={`/stats/${props.id}`} target="_blank" className="home-box-btn bg-purple-900">
                    <i className="mr-2 fa-sharp fa-solid fa-square-poll-horizontal fa-sm"></i>Rankings
                </a>
            </div>
        </div>
    );
};