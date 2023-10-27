

function printFavorites() {


    // Obtener todas las claves almacenadas en el local storage
    const keys = Object.keys(localStorage);

    // Filtrar las claves que comienzan con 'driver_' para obtener las claves de favoritos
    const favoriteKeys = keys.filter(key => key.startsWith('driver_'));

    // Obtener el contenedor donde deseas mostrar los favoritos
    const favoritesContainer = document.getElementById('lineup');

    // Limpiar el contenedor antes de mostrar los favoritos
    favoritesContainer.innerHTML = '';

    // Remover todos los elementos .heart existentes
    const favoriteElements = document.querySelectorAll('.heart');
    favoriteElements.forEach(element => element.remove());

    // Iterar a través de las claves de favoritos y mostrar los elementos correspondientes
    if (favoriteKeys.length === 0) {
        console.log("there is no favorite driver")
        return;
    }



    favoriteKeys.forEach(key => {
        const driverData = localStorage.getItem(key);

        const favoriteElement = document.createElement('article');
        favoriteElement.classList.add("driver");
        favoriteElement.innerHTML = driverData;

        // Agregar un botón para eliminar el favorito
        const removeButton = document.createElement('p');
        removeButton.textContent = '❤️';
        removeButton.classList.add('remove');
        favoriteElement.appendChild(removeButton);

        removeButton.addEventListener('click', () => {
            // Al hacer clic en el botón, elimina el favorito
            toggleLocalStorage(key, driverData);
            // Luego, vuelve a imprimir la lista de favoritos
            printFavorites();
        });



        favoritesContainer.appendChild(favoriteElement);


    });

    let heart = document.getElementsByClassName("heart")
    for (let i = 0; i < heart.length; i++) {
        heart[i].classList.add("none")
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

document.addEventListener("DOMContentLoaded", function () {
    printFavorites();
});

