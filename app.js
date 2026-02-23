document.addEventListener("DOMContentLoaded", () => {
    
    // ======================================================
    // 1. LIVE BACKGROUND PARTICLE ENGINE
    // (Moved to top so it runs instantly before videos load)
    // ======================================================
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
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
                this.size = Math.random() * 2 + 0.5; 
                this.speedX = Math.random() * 0.4 - 0.2; 
                this.speedY = Math.random() * 0.4 - 0.2; 
                this.opacity = Math.random() * 0.5 + 0.2; // Brighter particles
            }
            update() {
                this.x += this.speedX;
                this.y -= this.speedY;

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
            for(let i = 0; i < 80; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // ======================================================
    // 2. CINEMATIC VIDEO FADE TRANSITIONS
    // ======================================================
    const videos = document.querySelectorAll('.smooth-loop');
    
    videos.forEach(vid => {
        // Force play to ensure browser doesn't block it
        vid.play().catch(e => console.warn("Autoplay waiting for interaction"));

        vid.addEventListener('timeupdate', () => {
            const fadeDuration = 0.8; 
            if (vid.duration && (vid.duration - vid.currentTime <= fadeDuration)) {
                vid.style.opacity = '0'; 
            } else {
                vid.style.opacity = '1'; 
            }
        });

        vid.addEventListener('ended', () => {
            vid.currentTime = 0;
            vid.play().catch(e => console.warn(e));
            vid.style.opacity = '1';
        });
    });

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

    if (adminTriggerBtn && adminModal) {
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
    }
});
