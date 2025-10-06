// Close emergency banner
document.querySelector('.banner-close').addEventListener('click', function() {
    this.closest('.emergency-banner').style.display = 'none';
});

// Scroll to section functions
function scrollToCenter(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ block: 'center' });
    }
}
// smooth scrolling ka liya ha 
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.style.display = 'block';
        element.scrollIntoView({ behavior: 'smooth' });
    }
}


