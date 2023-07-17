import { useState, useEffect } from "react";
import { storage, db, auth } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc} from "firebase/firestore";
import { v4 } from "uuid";
import { _ } from 'lodash';
import Select from 'react-select';
import Navbar from "../components/Navbar";
import UploadedImg from "../components/UploadedImg";

const CATEGORY_OPTIONS= [
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
const FIRESTORE_COLLECTION_NAME = "all_games"

export default function CreateImg() {    
    const [inputtedImgs, setInputtedImgs] = useState([]);
    const [choicesData, setChoicesData] = useState(null);
    const [formData, setFormData] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);

    if (!auth.currentUser) {
        return (
            <div>
                <Navbar/>
                <div className="p-8 flex flex-col text-center justify-center">
                    <h2>You are not signed in. To create games, you must be signed in.</h2> 
                    <h1><Link to="/sign-in" className="text-blue-400 underline underline-offset-2">Sign In Here</Link></h1>
                </div>
            </div>
        );
    };

    // create a new id for the game, or if game creation was in progress, restore saved id from local storage
    const storedGameId = localStorage.getItem('create-img-gameId');
    const gameId = storedGameId ? storedGameId : v4();
    localStorage.setItem('create-img-gameId', gameId);
    
    // handle upload image button, upload image(s) file to cloud, add new image data with URL to choicesData state
    async function uploadImage() {        
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
        event.preventDefault();  

        if (choicesData.length < 4) {
            alert("The minimum game size is 4 choices. Make sure to have at least 4 choices.");
            return;
        };
                
        let fullFormData = _.cloneDeep(formData);
        fullFormData.id = gameId;
        fullFormData.authorId = auth.currentUser.uid;
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

    const uploadBtnSection = 
        <section className="flex flex-col px-6 mb-6 max-w-xs">
            <h2 className="mb-4">Choose images to add</h2>
            <input                
                type="file"    
                className="w-fit file:bg-blue-800"                              
                accept="image/png, image/jpeg, image/jpg, image/webp"
                multiple={true}                                                     
                onChange={event => {setInputtedImgs(event.target.files)}}
                id="imgUpload"
            />                         
            <button 
                type="button" 
                className="mt-4 py-2 px-20 w-fit bg-blue-400 font-bold border-transparent rounded" 
                onClick={uploadImage}
            >Add Images
            </button>
            <p className="mt-2"><em>Accepts .png, .jpg, .jpeg, .webp types</em></p>
        </section>;

    return (
        <div className="w-screen">
            <Navbar />
            <form onSubmit={(e) => handleSubmit(e)}>
                <fieldset>
                    <div className="flex flex-col w-full md:flex-row">
                        <div className="flex flex-col p-6 md:w-1/2">                            
                            <label htmlFor="title">Game Title:</label>
                            <input                                     
                                type="text" 
                                className="mb-4 p-1"
                                value={formData.title}
                                onChange={(e) => handleChange(e)}
                                id="title"                                                       
                            />                                          
                            <label>Categories (First one will be the main one):</label>
                            <Select 
                                isMulti
                                options={CATEGORY_OPTIONS}                                    
                                className="text-black"                              
                                value={selectedCategories}     
                                onChange={setSelectedCategories}                          
                                id="categories"                           
                            />                       
                        </div>
                        <div className="p-6 md:w-1/2">
                            <label htmlFor="description">Enter a description for your game:</label>
                            <br/>
                            <textarea 
                                className="text-base mt-2 h-28 border-transparent rounded w-full p-2 md:h-24"
                                value={formData.description}
                                onChange={(e) => handleChange(e)}
                                id="description"   
                                
                            />
                        </div>
                    </div>
                    {uploadBtnSection}
                </fieldset>  
                <hr />
                <div className="flex flex-col w-full items-center px-6 mt-8">                                             
                    <div className="create-img-choice-container">
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
                        className="m-6 py-4 px-8 w-fit border-transparent rounded bg-green-600 text-2xl font-bold md:text-3xl"                         
                        type="submit"
                    >Create Game! ({choicesData ? choicesData.length: 0} choices)
                    </button>
                </div>
            </form>   
        </div>
                
    );
};