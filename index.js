const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const presets = JSON.parse(localStorage.getItem("presets")) || [];

const formatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "thb",
  signDisplay: "always",
  currencyDisplay: "symbol",
});

const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const status = document.getElementById("status");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const searchInput = document.getElementById("search");
const presetDropdown = document.getElementById("preset");
const deletePresetButton = document.getElementById("deletePresetButton"); // Initialize deletePresetButton

deletePresetButton.addEventListener("click", deleteSelectedPreset);

form.addEventListener("submit", addTransaction);
searchInput.addEventListener("input", updateSearch);

populatePresets(); // Populate preset dropdown on page load

function updateSearch() {
  const searchTerm = searchInput.value.toLowerCase();

  const transactionsToRender = searchTerm === ""
    ? transactions
    : transactions.filter((trx) => trx.name.toLowerCase().includes(searchTerm));

  renderList(transactionsToRender);
  updateTotal(transactionsToRender);
}

function updateTotal(transactionsToRender) {
  const incomeTotal = transactionsToRender
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount, 0);

  const expenseTotal = transactionsToRender
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total + trx.amount, 0);

  const balanceTotal = incomeTotal - expenseTotal;

  const formattedBalance = (balanceTotal === 0 ? "" : (balanceTotal < 0 ? "-" : "+")) +
    formatter.format(Math.abs(balanceTotal)).replace(/^.*?(\d{1})/, "$1") +
    "฿";

  const formattedIncome = (incomeTotal === 0 ? "" : (incomeTotal < 0 ? "-" : "+")) +
    formatter.format(Math.abs(incomeTotal)).replace(/^.*?(\d{1})/, "$1") +
    "฿";

  const formattedExpense = (expenseTotal === 0 ? "" : (expenseTotal > 0 ? "-" : "+")) +
    formatter.format(Math.abs(expenseTotal)).replace(/^.*?(\d{1})/, "$1") +
    "฿";

  balance.textContent = formattedBalance;
  income.textContent = formattedIncome;
  expense.textContent = formattedExpense;

  const incomeContainer = document.getElementById('income');
  const incomeTextLength = Math.abs(incomeTotal).toString().length;
  let baseIncomeFontSize = 1.25;

  if (Math.abs(incomeTotal) >= 100000000) {
    baseIncomeFontSize = 0.8;
  }

  const incomeFontSize = Math.max(baseIncomeFontSize - 0.02 * incomeTextLength, 1);

  incomeContainer.style.fontSize = `${incomeFontSize}rem`;

  const expenseContainer = document.getElementById('expense');
  const expenseTextLength = Math.abs(expenseTotal).toString().length;
  let baseExpenseFontSize = 1.25;

  if (Math.abs(expenseTotal) >= 100000000) {
    baseExpenseFontSize = 0.8;
  }

  const expenseFontSize = Math.max(baseExpenseFontSize - 0.02 * expenseTextLength, 1);

  expenseContainer.style.fontSize = `${expenseFontSize}rem`;

  const header = document.querySelector("header");

  if (balanceTotal < 0) {
    header.style.backgroundColor = "red";
  } else {
    header.style.backgroundColor = "var(--main-color)";
  }
}

