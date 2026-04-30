const praxisList = [
  { emoji: "🌱", text: "Svarmate bultuqarbuk", level: "初級" },
  { emoji: "🛡️", text: "Anelte Plank durd-cuti", level: "中級" },
  { emoji: "📖", text: "Talamte qwaid loga-Janubiv bir-tavi", level: "上級" }
];

const container = document.getElementById("praxis-list");
const today = new Date().toDateString();
const lastDate = localStorage.getItem("last-date");

if (lastDate !== today) {
  praxisList.forEach((p, index) => {
    localStorage.removeItem(`praxis-${index}`);
  });
  localStorage.setItem("last-date", today);
}

praxisList.forEach((p, index) => {
  const div = document.createElement("div");
  div.className = "praxis-item";
  div.innerHTML = `
    <span class="level">${p.level}</span>
    <span class="emoji">${p.emoji}</span>
    <span class="text">${p.text}</span>
    <input type="checkbox" class="check">
  `;
  container.appendChild(div);

  const checkbox = div.querySelector(".check");

  const saved = localStorage.getItem(`praxis-${index}`);
  if (saved === "true") checkbox.checked = true;

  checkbox.addEventListener("change", () => {
    localStorage.setItem(`praxis-${index}`, checkbox.checked);

    const dateKey = `stamp-${today}-${index}`;
    if (checkbox.checked) {
      localStorage.setItem(dateKey, p.emoji);

      const existingMemo = div.querySelector(".memo-box");
      if (!existingMemo) {
        const memoBox = document.createElement("div");
        memoBox.className = "memo-box";
        memoBox.innerHTML = `
          <input type="text" class="memo-input" placeholder="メモ（任意）">
          <button class="memo-save">保存</button>
        `;
        div.appendChild(memoBox);

        memoBox.querySelector(".memo-save").addEventListener("click", () => {
          const memo = memoBox.querySelector(".memo-input").value;
          localStorage.setItem(`memo-${today}-${index}`, memo);
          memoBox.remove();
        });
      }
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
  document.getElementById("current-month-label").textContent = `${currentYear}Celi ${currentMonth + 1}Amis`;
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = ""; //
const year = currentYear;
const month = currentMonth;

// 曜日ヘッダー
const weekdays = ["Suf.", "Bir.", "Iki.", "Yuç.", "Dur.", "Beş.", "Alt."];
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
  const dateStr = new Date(year, month, day).toDateString();
  const stamps = praxisList
  .map((p, index) => localStorage.getItem(`stamp-${dateStr}-${index}`) || "")
  .join("");

cell.innerHTML = `
  <span class="day-number">${day}</span>
  <span class="stamps">${stamps}</span>
`;

cell.addEventListener("click", () => {
  const modal = document.getElementById("memo-modal");
  const list = document.getElementById("memo-modal-list");
  const dateLabel = document.getElementById("memo-modal-date");

  dateLabel.textContent = dateStr;
  list.innerHTML = "";

  praxisList.forEach((p, index) => {
    const stamp = localStorage.getItem(`stamp-${dateStr}-${index}`);
    if (!stamp) return;

    const memo = localStorage.getItem(`memo-${dateStr}-${index}`) || "";
    const row = document.createElement("div");
    row.innerHTML = `
      <span>${p.emoji}</span>
      <input type="text" value="${memo}" data-index="${index}" data-date="${dateStr}">
    `;
    list.appendChild(row);
  });

  document.getElementById("memo-modal-close").onclick = () => {
    list.querySelectorAll("input").forEach(input => {
      localStorage.setItem(`memo-${input.dataset.date}-${input.dataset.index}`, input.value);
    });
    modal.style.display = "none";
  };

  modal.style.display = "block";
});
    grid.appendChild(cell);
  }
}

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
buildCalendar();
document.getElementById("prev-month").addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  buildCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  buildCalendar();
});