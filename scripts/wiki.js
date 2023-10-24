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
        console.log( )
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

function backButton() {
    const back = document.createElement("div")
    back.id = "back"
    back.textContent = "Back"
    const body = document.querySelector("body")
    body.appendChild(back)
    body.insertBefore(back,body.childNodes[2])
    back.addEventListener("click", () => {
        back.remove()
        const article = document.querySelectorAll(".season")
        for(let element of article) {
            element.remove()
        }
        printDecades();
    })
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
            printDecade.classList.add("season")
            printDecade.textContent = `${i%100}'s`
            seasons.appendChild(printDecade)
            printDecade.addEventListener("click", () => {
                chooseSeason(i)
            })
        } else {
            const printDecade = document.createElement("article");
            printDecade.setAttribute("year",i)
            printDecade.classList.add("season")
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
    const article = document.querySelectorAll(".season")
        for(let element of article) {
            element.remove()
        }
    backButton()
    for(let i = year ; i < year+10; i++){
        const year = i
        const season = document.createElement("article")
        season.textContent = i
        season.classList.add("season")
        seasons.appendChild(season)
        season.addEventListener("click", async () => {
            const seasonData = await getSeason(year)
            printSeason(seasonData)
            printWinners(year)
            const buttons = document.getElementById("buttons")
            buttons.style.display="inline-block"
            buttonListeners();
            
        })
    }
}

// Code for each individual season

function buttonListeners(){
    const buttons = document.querySelectorAll("#buttons span")
    const raceTable = document.getElementById("seasontable");
    const driverStandingsTable = document.getElementById("driverstandings")
    for(let button of buttons){
        button.addEventListener("click",()=> {
            if(button.innerHTML = "Race table"){
                raceTable.style.display="none"
                const table = document.getElementById("seasontable");
                table.style.display = 'inline-block'
            }
        })
    }
}

async function printWinners(year){
    const seasonStandings = await getSeasonWinner(year)
    const sectionSeasons = document.getElementById("seasons")
    const winners = document.createElement("article")


    const winningDriverName = seasonStandings.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.givenName
    const winningDriverFamilyName = seasonStandings.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.familyName
    const winningDriverConstructor = seasonStandings.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Constructors[0].name
    const winningDriverFlag = await getFlag(seasonStandings.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver.nationality)
    winners.id="winner"
    winners.textContent=`The winner of the ${year} season is ${winningDriverName} ${winningDriverFamilyName} ${winningDriverFlag} driving for ${winningDriverConstructor}`
    sectionSeasons.prepend(winners)
}


function printSeason(seasonData){
    const seasonArticles = document.querySelectorAll("article")
    const table = document.getElementById("seasontable");
    /* table.style.display = 'inline-block' */
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
            console.log(seasonData[i])
            
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









async function getRaceResults(season, race) {
    try {
        const response = await fetch("https://ergast.com/api/f1/"+season+"/"+race+"/results.json");
        const lastRace = await response.json();
        return lastRace;
    } catch(error){
        console.log(error);
    }
}













printDecades()