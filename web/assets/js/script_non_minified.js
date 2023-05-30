// Obfuscate with https://obfuscator.io/ before shipping in script.js - or just ship this file instead

const subtitle = document.getElementById("subtitle");
const input = document.getElementById("textInput");
const button = document.getElementById("submitButton");
const response = document.getElementById("response");

// Replace with your API URL
const apiBase = "https://omnis-arg-api.ragnarok.workers.dev";
const errorMessage = "Oh no, an error.";

export const fetchAPI = async apiPath => {
    const inputValue = input.value.trim();
    if (!inputValue) return response.innerHTML = "Blank text is not the answer.";

    // Disable input and button while fetching. Enable and focus input in the finally
    input.disabled = true;
    button.disabled = true;

    try {
        const res = await fetch(apiBase + "/check" + apiPath, { method: "POST", body: inputValue });
        response.innerHTML = res.ok ? await res.text() : errorMessage;
    } catch (error) {
        response.innerHTML = errorMessage;
    } finally {

        // Wait before allowing user to submit again
        let secondsLeft = 4;
        button.textContent = `Please wait ${secondsLeft}s...`;
        const interval = setInterval(() => {
            secondsLeft--;
            button.textContent = `Please wait ${secondsLeft}s...`;
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
            button.textContent = location.pathname.includes("fa6d") ? "KFBEPllutt-wffct-qvvjsqfmw" : "Submit";
            input.disabled = false;
            button.disabled = false;
            input.focus();
        }, 4000);
    };
};

// When <iframe> has name="bh-iframe", use a transparent background
if (window.name === "bh-iframe") document.body.classList.add("in-iframe");

// This used to connect to a DB of all attempts and is what used to drive the "Total x attempts". Optional, but cool to have :)
// Fetch API to get total amount of attempts
// (async () => {
//     const res = await fetch(apiBase + "/attempts/count");
//     if (res.ok) {
//         const totalAttempts = await res.json();
//         subtitle.innerText = `${totalAttempts.toLocaleString("en")} total attempts have been made`;
//     } else {
//         subtitle.innerText = "";
//     };
// })();