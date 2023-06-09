// Landing page for create game function, 2 options: images (upload images), youtube videos (youtube URL)

import Navbar from "../components/Navbar";

export default function Create() {

    return (
        <div>
            <Navbar />
            <section className="flex justify-center mt-16">                
                    <a className="create-landing-choose-btn" href="/create-img">
                        <h1 className="create-landing-title">Create a game with Images</h1>
                        <img className="w-full h-5/12" src="/create-img-example.PNG" alt="image-choice" />
                    </a>                     
                    <a className="create-landing-choose-btn"href="/create-video">
                        <h1 className="create-landing-title">Create a game with Youtube Videos</h1>
                        <img className="w-full h-5/12" src="/create-video-example.PNG" alt="video-choice" />
                    </a>
              
            </section>
        </div>         
                
    );
};