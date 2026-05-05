// Intro animation (same as Projects.js)
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
window.onload = function () {
    window.scrollTo(0, 0);
};

if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// Popup functions
function openPopup(hobbyId) {
    const popup = document.getElementById(hobbyId + '-popup');
    if (popup) {
        popup.classList.add('show');
    }
}

function closePopup(element) {
    let popup = element;
    if (popup.classList && !popup.classList.contains('popup-overlay')) {
        popup = popup.closest('.popup-overlay');
    }
    if (popup) {
        popup.classList.remove('show');
        if (popup.id === 'music-popup') {
            const player = document.getElementById('music-player');
            if (player) {
                player.pause();
                player.currentTime = 0;
            }
            document.querySelectorAll('.play-button').forEach(btn => btn.textContent = 'Play');
        }
    }
}

function initMusicControls() {
    const player = document.getElementById('music-player');
    const volumeSlider = document.getElementById('music-volume');
    const buttons = document.querySelectorAll('.play-button');
    if (!player || !volumeSlider || buttons.length === 0) return;

    player.volume = parseFloat(volumeSlider.value);

    volumeSlider.addEventListener('input', () => {
        player.volume = parseFloat(volumeSlider.value);
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const src = button.dataset.src;
            if (!src) return;
            const isCurrent = player.dataset.currentSrc === src;
            if (isCurrent && !player.paused) {
                player.pause();
                button.textContent = 'Play';
                return;
            }
            player.src = src;
            player.dataset.currentSrc = src;
            player.play();
            buttons.forEach(btn => btn.textContent = 'Play');
            button.textContent = 'Pause';
        });
    });

    player.addEventListener('pause', () => {
        buttons.forEach(btn => {
            if (btn.dataset.src === player.dataset.currentSrc) {
                btn.textContent = 'Play';
            }
        });
    });

    player.addEventListener('play', () => {
        buttons.forEach(btn => {
            btn.textContent = btn.dataset.src === player.dataset.currentSrc ? 'Pause' : 'Play';
        });
    });
}

document.addEventListener('DOMContentLoaded', initMusicControls);