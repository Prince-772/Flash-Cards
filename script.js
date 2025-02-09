let sidebar_open = false;
let rows = [];
let rows_number = 0;
let modals_box = document.querySelector(".modals");
let modals = Array.from(document.querySelectorAll(".modal"));
let add_row_modal = document.querySelector(".modals .add-row-modal"),
  add_row_modal_active = false;
let add_card_modal = document.querySelector(".modals .add-card-modal"),
  add_card_modal_active = false;
let edit_card_modal = document.querySelector(".modals .edit-card-modal"),
  edit_card_modal_active = false;
const rows_box = document.querySelector(".rows");
let deletingRow = false;
let managingCards = false;
let deleteOption = document.querySelector(".opt.delete-row");
let manageCardsOption = document.querySelector(".opt.manage-cards");
//add_row_modal
const add_row_input = document.querySelector(
  ".add-row-modal input#add-row-input"
);
const add_row_add_btn = document.querySelector(".add-row-modal .btn.add");

//add_card_modal
const add_card_input_front = document.querySelector("#add-card-input-front");
const add_card_input_back = document.querySelector("#add-card-input-back");
const add_card_add_btn = document.querySelector(".add-card-modal .btn.add");
let cards_container_selected = null;

//edit_card_modal
const edit_card_input_front = document.querySelector("#edit-card-input-front");
const edit_card_input_back = document.querySelector("#edit-card-input-back");
const edit_card_add_btn = document.querySelector(".edit-card-modal .btn.edit");
let editing_card = null;


//confirm delete modals
const rowConfirmDeleteModal = document.querySelector(".modal.row-confirm")
const cardConfirmDeleteModal = document.querySelector(".modal.card-confirm")
let toDeleteCard = null
let toDeleteRow = null

add_row_input.addEventListener("keydown", (event) =>
  event.key === "Enter" ? onAddRow() : null
);
add_card_input_front.addEventListener("keydown", (event) =>
  event.key === "Enter" && add_card_input_front.value
    ? add_card_input_back.focus()
    : null
);

add_card_input_back.addEventListener("keydown", (event) =>
  event.key === "Enter" ? onAddCard() : null
);
edit_card_input_front.addEventListener("keydown", (event) =>
  event.key === "Enter" && edit_card_input_front.value
    ? edit_card_input_back.focus()
    : null
);

edit_card_input_back.addEventListener("keydown", (event) =>
  event.key === "Enter" ? onEditCard() : null
);

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === "p") {
    event.preventDefault()
    toggleAddRow(event,true);
  } else if (event.key === "Escape") {
    closeAllModals();
  } else if (event.ctrlKey && event.key.toLowerCase()==="d"){
    event.preventDefault()
    toggleDeleteRow(event, true)
    toggelManageCards(event, true)
  }
});

function loadRowsAndCards() {
  if (localStorage.getItem("StudyDeck_rows")) {
    rows = JSON.parse(localStorage.getItem("StudyDeck_rows"));
    if (rows) {
      rows.forEach((row) => {
        let row_name = row.rowName;
        let row_id = row.rowId;
        let new_row = createRow(row_name);
        new_row.dataset.rowNumber = row_id;
        rows_box.appendChild(new_row);
        row.cards.forEach((card) => {
          let new_card = createCard(card.frontText, card.backText);
          new_card.dataset.flipped = "false";
          new_card.dataset.row = row_id; //Row Number of card's row
          new_card.dataset.cardId = card.cardId; //Card Number
          new_row
            .querySelector(".cards")
            .insertBefore(new_card, new_row.querySelector(".card"));
        });
        rows_number = row_id > rows_number ? row_id : rows_number;
      });
    }
  }
}
loadRowsAndCards();
