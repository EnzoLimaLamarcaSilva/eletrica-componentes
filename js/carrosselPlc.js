document.addEventListener("DOMContentLoaded", () => {
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


    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const carouselImages = document.querySelectorAll(".carousel-item img");

    carouselImages.forEach(img => {
        img.addEventListener("click", () => {
            lightboxImg.src = img.src; 
            lightboxImg.alt = img.alt;
            lightbox.classList.add("active");
        });
    });

    lightbox.addEventListener("click", (e) => {
        lightbox.classList.remove("active");
    });
});