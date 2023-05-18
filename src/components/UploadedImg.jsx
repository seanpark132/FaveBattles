// box component for each img the user uploaded in the Create page

import { storage } from "../firebaseConfig"
import { ref, deleteObject } from "firebase/storage"

export default function UploadedImg(props) { 

    function handleNameChange(event) {
        props.setImgsData(prev => {                     
            let newArray = JSON.parse(JSON.stringify(prev))
            const imgData = newArray.find(obj => obj.id === props.id)
            const index = newArray.findIndex(obj => obj.id === props.id)
            const newData = {...imgData, name:event.target.value}
            newArray[index] = newData            
            return newArray
        })
    }

    function deleteBtn(event, fullName) {        
        const imgRef = ref(storage, `all_games/${props.uid}/${fullName}`)

        deleteObject(imgRef).then(() => {
            props.setImgsData(prev => {
                return prev.filter((imgData) => imgData.fullName !== fullName )
            })
            alert("Item deleted")            
        }).catch((error) => {   
            alert("An error has occurred")
        })
    }

    return (
        <div className="uploaded-box">
            <img className="w-48 h-40 object-cover" src={props.url} />
            <div className="m-4 w-3/5">
                <h3 className="mt-0 mb-4">Name of choice:</h3>
                <input 
                    type="text" 
                    className="w-full text-lg p-2 rounded border-2 border-blue-700"
                    onChange={handleNameChange} value={props.name}
                />
            </div>
            <button type="button" className="h-fit p-1.5 bg-red-500 ml-auto" onClick={(event) => deleteBtn(event, props.fullName)}>
                <i className="fa-solid fa-xmark fa-lg text-white"></i>
            </button>
        </div>  
    )
}