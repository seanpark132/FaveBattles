// Landing page for create game function, 2 options: images (upload images), youtube videos (youtube URL)

import { Link } from "react-router-dom";

export default function Create() {
	return (
		<div>
			<section className="flex justify-center items-center h-vh-nav">
				<Link className="create-landing-btn" to="/create-img">
					<h1 className="mb-4 px-4 text-2xl md:text-3xl xl:text-4xl">
						Create a game with Images
					</h1>
					<img
						className="hidden w-full h-5/12 md:block"
						src="/create-img-example.PNG"
						alt="image-choice"
					/>
				</Link>
				<Link className="create-landing-btn" to="/create-video">
					<h1 className="mb-4 px-4 text-2xl md:text-3xl xl:text-4xl">
						Create a game with Youtube Videos
					</h1>
					<img
						className="hidden w-full h-5/12 md:block"
						src="/create-video-example.PNG"
						alt="video-choice"
					/>
				</Link>
			</section>
		</div>
	);
}
