// Info Getters
async function getRaceSeasons() {
    try {
        const response = await fetch("https://ergast.com/api/f1/current/last/results.json");
        const lastRace = await response.json();
        return lastRace;
    } catch(error){
        console.log(error);
    }
}

const raceSeasons = getRaceSeasons()

async function getSeason(year) {
    try {
        const response = await fetch("https://ergast.com/api/f1/"+year+"/results.json?limit=10000");
        const yearSeason = await response.json();
        const raceList = yearSeason.MRData.RaceTable.Races
        return raceList
    } catch(error){
        console.log(error);
    }
}

async function getSeasonWinner(year){
    const response = await fetch ("https://ergast.com/api/f1/"+year+"/driverStandings.json")
    const yearSeason = await response.json();
    return yearSeason
}

async function getFlags() {
    const response = await fetch("https://restcountries.com/v3.1/all")
    const countries = await response.json()
    return countries;
}

const flagData = getFlags()

async function getFlag(country){
    const data = await flagData;
    let flag = undefined;
    data.forEach(name => {
        if ((name.demonyms && name.demonyms.eng && name.independent)){
            if (name.demonyms.eng.m.toLowerCase() === country.toLowerCase()){
                flag = name.flag;
            }
        }
    });
    return flag;
}

// Generic functions

function printTd(arg){
    const td = document.createElement("td")
    td.textContent = arg  
    return td
}

async function backButton(decade) {
    const singleSeason = document.getElementById("seasontitle")
    if(!singleSeason){
        const back2 = document.getElementById("back2")
        if(back2){
            back2.remove()
        }

        
        const back = document.createElement("div")
        back.id = "back"
        back.textContent = "Back"
        const body = document.querySelector("body")
        
        if(!document.getElementById("back")){ body.insertBefore(back,body.childNodes[2])}
        back.addEventListener("click", () => {
            back.remove()
            const article = document.querySelectorAll(".season")
            for(let element of article) {
                element.remove()
            }
            printDecades();
    })} else {
            const back = document.createElement("div")
            back.id = "back2"
            back.textContent = "Back"
            const body = document.querySelector("body")
            body.appendChild(back)
            body.insertBefore(back,body.childNodes[2])
            back.addEventListener("click", () => {
                const h1 = document.getElementById("seasontitle")
                const winner = document.getElementById("winner")
                const table = document.getElementById("seasontable")
                const tbody = document.getElementById("seasoninfo")
                const driverStandings = document.getElementById("driverstandingstable")
                const constructorStandings = document.getElementById("constructorstandingstable")
                const driverStandingsTbody = document.getElementById("driverstandingsinfo")
                const constructorStandingsTbody = document.getElementById("constructorstandingsinfo")
                if(h1){h1.remove()}
                if(winner) {winner.remove()}
                tbody.innerHTML=''
                driverStandingsTbody.innerHTML=""
                constructorStandingsTbody.innerHTML=""
                table.style.display="none"
                driverStandings.style.display="none"
                constructorstandingstable.style.display="none"
                chooseSeason(decade)
                })
        }
}

// Prints decades

function printDecades(){
    const seasons = document.getElementById("seasons");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    for(let i = 1950 ; i < currentYear; i+=10){
        if (i < 2000) {
            const printDecade = document.createElement("article");
            printDecade.setAttribute("year",i)
            printDecade.classList.add("decade")
            printDecade.textContent = `${i%100}'s`
            seasons.appendChild(printDecade)
            printDecade.addEventListener("click", () => {
                chooseSeason(i)
            })
        } else {
            const printDecade = document.createElement("article");
            printDecade.setAttribute("year",i)
            printDecade.classList.add("decade")
            printDecade.textContent = `${i}'s`
            seasons.appendChild(printDecade)
            printDecade.addEventListener("click", () => {
                chooseSeason(i)
            })
        }
    }
}

// The HTML has a block for each decade, so when the user clicks on the decade, automatically prints the 10 years in the decae
function chooseSeason(year){
    const seasons = document.getElementById("seasons");
    const article = document.querySelectorAll(".decade")
        for(let element of article) {
            element.remove()
        }
    backButton(year)
    for(let i = year ; i < year+10; i++){
        const years = i
        const season = document.createElement("article")
        season.textContent = i
        season.classList.add("season")
        seasons.appendChild(season)
        season.addEventListener("click", async () => {
            const main = document.querySelector("main")
            const body = document.querySelector("body")
            main.style.display="none"
            body.appendChild(loading())
            const seasonData = await getSeason(years)
            printWinners(years)
            printSeason(seasonData,year)
            printDriverStandings(year)
            printConstructorStandings(year)
            /* const buttons = document.getElementById("buttons")
            buttons.style.display="inline-block"
            buttonListeners(); */
            
        })
    }
}

// Code for each individual season

