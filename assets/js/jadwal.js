let schedules = JSON.parse(localStorage.getItem("schedules")) || [];
let editId = null;

// 1. Pengaturan Waktu & Hari
const hariIndo = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const now = new Date();
const today = hariIndo[now.getDay()];
let activeDay = "";

// 2. Fungsi Filter Hari
function filterDay(day) {
  activeDay = day;
  document.querySelectorAll(".day-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.innerText === day);
  });
  renderSchedules();
}

// 3. Logika Modal (Tambah & Edit)
function openModal(isEdit = false, id = null) {
  const modal = document.getElementById("schedule-modal");
  const btnSave = document.getElementById("save-schedule-btn");
  const title = modal.querySelector("h2");

  if (isEdit && id) {
    editId = id;
    const data = schedules.find((s) => s.id === id);
    // Isi form dengan data yang sudah ada
    document.getElementById("subject-name").value = data.name;
    document.getElementById("start-time").value = data.start;
    document.getElementById("end-time").value = data.end;
    document.getElementById("room-name").value = data.room;
    document.getElementById("day-select").value = data.day;

    btnSave.innerText = "UPDATE JADWAL";
    if (title) title.innerText = "Edit Agenda";
  } else {
    editId = null;
    document.getElementById("schedule-form").reset();
    document.getElementById("day-select").value = activeDay;
    btnSave.innerText = "TAMBAH JADWAL";
    if (title) title.innerText = "Tambah Agenda Baru";
  }
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("schedule-modal").style.display = "none";
  editId = null;
}

// 4. Logika Simpan & Update
document.getElementById("save-schedule-btn").onclick = () => {
  const name = document.getElementById("subject-name").value;
  const start = document.getElementById("start-time").value;
  const end = document.getElementById("end-time").value;
  const room = document.getElementById("room-name").value;
  const day = document.getElementById("day-select").value;

  if (!name || !start || !end) return alert("Harap isi nama dan jam!");

  if (editId) {
    const index = schedules.findIndex((s) => s.id === editId);
    schedules[index] = { ...schedules[index], name, start, end, room, day };
  } else {
    schedules.push({ id: Date.now(), name, start, end, room, day });
  }

  localStorage.setItem("schedules", JSON.stringify(schedules));
  closeModal();
  filterDay(day);
};

// 5. Render Tampilan (Fitur Utama: Tombol Aksi & Teks Responsive)
function renderSchedules() {
  const list = document.getElementById("schedule-list");
  list.innerHTML = "";

  const filtered = schedules
    .filter((s) => s.day === activeDay)
    .sort((a, b) => a.start.localeCompare(b.start));

  if (filtered.length === 0) {
    list.innerHTML = `
            <div style="text-align:center; padding: 50px 20px;">
                <i class="fas fa-mug-hot" style="font-size: 3rem; color: #e2e8f0; margin-bottom: 15px;"></i>
                <p style="color:#94a3b8; font-weight:600;">Santai dulu, hari ${activeDay} gak ada jadwal.</p>
            </div>`;
    return;
  }

  const timeNow = new Date();
  const currentTime = `${String(timeNow.getHours()).padStart(2, "0")}:${String(
    timeNow.getMinutes()
  ).padStart(2, "0")}`;

  filtered.forEach((s) => {
    const isNow =
      today === activeDay && currentTime >= s.start && currentTime <= s.end;
    const card = document.createElement("div");
    card.className = `schedule-card ${isNow ? "now" : ""}`;

    // Styling Inline untuk memastikan layout tidak hancur saat teks panjang
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.padding = "15px";
    card.style.gap = "12px";
    card.style.marginBottom = "12px";

    const liveBadge = isNow ? `<span class="live-badge">LIVE</span>` : "";

    card.innerHTML = `
            <div class="time-box" style="flex-shrink: 0; min-width: 65px; text-align: center;">
                <strong style="${isNow ? "color:#6366f1" : "color:#1e293b"}">${
      s.start
    }</strong>
                <span style="font-size: 0.7rem; color: #cbd5e1; display: block;">s/d</span>
                <strong style="${isNow ? "color:#6366f1" : "color:#1e293b"}">${
      s.end
    }</strong>
            </div>
            
            <div class="subject-info" style="flex-grow: 1; min-width: 0; overflow: hidden;">
                <h4 style="margin: 0; font-size: 1rem; color: #1e293b; word-wrap: break-word; white-space: normal;">
                    ${s.name} ${liveBadge}
                </h4>
                <p style="margin: 4px 0 0; font-size: 0.8rem; color: #94a3b8;">
                    <i class="fas fa-location-dot" style="font-size: 0.7rem;"></i> ${
                      s.room || "Tanpa Lokasi"
                    }
                </p>
            </div>

            <div class="action-buttons" style="display: flex; flex-direction: column; gap: 8px; flex-shrink: 0;">
                <button onclick="openModal(true, ${
                  s.id
                })" style="border:none; background:#f1f5f9; color:#6366f1; border-radius: 8px; width: 35px; height: 35px; cursor:pointer;">
                    <i class="fas fa-pen-to-square"></i>
                </button>
                <button onclick="deleteSchedule(${
                  s.id
                })" style="border:none; background:#fff1f2; color:#ef4444; border-radius: 8px; width: 35px; height: 35px; cursor:pointer;">
                    <i class="fas fa-trash-can"></i>
                </button>
            </div>
        `;
    list.appendChild(card);
  });
}

// 6. Fungsi Hapus
window.deleteSchedule = (id) => {
  if (confirm("Hapus jadwal ini?")) {
    schedules = schedules.filter((s) => s.id !== id);
    localStorage.setItem("schedules", JSON.stringify(schedules));
    renderSchedules();
  }
};

// 7. Inisialisasi
filterDay(today === "Minggu" ? "Senin" : today);

// Auto Refresh status LIVE setiap menit
setInterval(renderSchedules, 60000);
