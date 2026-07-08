document.addEventListener("DOMContentLoaded", () => {
    // --- LÓGICA DO CARROSSEL ---
    const slides = document.querySelectorAll(".carousel-item");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    let currentSlide = 0;

    function changeSlide(index) {
        slides[currentSlide].classList.remove("active");
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }
        slides[currentSlide].classList.add("active");
    }

    nextBtn.addEventListener("click", () => changeSlide(currentSlide + 1));
    prevBtn.addEventListener("click", () => changeSlide(currentSlide - 1));


    // --- LÓGICA DE EXPANDIR IMAGEM (LIGHTBOX) ---
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const carouselImages = document.querySelectorAll(".carousel-item img");

    // Abrir ao clicar em qualquer imagem do carrossel
    carouselImages.forEach(img => {
        img.addEventListener("click", () => {
            lightboxImg.src = img.src; // Copia o caminho da imagem atual
            lightboxImg.alt = img.alt;
            lightbox.classList.add("active");
        });
    });

    // Fechar ao clicar no fundo preto ou no próprio botão/imagem
    lightbox.addEventListener("click", (e) => {
        // Só fecha se clicar no fundo, no botão de fechar ou na própria imagem aberta
        lightbox.classList.remove("active");
    });
});