/* Requiring the error module that declares apart */
const Error = require('./Error');

/* Requiring the rest of the modules */
const cheerio = require('cheerio');
const request = require('request');
const fs = require("fs");
const json2csvParser = require('json2csv').Parser;

/* Declaring global variables */
let tshirts = [];
let entryPoint = 'http://shirts4mike.com/shirts.php';

/* Creating CSV file from an JSON array */
const headers = ['Title', 'Price', 'ImageURL', 'URL', 'Time'];
const jsonParse = new json2csvParser({ headers });

/* Declaring a function who makes a 'data' directory  */
const root = () => {
    try {
        if (fs.existsSync("../data")) {
            gettingTshirt();
        } else {
            fs.mkdir("../data", () =>  {
                gettingTshirt();
            });
        }
    } catch(error) {
        let message =`There was a problem creating the folder in the "data" directory ${error.message}`;
        Error(message);
    }
}
root();

/* Getting each of Tshirt from the page and store it in a variable
for then use it in 'getInfo()' */
function gettingTshirt() {
    try {
        request(entryPoint, (err, resp, html) => {
            if (!err && resp.statusCode === 200) {
                const $ = cheerio.load(html);
                $('.products li a').each((index, element) => {
                    let href = $(element).attr('href');
                    let link = `http://shirts4mike.com/${href}`;
                    //console.log(link);
                    getInfo(link);
                });
            } else {
                let message = `There was a problem trying to connect to the site http://shirts4mike.com.`;
                console.log(message);
                Error(message);
            }

        });
    } catch (error) {
        let message = `There was a problem trying to connect to the site http://shirts4mike.com. ${error.message}`;
        Error(message);
    }
}

/*Getting info from the entry point using the request method 
and traversing the DOM using the Cheerio module and making 
the variables for creating the CSV file */
const getInfo = (link) => {
    request(link, (err, resp, html) => {
        if (!err && resp.statusCode === 200) {
            const $ = cheerio.load(html);
            let title = $('.breadcrumb').text();
            title = title.substring(9, title.length);
            //console.log(title)
            let price = $('.price').text();
            let imageURLSrc = $('.shirt-picture span img').attr('src');
            let imageURL = `http://shirts4mike.com/${imageURLSrc}`;
            let time = new Date().toString();
                // let tshirt = {
                //     "Title": title,
                //     "Price": price,
                //     "ImageURL": imageURL,
                //     "URL": link,
                //     "Time": time
                // };
                // tshirts.push(tshirt);
            let date = new Date();
            let year = date.getFullYear();
                let tshirt = {
                    "Title": title,
                    "Price": price,
                    "ImageURL": imageURL,
                    "URL": link,
                    "Time": time
                };
                tshirts.push(tshirt);

            let month = (date.getMonth() + 1).toString();
            if (month.length === 1) {
                month = `0${month}`;
            }
            let day = date.getDate().toString();
            if (day.length === 1) {
                day = `0${day}`;
            }
            let fileName = `${year}-${month}-${day}.csv`;

            createFileCSV(fileName, tshirts);
        }
    });
}

/*Creating the CSV file ans store it on the 'data' directory*/
const createFileCSV = (fileName, item) => {
    let filePath = `../data/${fileName}`;
    let csv = jsonParse.parse(item);
    fs.writeFileSync(filePath, csv, (err) => {
        if (err) {
            Error(`There's been an error ${error.message}`);
        }
    });
}







