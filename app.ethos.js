const praxisList = [
  { emoji: "🌱", text: "Svarmate bultuqarbuk", level: "初級" },
  { emoji: "🛡️", text: "Anelte Plank yuç-cuti", level: "中級" },
  { emoji: "📖", text: "Talamte qwaid loga-Arabiv bir-tavi", level: "上級" }
];

const container = document.getElementById("praxis-list");

praxisList.forEach(p => {
  const div = document.createElement("div");
  div.className = "praxis-item";
  div.innerHTML = `
    <span class="level">${p.level}</span>
    <span class="emoji">${p.emoji}</span>
    <span class="text">${p.text}</span>
    <input type="checkbox" class="check">
  `;
  container.appendChild(div);
});

// 今日の日付を取得
const today = new Date().toDateString();
const lastDate = localStorage.getItem("last-date");

// 日付が変わってたら全チェックをリセット
if (lastDate !== today) {
  praxisList.forEach((p, index) => {
    localStorage.removeItem(`praxis-${index}`);
  });
  localStorage.setItem("last-date", today);
}

praxisList.forEach((p, index) => {
  const checkbox = document.querySelectorAll(".check")[index];
  
  // 保存済みの状態を読み込む
  const saved = localStorage.getItem(`praxis-${index}`);
  if (saved === "true") checkbox.checked = true;
  
  // チェックしたら保存
  checkbox.addEventListener("change", () => {
  localStorage.setItem(`praxis-${index}`, checkbox.checked);
  
  // 今日の達成絵文字を保存
  const dateKey = `stamp-${today}-${index}`;
  if (checkbox.checked) {
    localStorage.setItem(dateKey, p.emoji);
  } else {
    localStorage.removeItem(dateKey);
  }
   buildCalendar();
});
});

function showPage(name) {
  document.getElementById('page-praxis').style.display = 
    name === 'praxis' ? 'block' : 'none';
  document.getElementById('page-calendar').style.display = 
    name === 'calendar' ? 'block' : 'none';
}

// 最初はプラクシス画面を表示
showPage('praxis');

function buildCalendar() {
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = ""; //
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

// 曜日ヘッダー
const weekdays = ["Suf.", "Bir.", "Ik.", "Yuç.", "Dur.", "Beş.", "Alt."];
weekdays.forEach(day => {
  const header = document.createElement("div");
  header.className = "calendar-header";
  header.textContent = day;
  grid.appendChild(header);
});

// 月初めのズレ
const firstDay = new Date(year, month, 1).getDay();
for (let i = 0; i < firstDay; i++) {
  const empty = document.createElement("div");
  empty.className = "calendar-empty";
  grid.appendChild(empty);
}
  
  // 今月の日数
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    // この日の達成絵文字を取得
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const dateStr = new Date(year, now.getMonth(), day).toDateString();
  const stamps = praxisList
  .map((p, index) => localStorage.getItem(`stamp-${dateStr}-${index}`) || "")
  .join("");

  cell.innerHTML = `
  <span class="day-number">${day}</span>
  <span class="stamps">${stamps}</span>
`;
    grid.appendChild(cell);
  }
}

buildCalendar();
