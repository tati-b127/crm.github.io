(() => {
  const PATH = "http://localhost:3000/api/clients";
  const spinner = document.createElement("div");
  const TBODY = document.getElementById("clients-list");
  TBODY.append(spinner);
  spinner.classList.add("spinner");
  spinner.classList.add("hidden");
  console.log(TBODY);

  // загрузка данных с сервера
  async function loadData() {
    spinner.classList.remove("hidden");
    let response = await fetch(PATH, {
      method: "GET",
    });
    if (response.status === 200 || 201) {
      const data = await response.json();
      return data;
    } else {
      return response;
    }
  }
  // получение данных клиента по его ID
  async function getClientData(id) {
    let response = await fetch(`${PATH}/${id}`, {
      method: "GET",
    });
    if (response.status === 200 || 201) {
      const data = await response.json();
      return data;
    } else {
      return response;
    }
  }
  //  удаление текущего клиента по его ID
  async function deleteData(id) {
    spinner.classList.remove("hidden");
    let response = await fetch(`${PATH}/${id}`, {
      method: "DELETE",
    });
    console.log(response.status);
    if (response.status === 200 || 201) {
      const data = await response.json();
      return data;
    } else {
      let message = "Что-то пошло не так";
      return message;
    }
  }
  // добавление нового клиента в БД
  async function addData(clientItem) {
    spinner.classList.remove("hidden");
    let response = await fetch(PATH, {
      method: "POST",
      body: JSON.stringify(clientItem),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200 || 201) {
      const data = await response.json();
      return data;
    } else {
      return response;
    }
  }
  // изменение данных о клиенте
  async function changeData(id, clientItem) {
    let response = await fetch(`${PATH}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(clientItem),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200 || 201) {
      const data = await response.json();
      return data;
    } else {
      return response;
    }
  }

  // Клиент
  class Client {
    constructor(id, surname, name, lastName, createdAt, updatedAt, contacts) {
      this.id = id;
      this.name = name;
      this.surname = surname;
      this.lastName = lastName;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.contacts = contacts;
    }
    // создание ФИО
    createFullName() {
      let fullName = [
        this.surname.trim(),
        this.name.trim(),
        this.lastName.trim(),
      ].join(" ");
      return fullName;
    }
    // получение даты в формате
    getCreatedDate() {
      let createdTime =
        this.createdAt.split("T")[0].split("-").reverse().join(".") +
        " " +
        this.createdAt.split("T")[1].split(":", 2).join(":");
      return createdTime;
    }
    // получение текущей даты в формате
    getCurrentDate() {
      let updatedTime =
        this.updatedAt.split("T")[0].split("-").reverse().join(".") +
        " " +
        this.updatedAt.split("T")[1].split(":", 2).join(":");
      return updatedTime;
    }
    getContacts() {
      return this.contacts;
    }
  }

  // Модальное окно
  class Modal {
    constructor(props) {
      this.title = props.title;
      this.id = props.id;
      this.name = props.name;
      this.surname = props.surname;
      this.lastName = props.lastName;
      this.contacts = props.contacts;
    }
    // создание модального окна
    createModal() {
      const main = document.querySelector(".main"),
        fixedOverlay = document.createElement("div"),
        modalWindow = document.createElement("div"),
        modalTitle = document.createElement("h2"),
        modalId = document.createElement("h3"),
        inputDivName = document.createElement("div"),
        inputDivSurname = document.createElement("div"),
        inputDivLastName = document.createElement("div"),
        inputName = document.createElement("input"),
        inputSurname = document.createElement("input"),
        inputLastName = document.createElement("input"),
        btnClose = document.createElement("button"),
        formCreateClient = document.createElement("form"),
        btnSave = document.createElement("button"),
        btnAddContact = document.createElement("button"),
        btnDeleteCurrentContact = document.createElement("button");

      fixedOverlay.classList.add("fixed-overlay");
      modalWindow.classList.add("modal-window");
      fixedOverlay.classList.remove("hidden");
      modalWindow.classList.remove("hidden");
      formCreateClient.classList.add("form");
      inputDivName.classList.add("input-div");
      inputDivSurname.classList.add("input-div");
      inputDivLastName.classList.add("input-div");
      btnClose.classList.add("btn-close");
      btnSave.classList.add("btn-save");
      btnDeleteCurrentContact.classList.add("btn-delete-client");
      btnAddContact.classList.add("btn-add-contact");
      inputName.setAttribute("required", "true");
      inputSurname.setAttribute("required", "true");
      btnSave.setAttribute("type", "submit");

      inputName.placeholder = "Имя*";
      inputSurname.placeholder = "Фамилия*";
      inputLastName.placeholder = "Отчество";
      btnSave.textContent = "Сохранить";
      btnAddContact.textContent = "Добавить контакт";
      btnDeleteCurrentContact.textContent = "Удалить клиента";

      modalTitle.textContent = this.title;
      modalId.textContent = `ID: ${this.id}`;
      inputName.value = this.name;
      inputSurname.value = this.surname;
      inputLastName.value = this.lastName;

      formCreateClient.setAttribute("id", "form");
      inputName.setAttribute("id", "name");
      inputSurname.setAttribute("id", "surname");

      inputDivName.append(inputName);
      inputDivSurname.append(inputSurname);
      inputDivLastName.append(inputLastName);
      formCreateClient.append(
        inputDivSurname,
        inputDivName,
        inputDivLastName,
        btnAddContact,
        btnSave
      );
      if (this.title === "Изменить данные")
        formCreateClient.append(btnDeleteCurrentContact);
      modalWindow.append(modalTitle);
      modalWindow.append(modalId);
      modalWindow.append(btnClose);
      modalWindow.append(formCreateClient);
      fixedOverlay.append(modalWindow);
      main.append(fixedOverlay);

      formCreateClient.addEventListener("submit", (e) => {
        e.preventDefault();
      });
      // закрывает модальное окно
      btnClose.addEventListener("click", (e) => {
        e.preventDefault();
        renderClient();
        main.removeChild(fixedOverlay);
      });
      // добавляет новый контак в форму
      btnAddContact.addEventListener("click", (e) => {
        e.preventDefault();
        btnAddContact.before(createContactBlock());
        let arrContactBlock = document.querySelectorAll(".contact-block");
        if (arrContactBlock.length >= 10) btnAddContact.classList.add("hidden");
      });
      // в зависимости от title окна отравляет POST/PATCH
      btnSave.addEventListener("click", async () => {
        let name = inputName.value;
        let surname = inputSurname.value;
        let lastName = inputLastName.value;
        let arrContact = getClientItemContact();

        const clientItem = {
          name: name,
          surname: surname,
          lastName: lastName,
          contacts: arrContact,
        };

        let clientId = this.id;
        if (this.title === "Новый клиент") {
          validate();
          // spinner.classList.remove('hidden')
          btnSave.classList.add("spinner-btn");
          let response = await addData(clientItem);
          console.log(response);
          if (Array.isArray(response.errors)) {
            let messageBlock = document.createElement("div");
            messageBlock.classList.add("message-block");
            response.errors.forEach((error) => {
              let message = document.createElement("div");
              message.classList.add("message");
              message.textContent = "";
              message.textContent = `Ошибка: ${error.message}`;
              btnSave.classList.remove("spinner-btn");
              messageBlock.append(message);
            });
            btnSave.before(messageBlock);
          } else {
            spinner.classList.remove("hidden");
            console.log(response);
            renderClient();
            main.removeChild(fixedOverlay);
            spinner.classList.add("hidden");
          }
        } else {
          validate();
          // spinner.classList.remove('hidden')
          btnSave.classList.add("spinner-btn");
          let response = await changeData(clientId, clientItem);
          if (Array.isArray(response.errors)) {
            let messageBlock = document.createElement("div");
            messageBlock.classList.add("message-block");
            response.errors.forEach((error) => {
              let message = document.createElement("div");
              message.classList.add("message");
              message.textContent = "";
              message.textContent = `Ошибка: ${error.message}`;
              btnSave.classList.remove("spinner-btn");
              messageBlock.append(message);
            });
            btnSave.before(messageBlock);
          } else {
            spinner.classList.remove("hidden");
            renderClient();
            main.removeChild(fixedOverlay);
            spinner.classList.add("hidden");
          }
        }
      });
      btnDeleteCurrentContact.addEventListener("click", (e) => {
        e.preventDefault();
        btnDeleteCurrentContact.classList.add("spinner-btn");
        main.removeChild(fixedOverlay);
        console.log(this.id);
        let modalDel = new ModalDelete({
          title: "Удалить клиента",
          id: this.id,
        });
        modalDel.createModal();
      });
    }
  }

  class ModalDelete extends Modal {
    createModal() {
      const main = document.querySelector(".main"),
        fixedOverlay = document.createElement("div"),
        modalWindow = document.createElement("div"),
        modalTitle = document.createElement("h2"),
        modalId = document.createElement("h3"),
        modalDescription = document.createElement("p"),
        btnClose = document.createElement("button"),
        btnDelete = document.createElement("button"),
        btnReset = document.createElement("button");

      fixedOverlay.classList.add("fixed-overlay");
      modalWindow.classList.add("modal-window-delete");
      fixedOverlay.classList.remove("hidden");
      modalWindow.classList.remove("hidden");
      modalId.classList.add("hidden");
      modalDescription.classList.add("modal-description");
      btnClose.classList.add("btn-close");
      btnDelete.classList.add("btn-delete-action");
      btnReset.classList.add("btn-reset");

      modalTitle.textContent = this.title;
      modalId.textContent = this.id;
      modalDescription.textContent =
        "Вы действительно хотите удалить данного клиента?";
      btnReset.textContent = "Отмена";
      btnDelete.textContent = "Удалить";
      modalWindow.append(
        modalTitle,
        modalId,
        modalDescription,
        btnClose,
        btnDelete,
        btnReset
      );
      fixedOverlay.append(modalWindow);
      main.append(fixedOverlay);

      btnClose.addEventListener("click", (e) => {
        e.preventDefault();
        main.removeChild(fixedOverlay);
      });
      btnReset.addEventListener("click", (e) => {
        e.preventDefault();
        main.removeChild(fixedOverlay);
      });
      btnDelete.addEventListener("click", async (e) => {
        e.preventDefault();
        btnDelete.classList.add("spinner-btn");
        spinner.classList.remove("hidden");
        let response = await deleteData(this.id);
        console.log(response);
        if (response === "Что-то пошло не так") {
          let message = document.createElement("div");
          message.classList.add("message");
          message.textContent = "";
          message.textContent = response;
          btnSave.classList.remove("spinner-btn");
          btnDelete.before(message);
        } else {
          main.removeChild(fixedOverlay);
          renderClient();
          spinner.classList.add("hidden");
        }
      });
    }
  }

  // создает блок контакта в модальном окне
  function createContactBlock(type, value) {
    const contactBlock = document.createElement("div");
    const inputContact = document.createElement("input");
    const selectTypeContact = document.createElement("select");
    const btnContactDelete = document.createElement("button");
    contactBlock.classList.add("contact-block");
    inputContact.classList.add("input-contact");
    btnContactDelete.classList.add("btn-contact-delete");
    selectTypeContact.classList.add("select");
    inputContact.placeholder = "Введите данные контакта";
    inputContact.value = value ? value : "";
    inputContact.setAttribute("id", "contact");

    let option = ["Телефон", "Email", "VK", "Facebook", "Twitter", "Другое"];
    for (let i of option) {
      const optionContact = document.createElement("option");
      optionContact.classList.add("option");
      optionContact.value = i;
      optionContact.textContent = i;
      selectTypeContact.append(optionContact);
      selectTypeContact.value = type ? type : option[0];
    }
    contactBlock.append(selectTypeContact, inputContact, btnContactDelete);
    btnContactDelete.addEventListener("click", (e) => {
      e.preventDefault();
      let arrContactBlock = document.querySelectorAll(".contact-block");
      let btnAddContact = document.querySelector(".btn-add-contact");
      if (arrContactBlock.length <= 10)
        btnAddContact.classList.remove("hidden");
      contactBlock.parentElement.removeChild(contactBlock);
    });
    return contactBlock;
  }
  // отрисовывает блок кнопок контактов в таблице, по клику отображает type: value
  function renderContacts(contacts) {
    let contactFlex = document.createElement("div");
    contactFlex.classList.add("contact-flex-box");
    contacts.forEach((obj) => {
      let contactBtn = document.createElement("button");
      let contactTooltip = document.createElement("div");

      contactTooltip.classList.add("contact-tooltip");
      contactTooltip.classList.add("hidden");
      contactBtn.classList.add("contact-link");
      contactTooltip.textContent = `${obj.type}: ${obj.value}`;

      if (obj.type === "VK") contactBtn.classList.add("vk");
      if (obj.type === "Facebook") contactBtn.classList.add("fb");
      if (obj.type === "Twitter") contactBtn.classList.add("other");
      if (obj.type === "Email") contactBtn.classList.add("email");
      if (obj.type === "Телефон") contactBtn.classList.add("phone");
      if (obj.type === "Другое") contactBtn.classList.add("other");

      contactBtn.addEventListener("click", () => {
        contactTooltip.classList.toggle("hidden");
      });
      contactBtn.append(contactTooltip);
      contactFlex.append(contactBtn);
    });
    let contactBtns = contactFlex.childNodes;
    console.log(contactBtns[0]);
    if (contactBtns.length > 4) {
      const increment = document.createElement("button");
      increment.classList.add("contact-link", "inc");
      increment.textContent = `+${contactBtns.length - 4}`;
      for (let i = 4; contactBtns.length > i; i++) {
        console.log(i);
        contactBtns[i].classList.add("hidden");
      }
      contactFlex.append(increment);
      increment.addEventListener("click", () => {
        console.log(contactFlex);
        for (let i = 4; contactBtns.length > i; i++) {
          console.log(i);
          contactBtns[i].classList.remove("hidden");
          increment.classList.add("hidden");
        }
      });
      return contactFlex;
    } else {
      return contactFlex;
    }
  }

  // получает объект данных клиента для таблицы
  async function clientLoader() {
    spinner.classList.remove("hidden");
    console.log(spinner);
    let data = await loadData();
    let clientBase = [];

    for (item of data) {
      let clientItem = new Client(
        item.id,
        item.surname,
        item.name,
        item.lastName,
        item.createdAt,
        item.updatedAt,
        item.contacts
      );
      let id = clientItem.id;
      let fullName = clientItem.createFullName();
      let createdDate = clientItem.getCreatedDate();
      let currentDate = clientItem.getCurrentDate();
      let contacts = clientItem.getContacts();

      clientBase.push({ id, fullName, createdDate, currentDate, contacts });
    }
    console.log(clientBase);
    return clientBase;
  }

  // создает и возвращает массив объектов контактов из формы модального окна [{type: select, value: input}]
  function getClientItemContact() {
    const blocks = document.querySelectorAll(".contact-block");
    let arrayContacts = [];

    for (i of blocks) {
      let obj = {};
      let select = i.childNodes[0].value;
      let input = i.childNodes[1].value;
      obj.type = select;
      obj.value = input;
      arrayContacts.push(obj);
    }
    return arrayContacts;
  }
  // создание кнопок действия в таблице
  function createBtnAction(idClient) {
    let btnBlock = document.createElement("div"),
      btnChange = document.createElement("button"),
      btnDelete = document.createElement("button");
    btnBlock.classList.add("btn-block");
    btnChange.classList.add("btn-change");
    btnDelete.classList.add("btn-delete");
    btnChange.textContent = "Изменить";
    btnDelete.textContent = "Удалить";
    btnBlock.append(btnChange);
    btnBlock.append(btnDelete);

    btnDelete.addEventListener("click", (e) => {
      idClient = e.target.parentNode.parentNode.parentNode.dataset.clientId;
      let modalDel = new ModalDelete({
        title: "Удалить клиента",
        id: idClient,
      });
      modalDel.createModal();
    });
    btnChange.addEventListener("click", async (e) => {
      idClient = e.target.parentNode.parentNode.parentNode.dataset.clientId;
      spinner.classList.remove("hidden");
      let data = await getClientData(idClient);
      let modalChange = new Modal({
        title: "Изменить данные",
        id: data.id,
        surname: data.surname,
        name: data.name,
        lastName: data.lastName,
        contacts: data.contacts,
      });
      modalChange.createModal();
      for (let i of data.contacts) {
        console.log(i.type, i.value);
        let type = i.type;
        let value = i.value;
        let btn = document.querySelector(".btn-add-contact");
        btn.before(createContactBlock(type, value));
      }
      spinner.classList.add("hidden");
    });
    return btnBlock;
  }
  async function addNewClient() {
    const btnAddClient = document.querySelector(".btn-add");
    btnAddClient.addEventListener("click", () => {
      spinner.classList.remove("hidden");
      let modalNew = new Modal({
        title: "Новый клиент",
        id: "",
        surname: "",
        name: "",
        lastName: "",
      });
      spinner.classList.add("hidden");
      modalNew.createModal();
    });
  }
  addNewClient();
  async function renderClient(arr) {
    const tableBody = document.getElementById("clients-list");
    tableBody.innerHTML = "";
    tableBody.appendChild(spinner);
    spinner.classList.remove("hidden");
    let clientsArr;
    if (Array.isArray(arr)) clientsArr = arr;
    else clientsArr = await clientLoader();
    for (i of clientsArr) {
      const tableRow = document.createElement("tr");

      tableRow.style.height = "60";
      let idClient = document.createElement("td"),
        fullNameClient = document.createElement("td"),
        timeCreated = document.createElement("td"),
        timeUpdated = document.createElement("td"),
        contactsClient = document.createElement("td"),
        btnAction = document.createElement("td");
      idClient.textContent = i.id;
      fullNameClient.textContent = i.fullName;
      timeCreated.textContent = i.createdDate;
      timeUpdated.textContent = i.currentDate;
      btnAction.append(createBtnAction());
      contactsClient.append(renderContacts(i.contacts));

      tableRow.dataset.clientId = i.id;
      tableRow.append(
        idClient,
        fullNameClient,
        timeCreated,
        timeUpdated,
        contactsClient,
        btnAction
      );
      tableBody.append(tableRow);
      console.log(tableRow.cells[0]);
    }
    spinner.classList.add("hidden");
    return tableBody;
  }
  renderClient();

  // сортировка столбцов таблицы по параметрам
  function sortClientTable() {
    const table = document.querySelector("table");
    const headers = table.querySelectorAll("th[data-column]");
    const tbody = table.querySelector("tbody");
    const sortItems = Array.from(headers);
    // замена класса при клике на заголовок
    for (const item of sortItems) {
      item.addEventListener("click", () => {
        let span = item.childNodes[1];
        if (span.classList.contains("sort-down")) {
          span.classList.remove("sort-down");
          span.classList.add("sort-up");
        } else {
          span.classList.add("sort-down");
          span.classList.remove("sort-up");
        }
      });
    }
    const directions = Array.from(headers).map(() => "");

    const transform = (type, content) => {
      switch (type) {
        case "id":
          return parseFloat(content);
        case "createdAt":
        case "updatedAt":
          return content.split(".").reverse().join("-");
        case "fullName":
        default:
          return content;
      }
    };
    const sortColumn = (index) => {
      const type = headers[index].getAttribute("data-column");
      const rows = tbody.querySelectorAll("tr[data-client-id]");
      const direction = directions[index] || "sortUp";
      const multiply = direction === "sortUp" ? 1 : -1;
      const newRows = Array.from(rows);

      newRows.sort((row1, row2) => {
        const cellA = row1.querySelectorAll("td")[index].textContent;
        const cellB = row2.querySelectorAll("td")[index].textContent;

        const a = transform(type, cellA);
        const b = transform(type, cellB);

        switch (true) {
          case a > b:
            return 1 * multiply;
          case a < b:
            return -1 * multiply;
          default:
            break;
          case a === b:
            return 0;
        }
      });
      [].forEach.call(rows, (row) => {
        tbody.removeChild(row);
      });
      directions[index] = direction === "sortUp" ? "sortDown" : "sortUp";
      newRows.forEach((newRow) => {
        tbody.appendChild(newRow);
      });
    };

    [].forEach.call(headers, (header, index) => {
      if (index === 0) sortColumn(index);
      // сортировка по первому столбцу ?
      header.addEventListener("click", () => {
        sortColumn(index);
        console.log(index);
      });
    });
  }

  // получаем массив из отфильтрованных данных
  function filterClientsList(arr, prop, value) {
    let resultFilter = [];
    let clientListCopy = [...arr];
    console.log(clientListCopy);

    for (let item of clientListCopy) {
      if (String(item[prop]).toLowerCase().includes(String(value))) {
        resultFilter.push(item);
        console.log(resultFilter);
      }
    }
    return resultFilter;
  }
  function validate() {
    const validate = new window.JustValidate("#form");
    validate
      .addField("#name", [
        {
          rule: "required",
          errorMessage: "Введите Имя",
        },
      ])
      .addField("#surname", [
        {
          rule: "required",
          errorMessage: "Введите Фамилию",
        },
      ]);
    let inputContacts = document.querySelectorAll(".input-contact");
    console.log(inputContacts);
    if (inputContacts !== null) {
      inputContacts.forEach(() => {
        validate.addField(".input-contact", [
          {
            rule: "required",
            errorMessage: "Введите данные контакта",
          },
        ]);
      });
    }
    return;
  }
  document.addEventListener("DOMContentLoaded", sortClientTable());
  document.addEventListener("DOMContentLoaded", () => {
    let search = document.querySelector('.form-search')
    console.log(search);
    search.addEventListener("submit", (e) => {
        e.preventDefault()
    })
    let timer;
    input = document.getElementById("search");
    input.addEventListener("input", () => {
      const filterValue = input.value;
      clearTimeout(timer);
      timer = setTimeout(async function () {
        let filter = filterClientsList(
          await clientLoader(),
          "fullName",
          filterValue
        );
        if (Array.isArray(filter)) renderClient(filter);
      }, 400);
    });
  });
})();
