async function getRawDataFromApi() {
    try {
        const response = await fetch("https://ergast.com/api/f1/current/last/results.json");
        const lastRace = await response.json();
        return lastRace;
    } catch(error){
        console.log(error);
    }
}

const rawData = getRawDataFromApi()

async function getFlags() {
    const response = await fetch("https://restcountries.com/v3.1/all")
    const countries = await response.json()
    return countries;
}

const flagData = getFlags()

function getFlagEmoji(countryCode) {
    const countryCodeUpperCase = countryCode.toUpperCase();
    const base = 127397; // Offset for regional indicator symbols
    const offset = 65; // Offset for uppercase ASCII letters

    const firstChar = String.fromCodePoint(base + countryCodeUpperCase.charCodeAt(0) - offset);
    const secondChar = String.fromCodePoint(base + countryCodeUpperCase.charCodeAt(1) - offset);

    return `${firstChar}${secondChar}`;
}

async function printRaceName(){
        const data = await rawData;
        const raceInfo = data.MRData.RaceTable.Races[0].raceName;
        const h2 = document.getElementById("lastrace");
        h2.innerHTML = `Results for last race: ${raceInfo} 2023`;
}

async function getDriverFlag(country){
    const data = await flagData;
    let flag = undefined;
    data.forEach(name => {
        console.log( )
        if ((name.demonyms && name.demonyms.eng && name.independent)){
            if (name.demonyms.eng.m.toLowerCase() === country.toLowerCase()){
                flag = name.flag;
            }
        }
    });
    return flag;
}




async function printRaceResults() {
    const data = await rawData;
    const results = data.MRData.RaceTable.Races[0].Results;
    for (const result of results) {
        const driverName = `${result.Driver.givenName} ${result.Driver.familyName}`;
        const driverNationality = result.Driver.nationality;
        const driverFlag = await getDriverFlag(driverNationality);
        const constructor = result.Constructor.name;


        const container = document.getElementById("results");
        container.innerHTML += `${driverName} ${driverFlag}<br>`;
    }
}




printRaceName();
printRaceResults();
