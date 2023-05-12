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
            <img className="uploaded-img" src={props.url} />
            <div className="input-name-box">
                <h3 className="input-name-label">Name of choice:</h3>
                <input type="text" className="input-name" onChange={handleNameChange} value={props.name}/>
            </div>
            <button type="button" className="btn-delete" onClick={(event) => deleteBtn(event, props.fullName)}>
                <i className="fa-solid fa-xmark fa-lg x-icon"></i>
            </button>
        </div>  
    )
}