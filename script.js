// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// FAQ Dropdown
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
});
// Carousel Functionality
const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;

function updateCarousel(index) {
    // Update slide position
    slides.style.transform = `translateX(-${index * 100}%)`;
    
    // Update active dot
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % dots.length;
    updateCarousel(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + dots.length) % dots.length;
    updateCarousel(currentIndex);
}

// Event Listeners for Navigation Buttons
document.querySelector('.next').addEventListener('click', nextSlide);
document.querySelector('.prev').addEventListener('click', prevSlide);

// Event Listeners for Dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel(currentIndex);
    });
});

// Auto Slide (Optional)
setInterval(nextSlide, 5000); // Change slide every 5 seconds

// Handle Form Submission
document.getElementById('whatsappForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    // Construct WhatsApp message
    const message = `Name: ${name}%0AEmail: ${email}%0APhone: ${phone}%0AAddress: ${address}`;

    // Replace with your WhatsApp number (include country code, e.g., +1 for USA)
    const whatsappNumber = '+6285773009666';

    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
});
