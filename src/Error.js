const fs = require('fs');

/*This is the Error module, I just trying to put it apart 
of the main file to make the code more readable */
const Error = (message) => {
    let date = new Date(); 
    let date2 = date.toString();
    let fileText = `[${date2}] ${message} `+'\r\n';

    let filePath = "../error-log/scraper-error.log";
    if (fs.existsSync(filePath)) {
        fs.appendFileSync(filePath, fileText, (err) => {
            if (err) throw err;
        });
    } else {
        fs.writeFile(filePath, fileText, (err) => {
            if (err) throw err;
        });
    }
}

module.exports = Error;