
const fs = require("fs");
const prompt = require("prompt-sync")();


data = [];
dbFile = "db.txt"; 

function loadDB() {
    try {
        data = JSON.parse(fs.readFileSync(dbFile, "utf8"));
    } catch (e) {
        console.log("Error loading DB: " + e);
        data = [];
    }
}

function saveDB() {
    try {
        fs.writeFileSync(dbFile, JSON.stringify(data));
    } catch (e) {
        console.log("Error saving DB: " + e);
    }
}

function addPerson(){
    
    person = {};

    person.name = prompt("Enter the user`s name. To cancel press ENTER: ");
    if(person.name === ""){
        askToDo = prompt("Do you want to search data in database? Y/N: ");
        if(askToDo === "Y"){
            showDB();
        }
        return "doExit";
    }
    person.gender = prompt("Chose your gender[M/F] : ");
    person.age = parseInt(prompt("Enter your age: "));
    
    loadDB();
    //add person to data
    data.push(person);
    saveDB();
}

function showDB(){
    loadDB();
    console.log(data);
    askName = prompt("Enter the user`s name you want to search in database: ");
    for(const person of data){
        if(person.name.toUpperCase() == askName.toUpperCase()){
            console.log(person);
            return;
        }
    }
    console.log("There is no such user in database");
}



//main loop
while(true){
    if(addPerson() === "doExit"){
        break;
    }
}
