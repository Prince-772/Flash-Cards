function toggleSideBar() {
  let sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("active");
}

function flipCard(event) {
  let card = event.target.closest(".card");

  if (card.dataset.flipped === "false") {
    card.style.transform = "rotateY(180deg)";
    card.dataset.flipped = "true";
  } else {
    card.style.transform = "rotateY(0deg)";
    card.dataset.flipped = "false";
  }
}
function getLinearGradient(number_of_colors = 2) {
  function getRandomColor() {
    let r = Math.round(Math.random() * 200) + 25; // 25 to 225
    let g = Math.round(Math.random() * 200) + 25; // 25 to 225
    let b = Math.round(Math.random() * 200) + 25; // 25 to 225
    return `, rgb(${r},${g},${b})`;
  }

  let deg = Math.floor(Math.random() * 120) + 30; // 30 to 150
  let color = `${deg}deg`;
  for (let i = 0; i < number_of_colors; i++) {
    color += getRandomColor();
  }
  return `linear-gradient(${color})`;
}
function closeAllModals() {
  let modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => modal.classList.remove("active"));
  modals_box.classList.remove("active");
}
function toggleAddRow(event, shortcut = false) {
  closeAllModals();
  if (add_row_modal_active) {
    add_row_modal_active = false;
    add_row_input.value = "";
  } else {
    add_row_modal.classList.add("active");
    modals_box.classList.add("active");
    add_row_modal_active = true;
    add_row_input.focus()
    shortcut ? null : toggleSideBar();
  }
}
function toggleAddCard(event, rowToInsert) {
  closeAllModals();
  if (add_card_modal_active) {
    add_card_modal_active = false;
    cards_container_selected = null;
    add_card_input_front.value = "";
    add_card_input_back.value = "";
  } else {
    add_card_modal.classList.add("active");
    modals_box.classList.add("active");
    add_card_modal_active = true;
    add_card_input_front.focus()
    cards_container_selected = rowToInsert;
  }
}
function toggelShowShortcuts(event){
  event.stopPropagation()
  show_shortcut_modal.classList.toggle("active")
}
function toggleEditCard(event, card) {
  closeAllModals();
  event.stopPropagation();
  if (edit_card_modal_active) {
    edit_card_modal_active = false;
    editing_card = null;
  } else {
    edit_card_modal.classList.add("active");
    modals_box.classList.add("active");
    edit_card_modal_active = true;
    editing_card = card;
    edit_card_input_front.value =
      card.querySelector(".front .text").textContent;
    edit_card_input_back.value = card.querySelector(".back .text").textContent;
    edit_card_input_front.focus()
  }
}
function onEditCard(event) {
  if (edit_card_input_front.value && edit_card_input_back.value) {
    editing_card.querySelector(".front .text").textContent =
      edit_card_input_front.value;
    editing_card.querySelector(".back .text").textContent =
      edit_card_input_back.value;
    const row = rows.find(
      (row) => row.rowId === Number(editing_card.dataset.row)
    );
    if (row) {
      const card = row.cards.find(
        (card) => card.cardId === Number(editing_card.dataset.cardId)
      );
      if (card) {
        card.frontText = edit_card_input_front.value;
        card.backText = edit_card_input_back.value;
      }
    }

    localStorage.setItem("StudyDeck_rows", JSON.stringify(rows));
    toggleEditCard(event);
  }
}
function toggleDeleteRow(event, shortcut = false) {
  if (deletingRow) {
    deletingRow = false;
    deleteOption.classList.remove("active");
  } else {
    deletingRow = true;
    deleteOption.classList.add("active");
    shortcut ? null : toggleSideBar();
  }
  toggleClassNameOfBtns();
}
function toggelManageCards(event, shortcut = false) {
  let btns = document.querySelectorAll(".card .btn");
  if (managingCards) {
    managingCards = false;
    manageCardsOption.classList.remove("active");
    btns.forEach((btn) => btn.classList.remove("active"));
  } else {
    managingCards = true;
    manageCardsOption.classList.add("active");
    btns.forEach((btn) => btn.classList.add("active"));
    shortcut ? null : toggleSideBar();
  }
}
function toggleClassNameOfBtns(addBtn, deleteBtn) {
  if (!addBtn && !deleteBtn) {
    let add_btns = Array.from(document.querySelectorAll(".cards .add-card"));
    let delete_btns = Array.from(
      document.querySelectorAll(".cards .delete-row")
    );
    if (!deletingRow) {
      add_btns.forEach((btn) => (btn.className = "add-card active"));
      delete_btns.forEach((btn) => (btn.className = "delete-row disabled"));
    } else {
      add_btns.forEach((btn) => (btn.className = "add-card disabled"));
      delete_btns.forEach((btn) => (btn.className = "delete-row active"));
    }
  } else {
    if (!deletingRow) {
      addBtn.className = "add-card active";
      deleteBtn.className = "delete-row disabled";
    } else {
      addBtn.className = "add-card disabled";
      deleteBtn.className = "delete-row active";
    }
  }
}
function toggleRowName(event,new_row_name,hideShowBtn){
  event.stopPropagation()
  hideShowBtn.classList.toggle("hidden")
  new_row_name.classList.toggle("hidden")
}
function onAddRow() {
  let new_name = add_row_input.value.trim();
  if (new_name) {
    let new_row = createRow(new_name);
    rows_box.appendChild(new_row);
    new_row.classList.add("adding-row");
    setTimeout(() => new_row.classList.remove("adding-row"), 200);
    rows_number++;
    let row_obj = {
      rowId: rows_number, //row id
      rowName: new_name, //row name
      lastCardId: 0, //last card id
      cards: [], //collection of cards
    };
    rows.push(row_obj);

    new_row.dataset.rowNumber = rows_number;

    add_row_input.value = "";

    localStorage.setItem("StudyDeck_rows", JSON.stringify(rows));
  }
}

