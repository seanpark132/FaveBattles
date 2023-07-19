import { useState } from "react";
import { storage } from "../firebaseConfig";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddNewImage(props) {
    const [inputtedImgs, setInputtedImgs] = useState([]);

    async function uploadImage() {        
        if (inputtedImgs.length === 0 ) {
            alert("Please add a file first");
            return;
        };
                  
        for (const img of inputtedImgs) {
            const imgId = v4();                            
            const storageRef = ref(storage, `all_games/${props.gameId}/${imgId}`);         
            let uploaded = null;
            let imgUrl = null;

            try {
                uploaded = await uploadBytes(storageRef, img);
                imgUrl = await getDownloadURL(uploaded.ref);
            } catch (error) {
                alert("Image could not be uploaded");
                return;
            };                   
             
            let charsToRemove = 4;
            if (img.type === "image/webp") {
                charsToRemove = 5;
            }
            const defaultName = (img.name.charAt(0).toUpperCase() + img.name.slice(1)).slice(0, img.name.length- charsToRemove);  
            props.setChoicesData(prev => 
                prev ? 
                [...prev, 
                    {   
                        id: imgId,
                        url:imgUrl, 
                        name:defaultName,                        
                        numWins: 0,
                        numGames: 0,
                        numFirst: 0                
                    }
                ]
                :[
                    {   
                        id: imgId,
                        url:imgUrl, 
                        name:defaultName,                        
                        numWins: 0,
                        numGames: 0,
                        numFirst: 0       
                    }
                ]
            );
        }                
        alert("Image(s) uploaded");
        setInputtedImgs(null);
    };

    return (
        <section className="flex flex-col px-6 mb-6 max-w-xs">
            <h2 className="mb-4">Choose images to add</h2>
            <input                
                type="file"    
                className="w-fit file:bg-blue-800"                              
                accept="image/png, image/jpeg, image/jpg, image/webp"
                multiple={true}                                                    
                onChange={(e) => {setInputtedImgs(e.target.files)}}           
                id="imgUpload"
            />                         
            <button 
                type="button" 
                className="mt-4 py-2 px-20 w-fit bg-blue-400 border-transparent rounded" 
                onClick={uploadImage}
            >Add Images
            </button>
            <p className="mt-2"><em>Accepts .png, .jpg, .jpeg, .webp types</em></p>
        </section>
    );
};
