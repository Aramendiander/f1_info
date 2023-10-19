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

async function getRaceResults() {
    const data = await rawData;
    const results = data.MRData.RaceTable.Races[0].Results;
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        
        // Print rows
        const container = document.getElementById("results");
        const tr = document.createElement("tr");
        container.appendChild(tr);

        // Print position cell
        const driverPosition = result.position;
        tr.appendChild(printTd(driverPosition));

         // Print grid cell
        const driverGrid = result.grid
        tr.appendChild(printTd(driverGrid))

        // Print name cell
        const driverName = `${result.Driver.givenName} ${result.Driver.familyName}`;
        const printDriverName = printTd(driverName);
        if (result.FastestLap?.rank) {
            const raceFastestLap = result.FastestLap.rank;
            const fastestLapImage = document.createElement("img");
            fastestLapImage.src = "./assets/fastestlap.png";
            fastestLapImage.id = "fastestlap"
            if (raceFastestLap === "1") {
                printDriverName.appendChild(fastestLapImage);
            }
        }
        tr.appendChild(printDriverName);
        

        // Print nationality cell
        const driverNationality = result.Driver.nationality;
        const driverFlag = await getFlag(driverNationality);
        tr.appendChild(printTd(driverFlag))

        // Print constructor cell
        const constructor = result.Constructor.name;
        tr.appendChild(printTd(constructor))

        // Print fastest lap cell
        if (result.FastestLap) {
            tr.appendChild(printTd(result.FastestLap.Time.time))
        } else {
            tr.appendChild(printTd("DNF"))
        }

        // Print laps completed
        const lapsCompleted = `${result.laps} (${result.status})`
        tr.appendChild(printTd(lapsCompleted))
    }
}


async function getDriverStandings() {
    try {
        const response = await fetch("https://ergast.com/api/f1/current/driverStandings.json");
        const data = await response.json();
        const results = data.MRData.StandingsTable.StandingsLists[0].DriverStandings
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            // Print rows
            const container = document.getElementById("driverstandings");
            const tr = document.createElement("tr");
            container.appendChild(tr);

            // Print standing position
            const standingPosition = result.position;
            tr.appendChild(printTd(standingPosition))

            // Print standing driver
            const standingDriver = `${result.Driver.givenName} ${result.Driver.familyName}`;
            tr.appendChild(printTd(standingDriver))

            // Print standing driver nationality
            const driverNationality = result.Driver.nationality;
            const driverFlag = await getFlag(driverNationality);
            tr.appendChild(printTd(driverFlag))

            // Print standing driver points
            const driverPoints = result.points;
            tr.appendChild(printTd(driverPoints))
        }
    } catch(error){
        console.log(error);
    }
}


async function getConstructorStandings() {
    try {
        const response = await fetch("https://ergast.com/api/f1/current/constructorStandings.json");
        const data = await response.json();
        const results = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            // Print rows
            const container = document.getElementById("constructorstandings");
            const tr = document.createElement("tr");
            container.appendChild(tr);

            // Print standing position
            const standingPosition = result.position;
            tr.appendChild(printTd(standingPosition))

            // Print standing constructor
            const standingConstructor = result.Constructor.name ;
            tr.appendChild(printTd(standingConstructor))

            // Print standing driver nationality
             const constructorCounty = result.Constructor.nationality;
            const constructorFlag = await getFlag(constructorCounty);
            tr.appendChild(printTd(constructorFlag))

            // Print standing driver points
            const constructorPoints = result.points;
            tr.appendChild(printTd(constructorPoints)) 
        }
    } catch(error){
        console.log(error);
    }
}


function printIndex() {
getRaceName();
getRaceResults();
getDriverStandings();
getConstructorStandings();
}

printIndex()