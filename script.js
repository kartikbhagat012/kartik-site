document.addEventListener('DOMContentLoaded', () => {
    initBunting();
    initStars();

    const btn = document.getElementById('startSurprise');
    const page1 = document.getElementById('page-1');
    const page2 = document.getElementById('page-2');
    const lightBtn = document.getElementById('lightCandleBtn');
    const cakeSvg = document.querySelector('.cake-svg');

    btn.addEventListener('click', () => {
        btn.innerHTML = '<span>✨</span> Opening...';
        btn.style.background = 'linear-gradient(90deg, #6a11cb, #2575fc)';

        setTimeout(() => {
            page1.classList.add('hidden');
            page1.classList.remove('active');

            // Allow time for CSS transition fade out
            setTimeout(() => {
                page2.classList.remove('hidden');
                page2.classList.add('active');
            }, 800);
        }, 1000);
    });

    const page3 = document.getElementById('page-3');
    const page4 = document.getElementById('page-4');
    const page5 = document.getElementById('page-5');

    let poppedCount = 0;
    let currentCard = 0;
    const personalMessages = [
        "happy birthday moto sorry yrr ena late krta mai koi bahr vgera nhi meri suprice v late ho gya isli juth bolta ki bahr hu mai actualy ehi bna reha c isli sorry pr again happy birthday moto",
        "vaise te moto gussa bht hundi h pr jdo gussa hundi aa fr hor v sohni lgdi bnda kuj samne wala soch lya kre aaj birthday wale din v ena gussa galt gll hai yrr chl koi na dost h tu meri",
        "bht der da kuj soch reha c ki banau ki banau fr eh idea dekhya Q-R wala fr ede magr lag gya 7 vje da dekh 12 vaj gye hle tak na bnya pr tenu te bss gussa krne aanda chl koi na jisnu jo aanda ohi krega oye guusa nhi mazak nal bol reha again happy birthday moto"
    ];

    lightBtn.addEventListener('click', () => {
        // If already lit, transition to page 3
        if (cakeSvg.classList.contains('lit')) {
            page2.classList.add('hidden');
            page2.classList.remove('active');
            setTimeout(() => {
                page3.classList.remove('hidden');
                page3.classList.add('active');
            }, 800);
            return;
        }

        cakeSvg.classList.add('lit');
        lightBtn.innerHTML = '<span>🎈</span> Pop the balloons';
        lightBtn.style.background = 'linear-gradient(90deg, #f6d365, #fda085)';
        lightBtn.style.color = '#fff';

        // Trigger Confetti Effect
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FF5252', '#FFD740', '#69F0AE', '#40C4FF', '#E040FB', '#FF4081']
        });
    });

    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach(balloon => {
        balloon.addEventListener('click', function () {
            if (this.classList.contains('popped')) return;

            this.classList.add('popped');

            // Reveal text
            const item = this.closest('.balloon-item');
            if (item) item.classList.add('revealed');

            // Small confetti pop for the balloon
            const rect = this.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            // Get color from style property
            const color = item.style.getPropertyValue('--bottom-tie') || '#FF5252';

            confetti({
                particleCount: 40,
                spread: 60,
                origin: { x, y },
                colors: [color.trim(), '#ffffff']
            });

            poppedCount++;
            if (poppedCount === 4) {
                setTimeout(() => {
                    document.getElementById('nextAction').classList.remove('hidden');
                }, 1000);
            }
        });
    });

    // --- Phase 4 Stack Navigation ---
    const page6 = document.getElementById('page-6');

    document.getElementById('goToBookBtn').addEventListener('click', () => {
        page3.classList.add('hidden');
        page3.classList.remove('active');
        setTimeout(() => {
            page4.classList.remove('hidden');
            page4.classList.add('active');
        }, 800);
    });

    const openMsgBtn = document.getElementById('openMessageBtn');
    openMsgBtn.addEventListener('click', () => {
        if (openMsgBtn.classList.contains('final-chapter-btn')) {
            page4.classList.add('hidden');
            page4.classList.remove('active');
            setTimeout(() => {
                page6.classList.remove('hidden');
                page6.classList.add('active');
            }, 800);
            return;
        }

        if (currentCard >= personalMessages.length) return;

        document.getElementById('personalMessageText').innerText = personalMessages[currentCard];

        page4.classList.add('hidden');
        page4.classList.remove('active');
        setTimeout(() => {
            page5.classList.remove('hidden');
            page5.classList.add('active');
        }, 800);
    });

    document.getElementById('backToCardsBtn').addEventListener('click', () => {
        page5.classList.add('hidden');
        page5.classList.remove('active');

        setTimeout(() => {
            page4.classList.remove('hidden');
            page4.classList.add('active');

            // Once the page is somewhat visible, trigger the card slide away
            setTimeout(() => {
                const cardToRemove = document.querySelector(`.memory-card[data-id="${currentCard}"]`);
                if (cardToRemove) {
                    cardToRemove.classList.remove('active-card');
                    cardToRemove.classList.add('slide-away');
                }

                currentCard++;

                const nextCard = document.querySelector(`.memory-card[data-id="${currentCard}"]`);
                if (nextCard) {
                    nextCard.classList.add('active-card');
                } else {
                    openMsgBtn.innerHTML = "<span>📖</span> Last Chapter";
                    openMsgBtn.classList.add('final-chapter-btn');
                }
            }, 500);

        }, 800);
    });

    document.getElementById('replayBtn').addEventListener('click', () => {
        window.location.reload();
    });
});

function initBunting() {
    const flagsGroup = document.getElementById('flags');
    const colors = ['#FF5252', '#FFD740', '#69F0AE', '#40C4FF', '#E040FB', '#FF4081'];
    const flagWidth = 40;
    const totalFlags = 25;

    for (let i = 0; i < totalFlags; i++) {
        const x = i * flagWidth;
        const color = colors[i % colors.length];

        // Calculate y based on the curve (Simplified version of the path Q part)
        // Path: M0,20 Q250,60 500,20 T1000,20
        // We'll just approximate the curve for flag placement
        let y = 20;
        if (x <= 500) {
            // Parabola approximation for first half
            y = 20 + (40 * (1 - Math.pow((x - 250) / 250, 2)));
        } else {
            // Parabola approximation for second half
            y = 20 + (40 * (1 - Math.pow((x - 750) / 250, 2)));
        }

        const flag = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const points = `${x},${y} ${x + flagWidth},${y} ${x + flagWidth / 2},${y + 35}`;
        flag.setAttribute('points', points);
        flag.setAttribute('fill', color);
        flag.style.filter = 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))';
        flagsGroup.appendChild(flag);
    }
}

function initStars() {
    const container = document.getElementById('starsContainer');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;

        const duration = 2 + Math.random() * 4;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(star);
    }
}
