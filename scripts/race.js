async function getRaceData (){
    const urlParams = new URLSearchParams(window.location.search);
    const raceID = urlParams.get('raceID');
    const raceSeason = urlParams.get('raceSeason');
    try {
        const response = await fetch(`https://ergast.com/api/f1/${raceSeason}/${raceID}/results.json?limit=1000`);
        const lastRace = await response.json();
        return lastRace;
    } catch(error){
        console.log(error);
    }
}

async function getFlags() {
    const response = await fetch("https://restcountries.com/v3.1/all")
    const countries = await response.json()
    return countries;
}

const flagData = getFlags()

async function getRaceName(){
        const data = await rawData;
        const raceInfo = data.MRData.RaceTable.Races[0].raceName;
        const h2 = document.getElementById("lastrace");
        h2.innerHTML = `Results for last race: ${raceInfo} 2023`;
}

async function getFlag(country){
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


function printTd(arg){
    const td = document.createElement("td")
    td.textContent = arg  
    return td
}



async function printRaceTable(){
    const raceData = await getRaceData()
    const race = raceData.MRData.RaceTable.Races[0]
    
    for(let i = 0 ; i < race.Results.length ; i++){
        const table = document.querySelector("table")
        const tr = document.createElement("tr")
        table.appendChild(tr)
        // Print driver position
        tr.appendChild(printTd(race.Results[i].position))

        // Print driver grid
        tr.appendChild(printTd(race.Results[i].grid))

        // Print driver Name
        const driverName = race.Results[i].Driver.givenName
        const driverFamilyName = race.Results[i].Driver.familyName
        tr.appendChild(printTd(`${driverName} ${driverFamilyName}`))

        // Print driver nationality
        const driverNationality = race.Results[i].Driver.nationality;
        const driverFlag = await getFlag(driverNationality);
        tr.appendChild(printTd(driverFlag))

        // Print driver team
        tr.appendChild(printTd(race.Results[i].Constructor.name))

        // Print driver completed laps
        tr.appendChild(printTd(race.Results[i].laps))

        // Print driver status
        tr.appendChild(printTd(race.Results[i].status))





    }
    
    
    

    return race
}

console.log(printRaceTable())