import { Link } from "react-router-dom";
import {
  GOOGLE_CLOUD_STORAGE_BASE_URL,
  ORIGINAL_BUCKET_NAME,
} from "../utils/global_consts";

export default function Create() {
  return (
    <main>
      <section className="flex h-vh-nav items-center justify-center">
        <Link className="create-landing-btn" to="/create-img">
          <h1 className="mb-4 px-4 text-2xl md:text-3xl xl:text-4xl">
            Create a game with Images
          </h1>
          <img
            className="h-5/12 hidden w-full md:block"
            src={`${GOOGLE_CLOUD_STORAGE_BASE_URL}/${ORIGINAL_BUCKET_NAME}/website_images/create-img-example.webp`}
            alt="image-choice"
          />
        </Link>
        <Link className="create-landing-btn" to="/create-video">
          <h1 className="mb-4 px-4 text-2xl md:text-3xl xl:text-4xl">
            Create a game with Youtube Videos
          </h1>
          <img
            className="h-5/12 hidden w-full md:block"
            src={`${GOOGLE_CLOUD_STORAGE_BASE_URL}/${ORIGINAL_BUCKET_NAME}/website_images/create-video-example.webp`}
            alt="video-choice"
          />
        </Link>
      </section>
    </main>
  );
}