function createRow(rowName) {
  let new_row = document.createElement("div");
  new_row.className = "row";
  // new_row.style.backgroundImage = getLinearGradient(5)
  // Row Name Section
  let new_row_name = document.createElement("div");
  new_row_name.className = "name";

  let new_row_name_button = document.createElement("div");
  new_row_name_button.className = "hide-show";

  let new_row_name_buttonImg = document.createElement("img");
  new_row_name_buttonImg.className = "hide";
  new_row_name_buttonImg.src = "Assets/Hide-Show.svg";
  new_row_name_buttonImg.alt = "Hide-Show";
  new_row_name_button.appendChild(new_row_name_buttonImg)

  new_row_name_button.onclick = (event)=>toggleRowName(event,new_row_name,new_row_name_button);

  let new_para = document.createElement("p");
  new_para.textContent = rowName;

  new_row_name.appendChild(new_para);
  new_row.appendChild(new_row_name);
  new_row.appendChild(new_row_name_button);

  // Cards Container
  let new_cards = document.createElement("div");
  new_cards.className = "cards";

  // Add Card Button
  let new_add_card_btn = document.createElement("div");
  new_add_card_btn.onclick = (event) => toggleAddCard(event, new_cards);

  let new_delete_row_btn = document.createElement("div");
  new_delete_row_btn.onclick = (event) => onDelete_row(event, new_row);

  toggleClassNameOfBtns(new_add_card_btn, new_delete_row_btn); //change class with respect to deletingRow value
  // Add Icon for Button
  let new_add_icon = document.createElement("img");
  new_add_icon.src = "Assets/Add Cards.svg";
  new_add_icon.alt = "Add";

  let new_delete_row_icon = document.createElement("img");
  new_delete_row_icon.src = "Assets/Delete Button.svg";
  new_delete_row_icon.alt = "Delete";

  new_add_card_btn.appendChild(new_add_icon);
  new_delete_row_btn.appendChild(new_delete_row_icon);
  new_cards.appendChild(new_delete_row_btn);
  new_cards.appendChild(new_add_card_btn);
  new_row.appendChild(new_cards);

  return new_row;
}

