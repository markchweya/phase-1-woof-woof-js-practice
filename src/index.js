document.addEventListener("DOMContentLoaded", startFunction);

//Initializing the URL
const dogUrl = "http://localhost:3000/pups"

//fetch function
function fetchDogs(){
    return fetch(dogUrl)
        .then(response => response.json())
}

//function that calls the filter-dog button
function startFunction(){
    const dogFilterBtn = document.querySelector("#good-dog-filter");
    dogFilterBtn.addEventListener("click", toggleFilter)
    fetchDogs().then(addDogs)
}

//Function that filters good dogs
function toggleFilter(){
    const dogFilterBtn = document.querySelector("#good-dog-filter");
    if (dogFilterBtn.innerText.includes("OFF")){ //if the inner text is OFF
        dogFilterBtn.innerText = "Filter good dogs: ON"
        showDog()
    } else {
        dogFilterBtn.innerText = "Filter good dogs: OFF"
        showDog()
    }
}

//function that shows the dog
function showDog(){
    const dogFilterBtn = document.querySelector("#good-dog-filter")
    if (dogFilterBtn.innerText.includes("OFF")){
        fetchDogs().then(arrayOfDogs => addDogs(arrayOfDogs))
    } else {
        fetchDogs().then(arrayOfDogs => addDogs(arrayOfDogs, true))
    }
}

//Adding dogs
function addDogs(arrayDog, filter = false){
    const barDogs = document.querySelector("#dog-bar")
    barDogs.innerHTML = ""
    if (filter) {
        arrayDog.filter(dog => dog.isGoodDog).map(addDogToBar)
    } else {
        arrayDog.map(addDogToBar)
    }
}

function addDogToBar(dog){
    const dogBar = document.querySelector("#dog-bar")
    const dogSpan = document.createElement("span")
    dogSpan.innerText = dog.name
    dogSpan.dataset.id = dog.id

    dogSpan.addEventListener("click", onDogClick)

    dogBar.append(dogSpan)
}

//on clicking a dog
function onDogClick(e){
    oneDog(e.target.dataset.id)
        .then(showDogOnPage)
}

//Each dog function
function oneDog(id){
    return fetch(dogUrl + `/${id}`)
        .then(response => response.json() )
}

//showing dog on the page
function showDogOnPage(dog){
    const dogInfo = document.querySelector("#dog-info")
    dogInfo.innerHTML = ""
    const dogImage = document.createElement("img")
    dogImage.src = dog.image

    const dogName = document.createElement("h2")
    dogName.innerText = dog.name

    const dogBtn = document.createElement("button")
    dogBtn.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
    dogBtn.dataset.id = dog.id
    dogBtn.addEventListener("click", GoodDogClick)

    dogInfo.append(dogImage, dogName, dogBtn)
}

function GoodDogClick(){
    let val;
    if (e.target.innerText.includes("Good")){
        e.target.innerText = "Bad Dog"
        val = false;
    } else {
        e.target.innerText = "Good Dog"
        val = true;
    }
    showGoodDog(e.target.dataset.id, val).then(showDog)
}

//function that updates
function showGoodDog(id, newValue){
    const options = {
        method: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            isGoodDog: newValue
        })
    }
    return fetch(dogUrl + `/${id}`, options)
        .then(response => response.json())
}