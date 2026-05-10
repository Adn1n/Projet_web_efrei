// CAROUSEL

let currentSlide = 0;

const slides = document.querySelectorAll(".slide");

function showSlide(index){

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    slides[index].classList.add("active");
}

function nextSlide(){

    currentSlide++;

    if(currentSlide >= slides.length){
        currentSlide = 0;
    }

    showSlide(currentSlide);
}

function previousSlide(){

    currentSlide--;

    if(currentSlide < 0){
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
}

// Défilement automatique

setInterval(nextSlide, 5000);

// BOUTON RETOUR EN HAUT

function goTop(){

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// MENU RESPONSIVE

const menuButton = document.getElementById("menu-button");
const nav = document.getElementById("main-nav");

menuButton.addEventListener("click", function(){

    if(nav.style.display === "flex"){
        nav.style.display = "none";
    }
    else{
        nav.style.display = "flex";
    }
});

// JSON ENSEIGNANTS

fetch("../json/enseignants.json")
    .then(response => response.json())
    .then(data => {

        const container = document.getElementById("teachersContainer");

        if(container){

            container.innerHTML = "";

            data.enseignants.forEach(teacher => {

                container.innerHTML += `
            
            <article class="teacher-card">

                <img src="${teacher.image}" alt="Enseignant">

                <h3>${teacher.nom}</h3>

                <p class="subject">${teacher.matiere}</p>

                <p>${teacher.description}</p>

                <button class="teacher-btn">
                    Voir le profil
                </button>

            </article>

            `;
            });
        }
    });