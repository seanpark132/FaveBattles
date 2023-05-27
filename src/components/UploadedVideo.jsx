// box component for each video the user adds in Create-Video page

import { _ } from 'lodash';

export default function UploadedVideo(props) { 

    function handleNameChange(event) {
        props.setChoicesData(prev => {   
            let newArray = _.cloneDeep(prev);
            const videoData = newArray.find(obj => obj.id === props.choiceId);
            const index = newArray.findIndex(obj => obj.id === props.choiceId);
            const newData = {...videoData, name:event.target.value};
            newArray[index] = newData;          
            return newArray;
        });
    };

    function deleteBtn(event, choiceId) {          
        props.setChoicesData(prev => {
            return prev.filter((choiceData) => choiceData.id !== choiceId );
        });
        alert("Choice deleted");
    };
            
    return (
        <div className="uploaded-video-box">
            <iframe 
                width="480" 
                height="270" 
                src={props.embedUrl}
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; 
                autoplay; 
                clipboard-write; 
                encrypted-media; 
                gyroscope; 
                picture-in-picture; 
                web-share" 
                allowFullScreen                
            >                
            </iframe>        
            <div className="ml-4 mt-2 w-3/5">
                <h3 className="mt-4 mb-4">Name of choice:</h3>
                <input 
                    type="text" 
                    className="w-full text-lg p-2 rounded border-2 border-blue-700"
                    onChange={handleNameChange} value={props.name}
                />
            </div>
            <button type="button" className="h-fit p-1.5 bg-red-500 ml-auto" onClick={(event) => deleteBtn(event, props.choiceId)}>
                <i className="fa-solid fa-xmark fa-lg text-white"></i>
            </button>
        </div>  
    );
};