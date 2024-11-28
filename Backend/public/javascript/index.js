//Feature button click
document.addEventListener('DOMContentLoaded', function() {
const featuresBtn = document.getElementById('AboutBtn'); // Get the button by ID
const featuresSection = document.getElementById('container'); // Use the ID of the container you want to scroll to

featuresBtn.addEventListener('click', function(e) {
    e.preventDefault();
    smoothScroll(featuresSection);
});
function smoothScroll(target) {
    const headerOffset = 80; // Adjust this as necessary for your header height
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}
});

    //nav bar sticyness
    window.addEventListener("scroll",function(){
        var header = document.querySelector("header");
        header.classList.toggle("sticky",window.scrollY>0);
    })
    
    //hamburger symbol change
    const hamMenu = document.querySelector(".ham-menu");
    const offScreenMenu = document.querySelector(".off-screen-menu");
    hamMenu.addEventListener("click", () => {hamMenu.classList.toggle("active");offScreenMenu.classList.toggle("active");});

    //2nd page Background color change
    window.addEventListener('scroll', function() {
        const scrollPosition = (window.scrollY + window.innerHeight / 2); // Current scroll position plus half viewport height
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top + window.scrollY; // Get the card's top position relative to the page
            // Log for debugging: Check card position and scroll position
            console.log('Card Position:', cardPosition, 'Scroll Position:', scrollPosition);
            // Change background color based on the scroll position
            if (scrollPosition >= cardPosition && scrollPosition < cardPosition + card.offsetHeight) {
                if (card.id === 'card1') {
                    document.body.style.backgroundColor = '#485745'; // Change to card 1 background color
                } else if (card.id === 'card2') {
                    document.body.style.backgroundColor = '#685770'; // Change to card 2 background color
                } 
                else if (card.id === 'card3') {
                    document.body.style.backgroundColor = '#4c6984';
                }
            }
        });
    });