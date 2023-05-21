import { useState, useEffect } from "react";
import { storage, db } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc} from "firebase/firestore";
import { v4 } from "uuid";
import { _ } from 'lodash';
import Select from 'react-select';
import "../css/Create.css";
import Navbar from "../components/Navbar";
import UploadedImg from "../components/UploadedImg";

export default function Create() {
    const [inputtedImgs, setInputtedImgs] = useState(null);
    const [imgsData, setImgsData] = useState(null);
    const [formData, setFormData] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);

    // create a new id for the game, or if game creation was in progress, restore saved id from local storage
    const storedGameId = localStorage.getItem('create-GameId');
    const gameId = storedGameId ? storedGameId : v4();
    localStorage.setItem('create-GameId', gameId);
    
    // handle upload image button, upload image(s) file to cloud, add new image data with URL to imgsData state
    async function uploadImage(event) {        
        if (inputtedImgs == null) {
            alert("Please add a file first");
            return;
        };
                  
        for (const img of inputtedImgs) {
            const imgId = v4();                            
            const imageRef = ref(storage, `all_games/${gameId}/${imgId}`);         
            let uploaded = null;
            try {
                uploaded = await uploadBytes(imageRef, img);
            } catch (error) {
                alert("Image could not be uploaded");
                return;
            };        
            
            let imgURL = null;
            try {
                imgURL = await getDownloadURL(uploaded.ref);
            } catch (error) {
                alert("Image uploaded, but could not access download URL");
                return;
            };
            
            let charsToRemove = 4;
            if (img.type === "image/webp") {
                charsToRemove = 5;
            }
            const defaultName = (img.name.charAt(0).toUpperCase() + img.name.slice(1)).slice(0, img.name.length- charsToRemove);  
            setImgsData(prev => 
                prev ? 
                [...prev, 
                    {   
                        id: imgId,
                        url:imgURL, 
                        name:defaultName,                        
                        numWins: 0,
                        numGames: 0,
                        numFirst: 0                
                    }
                ]
                :[
                    {   
                        id: imgId,
                        url:imgURL, 
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

    // handle form data change (title, description)
    function handleChange(event) {       
        const {name, value} = event.target;
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            };
        });
    };

    // final "create game" button submit
    async function handleSubmit(event) {
        event.preventDefault();        
        let fullFormData = _.cloneDeep(formData);
        fullFormData.id = gameId;
        fullFormData.choices = imgsData;
        fullFormData.categories = selectedCategories;
        fullFormData.mainCategory = selectedCategories[0].label;
        fullFormData.numStarts = 0;
        fullFormData.numCompletes = 0;
        localStorage.removeItem('create-GameId');
        localStorage.removeItem('create-imgsData');
        await setDoc(doc(db, "all_games", gameId), fullFormData);
        alert("Game created!");        
    };

    useEffect(() => {
        const storedImgsData = localStorage.getItem('create-imgsData');            
        if (storedImgsData !== null) {
            setImgsData(JSON.parse(storedImgsData));
        };
    }, []);

    useEffect(() => {
        if (imgsData !== null) {            
            localStorage.setItem('create-imgsData', JSON.stringify(imgsData));
        };   
    },[imgsData]);

    const categoryOptions = [
        {value:"food", label:"Food"},
        {value:"entertainment", label:"Entertainment"},
        {value:"music", label:"Music"},
        {value:"games", label:"Games"},
        {value:"tv", label:"TV"},
        {value:"movies", label:"Movies"},
        {value:"anime", label:"Anime"},
        {value:"books", label:"Books"},
        {value:"sports", label:"Sports"},
        {value:"kpop", label:"Kpop"},
        {value:"other", label:"Other"} 
    ];

    return (
        <div>
            <Navbar />
            <form className="grid" onSubmit={handleSubmit}>
                <fieldset className="flex bg-teal-700">
                    <div className="grid m-4 h-fit">
                        <input                
                            type="file"     
                            className="mt-1"                       
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            multiple={true}                                                     
                            onChange={event => {setInputtedImgs(event.target.files)}}
                            name="imgUpload"
                        />                         
                        <button type="button" className="btn-upload" onClick={uploadImage}>Upload Images</button>
                    </div>   
                    <div className="grid m-3 w-1/4">                            
                        <label>Game Title:</label>
                        <input                                     
                            type="text" 
                            className="mb-4 p-1"
                            value={formData.title}
                            onChange={handleChange}
                            name="title"                                    
                        />                                          
                        <label>Categories (First category will be the main one):</label>
                        <Select 
                            isMulti
                            options={categoryOptions}                                    
                            className="mb-4 text-black"                              
                            value={selectedCategories}     
                            onChange={setSelectedCategories}                          
                            name="categories"                           
                        />                       
                    </div>
                    <div className="ml-12 mt-3 w-1/3">
                        <label>Enter a description for your game:</label>
                        <br/>
                        <textarea 
                            className="text-base mt-2 h-24 w-full"
                            value={formData.description}
                            onChange={handleChange}
                            name="description"   
                        />
                    </div>          
                </fieldset>  
                <div className="grid m-4 justify-items-center">                                             
                    <div className="w-full flex flex-wrap">
                        {imgsData && imgsData.map(imgData => {
                            return (
                                <UploadedImg 
                                key={imgData.id} 
                                imgId={imgData.id}                          
                                gameId={gameId}   
                                setImgsData={setImgsData}                           
                                {...imgData}    
                                />                             
                            );
                        })}
                    </div>  
                    <button
                        className="btn-create-game"                       
                        type="submit"
                    >Create Game! ({imgsData ? imgsData.length: 0} choices)</button>
                </div>
            </form>   
        </div>
                
    );
};