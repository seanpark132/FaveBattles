import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, setDoc} from "firebase/firestore";
import { v4 } from "uuid";
import { _ } from 'lodash';
import { FIRESTORE_COLLECTION_NAME } from "../utils/global_consts"
import Navbar from "../components/Navbar";
import CreateImgChoiceBox from "../components/CreateImgChoiceBox";
import AddGameDetails from "../components/AddGameDetails";
import AddNewImage from "../components/AddNewImage";

export default function CreateImg() {
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

    // final "create game" button submit - initialize game object on firestore database
    async function handleSubmit(event) {
        event.preventDefault();  

        if (choicesData.length < 4) {
            alert("The minimum game size is 4 choices. Make sure to have at least 4 choices.");
            return;
        };

        if (selectedCategories.length === 0) {
            alert("Please select at least 1 category");
            return;
        };    

        localStorage.removeItem('create-img-gameId');
        localStorage.removeItem('create-img-choicesData');
  
        const fullFormData = {
            ...formData,
            id: gameId,
            creatorId: auth.currentUser.uid,
            choices: choicesData,
            categories: selectedCategories,
            mainCategory: selectedCategories[0]?.label,
            numStarts: 0,
            numCompletes: 0,
            gameType: "image",
        };  
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

    return (
        <div className="w-screen">
            <Navbar />
            <form onSubmit={(e) => handleSubmit(e)}>
                <fieldset>
                    <AddGameDetails 
                        formData={formData}
                        setFormData={setFormData}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                    />
                    <AddNewImage gameId={gameId} setChoicesData={setChoicesData} />
                </fieldset>  
                <hr />
                <div className="flex flex-col w-full items-center px-6 mt-8">                                             
                    <div className="create-img-choice-container">
                        {choicesData && choicesData.map(choiceData => {
                            return (
                                <CreateImgChoiceBox 
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
                    >Create Game! ({choicesData ? choicesData.length: 0} choices)
                    </button>
                </div>
            </form>   
        </div>
                
    );
};