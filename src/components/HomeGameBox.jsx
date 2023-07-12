import { useEffect } from "react";
import { useState } from "react";

export default function HomeGameBox(props) {
    const [leftImgUrl, setLeftImgUrl] = useState("");
    const [rightImgUrl, setRightImgUrl] = useState("");
    const [leftName, setLeftName] = useState("");
    const [rightName, setRightName] = useState("");

    useEffect(() => {
        if (props.gameType === "video-youtube") {
            setLeftImgUrl(props.choices[0].thumbnailUrl);        
            setRightImgUrl(props.choices[1].thumbnailUrl);            
        } else if (props.gameType === "image") {
            setLeftImgUrl(props.choices[0].url);        
            setRightImgUrl(props.choices[1].url);      
        };
        
        setLeftName(props.choices[0].name);
        setRightName(props.choices[1].name);
    }, []);
    
    return (
        <div className="flex flex-col w-110 border border-gray-200 m-3 ">                         
            <div className="h-48 overflow-hidden flex">
                <img className="h-full w-1/2 object-cover" src={leftImgUrl} alt="left img"/>
                <img className="h-full w-1/2 object-cover" src={rightImgUrl} alt="right img"/>
            </div>
            <div className="flex mb-2 border-b-2 border-b-gray-200">
                <p className="box-img-label">{leftName}</p>
                <p className="box-img-label">{rightName}</p> 
            </div>
            <h3 className="my-1 mx-2 max-h-16 overflow-hidden">[{props.mainCategory}] {props.title} ({props.choices.length} choices)</h3>
            <p className="box-desc">{props.description}</p>          
            <div className="mt-auto">
                <a href={`/game/${props.id}`} target="_blank" className="box-btn bg-green-600">
                    <i className="mr-2 fa-solid fa-play fa-xs"></i>Play!
                </a>            
                <a href={`/stats/${props.id}`} target="_blank" className="box-btn bg-purple-900">
                    <i className="mr-2 fa-sharp fa-solid fa-square-poll-horizontal fa-sm"></i>Rankings
                </a>
            </div>
        </div>
    );
};