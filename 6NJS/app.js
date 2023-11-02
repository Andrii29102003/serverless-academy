const fs = require('fs');
const files = fs.readdirSync('./files');

function uniqueValues(){
    let users = new Set();

    for(let i = 0; i < 20; i++) {
        const data = fs.readFileSync('./files/'+files[i], 'utf8');
        const lines = new Set(data.split('\n'));
        users = new Set([...users, ...lines]);
    }

    return users.size;
}


function existInAllFiles(){
    let commonLines = null;

    for(let i = 0; i < 20; i++) {
        const data = fs.readFileSync('./files/'+files[i], 'utf8');
        const lines = new Set(data.split('\n'));

        if(commonLines === null) {
            commonLines = lines;
        } else {
            commonLines = new Set([...commonLines].filter(line => lines.has(line)));
        }
    }

    return commonLines.size;
}


function existInAtleastTen(){
    let lineCounts = new Map();

    for(let i = 0; i < 20; i++) {
        const data = fs.readFileSync('./files/'+files[i], 'utf8');
        const lines = new Set(data.split('\n'));

        lines.forEach(line => {
            if(lineCounts.has(line)) {
                lineCounts.set(line, lineCounts.get(line) + 1);
            } else {
                lineCounts.set(line, 1);
            }
        });
    }

    let commonLines = new Set();

    lineCounts.forEach((count, line) => {
        if(count >= 10) {
            commonLines.add(line);
        }
    });

    return commonLines.size;
}

console.log(uniqueValues());
console.log(existInAllFiles());
console.log(existInAtleastTen());