/* function buttonListeners(){
    const buttons = document.querySelectorAll("#buttons span")
    const raceTable = document.getElementById("seasontable");
    const driverStandingsTable = document.getElementById("driverstandings")
    for(let button of buttons){
        button.addEventListener("click",()=> {
            if(button.innerHTML === "Race table"){
                raceTable.style.display="none"
                const table = document.getElementById("seasontable");
                table.style.display = 'inline-block'
            }
        })
    }
} */

async function printWinners(year){
    const seasonStandings = await getSeasonWinner(year)
    const main = document.querySelector("main")
    const loadingImg = document.getElementById("loadingimg")
    const loadingText = document.getElementById("loadingtext")
    main.style.display="flex";
    loadingImg.remove()
    loadingText.remove()
    const sectionSeasons = document.getElementById("seasons")
    const winners = document.createElement("h2")


    const winningDriverName = seasonStandings.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.givenName
    const winningDriverFamilyName = seasonStandings.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.familyName
    const winningDriverConstructor = seasonStandings.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Constructors[0].name
    const winningDriverFlag = await getFlag(seasonStandings.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.nationality)
    winners.id="winner"
    winners.textContent=`The winner of the ${year} season is ${winningDriverName} ${winningDriverFamilyName} ${winningDriverFlag} driving for ${winningDriverConstructor}`
    sectionSeasons.insertBefore(winners, sectionSeasons.childNodes[2])
}


function printSeason(seasonData,decade){
    const back = document.getElementById("back")
    back.remove()
    const seasonSection = document.getElementById("seasons")
    const seasonArticles = document.querySelectorAll("article")
    const h1 = document.createElement("h1")
    h1.id = "seasontitle"
    h1.textContent=`F1 ${seasonData[0].season} Season`;
    seasonSection.prepend(h1)
    backButton(decade)
        const table = document.getElementById("seasontable");
        table.style.display="block"
        for (let article of seasonArticles){
            article.remove()
        }

        for(let i = 0 ; i < seasonData.length ; i++){
            const seasonElement = document.getElementById("seasons");
            // Print championship winning driver
            
            
            
            const tbody = document.getElementById("seasoninfo")
            const tr = document.createElement("tr")
            tbody.appendChild(tr)

            // Print GP Name
            
            const raceID = seasonData[i].round
            const raceSeason = seasonData[i].season
            const raceLink = document.createElement("a")
            raceLink.href = `./race.html?raceID=${raceID}&raceSeason=${raceSeason}`
            raceLink.textContent = seasonData[i].raceName

            const tdRaceName = document.createElement("td");
            tdRaceName.appendChild(raceLink)
            tr.appendChild(tdRaceName)
            
            // Print GP Circuit Name
            tr.appendChild(printTd(seasonData[i].Circuit.circuitName))

            // Print GP City
            tr.appendChild(printTd(seasonData[i].Circuit.Location.locality))

            // Print GP Date
            tr.appendChild(printTd(seasonData[i].date))

            // Print GP Winning driver
            const driverName = seasonData[i].Results[0].Driver.givenName
            const driverFamilyName = seasonData[i].Results[0].Driver.familyName
            tr.appendChild(printTd(`${driverName} ${driverFamilyName}`))

            // Print GP Winning constructor
            tr.appendChild(printTd(seasonData[i].Results[0].Constructor.name))
        }
}

async function printDriverStandings(year) {
    try {
        const response = await fetch(`https://ergast.com/api/f1/${year}/driverStandings.json`);
        const data = await response.json();
        const results = data.MRData.StandingsTable.StandingsLists[0].DriverStandings
        const table = document.getElementById("driverstandingstable")
        table.style.display="block"
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            // Print rows
            const container = document.getElementById("driverstandingsinfo");
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

            // Print driver team
            const driverTeam = result.Constructors[0].name;
            tr.appendChild(printTd(driverTeam))

            // Print standing driver points
            const driverPoints = result.points;
            tr.appendChild(printTd(driverPoints))
        }
    } catch(error){
        console.log(error);
    }
}


async function printConstructorStandings(year) {
    try {
        const response = await fetch(`https://ergast.com/api/f1/${year}/constructorStandings.json`);
        const data = await response.json();
        console.log(data)
        const results = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
        const table = document.getElementById("constructorstandingstable")
        table.style.display="block"
        if(results) {
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                // Print rows
                const container = document.getElementById("constructorstandingsinfo");
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
        } else {
            console.log("there is not constructor standings")
        }
    } catch(error){
        console.log(error);
    }
}



function loading(){
    const loadingDiv = document.createElement("div")
    loadingDiv.id = "loading"
    const loadingImg = document.createElement("img")
    loadingImg.id ="loadingimg"
    loadingImg.src = "../assets/moderncar.gif"
    const loadingText = document.createElement("p")
    loadingText.id ="loadingtext"
    loadingText.textContent="Loading..."
    loadingDiv.appendChild(loadingImg)
    loadingDiv.appendChild(loadingText)
    return loadingDiv
}











/* 
Comprobar que están cubiertas cosas como: 
El ganador del año de una temporada no ha acabado
No imprimir hasta 2029 cuando no existe la temporada
 */

printDecades()