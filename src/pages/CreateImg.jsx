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

export default function CreateImg() {
    const FIRESTORE_COLLECTION_NAME = "all_games"

    const [inputtedImgs, setInputtedImgs] = useState([]);
    const [choicesData, setChoicesData] = useState(null);
    const [formData, setFormData] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);

    // create a new id for the game, or if game creation was in progress, restore saved id from local storage
    const storedGameId = localStorage.getItem('create-img-gameId');
    const gameId = storedGameId ? storedGameId : v4();
    localStorage.setItem('create-img-gameId', gameId);
    
    // handle upload image button, upload image(s) file to cloud, add new image data with URL to choicesData state
    async function uploadImage(event) {        
        if (inputtedImgs.length === 0 ) {
            alert("Please add a file first");
            return;
        };
                  
        for (const img of inputtedImgs) {
            const imgId = v4();                            
            const storageRef = ref(storage, `all_games/${gameId}/${imgId}`);         
            let uploaded = null;
            try {
                uploaded = await uploadBytes(storageRef, img);
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
            setChoicesData(prev => 
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

    // final "create game" button submit - initialize game object on firestore database
    async function handleSubmit(event) {
        if (choicesData.length < 4) {
            alert("The minimum game size is 4 choices. Make sure to have at least 4 choices.");
            return;
        };
        
        event.preventDefault();        
        let fullFormData = _.cloneDeep(formData);
        fullFormData.id = gameId;
        fullFormData.choices = choicesData;
        fullFormData.categories = selectedCategories;
        fullFormData.mainCategory = selectedCategories[0].label;
        fullFormData.numStarts = 0;
        fullFormData.numCompletes = 0;
        fullFormData.gameType = "image"
        localStorage.removeItem('create-img-gameId');
        localStorage.removeItem('create-img-choicesData');
        await setDoc(doc(db, FIRESTORE_COLLECTION_NAME, gameId), fullFormData);
        alert("Game created!");        
    };

    useEffect(() => {
        const storedChoicesData = localStorage.getItem('create-img-choicesData');            
        if (storedChoicesData !== null) {
            setChoicesData(JSON.parse(storedChoicesData));
        };
    }, []);

    useEffect(() => {
        if (choicesData !== null) {            
            localStorage.setItem('create-img-choicesData', JSON.stringify(choicesData));
        };   
    },[choicesData]);

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

    const uploadBtnSection = 
        <section className="m-0 grid">
            <input                
                type="file"     
                className="mt-1"                       
                accept="image/png, image/jpeg, image/jpg, image/webp"
                multiple={true}                                                     
                onChange={event => {setInputtedImgs(event.target.files)}}
                name="imgUpload"
            />                         
            <button type="button" className="btn-upload" onClick={uploadImage}>Upload Images</button>
            <p className="ml-2 mt-2"><em>Accepts .png, .jpg, .jpeg, .webp image types</em></p>
        </section>;

    return (
        <div>
            <Navbar />
            <form className="grid" onSubmit={handleSubmit}>
                <fieldset className="flex bg-teal-700">
                    <div className="m-4 w-1/3">
                        {uploadBtnSection}
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
                        {choicesData && choicesData.map(choiceData => {
                            return (
                                <UploadedImg 
                                key={choiceData.id} 
                                choiceId={choiceData.id}                          
                                gameId={gameId}   
                                setChoicesData={setChoicesData}                           
                                {...choiceData}    
                                />                             
                            );
                        })}
                    </div>  
                    <button
                        className="btn-create-game"                       
                        type="submit"
                    >Create Game! ({choicesData ? choicesData.length: 0} choices)</button>
                </div>
            </form>   
        </div>
                
    );
};