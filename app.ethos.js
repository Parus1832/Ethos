const praxisList = [
  { emoji: "🌱", text: "Svarmate bultuqarbuz", level: "初級", frequency: 3 },
  { emoji: "🛡️", text: "Anelte Plank durd-cuti", level: "初級", frequency: 1 },
  { emoji: "🏖️", text: "UL", level: "初級", frequency: 4 },
  { emoji: "💅", text: "Qaigute nogatuk", level: "中級", frequency: 12 },
  { emoji: "🛏️", text: "Tabdiჲlte prostinuz", level: "中級", frequency: 7 },
  { emoji: "🚶", text: "Rafte hamar gnumner", level: "中級", frequency: 3 },
  { emoji: "📖", text: "Talamte qwaid loga-Janubiv bir-tavi", level: "上級", frequency: 4 },
  { emoji: "📒", text: "Katabte tetruz", level: "上級", frequency: 4 },
  { emoji: "🎙️", text: "Zingte liduk", level: "上級", frequency: 4 },
  { emoji: "🚀", text: "", level: "上級", frequency: 4 },
  { emoji: "⌨️", text: "Katabte", level: "上級", frequency: 4 },
];

const diaryList = [
  { emoji: "🍴", text: "Yemad", },
  { emoji: "🍳", text: "Bişirad", },
  { emoji: "🛍️", text: "Rafad hamar qidisad", },
  { emoji: "🎶", text: "Xor", },
  { emoji: "🎹", text: "Talamad", },
  { emoji: "🎥", text: "Rafad depi hamerg kam pilmi", },
  { emoji: "🧍", text: "Gyorşad het dost", },
  { emoji: "🫏", text: "karad", },
  { emoji: "💬", text: "", },
];

const container = document.getElementById("praxis-list");
const today = new Date().toDateString();
const lastDate = localStorage.getItem("last-date");

if (lastDate !== today) {
  praxisList.forEach((p, index) => {
    localStorage.removeItem(`praxis-${index}`);
  });
  localStorage.setItem("last-date", today);

  // frequencyに基づいてデイリー候補を選出
  const todayDate = new Date();
  const dailyCandidates = praxisList
    .map((p, index) => ({ p, index }))
    .filter(({ p, index }) => {
      const lastDone = localStorage.getItem(`last-done-${index}`);
      if (!lastDone) return true;
      const daysSince = (todayDate - new Date(lastDone)) / (1000 * 60 * 60 * 24);
      return daysSince >= p.frequency;
    });

  // frequencyが満期のものを優先確保
  const urgent = dailyCandidates.filter(({ p, index }) => {
    const lastDone = localStorage.getItem(`last-done-${index}`);
    if (!lastDone) return false;
    const daysSince = (todayDate - new Date(lastDone)) / (1000 * 60 * 60 * 24);
    return daysSince >= p.frequency && p.frequency > 1;
  });

  // 残り枠を初・中・上バランスで埋める
  const levels = ["初級", "中級", "上級"];
  const remaining = levels.map(level =>
    dailyCandidates
      .filter(({ p }) => p.level === level)
      .filter(({ index }) => !urgent.find(u => u.index === index))
      .sort(() => Math.random() - 0.5)[0]
  ).filter(Boolean);

  const dailyIndices = [
    ...urgent,
    ...remaining
  ].slice(0, 3).map(({ index }) => index);

  localStorage.setItem("daily-indices", JSON.stringify(dailyIndices));
}

// 日記リストを描画
const diaryContainer = document.getElementById("diary-list");
diaryList.forEach((d, index) => {
  const div = document.createElement("div");
  div.className = "praxis-item diary-item";
  div.innerHTML = `
    <span class="emoji">${d.emoji}</span>
    <span class="text">${d.text}</span>
    <input type="checkbox" class="diary-check">
  `;
  diaryContainer.appendChild(div);

  const checkbox = div.querySelector(".diary-check");
  const saved = localStorage.getItem(`diary-${today}-${index}`);
  if (saved === "true") checkbox.checked = true;

  checkbox.addEventListener("change", () => {
    localStorage.setItem(`diary-${today}-${index}`, checkbox.checked);

    const dateKey = `diary-stamp-${today}-${index}`;
    if (checkbox.checked) {
      localStorage.setItem(dateKey, d.emoji);

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
          localStorage.setItem(`diary-memo-${today}-${index}`, memo);
          memoBox.remove();
        });
      }
    } else {
      localStorage.removeItem(dateKey);
    }
    buildCalendar();
  });
});

