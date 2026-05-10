let sentenceInput = document.getElementById("phrase-input");
let bestSentenceP = document.getElementById("best-sentence");
let sentencesP = document.getElementById("other-sentences");
let genIndicator = document.getElementById("gen-indicator");

let genSizeINP = document.getElementById("gen-size")
let mutRateINP = document.getElementById("mut-rate")
let mutChanceINP = document.getElementById("mut-chance")
let repeatINP = document.getElementById("auto-gen")
let lengthWeightINP = document.getElementById("length-weight")

let genNum = 0;
let sentences = [];
let bestSentence = "";

let sentenceToMatch = "To be or not to be...";

let sampleSize = 10000;
let mutRate = 1;
let mutChance = 1;
let lengthWeight = 100;
let repeat = false;

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function getRandomLetter() {
    let letterNum = 32 + Math.floor(Math.random() * 94);
    let letter = String.fromCharCode(letterNum);
    return letter;
}

function getBest() {
    let best = {
        score: -100,
        index: 0,
    }
    let best2 = {
        score: -100,
        index: 1,
    }
    for (let i=0; i<sentences.length; i++) {
        let score = 0;
        let sentence = sentences[i];
        let lengthDiff = Math.abs(sentence.length - sentenceToMatch.length);
        score -= lengthDiff * lengthWeight/100;
        let iterationLength = Math.min(sentence.length, sentenceToMatch.length);
        for (let j=0; j<iterationLength; j++) {
            if (sentence[j] === sentenceToMatch[j]) {
                score += 1;
            }
        }
        if (score > best.score) {
            let previousBestScore = best.score;
            let previousBestIndex = best.index;

            best.score = score;
            best.index = i;

            best2.score = previousBestScore;
            best2.index = previousBestIndex;
        } else if (score > best2.score) {
            best2.score = score;
            best2.index = i;
        }
    }
    return [sentences[best.index], sentences[best2.index]]
}

function onSentenceEntered() {
    if (sentenceInput.value !== "") {
        sentenceToMatch = sentenceInput.value;
        genNum = 0;
        genIndicator.textContent = "Generation " + genNum;
    }
}

function generate() {
    if (bestSentence === sentenceToMatch) {return;}
    repeat = repeatINP.checked
    mutChance = Math.round(mutChanceINP.value/100);
    mutRate = mutRateINP.value;
    sampleSize = genSizeINP.value;
    lengthWeight = lengthWeightINP.value
    sentences = [];
    if (genNum > 0) {
        for (let i=0; i<sampleSize; i++) {
            for (let j=0; j<mutRate; j++) {
                let newSentence = bestSentence;

                let changeLength = Math.floor(Math.random() * 100) < 25 * mutChance;
                let changeLetter = Math.floor(Math.random() * 100) < 75 * mutChance;
                if (changeLetter) {
                    let letterToChange = Math.floor(Math.random() * newSentence.length);
                    let sentenceArray = newSentence.split("");
                    sentenceArray[letterToChange] = getRandomLetter();
                    newSentence = sentenceArray.join("");
                }
                if (changeLength) {
                    let direction = Math.floor(Math.random() * 2);
                    if (direction === 0) {newSentence = newSentence.substring(0, newSentence.length - 1);}
                    else if (direction === 1) {newSentence = newSentence + getRandomLetter()};
                }
                sentences.push(newSentence);
            }
        }
    }
    else {
        for (let i=0; i<sampleSize; i++) {
            let sentence = "";
            let sentenceLength = 1 + Math.floor(Math.random() * 40);
            for (let j=0; j<sentenceLength; j++) {
                sentence = sentence + getRandomLetter();
            }
            sentences.push(sentence);
        }
    }
    genNum++;
    genIndicator.textContent = "Generation " + genNum;
    let top = getBest();
    bestSentence = top[0].slice(0, Math.round(top[0].length/2)) + top[1].slice(Math.round(top[1].length/2, top[1].length));
    bestSentenceP.textContent = bestSentence;
    if (repeat) {
        delay(100).then(() => generate());
    }
    //sentencesP.textContent = sentences.join(" ; ")
}
