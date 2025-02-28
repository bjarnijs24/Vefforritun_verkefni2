//Vika 5 [20:00] vídjóHarpa

//The URL to which we will send the request
const API_URL = "http://localhost:3000/api/v1/game-state";

let lost = false
let user_sequence = [];
document.getElementById("pad-red").disabled = true;
document.getElementById("pad-yellow").disabled = true;
document.getElementById("pad-green").disabled = true;
document.getElementById("pad-blue").disabled = true;

const startUpReset = async () => {
    try {
        let response = await axios.put(API_URL);

        let gameHighScore = response.data.gameState.highScore       
        document.getElementById("high-score").textContent = gameHighScore

        let level = response.data.gameState.level
        document.getElementById("level-indicator").textContent = level

    } catch (error) {
    //When unsuccessful, print the error.
    console.log(error);
    }
};


const modal = document.getElementById("failure-modal");

const showModal = () => {
    modal.style.display = "block";
}

const hideModal = () => {
    modal.style.display = "none"
}

const putGameState = async () => {
    //Perform a GET request to the url
    try {
        lost = false
        hideModal();
        document.getElementById("start-btn").disabled = true;
        document.getElementById("replay-btn").disabled = false;
        document.getElementById("pad-red").disabled = false;
        document.getElementById("pad-yellow").disabled = false;
        document.getElementById("pad-green").disabled = false;
        document.getElementById("pad-blue").disabled = false;

        response = await axios.put(API_URL);
        //When successful, print the received data
        console.log("Success: ", response.data);

        //   Update hi score:
        gameHighScore = response.data.gameState.highScore       
        document.getElementById("high-score").textContent = gameHighScore
      
        //   update level:
        level = response.data.gameState.level
        document.getElementById("level-indicator").textContent = level
        
        // Get and play sequence:
        new_sequence = response.data.gameState.sequence
        playSequence(new_sequence)
        console.log(new_sequence)

    } catch (error) {
      //When unsuccessful, print the error.
      console.log(error);
    }
    // This code is always executed, independent of whether the request succeeds or fails.
};


// Play for user:
const playSequence = (seq) => {
    seq.forEach((element, index) => {
        setTimeout(() => {
            if (element === "red") {
                synth.triggerAttackRelease("c4", "4n");
            } if (element === "yellow") {
                synth.triggerAttackRelease("d4", "4n");
            } if (element === "green") {
                synth.triggerAttackRelease("e4", "4n");
            } if (element === "blue") {
                synth.triggerAttackRelease("f4", "4n");
            }
        }, index * 1000);
    });
};



// replay:
const replaySequence = () => {
    playSequence(new_sequence);
};

const testSequence = async (user_seq) => {
    // const player_sequence = ["red", "green"]
   
    console.log('Sending data:', { sequence: user_seq });
    try {
        response = await axios.post(API_URL + '/sequence', { 
            sequence: user_seq
        });
    } catch (error) {
        console.log("Error cause shits gone wrong:", error);
        showModal();
        lost = true
    }

    // tæma notendalistann aftur:
    user_sequence = [];

    if (lost !== true) {
    //   Update hi score:
    gameHighScore = response.data.gameState.highScore       
    document.getElementById("high-score").textContent = gameHighScore
      
    //   update level:
    level = response.data.gameState.level
    document.getElementById("level-indicator").textContent = level

    // Get and play sequence:
    new_sequence = response.data.gameState.sequence;
    console.log('New sequence:', response.data.gameState.sequence);
    playSequence(new_sequence);

    }
};



//We initialise the synthesiser with sine wave as default
const synth = new Tone.Synth({ 
    oscillator: { type: "sine" }
    }).toDestination();

// Breyta hljóðinu eftir oscillator:
const soundSelector = document.getElementById("sound-select");

soundSelector.addEventListener("change", (event) => { 
    let selectedSound = event.target.value;
    synth.set({ 
        oscillator: { type: selectedSound } 
    });
});

// // Hér verður fallið fyrir hljóðið frá database:
// const playTune = () => {
//     //initialise a timer to decide when to play individual notes
//     const now = Tone.now();
//     //Play a C4 as an 8th note
//     synth.triggerAttackRelease("c4", "8n", now);
//     //Play a F#4 as a 4th note, after half a second
//     synth.triggerAttackRelease("f#4", "4n", now + 0.5);
//     //Play a D#4 as a half note after 1 second
//     synth.triggerAttackRelease("d#4", "2n", now + 1);
// };

const playRed = () => {
    synth.triggerAttackRelease("c4", "4n");
    user_sequence.push("red");
    console.log(user_sequence)
    if (user_sequence.length === new_sequence.length) {
        testSequence(user_sequence)
    }
};
const playYellow = () => {
    synth.triggerAttackRelease("d4", "4n");
    user_sequence.push("yellow");
    console.log(user_sequence)
    if (user_sequence.length === new_sequence.length) {
        testSequence(user_sequence)
    }
};
const playGreen = () => {
    synth.triggerAttackRelease("e4", "4n");
    user_sequence.push("green");
    console.log(user_sequence)
    if (user_sequence.length === new_sequence.length) {
        testSequence(user_sequence)
    }
};
const playBlue = () => {
    synth.triggerAttackRelease("f4", "4n");
    user_sequence.push("blue")
    console.log(user_sequence)
    if (user_sequence.length === new_sequence.length) {
        testSequence(user_sequence)
    }
};

// KeyboardListener:
document.addEventListener("keydown", (event) => {
    if (event.key === 'q') {
        playRed();
    }
    if (event.key === 'w') {
        playYellow();
    }
    if (event.key === 'a') {
        playGreen();
    }
    if (event.key === 's') {
        playBlue();
    }
});

// Reset all on startup:
document.addEventListener("DOMContentLoaded", () => {
    startUpReset();
});