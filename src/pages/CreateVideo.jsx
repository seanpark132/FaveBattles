import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc} from "firebase/firestore";
import { v4 } from "uuid";
import { _ } from 'lodash';
import Select from 'react-select';
import Navbar from "../components/Navbar";
import UploadedVideo from "../components/UploadedVideo";

export default function CreateVideo() {
    const FIRESTORE_COLLECTION_NAME = "all_games"

    const [inputUrl, setInputUrl] = useState("");
    const [inputTime, setInputTime] = useState("0:00");   
    const [choicesData, setChoicesData] = useState(null);  
    const [formData, setFormData] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);

    // create a new id for the game, or if game creation was in progress, restore saved id from local storage
    const storedGameId = localStorage.getItem('create-video-gameId');
    const gameId = storedGameId ? storedGameId : v4();
    localStorage.setItem('create-video-GameId', gameId);    

    function convertInputTimeToSeconds(timeString) {
        const splitTimeArray = timeString.split(":");
        if (splitTimeArray.length === 3) {
            const hours = parseInt(splitTimeArray[0]);
            const minutes = parseInt(splitTimeArray[1]);
            const seconds = parseInt(splitTimeArray[2]);
            return (hours * 60 * 60 ) + (minutes * 60) + seconds;
        }

        if (splitTimeArray.length === 2) {
            const minutes = parseInt(splitTimeArray[0]);
            const seconds = parseInt(splitTimeArray[1]);
            return (minutes * 60) + seconds;
        }     
        return parseInt(timeString);
    };

    async function handleAddVideo(event) {
        const trimmedUrl = inputUrl.trim()
        if (trimmedUrl.length !== 43) {
            alert("Please enter a valid Youtube URL of the form:\nhttps://www.youtube.com/watch?v=9bZkp7q19f0")
            return;
        };

        const startTime = convertInputTimeToSeconds(inputTime); 
        if (isNaN(startTime)) {
            alert("Please enter a valid start time.")
            return;
        };

        const youtubeID = inputUrl.slice(32);   
        const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeID}?start=${startTime}?origin=https://favebattles.netlify.app`;
        const thumbnailUrl = `https://img.youtube.com/vi/${youtubeID}/0.jpg`;        
        const choiceId = v4();
        const res = await (await fetch(`https://noembed.com/embed?dataType=json&url=${inputUrl}`)).json();
        const youtubeTitle = res.title;

        setChoicesData(prev => 
            prev ? 
            [...prev, 
                {   
                    id: choiceId,
                    thumbnailUrl: thumbnailUrl, 
                    embedUrl: embedUrl,
                    name: youtubeTitle,               
                    numWins: 0,
                    numGames: 0,
                    numFirst: 0                
                }
            ]
            :[
                {   
                    id: choiceId,
                    thumbnailUrl: thumbnailUrl, 
                    embedUrl: embedUrl,
                    name: youtubeTitle,               
                    numWins: 0,
                    numGames: 0,
                    numFirst: 0        
                }
            ]
        );
        alert("Video added!");
        setInputUrl("")
        setInputTime("0:00")
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
        fullFormData.choices = choicesData;
        fullFormData.categories = selectedCategories;
        fullFormData.mainCategory = selectedCategories[0].label;
        fullFormData.numStarts = 0;
        fullFormData.numCompletes = 0;
        fullFormData.gameType = "video-youtube"
        localStorage.removeItem('create-video-gameId');
        localStorage.removeItem('create-video-choicesData');
        await setDoc(doc(db, FIRESTORE_COLLECTION_NAME, gameId), fullFormData);
        alert("Game created!");        

    };

    useEffect(() => {
        const storedChoicesData = localStorage.getItem('create-video-choicesData');            
        if (storedChoicesData !== null) {
            setChoicesData(JSON.parse(storedChoicesData));
        };
    }, []);

    useEffect(() => {
        if (choicesData !== null) {            
            localStorage.setItem('create-video-choicesData', JSON.stringify(choicesData));
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

    const addVideoSection = 
        <section className="my-1">              
            <p>Copy the URL for each Youtube video, paste it below, and click Add Video.</p>
            <p>example: <em> https://www.youtube.com/watch?v=9bZkp7q19f0 </em></p>
            <label htmlFor="inputLink">Youtube URL:</label>
            <input 
                type="text"
                className="ml-4 mt-2 p-2 w-3/4 rounded"
                value={inputUrl}
                onChange={(event) => setInputUrl(event.target.value)}
                name="inputLink"               
            />
            <div className="flex my-3">
                <label htmlFor="inputTime">Start time (optional): </label>
                <input
                    type="text"
                    className="ml-2 h-fit w-20 px-2 py-2 rounded"
                    value={inputTime}
                    onChange={(event) => setInputTime(event.target.value)}
                    name="inputTime"
                />
                <button type="button" className="btn-video-add" onClick={handleAddVideo}>Add Video</button>
            </div>            
        </section>

    return (
        <div>
            <Navbar />
            <form className="grid" onSubmit={handleSubmit}>
                <fieldset className="flex bg-teal-700">
                    <div className="m-4 w-1/3">
                        {addVideoSection}
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
                <div className="grid justify-items-center">                                             
                    <div className="w-full flex flex-wrap">
                        {choicesData && choicesData.map(choiceData => {
                            return (
                                <UploadedVideo
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