function renderList(transactionsToRender) {
  list.innerHTML = "";

  status.textContent = "";
  if (transactionsToRender.length === 0) {
    status.textContent = "No transactions.";
    return;
  }

  transactionsToRender.forEach(({ id, name, amount, date, type }) => {
    const sign = type === "income" ? "+" : "-";
    const formattedAmount = sign + amount.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
    }).replace(/^.*?(\d{1})/, "$1");

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
      </div>

      <div class="amount ${type}">
        <span>${formattedAmount}฿</span>
      </div>
    
      <div class="action">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    `;

    list.appendChild(li);
  });
}

function deleteTransaction(id) {
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1);

  updateTotal(transactions);
  saveTransactions();
  renderList(transactions);
}

function addTransaction(e) {
  e.preventDefault();

  const formData = new FormData(form);

  const enteredAmount = parseFloat(formData.get("amount"));
  const selectedType = form.type.checked ? "expense" : "income";

  if (enteredAmount >= 2000000000) {
    alert("Amount cannot be 2,000,000,000 or more.");
    return;
  }

  const currentIncome = transactions
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount, 0);

  const currentExpense = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total + trx.amount, 0);

  const newTotalIncome = selectedType === "income" ? currentIncome + enteredAmount : currentIncome;
  const newTotalExpense = selectedType === "expense" ? currentExpense + enteredAmount : currentExpense;

  if (newTotalIncome >= 2000000000) {
    alert("Income cannot be more than 1,999,999,999.");
    return;
  }

  if (newTotalExpense >= 2000000000) {
    alert("Expense cannot be more than 1,999,999,999.");
    return;
  }

  transactions.push({
    id: transactions.length + 1,
    name: formData.get("name"),
    amount: enteredAmount,
    date: new Date(formData.get("date")),
    type: selectedType,
  });

  form.reset();

  updateTotal(transactions);
  saveTransactions();
  renderList(transactions);
}

function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function populatePresets() {
  presets.forEach((preset) => {
    const option = document.createElement("option");
    option.value = JSON.stringify(preset);
    option.text = preset.name;
    presetDropdown.add(option);
  });
}

function createPreset() {
  const presetName = prompt("Enter the name for the preset:");

  if (presetName) {
    const formData = new FormData(form);

    const preset = {
      name: presetName,
      type: formData.get("type") || "income", // Set the default type to income if not selected
      action: formData.get("name") || "",
      amount: formData.get("amount") || 0,
      date: new Date().toISOString().split("T")[0], // Set the date to the current date
    };

    presets.push(preset);

    updatePresetDropdown(); // Update the dropdown with the new preset

    localStorage.setItem("presets", JSON.stringify(presets));
  }
}

function applyPreset() {
  const selectedPreset = presetDropdown.value;

  if (selectedPreset === 'none') {
    // Set the type to income and other fields to default values
    document.getElementById("type").checked = false;
    document.getElementsByName("name")[0].value = "";
    document.getElementsByName("amount")[0].value = "";
    document.getElementsByName("date")[0].valueAsDate = new Date();

    // Disable the delete button for the "None" option
    deletePresetButton.disabled = true;
  } else if (selectedPreset) {
    const preset = JSON.parse(selectedPreset);

    // Set the type based on the preset
    document.getElementById("type").checked = preset.type !== "income";

    document.getElementsByName("name")[0].value = preset.action;
    document.getElementsByName("amount")[0].value = preset.amount;
    document.getElementsByName("date")[0].value = preset.date;

    // Enable the delete button for other presets
    deletePresetButton.disabled = false;
  }
}

function deleteSelectedPreset() {
  const selectedPreset = presetDropdown.value;
  if (selectedPreset !== 'none') {
    deletePreset(selectedPreset);
  }
}

function deletePreset(selectedPreset) {
  const index = presets.findIndex((preset) => JSON.stringify(preset) === selectedPreset);

  if (index !== -1) {
    presets.splice(index, 1);
    localStorage.setItem("presets", JSON.stringify(presets));

    // Clear and repopulate the preset dropdown
    updatePresetDropdown();
  }

  // Set the form values after deletion
  document.getElementById("type").checked = false;
  document.getElementsByName("name")[0].value = "";
  document.getElementsByName("amount")[0].value = "";

  // Set the date to the current date
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  document.getElementsByName("date")[0].value = formattedDate;

  // Disable the delete button for the "None" option after deletion
  deletePresetButton.disabled = true;
}


function updatePresetDropdown() {
  // Clear existing options
  presetDropdown.innerHTML = '<option value="none">None</option>';

  // Populate the dropdown with presets
  presets.forEach((preset) => {
    const option = document.createElement("option");
    option.value = JSON.stringify(preset);
    option.text = preset.name;
    presetDropdown.add(option);
  });
}

document.getElementById('dateInput').valueAsDate = new Date();
updateSearch(); // Update the search initially
applyPreset(); // Apply the preset initially
