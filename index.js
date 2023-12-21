const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

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

const EXPENSE_THRESHOLD = 100000;

form.addEventListener("submit", addTransaction);
searchInput.addEventListener("input", updateSearch);

function updateSearch() {
  const searchTerm = searchInput.value.toLowerCase();

  // If the search term is empty, show all transactions
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

  // Format the Total Balance with the currency symbol at the end
  const formattedBalance = (balanceTotal === 0 ? "" : (balanceTotal < 0 ? "-" : "+")) +
    formatter.format(Math.abs(balanceTotal)).replace(/^.*?(\d{1})/, "$1") +
    "฿";

  // Format the Income with the currency symbol at the end
  const formattedIncome = (incomeTotal === 0 ? "" : (incomeTotal < 0 ? "-" : "+")) +
    formatter.format(Math.abs(incomeTotal)).replace(/^.*?(\d{1})/, "$1") +
    "฿";

  // Format the Expnse with the currency symbol at the end
  const formattedExpense = (expenseTotal === 0 ? "" : (expenseTotal > 0 ? "-" : "+")) +
    formatter.format(Math.abs(expenseTotal)).replace(/^.*?(\d{1})/, "$1") +
    "฿";

  balance.textContent = formattedBalance;
  income.textContent = formattedIncome;
  expense.textContent = formattedExpense;

  // the income value
  const incomeContainer = document.getElementById('income');
  const incomeTextLength = Math.abs(incomeTotal).toString().length;
  let baseIncomeFontSize = 1.25;

  if (Math.abs(incomeTotal) >= 100000000) {
    baseIncomeFontSize = 0.8;
  }

  const incomeFontSize = Math.max(baseIncomeFontSize - 0.02 * incomeTextLength, 1);

  incomeContainer.style.fontSize = `${incomeFontSize}rem`;

  // the expense value
  const expenseContainer = document.getElementById('expense');
  const expenseTextLength = Math.abs(expenseTotal).toString().length;
  let baseExpenseFontSize = 1.25;

  if (Math.abs(expenseTotal) >= 100000000) {
    baseExpenseFontSize = 0.8;
  }

  const expenseFontSize = Math.max(baseExpenseFontSize - 0.02 * expenseTextLength, 1);

  expenseContainer.style.fontSize = `${expenseFontSize}rem`;

  // Get the header element
  const header = document.querySelector("header");

  // Change background color based on the Total Balance value
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
    }).replace(/^.*?(\d{1})/, "$1"); // Remove the first "฿"

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

  const formData = new FormData(this);

  const enteredAmount = parseFloat(formData.get("amount"));
  const selectedType = form.type.checked ? "expense" : "income";

  // Check if the entered amount is valid
  if (enteredAmount >= 2000000000) {
    alert("Amount cannot be 2,000,000,000 or more.");
    return;
  }

  // Check if the sum of Income or Expense exceeds the limit
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

  this.reset();

  updateTotal(transactions);
  saveTransactions();
  renderList(transactions);
}

function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

document.getElementById('dateInput').valueAsDate = new Date();
updateSearch(); // Update the search initially
