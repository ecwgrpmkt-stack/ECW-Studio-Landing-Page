document.addEventListener("DOMContentLoaded", () => {
    
    // ======================================================
    // 1. LIVE BACKGROUND PARTICLE ENGINE (WITH PARALLAX)
    // ======================================================
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        // Mouse Tracking Variables for Parallax
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let targetMouseX = mouseX;
        let targetMouseY = mouseY;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Listen for mouse movements globally
        window.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5; 
                this.speedX = Math.random() * 0.4 - 0.2; 
                this.speedY = Math.random() * 0.4 - 0.2; 
                this.opacity = Math.random() * 0.5 + 0.2;
                
                // Parallax Factor: Bigger particles = closer = more reactive to the mouse
                this.parallaxFactor = this.size * 0.015; 
            }
            
            update() {
                // Natural drift
                this.x += this.speedX;
                this.y -= this.speedY;

                // Wrap around edges cleanly
                if(this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                }
            }
            
            draw(currentMouseX, currentMouseY) {
                // Calculate Parallax Offset
                const dx = (currentMouseX - canvas.width / 2) * this.parallaxFactor;
                const dy = (currentMouseY - canvas.height / 2) * this.parallaxFactor;

                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                // Apply the offset (subtracting makes them move opposite to the mouse, simulating depth)
                ctx.arc(this.x - dx, this.y - dy, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for(let i = 0; i < 90; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Smoothly ease the mouse coordinates to prevent jarring jumps
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            particles.forEach(p => { 
                p.update(); 
                p.draw(mouseX, mouseY); 
            });
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
