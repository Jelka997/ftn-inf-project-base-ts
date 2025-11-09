import { UserFormData } from "../model/userForm.model";
import { UserService } from "../services/user.service";

const userService = new UserService;

function initializeForm(): void {
    const queryString = window.location.search;
    const urlparams = new URLSearchParams(queryString);
    const id = urlparams.get('id');

    if (id) {
        userService.getById(id)
            .then(user => {
                (document.querySelector('#username') as HTMLInputElement).value = user.username;
                (document.querySelector('#name') as HTMLInputElement).value = user.name;
                (document.querySelector('#lastName') as HTMLInputElement).value = user.lastName;
                (document.querySelector('#birthday') as HTMLInputElement).value = user.birthday.toISOString().split('T')[0];
            }).catch(error => {
                console.error(error.status, error.text);
            })
    }
}

function submit() {
    const button = document.querySelector("#submitBtn") as HTMLButtonElement;
    const spinner = document.querySelector("#loadingSpinner") as HTMLElement;
    const errorMessage = document.querySelector("#errorMessage") as HTMLElement;
    
    button.disabled = true;
    errorMessage.textContent = "";
    spinner.classList.remove("hidden");

    const username = (document.querySelector('#username') as HTMLInputElement).value
    const name = (document.querySelector('#name') as HTMLInputElement).value
    const lastname = (document.querySelector('#lastName') as HTMLInputElement).value
    const birthdaydate = (document.querySelector('#birthday') as HTMLInputElement).value
    const birthday = new Date(birthdaydate)

    if (!username || !name || !lastname || !birthday) {
        alert("All fields are required!");
        spinner.classList.add("hidden");
        button.disabled = false;
        return
    }

    const formData: UserFormData = { username, name, lastname, birthday }
    const queryString = window.location.search;
    const urlparams = new URLSearchParams(queryString);
    const id = urlparams.get('id');
    if (id) {
        userService.update(id, formData)
            .then(() => {
                window.location.href = '/index.html'
            }).catch(error => {
                console.error(error.status, error.text);
            })
    } else {
        userService.add(formData)
            .then(() => {
                setTimeout(() => {
                    window.location.href = '/index.html';
                    spinner.classList.remove("hidden");
                }, 5000)
            }).catch(error => {
                spinner.classList.remove("visible");
                errorMessage.textContent = "Došlo je do greške prilikom dodavanja korisnika.";
                console.error(error.status, error.text)
                button.disabled = false;
            })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeForm();
    const button = document.querySelector("#submitBtn") as HTMLButtonElement;
    const buttonCancel = document.querySelector("#cancelBtn")
    if (button) {
        button.addEventListener("click", submit)
    }
    if (buttonCancel) {
        buttonCancel.addEventListener("click", function () {
            window.location.href = '/index.html'
        })
    }
})