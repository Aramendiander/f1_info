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


async function getRaceResults(season, race) {
    try {
        const response = await fetch("https://ergast.com/api/f1/"+season+"/"+race+"/results.json");
        const lastRace = await response.json();
        return lastRace;
    } catch(error){
        console.log(error);
    }
}

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
    seasons.innerHTML="";
    for(i = year ; i < year+10; i++){
        const year = i
        console.log(i)
        const season = document.createElement("article")
        season.textContent = i
        seasons.appendChild(season)
        season.addEventListener("click", () => {
            console.log("you chose " + year)
        })
    }
}




printDecades()