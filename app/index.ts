import { UserService } from "./services/user.service";

const userService = new UserService()

function renderData(): void {
    userService.getAll()
        .then(users => {
            const table = document.querySelector("table tbody");

            if (!table) {
                console.error('Table body not found');
                return;
            }

            for (let i = 0; i < users.length; i++) {
                const newRow = document.createElement("tr");

                const userid = String(users[i].id);

                const cell2 = document.createElement("td");
                cell2.textContent = users[i].username;
                newRow.appendChild(cell2);

                const cell3 = document.createElement("td");
                cell3.textContent = users[i].name;
                newRow.appendChild(cell3);

                const cell4 = document.createElement("td");
                cell4.textContent = users[i].lastName;
                newRow.appendChild(cell4);

                const cell5 = document.createElement("td");
                const date = new Date(users[i].birthday);
                // Formatiramo u dd.mm.yyyy
                const formattedDate = date.toLocaleDateString("sr-RS", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });

                cell5.textContent = formattedDate;
                newRow.appendChild(cell5);
                // Kreiranje ćelije za dugme "Edit"
                const cell6 = document.createElement('td')
                const editButton = document.createElement('button')
                editButton.textContent = 'Izmeni'
                editButton.addEventListener('click', function () {
                    window.location.href = `./usersForm/usersForm.html?id=${userid}`
                });
                cell6.appendChild(editButton)
                newRow.appendChild(cell6)

                const cell7 = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Obrisi';
                deleteButton.onclick = function () {
                    userService.deleteUser(userid.toString())
                        .then(() => {
                            window.location.reload();
                        })
                        .catch(error => {
                            console.error(error.status, error.text);
                        });
                };
                cell7.appendChild(deleteButton);
                newRow.appendChild(cell7);
                table.appendChild(newRow);
            }
        })
        .catch(error => {
            console.error(error.status, error.message);
        });
}

renderData();