const dailyIndices = JSON.parse(localStorage.getItem("daily-indices") || "[]");

praxisList.forEach((p, index) => {
  const div = document.createElement("div");
  div.className = "praxis-item";
  div.innerHTML = `
    <span class="level">${p.level}</span>
    <span class="emoji">${p.emoji}</span>
    <span class="text">${p.text}</span>
    <input type="checkbox" class="check">
  `;

  const isDaily = dailyIndices.includes(index);
  if (isDaily) {
    document.getElementById("praxis-list").appendChild(div);
  } else {
    document.getElementById("praxis-all").appendChild(div);
  }

  const checkbox = div.querySelector(".check");

  const saved = localStorage.getItem(`praxis-${index}`);
  if (saved === "true") checkbox.checked = true;

  checkbox.addEventListener("change", () => {
    localStorage.setItem(`praxis-${index}`, checkbox.checked);

    const dateKey = `stamp-${today}-${index}`;
    if (checkbox.checked) {
      localStorage.setItem(dateKey, p.emoji);
      localStorage.setItem(`last-done-${index}`, today);

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
 const praxisStamps = praxisList
    .map((p, index) => localStorage.getItem(`stamp-${dateStr}-${index}`) || "")
    .join("");

  const diaryStamps = diaryList
    .map((d, index) => {
      const stamp = localStorage.getItem(`diary-stamp-${dateStr}-${index}`);
      return stamp ? `<span class="diary-stamp">${stamp}</span>` : "";
    })
    .join("");

  const stamps = praxisStamps + diaryStamps;

  const hasDiary = !!localStorage.getItem(`diary-${dateStr}`);
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

const diaryKey = `diary-${dateStr}`;
  const diaryArea = document.getElementById("memo-modal-diary");
  diaryArea.value = localStorage.getItem(diaryKey) || "";

 // 日記メモを表示
  diaryList.forEach((d, index) => {
    const stamp = localStorage.getItem(`diary-stamp-${dateStr}-${index}`);
    if (!stamp) return;

    const memo = localStorage.getItem(`diary-memo-${dateStr}-${index}`) || "";
    const row = document.createElement("div");
    row.innerHTML = `
      <span>${d.emoji}</span>
      <input type="text" value="${memo}" data-diary-index="${index}" data-date="${dateStr}">
    `;
    list.appendChild(row);
  });

  document.getElementById("memo-modal-close").onclick = () => {
    list.querySelectorAll("input").forEach(input => {
    list.querySelectorAll("[data-diary-index]").forEach(input => {
      localStorage.setItem(`diary-memo-${input.dataset.date}-${input.dataset.diaryIndex}`, input.value);
    });
      localStorage.setItem(`memo-${input.dataset.date}-${input.dataset.index}`, input.value);
    });
    localStorage.setItem(diaryKey, diaryArea.value);
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

function exportData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    data[key] = localStorage.getItem(key);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ethos-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      Object.keys(data).forEach(key => {
        localStorage.setItem(key, data[key]);
      });
      alert("復元完了！");
      buildCalendar();
    };
    reader.readAsText(file);
  };
  input.click();
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.ethos.js").then((reg) => {
    reg.pushManager;
  });
}

function scheduleNotification() {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      navigator.serviceWorker.ready.then((reg) => {
        const now = new Date();
        const target = new Date();
        target.setHours(14, 0, 0, 0);
        if (target <= now) target.setDate(target.getDate() + 1);
        const delay = target - now;

        setTimeout(() => {
          reg.showNotification("EѲOS", {
            body: "Sianeltaz Praksis axloriv?👟",
            icon: "icon.ethos.png"
          });
        }, delay);
      });
    }
  });
}

scheduleNotification();