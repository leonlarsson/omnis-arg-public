import { Environment, Route } from "./types";
import handleCORSPreflight from "./utils/handleCORSPreflight";
import checkRatelimit from "./utils/checkRatelimit";

const notCorrectResponses = ["Not correct.", "Nope.", "Try again.", "Better luck next time."];

const routes: Route[] = [
    {
        stage: 1,
        pathname: "/check/part1-62cc0e08-a230-43e0-a7d2-4d1fd14af939",
        correctAnswers: ["vltava river"],
        correctResponse: "Task completed. Press <a href='./part2-d40d2703-e230-4786-a366-6f6e2828794b'>here</a> to progress.",
        notCorrectResponses
    },
    {
        stage: 2,
        pathname: "/check/part2-d40d2703-e230-4786-a366-6f6e2828794b",
        correctAnswers: ["goliath"],
        correctResponse: "Biblical reference master! Press <a href='../part3-9c615232-e6d8-46a1-ad42-c03ae9fc9703'>here</a> to progress.",
        notCorrectResponses
    },
    {
        stage: 3,
        pathname: "/check/part3-9c615232-e6d8-46a1-ad42-c03ae9fc9703",
        correctAnswers: ["my name is edvin and i have been living in the massive bunker under prague for the last 5 years."],
        correctResponse: "I'm impressed. Press <a href='../part4-61be5a2e-b8d0-47bf-8c92-f6b14f9f2ae7'>here</a> to progress.",
        notCorrectResponses
    },
    {
        stage: 4,
        pathname: "/check/part4-61be5a2e-b8d0-47bf-8c92-f6b14f9f2ae7",
        correctAnswers: ["an echo", "echo"],
        correctResponse: "An echo indeed. Press <a href='../part5-8eb95950-e1f2-43b1-86f7-5bdbacfbbaaf'>here</a> to progress.",
        notCorrectResponses
    },
    {
        stage: 5,
        pathname: "/check/part5-8eb95950-e1f2-43b1-86f7-5bdbacfbbaaf",
        correctAnswers: ["abfsrengh (1922)", "abfsrengh zbivr (1922)", "abfsrengh 1922", "abfsrengh zbivr 1922", "abfsrengh - 1922", "1922 abfsrengh", "(1922) abfsrengh", "abfsrengh gur zbivr", "gur zbivr abfsrengh"],
        // "nosferatu (1922)", "nosferatu movie (1922)", "nosferatu 1922", "nosferatu movie 1922", "nosferatu - 1922", "1922 nosferatu", "(1922) nosferatu", "nosferatu the movie", "the movie nosferatu"
        correctResponse: "Of course. Press <a href='../part6-cabbe8cf-cb8f-4301-9b97-9f007ac9f326'>here</a> to progress.",
        notCorrectResponses
    },
    {
        stage: 6,
        pathname: "/check/part6-cabbe8cf-cb8f-4301-9b97-9f007ac9f326",
        correctAnswers: ["vbe ccflt vmk dramyxs"],
        correctResponse: "Correct! Press <a href='../part7-07c84e24-8e47-445e-a8f5-aead7bbf3e22'>here</a> to progress.",
        notCorrectResponses
    },
    {
        stage: 7,
        pathname: "/check/part7-07c84e24-8e47-445e-a8f5-aead7bbf3e22",
        correctAnswers: ["hans christoff von königsmarck", "hans christoph von königsmarck", "hans christoff königsmarck"],
        correctResponse: "True historian! Press <a href='../part8-87dee686-1a6f-413a-8d35-ffc3966af79a'>here</a> to progress.",
        notCorrectResponses: ["Nope.", "Try again.", "Never heard of this person."]
    },
    {
        stage: 8,
        pathname: "/check/part8-87dee686-1a6f-413a-8d35-ffc3966af79a",
        correctAnswers: ["jraprfynf xevm", "jraprfynf xříž"],
        // "wenceslas kriz", "wenceslas kříž"
        correctResponse: "Obviously... Press <a href='../part9-5576535d-d238-4f17-8f8f-84fa6d2637a6'>here</a> to progress.",
        notCorrectResponses
    },
    {
        stage: 9,
        pathname: "/check/part9-5576535d-d238-4f17-8f8f-84fa6d2637a6",
        correctAnswers: ["hořící kostel", "horici kostel"],
        correctResponse: "You're on fire! Press <a href='../part10-0d630934-40e1-4e03-a64d-a8fd05a4bd4d'>here</a> to progress.",
        notCorrectResponses
    },
    {
        stage: 10,
        pathname: "/check/part10-0d630934-40e1-4e03-a64d-a8fd05a4bd4d",
        correctAnswers: ["wnahf"],
        // "janus" ROT13
        correctResponse: "Tread carefully: vfgxk://taeuk.uxr/lvalsHMuW2W8uJMC8",
        notCorrectResponses
    }
];

let headers: HeadersInit = { "Access-Control-Allow-Origin": "*" };

export default {
    async fetch(request: Request, env: Environment): Promise<Response> {

        // Handle CORS preflight
        if (request.method === "OPTIONS") return handleCORSPreflight(request);
        // Deny any non-POST requests
        if (request.method !== "POST") return notAllowed();

        const url = new URL(request.url);

        // CHECKING ANSWERS: If request is to one of the routes
        if (routes.map(route => route.pathname).includes(url.pathname)) {

            const isRatelimited = await checkRatelimit(request, env);
            if (isRatelimited) return ratelimited();

            const route = routes.find(route => route.pathname === url.pathname);
            const userAnswer = await request.text();

            // Handle extra clues
            if (route.stage === 2 && userAnswer.toLowerCase() === "shielded by faith") return correct("Philistine is something else.");
            if (route.stage === 8 && ["bétlémská", "betlémská", "betlemska"].includes(userAnswer.toLowerCase())) return correct("⬆ wxsaht oonwxscs nhlwhloly");
            if (route.stage === 10 && ["vera", "decay"].includes(userAnswer.toLowerCase())) return correct("gnp.TKFNWYF638/2hsats/");

            const answerIsCorrect: boolean = route.correctAnswers.includes(userAnswer.toLowerCase());

            // On stage 10, add clue in return headers
            if (route.stage === 10) headers = { ...headers, "Omnis-Communication": "Key + 19.8.1 === k_vbfrt || glnmtorxpfskzngchzrohagedcwphaidvipkrjm3" };

            // Handle response
            return answerIsCorrect ? correct(route.correctResponse) : notCorrect(route.notCorrectResponses);
        };

        // Catch anything else
        return notAllowed();
    }
};

const correct = (text: string): Response => new Response(text, { headers });
const notCorrect = (notCorrectResponses: string[]): Response => new Response(notCorrectResponses[Math.floor(Math.random() * notCorrectResponses.length)], { headers });
const notAllowed = (): Response => new Response("Not allowed.", { status: 403, headers });
const ratelimited = (): Response => new Response("Please slow down.", { headers });