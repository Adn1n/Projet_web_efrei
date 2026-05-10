// CAROUSEL

let currentSlide = 0;
let slides = [];

function showSlide(index){
    if(slides.length > 0){
        slides.forEach(slide => {
            slide.classList.remove("active");
        });

        slides[index].classList.add("active");
    }
}

function nextSlide(){
    if(slides.length > 0){
        currentSlide++;

        if(currentSlide >= slides.length){
            currentSlide = 0;
        }

        showSlide(currentSlide);
    }
}

function previousSlide(){
    if(slides.length > 0){
        currentSlide--;

        if(currentSlide < 0){
            currentSlide = slides.length - 1;
        }

        showSlide(currentSlide);
    }
}


function initAnimations(){

    const elements = document.querySelectorAll(".fade-in");

    window.addEventListener("scroll", function(){

        elements.forEach(element => {

            const position = element.getBoundingClientRect().top;

            if(position < window.innerHeight - 100){
                element.classList.add("visible");
            }

        });

    });
}

function initCounters(){
    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {
        const target = Number(counter.getAttribute("data-target"));
        let value = 0;
        const speed = Math.ceil(target / 80);

        const updateCounter = setInterval(function(){
            value += speed;

            if(value >= target){
                if(counter.classList.contains("no-plus")){
                    counter.textContent = target;
                }
                else{
                    counter.textContent = target + "+";
                }

                clearInterval(updateCounter);
            }
            else{
                counter.textContent = value;
            }
        }, 25);
    });
}

// BOUTON RETOUR EN HAUT

function goTop(){
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.addEventListener("DOMContentLoaded", function(){

    initAnimations();
    initCounters();
    // Initialisation du carrousel

    slides = document.querySelectorAll(".slide");

    if(slides.length > 0){
        showSlide(currentSlide);
        setInterval(nextSlide, 5000);
    }

    // MENU RESPONSIVE

    const menuButton = document.getElementById("menu-button");
    const nav = document.getElementById("main-nav");

    if(menuButton !== null && nav !== null){
        menuButton.addEventListener("click", function(){
            nav.classList.toggle("active");
        });
    }

    // RECHERCHE DANS LE TABLEAU DES FORMATIONS

    const searchFormation = document.getElementById("searchFormation");
    const formationTable = document.getElementById("formationTable");
    const noResult = document.getElementById("noResult");

    if(searchFormation !== null && formationTable !== null){

        searchFormation.addEventListener("input", function(){

            const searchText = searchFormation.value.toLowerCase();
            const rows = formationTable.querySelectorAll("tbody tr");
            let resultFound = false;

            rows.forEach(row => {
                const rowText = row.textContent.toLowerCase();

                if(rowText.includes(searchText)){
                    row.style.display = "";
                    resultFound = true;
                }
                else{
                    row.style.display = "none";
                }
            });

            if(noResult !== null){
                if(resultFound === false){
                    noResult.style.display = "block";
                }
                else{
                    noResult.style.display = "none";
                }
            }
        });
    }

    // JSON ENSEIGNANTS

    const teachersContainer = document.getElementById("teachersContainer");

    if(teachersContainer !== null){
        fetch("../json/enseignants.json")
            .then(response => response.json())
            .then(data => {

                teachersContainer.innerHTML = "";

                data.enseignants.forEach(teacher => {

                    teachersContainer.innerHTML += `
                        <article class="teacher-card">
                            <img src="${teacher.image}" alt="Enseignant">
                            <h3>${teacher.nom}</h3>
                            <p class="subject">${teacher.matiere}</p>
                            <p>${teacher.description}</p>
                            <button class="teacher-btn">Voir le profil</button>
                        </article>
                    `;
                });
            });
    }

    // FORMULAIRE DE CONTACT

    const contactForm = document.getElementById("contactForm");
    const messageInput = document.getElementById("message");
    const charCounter = document.getElementById("charCounter");
    const formError = document.getElementById("formError");
    const successModal = document.getElementById("successModal");
    const closeModal = document.getElementById("closeModal");

    if(messageInput !== null && charCounter !== null){
        messageInput.addEventListener("input", function(){
            charCounter.textContent = messageInput.value.length + " / 300 caractères";
        });
    }

    if(contactForm !== null){
        contactForm.addEventListener("submit", function(event){
            event.preventDefault();

            const lastname = document.getElementById("lastname").value.trim();
            const firstname = document.getElementById("firstname").value.trim();
            const email = document.getElementById("email").value.trim();
            const subject = document.getElementById("subject").value;
            const message = document.getElementById("message").value.trim();

            if(lastname === "" || firstname === "" || email === "" || subject === "" || message === ""){
                formError.textContent = "Veuillez remplir tous les champs du formulaire.";
                return;
            }

            if(!email.includes("@") || !email.includes(".")){
                formError.textContent = "Veuillez saisir une adresse email valide.";
                return;
            }

            if(message.length < 10){
                formError.textContent = "Le message doit contenir au moins 10 caractères.";
                return;
            }

            formError.textContent = "";

            if(successModal !== null){
                successModal.style.display = "flex";
            }

            contactForm.reset();

            if(charCounter !== null){
                charCounter.textContent = "0 / 300 caractères";
            }
        });
    }

    if(closeModal !== null && successModal !== null){
        closeModal.addEventListener("click", function(){
            successModal.style.display = "none";
        });
    }

    // CHATBOT AVEC JSON

    const chatInput = document.getElementById("chatInput");
    const sendChat = document.getElementById("sendChat");
    const chatMessages = document.getElementById("chatMessages");

    if(chatInput !== null && sendChat !== null && chatMessages !== null){

        function addMessage(text, className){
            const message = document.createElement("div");
            message.className = className;
            message.textContent = text;
            chatMessages.appendChild(message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function sendMessage(){
            const userText = chatInput.value.toLowerCase().trim();

            if(userText === ""){
                return;
            }

            addMessage(chatInput.value, "user-message");
            chatInput.value = "";

            fetch("../json/intents.json")
                .then(response => response.json())
                .then(data => {

                    let responseFound = false;

                    data.intents.forEach(intent => {
                        if(userText.includes(intent.question)){
                            addMessage(intent.response, "bot-message");
                            responseFound = true;
                        }
                    });

                    if(responseFound === false){
                        addMessage("Je n’ai pas compris votre question. Essayez avec : formations, web, équipe ou contact.", "bot-message");
                    }
                });
        }

        sendChat.addEventListener("click", function(){
            sendMessage();
        });

        chatInput.addEventListener("keyup", function(event){
            if(event.key === "Enter"){
                sendMessage();
            }
        });
    }
});