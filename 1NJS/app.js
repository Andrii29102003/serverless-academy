const prompt = require('prompt-sync')();


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
let values = prompt("Hi, please write 10 values separated by space: ").split(' ');

//check if user wrote 10 values
if(values.length !== 10){
    console.log("You wrote wrong quantity of values, 10 values are required");
    return;
}
//main loop
while(true){
    console.log("How would you like to sort values or write 'exit' to exit:");
    console.log("1. Words by name (from A to Z)");
    console.log("2. Show digits from the smallest");
    console.log("3. Show digits from the biggest");
    console.log("4. Words by quantyty of letters)");
    console.log("5. Only unique words");
    let variant = prompt();
    if(variant === 'exit'){
        break;
    }

    //function redirector
    switch(variant){
        case '1':
            console.log(sortWordsByName(values));
            break;
        case '2':
            console.log(sortDigitsFromSmallest(values));
            break;
        case '3':
            console.log(sortDigitsFromBiggest(values));
            break;
        case '4':
            console.log(sortWordsByQuantityOfLetters(values));
            break;
        case '5':
            console.log(showOnlyUniqueWords(values));
            break;
        default:
            console.log("Wrong variant");
    }
}
