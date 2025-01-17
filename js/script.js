// Selecting elements
var LUemailInput = document.querySelector('#LUemail');
var LUpasswordInput = document.querySelector('#LUpassword');
var loginPanel = document.querySelector('.login_panel');
var goToregisterBtn = document.querySelector('#goToRegister');
var loginInput = document.querySelector('#loginInbtn');
var homesec = document.querySelector("#home");
var loginPanels = document.querySelector('#loginPanels');
var RUemailInput = document.querySelector('#RUemail');
var RUpasswordInput = document.querySelector('#RUpassword');
var RUnameInput = document.querySelector('#RUname');
var RUregisterBtn = document.querySelector('#RUregister');
var registerPanel = document.querySelector('.register_panel');
var goTologinBtn = document.querySelector('#backToLogin');
var regesterAccountBtn = document.querySelector('#regesterAccount');
var reUpasswordInput = document.querySelector('#RUrepassword');
var logoutBtn = document.querySelector('#logoutBtn');
var UDisplayName = document.querySelector("#DisplayName");

// Regex patterns
var regex = {
    "emailRegx": /^[^@]+@\w+(\.\w+)+\w$/,
    "passRegx": /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,21}$/,
    "userRegx": /^(?!.*__)[a-zA-Z0-9_]{3,12}$/
};

// Local storage initialization
var accountsContainer;

if (localStorage.getItem("accounts") == null) {
    accountsContainer = [];
} else {
    accountsContainer = JSON.parse(localStorage.getItem("accounts"));
}

// Function to reset input fields
function resetInputs() {
    RUemailInput.value = '';
    RUpasswordInput.value = '';
    RUnameInput.value = '';
    reUpasswordInput.value = '';
    LUemailInput.value = '';
    LUpasswordInput.value = '';
}

// Function to show registration error messages
function showError(message) {
    var errorMessage = document.getElementById('errorMessage');
    var errorMessageText = document.getElementById('errorMessageText');
    
    errorMessageText.textContent = message;
    errorMessage.classList.remove('d-none');
    errorMessage.classList.add('alert-show');

    setTimeout(function() {
        errorMessage.classList.remove('alert-show');
        errorMessage.classList.add('alert-hide');
        setTimeout(function() {
            errorMessage.classList.add('d-none');
        }, 500); // Optional delay to ensure animation completes before hiding
    }, 3000); // Hide error message after 3 seconds
}

// Function to show registration success messages
function showSuccess(message) {
    var successMsg = document.getElementById('successMsg');
    var successMsgTxt = document.getElementById('successMsgTxt');
    
    successMsgTxt.textContent = message;
    successMsg.classList.remove('d-none');
    successMsg.classList.add('alert-show');

    setTimeout(function() {
        successMsg.classList.remove('alert-show');
        successMsg.classList.add('alert-hide');
        setTimeout(function() {
            successMsg.classList.add('d-none');
        }, 500); // Optional delay to ensure animation completes before hiding
    }, 3000); // Hide success message after 3 seconds
}

// Transfer between Panels
goToregisterBtn.addEventListener('click', function () {
    loginPanel.classList.add('d-none');
    registerPanel.classList.replace('d-none', 'd-block');
});

goTologinBtn.addEventListener('click', function () {
    registerPanel.classList.add('d-none');
    loginPanel.classList.replace('d-none', 'd-block');
});

// Register new account
regesterAccountBtn.addEventListener('click', function () {
    var email = RUemailInput.value;
    var password = RUpasswordInput.value;
    var Uname = RUnameInput.value;
    var repassword = reUpasswordInput.value;

    if (repassword !== password) {
        showError('Passwords do not match');
        return;
    } else if (email && password && Uname) {
        if (!regex.emailRegx.test(email)) {
            showError('Invalid email address');
            return;
        }
        if (!regex.userRegx.test(Uname)) {
            showError('Invalid username');
            return;
        }
        if (!regex.passRegx.test(password)) {
            showError('Invalid password');
            return;
        }
        for (var i = 0; i < accountsContainer.length; i++) {
            if (accountsContainer[i].email === email) {
                showError('Email already exists');
                return;
            }
        }
        for (var i = 0; i < accountsContainer.length; i++) {
            if (accountsContainer[i].Uname === Uname) {
                showError('Username already exists');
                return;
            }
        }
        var newAccount = {
            "email": email,
            "password": password,
            "Uname": Uname,
        };

        accountsContainer.push(newAccount);
        localStorage.setItem("accounts", JSON.stringify(accountsContainer));
        resetInputs();
        showSuccess('Account created successfully!');
        redirectToLogin(); // Optionally redirect to login panel after registration
    } else {
        showError('Please fill all fields');
    }
});

// Function to redirect to login panel after successful registration
function redirectToLogin() {
    registerPanel.classList.add('d-none');
    loginPanel.classList.replace('d-none', 'd-block');
}

// Function to handle login
loginInput.addEventListener('click', function () {
    var email = LUemailInput.value;
    var password = LUpasswordInput.value;
    var isLoggedIn = false;

    for (var i = 0; i < accountsContainer.length; i++) {
        if (accountsContainer[i].email === email && accountsContainer[i].password === password) {
            isLoggedIn = true;
            UDisplayName.textContent = accountsContainer[i].Uname;

            // Store logged-in user information in localStorage
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('loggedInUsername', accountsContainer[i].Uname);
            break; // Stop searching once a match is found
        }
    }

    if (isLoggedIn) {
        showSuccess('Logged in successfully!');
        resetInputs();
        homesec.classList.replace("d-none", "d-block");
        loginPanels.classList.add('d-none');
    } else {
        showError('Invalid email or password');
    }
});

// Function to check login status on page load
document.addEventListener('DOMContentLoaded', function () {
    var isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
        homesec.classList.replace('d-none', 'd-block');
        loginPanels.classList.add('d-none');

        // Retrieve logged-in username from localStorage and display
        var loggedInUsername = localStorage.getItem('loggedInUsername');
        if (loggedInUsername) {
            UDisplayName.textContent = loggedInUsername;
        }
    }
});

// Function to handle logout
logoutBtn.addEventListener('click', function (event) {
    event.preventDefault();
    localStorage.removeItem('isLoggedIn'); // Remove login status flag
    localStorage.removeItem('loggedInUsername'); // Remove logged-in username
    homesec.classList.add('d-none');
    loginPanels.classList.replace('d-none', 'd-block');
});
