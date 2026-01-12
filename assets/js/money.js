let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let currentType = "income";

const modal = document.getElementById("money-modal");
const amountInput = document.getElementById("amount-input");
const descInput = document.getElementById("desc-input");
const transList = document.getElementById("transaction-list");

function openMoneyModal(type) {
  currentType = type;
  document.getElementById("modal-title").innerText =
    type === "income" ? "Tambah Pemasukan" : "Catat Pengeluaran";
  modal.style.display = "flex";
  amountInput.focus();
}

function closeMoneyModal() {
  modal.style.display = "none";
  amountInput.value = "";
  descInput.value = "";
}

document.getElementById("save-money-btn").onclick = () => {
  const amount = parseInt(amountInput.value);
  const desc = descInput.value.trim();

  if (!amount || !desc) return alert("Isi semua data!");

  const newTrans = {
    id: Date.now(),
    type: currentType,
    amount: amount,
    desc: desc,
    date: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    }),
  };

  transactions.unshift(newTrans);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderMoney();
  closeMoneyModal();
};

function renderMoney() {
  transList.innerHTML = "";
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") totalIncome += t.amount;
    else totalExpense += t.amount;

    const item = document.createElement("div");
    item.className = "transaction-item";
    item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div class="trans-icon" style="background: ${
                  t.type === "income" ? "#ecfdf5" : "#fef2f2"
                }; color: ${t.type === "income" ? "#10b981" : "#ef4444"};">
                    <i class="fas ${
                      t.type === "income" ? "fa-arrow-down" : "fa-arrow-up"
                    }"></i>
                </div>
                <div>
                    <strong style="display: block; font-size: 0.9rem;">${
                      t.desc
                    }</strong>
                    <span style="font-size: 0.7rem; color: #94a3b8;">${
                      t.date
                    }</span>
                </div>
            </div>
            <strong style="color: ${
              t.type === "income" ? "#10b981" : "#ef4444"
            };">
                ${
                  t.type === "income" ? "+" : "-"
                } Rp ${t.amount.toLocaleString()}
            </strong>
        `;
    transList.appendChild(item);
  });

  document.getElementById("total-balance").innerText = `Rp ${(
    totalIncome - totalExpense
  ).toLocaleString()}`;
  document.getElementById(
    "total-income"
  ).innerText = `+ Rp ${totalIncome.toLocaleString()}`;
  document.getElementById(
    "total-expense"
  ).innerText = `- Rp ${totalExpense.toLocaleString()}`;
}

renderMoney();
