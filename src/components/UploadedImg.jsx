// box component for each img the user uploaded in the Create page

import { storage } from "../firebaseConfig";
import { ref, deleteObject } from "firebase/storage";
import { _ } from 'lodash';
import { Image } from "primereact/image"

export default function UploadedImg(props) { 

    function handleNameChange(event) {
        props.setChoicesData(prev => {   
            let newArray = _.cloneDeep(prev);
            const imgData = newArray.find(obj => obj.id === props.choiceId);
            const index = newArray.findIndex(obj => obj.id === props.choiceId);
            const newData = {...imgData, name:event.target.value};
            newArray[index] = newData;          
            return newArray;
        });
    };

    async function deleteBtn(choiceId) {        
        const imgRef = ref(storage, `all_games/${props.gameId}/${choiceId}`);

        try {
            await deleteObject(imgRef);
            props.setChoicesData(prev => {
                return prev.filter((choiceData) => choiceData.id !== choiceId );
            });
            alert("Choice deleted"); 
        } catch(error) {
            alert("An error has occurred")
        };           
    };

    return (
        <div className="flex relative mb-8 border bg-neutral-600 w-full h-32">
            <Image src={props.url} alt="choice-img" imageClassName="h-full w-32 object-cover" preview />
            <div className="p-4 w-3/5">
                <h3 className="mb-4">Name:</h3>
                <input 
                    type="text" 
                    className="w-full p-2 text-sm rounded border-2 md:text-lg"
                    onChange={(e) => handleNameChange(e)} value={props.name}
                />
            </div>
            <button type="button" className="absolute top-0 right-0 h-fit py-1 px-1.5 bg-red-500" onClick={() => deleteBtn(props.choiceId)}>
                <i className="fa-solid fa-xmark fa-lg text-white"></i>
            </button>
        </div>  
    );
};