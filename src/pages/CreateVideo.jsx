import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, setDoc} from "firebase/firestore";
import { v4 } from "uuid";
import { _ } from 'lodash';
import { Link } from "react-router-dom";
import Select from 'react-select';
import Navbar from "../components/Navbar";
import CreateVideoChoiceBox from "../components/CreateVideoChoiceBox";

const FIRESTORE_COLLECTION_NAME = "all_games"
const CATEGORY_OPTIONS = [
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

export default function CreateVideo() {
    const [inputUrl, setInputUrl] = useState("");
    const [inputTime, setInputTime] = useState("");   
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
    const storedGameId = localStorage.getItem('create-video-gameId');
    const gameId = storedGameId ? storedGameId : v4();
    localStorage.setItem('create-video-GameId', gameId);    

    function convertInputTimeToSeconds(timeString) {
        if (timeString.length === 0) {
            return 0;
        }
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

    async function handleAddVideo() {
        const trimmedUrl = inputUrl.trim()
        if (trimmedUrl.length < 43) {
            alert("Please enter a valid Youtube URL of the form:\nhttps://www.youtube.com/watch?v=9bZkp7q19f0")
            return;
        };

        const startTime = convertInputTimeToSeconds(inputTime); 
        if (isNaN(startTime)) {
            alert("Please enter a valid start time.")
            return;
        };

        const youtubeId = trimmedUrl.slice(32, 43);        
        const actualUrl = `https://www.youtube.com/watch?v=${youtubeId}`
        const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?start=${startTime}?origin=https://favebattles.netlify.app`;
        const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;        
        const choiceId = v4();
        const res = await (await fetch(`https://noembed.com/embed?dataType=json&url=${actualUrl}`)).json();
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
        setInputTime("")
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

    const addVideoSection = 
        <section className="flex flex-col px-6 mb-6 max-w-4xl">              
            <h2 className="mb-2">Add Youtube Videos by pasting their links below</h2>          
            <label htmlFor="inputLink">Full Youtube Link:</label>
            <input 
                type="text"
                className="my-2 p-2"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                id="inputLink"               
            />       
            <label htmlFor="inputTime">Start time (optional): </label>
            <input
                type="text"
                className="my-2 w-24 p-2"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                id="inputTime"
            />              
            <button type="button" className="mt-2 p-2 border-transparent rounded bg-blue-800" onClick={handleAddVideo}>Add Video</button>         
        </section>

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
                                className="mb-4 p-2"
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
                                className="text-base h-28 border-transparent rounded w-full p-2"
                                value={formData.description}
                                onChange={(e) => handleChange(e)}
                                id="description"                                   
                            />
                        </div>      
                    </div>                                     
                    {addVideoSection}                                      
                </fieldset>  
                <hr />                    
                <div className="flex flex-col items-center px-6 mt-8 w-full">                                             
                    <div className="create-video-choice-container ">
                        {choicesData && choicesData.map(choiceData => {
                            return (
                                <CreateVideoChoiceBox
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
                        className="m-6 py-4 px-8 w-fit border-transparent rounded bg-green-600 text-2xl md:text-3xl"                       
                        type="submit"
                    >Create Game! ({choicesData ? choicesData.length: 0} choices)</button>
                </div>
                
            </form>   
        </div>                
    );
};