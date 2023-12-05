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

form.addEventListener("submit", addTransaction);

function updateTotal() {
  const incomeTotal = transactions
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount, 0);

  const expenseTotal = transactions
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

  // Get the header element
  const header = document.querySelector("header");

  // Change background color based on the Total Balance value
  if (balanceTotal < 0) {
    header.style.backgroundColor = "red";
  } else {
    header.style.backgroundColor = "var(--main-color)";
  }

}

function renderList() {
  list.innerHTML = "";

  status.textContent = "";
  if (transactions.length === 0) {
    status.textContent = "No transactions.";
    return;
  }

  transactions.forEach(({ id, name, amount, date, type }) => {
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

renderList();
updateTotal();

function deleteTransaction(id) {
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1);

  updateTotal();
  saveTransactions();
  renderList();
}

function addTransaction(e) {
  e.preventDefault();

  const formData = new FormData(this);

  transactions.push({
    id: transactions.length + 1,
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: new Date(formData.get("date")),
    type: form.type.checked ? "expense" : "income",
  });

  this.reset();

  updateTotal();
  saveTransactions();
  renderList();
}

function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  localStorage.setItem("transactions", JSON.stringify(transactions));
}