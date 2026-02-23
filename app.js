document.addEventListener("DOMContentLoaded", () => {
    
    // ======================================================
    // 1. CINEMATIC VIDEO FADE TRANSITIONS
    // Prevent hard cuts by fading the video to black at the end of the loop
    // ======================================================
    const videos = document.querySelectorAll('.smooth-loop');
    
    videos.forEach(vid => {
        // As the video plays, check if it's near the end
        vid.addEventListener('timeupdate', () => {
            const fadeDuration = 0.6; // Fade out during the last 600ms
            if (vid.duration && (vid.duration - vid.currentTime <= fadeDuration)) {
                vid.style.opacity = '0'; // Fade to black
            } else {
                vid.style.opacity = '0.9'; // Normal opacity
            }
        });

        // When the video naturally ends, rewind and fade back in
        vid.addEventListener('ended', () => {
            vid.currentTime = 0;
            vid.play();
            vid.style.opacity = '0.9';
        });
    });

    // ======================================================
    // 2. LIVE BACKGROUND PARTICLE ENGINE (Vanilla JS)
    // Generates a sophisticated dust/ash drift effect
    // ======================================================
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5; // Random size between 0.5 and 2.5
            this.speedX = Math.random() * 0.4 - 0.2; // Drift left or right
            this.speedY = Math.random() * 0.4 - 0.2; // Drift up or down
            this.opacity = Math.random() * 0.4 + 0.1; // Faint opacity
        }
        update() {
            this.x += this.speedX;
            this.y -= this.speedY;

            // If particle floats off screen, reset it randomly
            if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        // Spawn 80 particles
        for(let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { 
            p.update(); 
            p.draw(); 
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ======================================================
    // 3. ADMIN SECURITY MODAL LOGIC
    // ======================================================
    const adminTriggerBtn = document.getElementById('adminTriggerBtn');
    const adminModal = document.getElementById('adminModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const loginBtn = document.getElementById('loginBtn');
    const userInput = document.getElementById('adminUser');
    const passInput = document.getElementById('adminPass');
    const errorMsg = document.getElementById('errorMsg');

    adminTriggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        adminModal.classList.add('active');
        userInput.value = '';
        passInput.value = '';
        errorMsg.style.display = 'none';
        userInput.focus();
    });

    function closeModal() {
        adminModal.classList.remove('active');
    }

    cancelBtn.addEventListener('click', closeModal);
    adminModal.addEventListener('click', (e) => {
        if(e.target === adminModal) closeModal();
    });

    function attemptLogin() {
        const u = userInput.value.trim();
        const p = passInput.value.trim();

        if (u === 'ecw' && p === 'ecw123') {
            errorMsg.style.display = 'none';
            loginBtn.innerText = "AUTHENTICATING...";
            setTimeout(() => {
                window.location.href = "https://ecwgrpmkt-stack.github.io/ECW-Studio-Interior/admin.html";
            }, 500);
        } else {
            errorMsg.style.display = 'block';
            errorMsg.style.animation = 'none';
            errorMsg.offsetHeight; 
            errorMsg.style.animation = null; 
            passInput.value = ''; 
            passInput.focus();
        }
    }

    loginBtn.addEventListener('click', attemptLogin);
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') attemptLogin();
    });
});
