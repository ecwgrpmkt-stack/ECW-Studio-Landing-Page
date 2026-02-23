document.addEventListener("DOMContentLoaded", () => {
    
    const adminTriggerBtn = document.getElementById('adminTriggerBtn');
    const adminModal = document.getElementById('adminModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const loginBtn = document.getElementById('loginBtn');
    
    const userInput = document.getElementById('adminUser');
    const passInput = document.getElementById('adminPass');
    const errorMsg = document.getElementById('errorMsg');

    // 1. Open Modal
    adminTriggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        adminModal.classList.add('active');
        userInput.value = '';
        passInput.value = '';
        errorMsg.style.display = 'none';
        userInput.focus();
    });

    // 2. Close Modal function
    function closeModal() {
        adminModal.classList.remove('active');
    }

    cancelBtn.addEventListener('click', closeModal);

    // Close modal if user clicks outside the box
    adminModal.addEventListener('click', (e) => {
        if(e.target === adminModal) {
            closeModal();
        }
    });

    // 3. Security Validation Logic
    function attemptLogin() {
        const u = userInput.value.trim();
        const p = passInput.value.trim();

        // Exact match required
        if (u === 'ecw' && p === 'ecw123') {
            // Success: Route absolutely to the interior repo's admin panel
            errorMsg.style.display = 'none';
            loginBtn.innerText = "AUTHENTICATING...";
            
            setTimeout(() => {
                window.location.href = "https://ecwgrpmkt-stack.github.io/ECW-Studio-Interior/admin.html";
            }, 500);

        } else {
            // Failure: Show error and shake
            errorMsg.style.display = 'block';
            
            // Re-trigger shake animation
            errorMsg.style.animation = 'none';
            errorMsg.offsetHeight; /* Trigger reflow to restart animation */
            errorMsg.style.animation = null; 
            
            passInput.value = ''; // clear password field for retry
            passInput.focus();
        }
    }

    // Trigger login on button click
    loginBtn.addEventListener('click', attemptLogin);

    // Trigger login if user hits "Enter" key while in the password field
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            attemptLogin();
        }
    });
});
