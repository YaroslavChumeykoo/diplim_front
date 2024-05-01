const butLogIn = document.querySelector('.log-in');
const butLogUs = document.querySelector('.log-us');
const butLogOut = document.querySelector('.log-out')
const roleUser = document.querySelector('.role-user');
const nameUser = document.querySelector('.name-user');
const modalWindowLogin = document.querySelector('#login');
const modalWindowRegistr = document.querySelector('#registration');
const inputEmailLogin = document.querySelector('#login_email');
const inputPasswordLogin = document.querySelector('#login_password');
const butLogin = document.querySelector('.login_button');
const inputEmailRegistr = document.querySelector('#registration_email');
const inputPasswordRegistr = document.querySelector('#registration_password');
const butRegistr = document.querySelector('.registration_button');
const butAllTasks = document.querySelector('.tasks-all');



const url = 'http://localhost:3001/'
let token = '';
let role = '';


const logOut = () => {
  token = '';
  role = '';
  butLogIn.classList.remove('none');
  butLogUs.classList.remove('none');
  butLogOut.classList.add('none');
  roleUser.innerHTML = `Your role: User`;
  nameUser.innerHTML = `You: Guest`;
  localStorage.removeItem('data');
  localStorage.removeItem('email');
}

const successLogin = (data, email) => {
  localStorage.setItem("data", JSON.stringify(data));
  localStorage.setItem("email", email);
  if (data) {
    token = data.token;
    role = data.role;
    butLogIn.classList.add('none');
    butLogUs.classList.add('none');
    butLogOut.classList.remove('none');
    modalWindowLogin.classList.add('none');
    modalWindowRegistr.classList.add('none');
    roleUser.innerHTML = `Your role: ${role}`;
    nameUser.innerHTML = `You: ${email}`;
  }
}

const getData = () => {
  const data = JSON.parse(localStorage.getItem('data'));
  const email = localStorage.getItem('email');
  successLogin(data, email)
}

getData();

const login = () => {
    const email = inputEmailLogin.value;
    const password = inputPasswordLogin.value;
    inputEmailLogin.value = "";
    inputPasswordLogin.value = "";
    fetch(url + "auth/login", {
        method: 'Post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        })
    }).then((res) => {
      if (!res.ok) return res.json().then(err => {throw new Error(`${err.message}`)});
      return res.json();
    }).then((data) => {
      successLogin(data, email)
    }).catch((res) => alert(res))
};


const registration = () => {
  const email = inputEmailRegistr.value;
  const password = inputPasswordRegistr.value;
  inputEmailRegistr.value = "";
  inputPasswordRegistr.value = "";
  fetch(url + "auth/registration", {
      method: 'Post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
  }).then((res) => {
    if (!res.ok) return res.json().then(err => {throw new Error(`${err.message}`)});
      return res.json();
  }).then((data) => {
    successLogin(data, email)
  }).catch((res) => alert(res))
}

const getAllUser = () => {
  fetch(url + 'users', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,  
    }
  }).then((res) => {
    if (!res.ok) return res.json().then(err => {throw new Error(`${err.message}`)});
      return res.json();
  })
  .then((data) => console.log(data))
  .catch((res) => alert(res))
}

const getAllTasks = () => {

  fetch(url + 'tasks', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,  
    }
  }).then((res) => {
    if (!res.ok) return res.json().then(err => {throw new Error(`${err.message}`)});
      return res.json();
  })
  .then((data) => console.log(data))
  .catch((res) => alert(res))
}

const showModal = (event) => {
  if (event.target.innerHTML === 'Log in') {
    modalWindowLogin.classList.remove('none')
  } else modalWindowRegistr.classList.remove('none')
}

const hideModal = (event) => {
  if (event.target.classList.contains('modal_window') || event.target.alt === 'X') {
    modalWindowLogin.classList.add('none');
    modalWindowRegistr.classList.add('none');
  }
}

butLogIn.addEventListener('click', showModal);
butLogUs.addEventListener('click', showModal);
modalWindowLogin.addEventListener('click', hideModal);
modalWindowRegistr.addEventListener('click', hideModal);
butLogin.addEventListener("click", login);
butRegistr.addEventListener('click', registration);
butLogOut.addEventListener('click', logOut);
butAllTasks.addEventListener('click', getAllTasks);
