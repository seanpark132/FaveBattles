import { storage } from "../firebaseConfig";
import { ref, deleteObject } from "firebase/storage";
import { _ } from 'lodash';
import { Image } from "primereact/image"

export default function NewImgBox({choiceId, gameId, url, name, setChoicesData, setImgIdsToRemove, page}) { 

    function handleNameChange(event) {
        setChoicesData(prev => {   
            let newArray = _.cloneDeep(prev);
            const imgData = newArray.find(obj => obj.id === choiceId);
            const index = newArray.findIndex(obj => obj.id === choiceId);
            const newData = {...imgData, name:event.target.value};
            newArray[index] = newData;          
            return newArray;
        });
    };

    async function deleteBtn(choiceId) {     
        if (page === "edit") {
            setImgIdsToRemove(prev => {
                const copy = [...prev];
                const index = copy.indexOf(choiceId);
                copy.splice(index, 1);
                return copy;
            });

            setChoicesData(prev => {
                return prev.filter((choiceData) => choiceData.id !== choiceId );
            });
            return;
        }; 

        try {
            const imgRef = ref(storage, `all_games/${gameId}/${choiceId}`);
            await deleteObject(imgRef);
            alert("Choice deleted"); 
            setChoicesData(prev => {
                return prev.filter((choiceData) => choiceData.id !== choiceId );
            });     
        } catch(error) {
            alert("An error has occurred")
        };           
    };

    return (
        <div className="flex relative mb-8 border rounded bg-neutral-600 w-full h-32">
            <Image src={url} alt="choice-img" imageClassName="h-full w-32 object-cover" preview />
            <div className="p-4 w-3/5">
                <h3 className="mb-4">Name:</h3>
                <input 
                    type="text" 
                    className="w-full p-2 text-sm rounded border-2 md:text-lg"
                    onChange={(e) => handleNameChange(e)} value={name}
                />
            </div>
            <button 
                type="button" 
                className="absolute top-0 right-0 border-transparent rounded h-fit py-1 px-1.5 bg-red-500" 
                onClick={() => deleteBtn(choiceId)}
            >
                <i className="fa-solid fa-xmark fa-lg text-white"></i>
            </button>
        </div>  
    );
};