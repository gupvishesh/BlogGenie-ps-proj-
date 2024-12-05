
// form loading animation

const form = [...document.querySelector('.form').children];

form.forEach((item, i) => {
    setTimeout(() => {
        item.style.opacity = 1;
    }, i*100);
})

window.onload = () => {
    if(sessionStorage.name){
        location.href = '/';
    }
}

// form validation

const name = document.querySelector('.name') || null;
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const submitBtn = document.querySelector('.submit-btn');

if(name == null){ // means login page is open
    submitBtn.addEventListener('click', () => {
        const email = document.querySelector('.email').value;
        const password = document.querySelector('.password').value;

        console.log('Login attempt:', email);

        fetch('/blogGenie/login', {
            method: 'post',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ email, password })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Login failed');
            }
            return res.json();
        })
        .then(data => {
            if (data.message === 'Login successful') {
                window.location.href = '/blogGenie/profile';
            }
        })
        .catch(error => {
            alert('Login failed. Please check your credentials.');
            console.error('Error:', error);
        });
    })
} else{ // means register page is open

    submitBtn.addEventListener('click', () => {
        fetch('/register-user', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            validateData(data);
        })
        .catch(error => console.error('Error:', error));
    })

}

const validateData = (data) => {
    if(!data.name){
        alertBox(data);
    } else{
        sessionStorage.name = data.name;
        sessionStorage.email = data.email;
        location.href = '/';
        window.location.href = '/blogGenie/profile';
    }
}

const alertBox = (data) => {
    const alertContainer = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');
    alertMsg.innerHTML = data;

    alertContainer.style.top = `5%`;
    setTimeout(() => {
        alertContainer.style.top = null;
    }, 5000);
}

document.querySelector('.submit-btn').addEventListener('click', () => {
    const email = document.querySelector('.email').value;
    const password = document.querySelector('.password').value;

    fetch('/blogGenie/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Login failed');
        }
        return res.json();
    })
    .then(data => {
        if (data.message === 'Login successful') {
            window.location.href = '/blogGenie/profile';
        }
    })
    .catch(error => {
        alert('Login failed. Please check your credentials.');
        console.error('Error:', error);
    });
});