function onAddCard() {
  let new_card_front = add_card_input_front.value.trim();
  let new_card_back = add_card_input_back.value.trim();
  if (new_card_back && new_card_front) {
    let new_card = createCard(new_card_front, new_card_back);
    cards_container_selected.insertBefore(
      new_card,
      cards_container_selected.querySelector(".card")
    );
    new_card.classList.add("adding-card");
    setTimeout(() => new_card.classList.remove("adding-card"), 200);
    let selected_rowId =
      cards_container_selected.closest(".row").dataset.rowNumber;

    let row = rows.find((row) => row.rowId == selected_rowId);
    if (row) {
      let cardId = ++row.lastCardId;
      new_card.dataset.row = selected_rowId; //Row Number of card's row
      new_card.dataset.cardId = cardId; //Card Number
      let card_obj = {
        cardId: cardId,
        frontText: new_card_front,
        backText: new_card_back,
      };

      row.cards.push(card_obj);

      localStorage.setItem("StudyDeck_rows", JSON.stringify(rows));
    }
    add_card_input_back.value = "";
    add_card_input_front.value = "";
    add_card_input_front.focus();
  }
}
function createCard(frontText, backText) {
  if (frontText && backText) {
    let new_card = document.createElement("div");
    let new_card_front_div = document.createElement("div");
    let new_card_back_div = document.createElement("div");

    // Front Side Buttons
    let front_deleteBtn_div = document.createElement("div");
    let front_editBtn_div = document.createElement("div");

    // Back Side Buttons
    let back_deleteBtn_div = document.createElement("div");
    let back_editBtn_div = document.createElement("div");

    //Text for bith sides
    let front_text = document.createElement("span");
    let back_text = document.createElement("span");
    front_text.classList.add("text");
    back_text.classList.add("text");

    // Card Structure
    new_card.className = "card";
    new_card.onclick = (event) => flipCard(event);
    new_card.dataset.flipped = "false";

    new_card_front_div.className = "front face";
    new_card_back_div.className = "back face";

    front_text.textContent = frontText;
    back_text.textContent = backText;

    new_card_front_div.style.background = getLinearGradient();
    new_card_back_div.style.background = getLinearGradient();

    // Assign Classes to Buttons
    front_deleteBtn_div.className = "delete btn";
    front_editBtn_div.className = "edit btn";
    back_deleteBtn_div.className = "delete btn";
    back_editBtn_div.className = "edit btn";

    // Add Event Listeners
    front_deleteBtn_div.onclick = (event) => onDelete_card(event, new_card);
    front_editBtn_div.onclick = (event) => toggleEditCard(event, new_card);
    back_deleteBtn_div.onclick = (event) => onDelete_card(event, new_card);
    back_editBtn_div.onclick = (event) => toggleEditCard(event, new_card);

    // Append Buttons to Card Faces
    new_card_front_div.appendChild(front_text);
    new_card_front_div.appendChild(front_deleteBtn_div);
    new_card_front_div.appendChild(front_editBtn_div);
    new_card_back_div.appendChild(back_text);
    new_card_back_div.appendChild(back_deleteBtn_div);
    new_card_back_div.appendChild(back_editBtn_div);

    // Append Faces to Card
    new_card.appendChild(new_card_front_div);
    new_card.appendChild(new_card_back_div);
    return new_card;
  }
}
function onDelete_card(event, cardToDelete) {
  event.stopPropagation();
  toDeleteCard = cardToDelete;
  closeAllModals()
  modals_box.classList.toggle("active");
  cardConfirmDeleteModal.classList.toggle("active");

  setTimeout(() => {
    cardConfirmDeleteModal.querySelector(".delete").focus();
  }, 100);
}
function onConfirmDeleteCard(event, isConfirmed) {
  event.stopPropagation();
  cardConfirmDeleteModal.classList.toggle("active");
  if (isConfirmed && toDeleteCard) {
    let this_cardRowId = Number(toDeleteCard.dataset.row);
    let this_cardId = Number(toDeleteCard.dataset.cardId);
    toDeleteCard.classList.add("deleting-card");
    setTimeout(() => {
      toDeleteCard.remove();
      toDeleteCard = null;
    }, 200);
    let row = rows.find((row) => row.rowId === this_cardRowId);
    if (row) {
      row.cards = row.cards.filter((card) => card.cardId !== this_cardId);
      localStorage.setItem("StudyDeck_rows", JSON.stringify(rows));
    }
  } else {
    toDeleteCard = null;
  }
}
function onDelete_row(event, rowToDelete) {
  event.stopPropagation();
  toDeleteRow = rowToDelete;
  closeAllModals()
  modals_box.classList.toggle("active");
  rowConfirmDeleteModal.classList.toggle("active");
  setTimeout(() => {
    rowConfirmDeleteModal.querySelector(".delete").focus();
  }, 100);
}
function onConfirmDeleteRow(event, isConfirmed) {
  event.stopPropagation();
  rowConfirmDeleteModal.classList.toggle("active");
  if (isConfirmed && toDeleteRow) {
    let this_rowId = Number(toDeleteRow.dataset.rowNumber);
    toDeleteRow.classList.add("Deleting-row");
    setTimeout(() => {
      toDeleteRow.remove();
      toDeleteRow = null;
    }, 200);
    rows = rows.filter((row) => row.rowId !== this_rowId);
    localStorage.setItem("StudyDeck_rows", JSON.stringify(rows));
  } else {
    toDeleteRow = null;
  }
}
