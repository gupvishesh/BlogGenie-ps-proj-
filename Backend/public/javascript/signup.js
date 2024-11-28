document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userName = document.querySelector('input[name="userName"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    try {
        const res = await fetch('/blogGenie/signup', {
            method: 'POST',
            body: JSON.stringify({ userName, email, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await res.json();
        if (data.user) {
            window.location.href = '/blogGenie/login';
        } else {
            alert(data.errors.email || 'Signup failed');
        }
    } catch (err) {
        console.error('Error:', err);
    }
});