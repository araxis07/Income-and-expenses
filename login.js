const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

function auth() {
    var email_check = !!document.getElementById('Emailcheck').value;
    var password_check = !!document.getElementById('PasswordCheck').value;
    var password_con_check = !!document.getElementById('Password_Confirm_Check').value;
    var user_check = !!document.getElementById('Usercheck').value;

    var password_syntax =  document.getElementById('PasswordCheck').value;
    var password_con_syntax = document.getElementById('Password_Confirm_Check').value;

    if (password_syntax !== password_con_syntax) {
      // Perform your authentication logic
      alert("Password not match Please try again.");
      return;
    }

    else if (email_check && password_check && password_con_check && user_check) {
      // Perform your authentication logic
      window.location.href = "login.html"
      alert("Create Account Success.");


    } else {
      alert("Please fill in all fields.");
    }
    }

    // password zone change
    
    function Login_check() {
      var email = document.getElementById('Email').value;
      var password = document.getElementById('Password').value;

      if (email == "user123@gmail.com" && password == "123456") {
        window.location.href = "index.html";
        alert("Login successful");
      }
      else {
        alert("Incorrect email or password");
      }
    }