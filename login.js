document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality login -> Sign_up
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const gotoSignup = document.getElementById('goto-signup');
    const gotoLogin = document.getElementById('goto-login');
    
    // User type switching  person -> rescuer
    const personType = document.getElementById('person-type');
    const rescuerType = document.getElementById('rescuer-type');
    const personForm = document.getElementById('person-form');
    const rescuerForm = document.getElementById('rescuer-form');
    
    // Function to check if value is empty or only contains whitespace
    function isEmptyOrWhitespace(value) {
        return !value || value.trim() === '';
    }
    
    // Professional popup function
    function showPopup(message, type = 'error') {
        // Create popup element
        const popup = document.createElement('div');
        popup.className = `popup-notification ${type}`;
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-icon">
                    ${type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : '<i class="fas fa-check-circle"></i>'}
                </div>
                <div class="popup-message">${message}</div>
                <button class="popup-close">&times;</button>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(popup);
        
        // Show popup with animation
        setTimeout(() => popup.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            if (popup.parentNode) {
                popup.classList.remove('show');
                setTimeout(() => popup.remove(), 300);
            }
        }, 5000);
        
        // Close button event
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        });
    }
    
    // Switch to signup form  
    signupTab.addEventListener('click', function() {
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    });
    
    gotoSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    });
    
    // Switch to login form
    loginTab.addEventListener('click', function() {
        signupTab.classList.remove('active');
        loginTab.classList.add('active');
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    });
    
    gotoLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupTab.classList.remove('active');
        loginTab.classList.add('active');
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    });
    
    // Switch between person and rescuer forms
    personType.addEventListener('click', function() {
        rescuerType.classList.remove('active');
        personType.classList.add('active');
        rescuerForm.style.display = 'none';
        personForm.style.display = 'block';
    });
    
    rescuerType.addEventListener('click', function() {
        personType.classList.remove('active');
        rescuerType.classList.add('active');
        personForm.style.display = 'none';
        rescuerForm.style.display = 'block';
    });
    
    // Form submission
    const loginBtn = loginForm.querySelector('.btn-primary');
    const signupBtn = signupForm.querySelector('.btn-primary');
    
    loginBtn.addEventListener('click', function() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (isEmptyOrWhitespace(email) || isEmptyOrWhitespace(password)) {
            showPopup('Please fill in all required fields with valid content (not just spaces)');
            return;
        }
        
        // In a real application, you would validate credentials with a server
        showPopup('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'demo.html';
        }, 1500);
    });
    
    signupBtn.addEventListener('click', function() {
        if (personType.classList.contains('active')) {
            // Person registration
            const name = document.getElementById('person-name').value;
            const age = document.getElementById('person-age').value;
            const location = document.getElementById('person-location').value;
            const gender = document.getElementById('person-gender').value;
            const phone = document.getElementById('person-phone').value;
            const email = document.getElementById('person-email').value;
            const password = document.getElementById('person-password').value;
            const emergencyContact = document.getElementById('person-contact').value;
            
            if (isEmptyOrWhitespace(name) || isEmptyOrWhitespace(age) || 
                isEmptyOrWhitespace(location) || isEmptyOrWhitespace(gender) || 
                isEmptyOrWhitespace(phone) || isEmptyOrWhitespace(email) || 
                isEmptyOrWhitespace(password) || isEmptyOrWhitespace(emergencyContact)) {
                showPopup('Please fill in all required fields with valid content (not just spaces)');
                return;
            }
            
            // In a real application, you would send this data to your server
            showPopup('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'demo.html';
            }, 1500);
            
        } else {
            // Rescuer registration
            const name = document.getElementById('rescuer-name').value;
            const gender = document.getElementById('rescuer-gender').value;
            const phone = document.getElementById('rescuer-phone').value;
            const email = document.getElementById('rescuer-email').value;
            const password = document.getElementById('rescuer-password').value;
            const skills = document.getElementById('rescuer-skills').value;
            
            if (isEmptyOrWhitespace(name) || isEmptyOrWhitespace(gender) || 
                isEmptyOrWhitespace(phone) || isEmptyOrWhitespace(email) || 
                isEmptyOrWhitespace(password) || isEmptyOrWhitespace(skills)) {
                showPopup('Please fill in all required fields with valid content (not just spaces)');
                return;
            }
            
            // In a real application, you would send this data to your server
            showPopup('Rescuer account created successfully!', 'success');
        }
        
        // After successful registration, you might want to redirect to login
        // or automatically log the user in
        setTimeout(() => {
            signupTab.classList.remove('active');
            loginTab.classList.add('active');
            signupForm.classList.remove('active');
            loginForm.classList.add('active');
        }, 2000);
    });
});