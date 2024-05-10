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
const mainSection = document.querySelector('.main_section');
const containerTasks = document.querySelector('.for-tasks');
const containerForTasks = document.querySelector('.container-tasks');
const typeTasks = document.querySelector('.type-tasks');
const levelTasks = document.querySelector('.level-tasks');
const createNewTask = document.querySelector('.create-task');
const containerCreateTask = document.querySelector('.for-create-task');
const butAllUsers = document.querySelector('.all-users');
const containerAllUsers = document.querySelector('.container-for-all-users');



const url = 'http://localhost:3001/'
let token = '';
let role = '';
let tasks = [];
let users = [];


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
  mainSection.classList.remove('none');
  containerTasks.classList.add('none');
  containerCreateTask.classList.add('none');
  containerAllUsers.classList.add('none')
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
    butAllUsers.classList.remove('none');
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

const renderAllUsers = () => {
  let renderList = '';
  users.forEach((user) => {
    const render = `
    <div class="user" id="${user.id}">
      <p>Email: ${user.email}</p>
      <p>Role: ${user.role}</p>
      <button onclick="updateUserRole('admin','${user.role}', '${user.id}')">Add admin role</button>
      <button onclick="updateUserRole('user','${user.role}', '${user.id}')">Remove admin role</button>
    </div>`
    renderList += render;
  });
  containerAllUsers.innerHTML = `<h1>List All Users</h1>${renderList}`
}

const updateUserRole = (addRole, userRole, id) => {
  if (addRole === userRole) {
    alert(`This user is already: ${userRole}`)
  } else {
    fetch(`${url}users/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json'  
      },
      body: JSON.stringify({
        role: addRole
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('error');
        return res.json();
      })
      .then((data) => {
        users.forEach((user) => {
          if (user.id === data.id) user.role = data.role
        })
        renderAllUsers()
      })
  }
};

const getAllUser = () => {
  containerTasks.classList.add('none');
  containerCreateTask.classList.add('none');
  mainSection.classList.add('none')
  containerAllUsers.classList.remove('none')
  fetch(url + 'users', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,  
    }
  }).then((res) => {
    if (!res.ok) return res.json().then(err => {throw new Error(`${err.message}`)});
      return res.json();
  })
  .then((data) => {
    users = data
    renderAllUsers()
  })
  .catch((res) => alert(res))
}


const requestAddNewTask = () => {
  if (containerCreateTask.childNodes[3].value === '' 
  || containerCreateTask.childNodes[9].value === '') {
    alert('Enter the name and text of the task');
  } else {
    const photo = new Blob([containerCreateTask.childNodes[11].files[0]])
    const formData = new FormData();
    formData.append('name', containerCreateTask.childNodes[3].value);
    formData.append('text', containerCreateTask.childNodes[9].value);
    formData.append('tag', containerCreateTask.childNodes[5].childNodes[1].value);
    formData.append('level', containerCreateTask.childNodes[7].childNodes[1].value);
    
    // Проверка, есть ли файл
    const fileInput = containerCreateTask.childNodes[11].files[0];
    if (fileInput) {
      formData.append('photo', photo);
    }
    containerCreateTask.childNodes[3].value = '';
    containerCreateTask.childNodes[9].value = '';
    containerCreateTask.childNodes[11].value = '';

    fetch(`${url}tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,  
      },
      body: formData, 
    })
    .then(res => {
      if(!res.ok) throw new Error('error');
      return res.json();
    })
    .then(data => {
      tasks.push(data);
      renderTasks()
    })
  }

};

const removeTask = (id) => {
  fetch(`${url}tasks/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,  
    },
  })
    .then((res) => {
      if(!res.ok) throw new Error('error');
      return res
    })
    .then(() => {
      tasks = tasks.filter((item) => item.id !== id);
    renderTasks();
  })
  
}

const renderTasks = () => {
  containerCreateTask.classList.add('none');
  mainSection.classList.add('none');
  containerTasks.classList.remove('none');
  containerAllUsers.classList.add('none')
  let renderList = ``;
 
  tasks.forEach((item) => {
    if ((typeTasks.value === item.tag || 
    typeTasks.value === 'ALL') &&
    (levelTasks.value === item.level.toUpperCase() || levelTasks.value === 'ALL')) {
      const render = `
      <div class="task">
        <div class="task-name">${item.name.toUpperCase()}</div>
        <div class="tag">Type: ${item.tag.toUpperCase()}</div>
        <div class="level">Level: ${item.level}</div>
        <div class="task-text">${item.text}</div>
        <img class="photo-task" src="${item.photo ? item.photo : 'style/task.webp'}">
        <button onclick="removeTask(${item.id})" class="remove-task ${role === 'admin' ? '' : 'none'}">Remove Task</button>
      </div>
      `
      renderList += render
    }
  });
  containerForTasks.innerHTML = renderList

  if(role === 'admin') {
    const butAddTask = document.createElement('button');
    butAddTask.classList.add('addTask');
    butAddTask.addEventListener('click', () => {
      containerTasks.classList.add('none');
      containerCreateTask.classList.remove('none');
    });
    butAddTask.innerHTML = 'Add Task'
    containerForTasks.prepend(butAddTask);
  }
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
  .then((data) => {
    tasks = data
    renderTasks()
  })
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

levelTasks.addEventListener('change', renderTasks);
typeTasks.addEventListener('change', renderTasks);
butLogIn.addEventListener('click', showModal);
butLogUs.addEventListener('click', showModal);
modalWindowLogin.addEventListener('click', hideModal);
modalWindowRegistr.addEventListener('click', hideModal);
butLogin.addEventListener("click", login);
butRegistr.addEventListener('click', registration);
butLogOut.addEventListener('click', logOut);
butAllTasks.addEventListener('click', getAllTasks);
createNewTask.addEventListener('click', requestAddNewTask);
butAllUsers.addEventListener('click', getAllUser)