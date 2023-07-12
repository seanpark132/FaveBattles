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
        <div className="uploaded-img-box">
            <Image src={props.url} alt="choice-img" imageClassName="uploaded-img" preview />
            <div className="m-4 w-3/5">
                <h3 className="mt-0 mb-4">Name of choice:</h3>
                <input 
                    type="text" 
                    className="w-full text-lg p-2 rounded border-2 border-blue-700"
                    onChange={handleNameChange} value={props.name}
                />
            </div>
            <button type="button" className="h-fit p-1.5 bg-red-500 ml-auto" onClick={() => deleteBtn(props.choiceId)}>
                <i className="fa-solid fa-xmark fa-lg text-white"></i>
            </button>
        </div>  
    );
};