// IP_MAIN = 'http://127.0.0.1:3000'

let login_errorArea = document.querySelector('.login__errorArea')
let reg_errorArea = document.querySelector('.reg__errorArea')

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const clearErrorInField = () => {
    login_errorArea.textContent = ''
    reg_errorArea.textContent = ''
} 

// field is ID errorArea, 0 - login, 1 - register, 2 - all 
const setErrorInField = (txt='Error', field=2) => {
    let text = `* ${txt} *`
    switch (field) {
        case 0:
            login_errorArea.textContent = text
            break;
        case 1:
            reg_errorArea.textContent = text
            break;
        case 2:
            login_errorArea.textContent = text
            reg_errorArea.textContent = text
            break;
        default:
            break;
    }
}

document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    if (window.isLoggedIn){
        setErrorInField('Ви вже авторизовані', 1)
        return
    }

    const formData = new FormData(this);

    const requestData = {
        username: formData.get('reg__login'),
        password: formData.get('reg__pass'),
        re_password: formData.get('reg__reppass'),
        firstName: formData.get('reg__fname'),
        lastName: formData.get('reg__lname')
    };
    
    if (requestData.firstName.trim().length<=0 || requestData.lastName.trim().length<=0) {
        setErrorInField('Заповніть всі необхідні поля', 1)
        return;
    } else {
        clearErrorInField()
    }

    if (!isValidEmail(requestData.username)) {
        setErrorInField('Невірний формат електронної пошти', 1)
        return;
    } else {
        clearErrorInField()
    }

    if (requestData.password.length < 8 || requestData.password.length > 24) {
        setErrorInField('Пароль повинен містити принаймні 8 символів та не більше 24', 1)
        return;
    } else {
        clearErrorInField()
    }
    
    if (requestData.password != requestData.re_password) {
        setErrorInField('Паролі повинні співпадати', 1)
        return;
    } else {
        clearErrorInField()
    }

    try {
        const response = await fetch(window.IP_MAIN+'/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const data = await response.json();
            console.log(data)
            setErrorInField(data.message, 1)
            return
            throw new Error(data.message || 'Registration failed');
        }
        window.location.reload();
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
});

document.getElementById('loginizationForm').addEventListener('submit', async function(event) {
    if (window.isLoggedIn){
        setErrorInField('Ви вже авторизовані', 0)
        return
    }
    event.preventDefault();

    const formData = new FormData(this);

    const requestData = {
        username: formData.get('login__login'),
        password: formData.get('login__pass')
    };


    if (!isValidEmail(requestData.username)) {
        setErrorInField('Невірний формат електронної пошти', 0)
        return;
    } else {
        clearErrorInField()
    }

    if (requestData.password.length < 8 || requestData.password.length > 24) {
        setErrorInField('Пароль повинен містити принаймні 8 символів та не більше 24', 0)
        return;
    } else {
        clearErrorInField()
    }

    try {
        const response = await fetch(window.IP_MAIN+'/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const data = await response.json();
            setErrorInField(data.message, 0)
            return
        }
        const data = await response.json()
        JWT_token = data.token

        localStorage.setItem('token', JWT_token);
        window.location.reload();

    } catch (error) {
        console.error('Loginization error:', error);
        alert('Loginization failed. Please try again.');
    }
})