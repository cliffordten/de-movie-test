import axios from "axios";

const request = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

const actorsUrl =
  "/person/popular?api_key=a2f7de1a4da4393a6721d045a1ff9e63&language=en-US&page=";
const moviesUrl =
  "/movie/popular?api_key=a2f7de1a4da4393a6721d045a1ff9e63&language=en-US&page=";

const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

export const getActor = async (
  page: number = generateRandomNumber(1, 50)
): Promise<any> => {
  try {
    const actors = await request.get(`${actorsUrl}${page}`);

    if (!actors.data) {
      throw new Error("Error Fetching Actors");
    }
    const actor = actors.data?.results[0];

    return {
      actor,
      movie: actor?.known_for[0],
    };
  } catch (error) {
    console.log(
      "%getActor line:15 error",
      "color: #007acc;",
      error.message,
      error.code
    );
  }
};

export const getMovie = async (
  page: number = generateRandomNumber(1, 50),
  query: String = ""
): Promise<any> => {
  try {
    const movie = await request.get(`${moviesUrl}${page}${query}`);

    if (!movie.data) {
      throw new Error("Error Fetching Movie");
    }

    if (query.length > 1) {
      return movie.data.results;
    }

    return movie.data.results[0];
  } catch (error) {
    console.log(
      "%getActor line:15 error",
      "color: #007acc;",
      error.message,
      error.code
    );
  }
};

export const getGameInfo = async (): Promise<any> => {
  try {
    const actor = await getActor();
    const movie = await getMovie();

    // return actor and movie with correct answer for odds random number
    if (generateRandomNumber(1, 2) == 1) {
      console.log("%cquiz.ts line:74 actor", "color: #007acc;", actor);
      return { ...actor, correctAnswer: true, even: false };
    }

    // for evens random number check if actor played in the
    const actorMovies = await getMovie(1, `&with_people=${actor.actor.id}`); // get movies where actor featured
    const foundMovie = actorMovies.find((item: any) => item.id == movie.id);

    return {
      ...actor,
      movie,
      correctAnswer: !!foundMovie,
      even: true,
    };
  } catch (error) {
    console.log(
      "%getActor line:15 error",
      "color: #007acc;",
      error.message,
      error.code
    );
  }
};
