const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function sortWordsByName(arr){
    //sort and return only words not digits
    let sortedArr = arr.sort((a,b) => a.localeCompare(b)).filter(item => isNaN(item));
    return sortedArr;
}

function sortDigitsFromSmallest(arr){
    //sort and return only digits not words
    let sortedArr = arr.sort((a,b) => a-b).filter(item => !isNaN(item));
    return sortedArr;
}

function sortDigitsFromBiggest(arr){
    //sort and return only digits not words
    let sortedArr = arr.sort((a,b) => b-a).filter(item => !isNaN(item));
    return sortedArr;
}

function sortWordsByQuantityOfLetters(arr){
    //sort and return only words not digits
    let sortedArr = arr.sort((a,b) => a.length - b.length).filter(item => isNaN(item));
    return sortedArr;
}

function showOnlyUniqueWords(arr){
    //return only unique words not digits
    let uniqueArr = arr.filter((item, index) => arr.indexOf(item) === index && isNaN(item));
    return uniqueArr;
}

//get values from user
rl.question("Hi, please write 10 values separated by space: ", (answer) => {
    mainLoop(answer.split(" "));
    rl.close();
});

//function mainLoop
function mainLoop(values){
    //check if user wrote 10 values
    if(values.length !== 10){
        console.log("You wrote wrong quantity of values, 10 values are required");
        return;
    }
    console.log("How would you like to sort values or write 'exit' to exit:");
    console.log("1. Words by name (from A to Z)");
    console.log("2. Show digits from the smallest");
    console.log("3. Show digits from the biggest");
    console.log("4. Words by quantyty of letters)");
    console.log("5. Only unique words");
    rl.question("Your choice: ", (answer) => {
        if(redirector(answer, values) === 1){
            console.log("Goodbye!");
            return;
        }
    });
    console.log("BBBBBB");
    return;
}


//function redirector
function redirector(variant, values){
    switch(variant){
        case '1':
            console.log(sortWordsByName(values));
            return mainLoop(values);
        case '2':
            console.log(sortDigitsFromSmallest(values));
            return mainLoop(values);
        case '3':
            console.log(sortDigitsFromBiggest(values));
            return mainLoop(values);
        case '4':
            console.log(sortWordsByQuantityOfLetters(values));
            return mainLoop(values);
        case '5':
            console.log(showOnlyUniqueWords(values));
            return mainLoop(values);
        case 'exit':
            return 1;
        default:
            console.log("Wrong variant");
            return mainLoop(values);
    }
}
