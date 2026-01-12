document.addEventListener('DOMContentLoaded', () => {
    updateGreeting();
    updateDate();
    loadQuickStats();
});

/**
 * Fungsi untuk mengubah sapaan berdasarkan jam
 */
function updateGreeting() {
    const hours = new Date().getHours();
    const greetingElement = document.getElementById('greeting');
    let message = "Selamat Malam";

    if (hours < 11) message = "Selamat Pagi";
    else if (hours < 15) message = "Selamat Siang";
    else if (hours < 19) message = "Selamat Sore";

    greetingElement.innerText = `Halo, ${message}!`;
}

/**
 * Fungsi untuk menampilkan tanggal hari ini
 */
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('id-ID', options);
    document.getElementById('date-display').innerText = today;
}

/**
 * Fungsi untuk mengambil data singkat dari localStorage
 */
function loadQuickStats() {
    // Ambil data To-Do (nanti akan dikembangkan di modul To-Do)
    const tasks = JSON.parse(localStorage.getItem('todos')) || [];
    const activeTasks = tasks.filter(t => !t.completed).length;
    
    document.getElementById('task-count').innerText = activeTasks;
    
    // Placeholder untuk Kuliah
    document.getElementById('next-class').innerText = "Arsitektur Web"; 
}