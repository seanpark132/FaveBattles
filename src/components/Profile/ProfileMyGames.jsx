import DisplayGameBox from "../DisplayGameBox";
import { useUser } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getMyGames } from "../../api/getMyGames";

export default function ProfileMyGames() {
  const user = useUser();

  const myGamesQuery = useQuery({
    queryKey: ["myGames"],
    queryFn: () => getMyGames(user.uid),
  });

  if (myGamesQuery.isLoading) {
    return <h1 className="m-6">Loading...</h1>;
  }
  if (myGamesQuery.isError) {
    return (
      <h1 className="m-6">
        An error has occurred. Please try refreshing the page.
      </h1>
    );
  }
  return (
    <section className="flex flex-col">
      <h1 className="px-6">My Games</h1>
      <div className="home-box-container">
        {myGamesQuery.data.length === 0 ? (
          <h2>You have not created any games yet.</h2>
        ) : (
          myGamesQuery.data.map((gameData) => (
            <DisplayGameBox
              key={gameData.id}
              type="profile"
              gameData={gameData}
            />
          ))
        )}
      </div>
    </section>
  );
}
