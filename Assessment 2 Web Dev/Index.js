// Intro animation
let intro = document.querySelector('.Intro');
let logoItems = document.querySelectorAll('.logo-item');

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        logoItems.forEach((item, idx) => {
            setTimeout(() => {
                item.classList.add('active');
            }, idx * 100);
        });

        setTimeout(() => {
            logoItems.forEach((item, idx) => {
                setTimeout(() => {
                    item.classList.remove('active');
                    item.classList.add('fade');
                }, idx * 50);
            });
        }, 700);

        setTimeout(() => {
            intro.classList.add('hide');
        }, 1200);
    }, 100);
});

// Scroll to top on page load
window.onload = function() {
    window.scrollTo(0, 0);
};
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';    
}

//Audio

const audio = document.getElementById('bg-music');
const volumeSlider = document.getElementById('volume-slider');
const volumePopover = document.getElementById('volume-control');

function toggleMusic(logoElement) {

    if (audio.muted || audio.paused) {
        audio.muted = false;
        audio.play();
        logoElement.classList.add('spinning');
        volumePopover.classList.add('show');
    } else {
        audio.muted = true;
        logoElement.classList.remove('spinning');
        volumePopover.classList.remove('show');
    }
}


volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
 
    const logo = document.querySelector('.Logo');
    if (audio.volume === 0) {
        logo.style.animationPlayState = 'paused';
    } else {
        logo.style.animationPlayState = 'running';
    }
});