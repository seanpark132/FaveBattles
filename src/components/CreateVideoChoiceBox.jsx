// box component for each video the user adds in Create-Video page

import { _ } from 'lodash';

export default function CreateVideoChoiceBox(props) { 

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

    function deleteBtn(choiceId) {          
        props.setChoicesData(prev => {
            return prev.filter((choiceData) => choiceData.id !== choiceId );
        });
        alert("Choice deleted");
    };

    // Component viable for screens below 768 px 
    const mdScreen =
        <div className="create-video-choice-box-md">
            <iframe                        
                className='create-iframe-dimensions-md'
                src={props.embedUrl}
                title="YouTube video player"
                allow="accelerometer"
                allowFullScreen
            />         
            <div className='relative'>
                <div className="py-2 px-4 w-11/12">
                    <h3 className="my-4">Title:</h3>
                    <input 
                        type="text" 
                        className="w-full text-lg p-2 rounded"
                        onChange={(e) => handleNameChange(e)} value={props.name}
                    />
                </div>
                <button type="button" className="absolute top-0 right-0 h-fit py-1 px-1.5 bg-red-500" onClick={() => deleteBtn(props.choiceId)}>
                    <i className="fa-solid fa-xmark fa-lg text-white"></i>
                </button>
            </div>
        </div>
    
            
    return (
        <>            
            {mdScreen}
            <div className="create-video-choice-box">
                <iframe 
                    width="400" 
                    height="225" 
                    src={props.embedUrl}
                    title="YouTube video player"
                    allow="accelerometer;"
                    allowFullScreen
                />            
                <div className="mx-4 mt-2 w-3/5 xxl:w-1/2">
                    <h3 className="mt-4 mb-4">Title:</h3>
                    <input 
                        type="text" 
                        className="w-full text-lg p-2 rounded"
                        onChange={(e) => handleNameChange(e)} value={props.name}
                    />
                </div>
                <button type="button" className="absolute top-0 right-0 h-fit py-1 px-1.5 bg-red-500" onClick={() => deleteBtn(props.choiceId)}>
                    <i className="fa-solid fa-xmark fa-lg text-white"></i>
                </button>
            </div>  
        </>
    );
};