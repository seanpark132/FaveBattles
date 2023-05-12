import { useState, useEffect } from "react"
import { storage, db } from "../firebaseConfig"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { doc, setDoc} from "firebase/firestore"
import { v4 } from "uuid"
import { _ } from 'lodash'
import Select from 'react-select'
import "../css/Create.css"
import Navbar from "../components/Navbar"
import UploadedImg from "../components/UploadedImg"

export default function Create() {
    const [inputtedImgs, setInputtedImgs] = useState(null)
    const [imgsData, setImgsData] = useState([])
    const [formData, setFormData] = useState({})
    const [selectedCategories, setSelectedCategories] = useState([])

    const storedUid = localStorage.getItem('create-uid')
    const uid = storedUid ? storedUid : v4()
    localStorage.setItem('create-uid', uid)     
        
    async function uploadImage(event) {        
        if (inputtedImgs == null) {
            alert("Please add a file first")
            return
        }       
                  
        for (const img of inputtedImgs) {
            const id = v4()
            const fullName = img.name + id
            const imageRef = ref(storage, `all_games/${uid}/${fullName}`)  

            let uploaded = null
            try {
                uploaded = await uploadBytes(imageRef, img)
            } catch (error) {
                alert("Image could not be uploaded")
                return
            }        
            
            let imgURL = null
            try {
                imgURL = await getDownloadURL(uploaded.ref)  
            } catch (error) {
                alert("Image uploaded, but could not access download URL")
                return
            }
                       
            const defaultName = (img.name.charAt(0).toUpperCase() + img.name.slice(1)).slice(0, img.name.length-4)   
            setImgsData(prev => 
                [...prev, 
                    {   
                        id: id,
                        url:imgURL, 
                        name:defaultName,
                        fullName:fullName,
                        numWins: 0,
                        numGames: 0,
                        numFirst: 0,
                        winPercent: 0,
                        firstPercent: 0
                    }
                ]
            )  
        }                
        alert("Image(s) uploaded")
        setInputtedImgs(null)
    }

    function handleChange(event) {       
        const {name, value} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }

    async function handleSubmit(event) {
        event.preventDefault()        
        let fullFormData = _.cloneDeep(formData)
        fullFormData.id = uid
        fullFormData.choices = imgsData
        fullFormData.categories = selectedCategories
        fullFormData.mainCategory = selectedCategories[0].label
        fullFormData.numPlays = 0 
        localStorage.removeItem('create-uid')
        localStorage.removeItem('create-imgsData')
        await setDoc(doc(db, "all_games", uid), fullFormData)
        alert("Game created!")
        
    }

    useEffect(() => {
        const storedImgsData = localStorage.getItem('create-imgsData')            
        if (storedImgsData !== null) {
            setImgsData(JSON.parse(storedImgsData))
        }
    }, [])

    useEffect(() => {
        if (imgsData.length !== 0) {            
            localStorage.setItem('create-imgsData', JSON.stringify(imgsData))
        }   
    },[imgsData])

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
    ]

    return (
        <div>
            <Navbar />
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <div className="upload-container">
                        <input                
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            multiple={true}                                                     
                            onChange={event => {setInputtedImgs(event.target.files)}}
                            name="imgUpload"
                        />                         
                        <button type="button" className="btn-upload" onClick={uploadImage}>Upload Images</button>
                    </div>   
                    <div className="input-title-category-container">                            
                        <label>Game Title:</label>
                        <input                                     
                            type="text" 
                            className="input-title"
                            value={formData.title}
                            onChange={handleChange}
                            name="title"                                    
                        />                                          
                        <label>Categories (First category will be the main one):</label>
                        <Select 
                            isMulti
                            options={categoryOptions}                                    
                            className="select-categories"                              
                            value={selectedCategories}     
                            onChange={setSelectedCategories}                          
                            name="categories"                           
                        />                       
                    </div>
                    <div className="description-container">
                        <label>Enter a description for your game:</label>
                        <br/>
                        <textarea 
                            className="textarea-description"
                            value={formData.description}
                            onChange={handleChange}
                            name="description"   
                        />
                    </div>          
                </fieldset>  
                <div className="create-container">                                             
                    <div className="uploaded-container">
                        {imgsData.map(imgData => {
                            return (
                                <UploadedImg 
                                key={imgData.id} 
                                id={imgData.id}                          
                                uid={uid}   
                                setImgsData={setImgsData}                           
                                {...imgData}    
                                />                             
                            )
                        })}
                    </div>  
                    <button
                        className="btn-create-game"                       
                        type="submit"
                    >Create Game! ({imgsData.length} choices)</button>
                </div>
            </form>   
        </div>
                
    )
}