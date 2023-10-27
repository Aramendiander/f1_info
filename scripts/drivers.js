

async function getFlags() {
    const response = await fetch("https://restcountries.com/v3.1/all")
    const countries = await response.json()
    return countries;
}

const flagData = getFlags()




async function getDriverInfo(){
    const response = await fetch("https://ergast.com/api/f1/current/driverStandings.json")
    const drivers = await response.json()
    return drivers;
}

const driverInfoRaw = await getDriverInfo()
const driverInfo = driverInfoRaw.MRData.StandingsTable.StandingsLists[0].DriverStandings
/* const apiDriverName = driverInfo[i].Driver.givenName + ' ' + driverInfo[i].Driver.familyName */

async function getDriverNationality(name){
    for(let i = 0 ; i < driverInfo.length ; i++) {
        await driverInfo
        await flagData
        const apiFullName = driverInfo[i].Driver.givenName + " " +  driverInfo[i].Driver.familyName;
        if (apiFullName === name){
            return driverInfo[i].Driver.nationality
            }
        }
    }




async function printFlag(){
    const domName = document.getElementsByClassName("name")
    const domNationality = document.getElementsByClassName("nationality")
    for(let i = 0 ; i < domName.length ; i++){
        await driverInfo
        const name = domName[i].innerHTML
        const nationality = await getDriverNationality(name)
        const flagData = await getFlags()
        for (let j = 0 ; j < flagData.length ; j++){
            if(flagData[j].demonyms && flagData[j].demonyms.eng && flagData[j].independent){
                if (flagData[j].demonyms.eng.m === nationality){
                    domNationality[i].innerHTML = "Nationality: " + flagData[j].flag
                }
            }
        }
        
    }
}

let alonsoPoints = 0

async function getDriverPoints(){
    const domName = document.getElementsByClassName("name")
    const domPoints = document.getElementsByClassName("points")
    const driverInfo = await getDriverInfo()
    const data = driverInfo.MRData.StandingsTable.StandingsLists[0].DriverStandings

    for(let i = 0 ; i < data.length ; i++){
        const driverName = data[i].Driver.givenName + " " + data[i].Driver.familyName
        for(let j = 0 ; j < domName.length ; j++){
            if (driverName === domName[j].innerHTML){
                domPoints[j].innerHTML = "Points: " + data[i].points
            }

            if (driverName === "Fernando Alonso"){
                alonsoPoints = data[i].points
            }

        }

    }
}




function toggleLocalStorage(key, value) {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
        // Si no existe en el almacenamiento local, agrégalo
        localStorage.setItem(key, value);
    } else {
        // Si ya existe en el almacenamiento local, elimina solo ese elemento
        localStorage.removeItem(key);
    }
}

function activeHeart(pos, isActive) {
    const heart = document.getElementsByClassName("heart");
    heart[pos].innerHTML = isActive ? "❤️" : "🖤";
}

function checkActiveHeart() {
    for (let i = 0; i < 22; i++) {
        const key = `driver_${i}`;
        const piloto = localStorage.getItem(key);

        if (piloto != null) {
            activeHeart(i, true);
        } else {
            activeHeart(i, false);
        }
    }
}

function heart() {
    const driver = document.getElementsByClassName("driver");
    const dataContainer = document.getElementsByClassName("data");

    for (let i = 0; i < driver.length; i++) {
        const heart = document.createElement("p");
        heart.classList.add("heart")
        heart.textContent = "🖤";
        

        // Agregar un evento click a cada corazón para almacenar o eliminar datos en el almacenamiento local
        heart.addEventListener('click', function() {
            activeHeart(i)
            checkActiveHeart()
            const driverData = driver[i].innerHTML;
            // Llamar a toggleLocalStorage para agregar o eliminar datos específicos
            toggleLocalStorage('driver_' + i, driverData);
            checkActiveHeart()
        });

        dataContainer[i].appendChild(heart);
    }
}





printFlag()
getDriverPoints()
heart()
checkActiveHeart()




async function alonsify () {
    await getDriverPoints()
    const alonsifyButton = document.getElementById("alonsify")
    alonsifyButton.addEventListener("click", () =>{
        const drivers = document.querySelectorAll(".driver")
        for(let i = 0 ; i < drivers.length ; i++){
            // Change photo
            const photo = document.getElementsByClassName("photo")[i]
            const random = Math.floor(Math.random() * 30) + 1;
            photo.classList.add("alonsified")
            photo.src = `../assets/drivers/alonso/alonso${random}.jpg`
            

            // Change Name
            const name = document.getElementsByClassName("name")[i]
            name.innerHTML ="Fernando Alonso"

            // Change Team
            const team = document.getElementsByClassName("team")[i]
            team.innerHTML ="Aston Martin"

            // Change Number
            const number = document.getElementsByClassName("number")[i]
            number.innerHTML ="14"

            // Change Nationality
            const nationality = document.getElementsByClassName("nationality")[i]
            nationality.innerHTML = "Nationality: " + "🇪🇸"

            // Change points
            const points = document.getElementsByClassName("points")[i]
            points.innerHTML = "Points: " + alonsoPoints

        }
    })
    
}

function nano() {
    // Obtain a reference to the button and the audio element
    const alonsify = document.getElementById("alonsify");
    const miAudio = document.getElementById("nano");
  
    // Check if the audio element exists
    if (miAudio) {
      // Add an event listener to the button
      alonsify.addEventListener("click", function() {
        miAudio.play();
      });
    } else {
      console.error("The audio element with id 'miAudio' was not found.");
    }
  }
  
nano();
alonsify ()