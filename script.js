console.log("script.jsが読み込まれました");


// =========================
// プリセット一覧
// =========================

const defaultPresets = [
    {
        name: "クロッキー_1",
        category: "クロッキー",
        subject: "人体",
        timerMode: "countdown",
        time: 30
    },
    {
        name: "スケッチ_1",
        category: "スケッチ",
        subject: "背景",
        timerMode: "countup",
        time: null
    },
    {
        name: "キャラクターデザイン_1",
        category: "キャラクターデザイン",
        subject: "",
        timerMode: "none",
        time: null
    }
];

let presets =
    JSON.parse(localStorage.getItem("croquisPresets")) || defaultPresets;

    let practiceRecords = 
    JSON.parse(localStorage.getItem("croquisPracticeRecords")) || [];

    let selectedRecord = null;



// =========================
// 状態管理
// =========================

let selectedPreset = null;
let isTemporaryPractice = false;

let timer = null;
let remainingTime = 0;
let elapsedPracticeTime = 0;
let isPaused = false;
let practiceStartTime = null;
let practicePausedTime = 0;
let pauseStartTime = null;

// =========================
// 画面
// =========================

const home = document.getElementById("home");
const startMenu = document.getElementById("startMenu");
const preset = document.getElementById("preset");
const practice = document.getElementById("practice");
const newPractice = document.getElementById("newPractice");
const editPractice = document.getElementById("editPractice");
const training = document.getElementById("training");
const savePreset = document.getElementById("savePreset");

const album = document.getElementById("album");
const albumList = document.getElementById("albumList");
const albumButton = document.getElementById("albumButton");
const albumBackButton = document.getElementById("albumBackButton");

const recordDetail = document.getElementById("recordDetail");
const recordDetailName = document.getElementById("recordDetailName");
const recordDetailCategory = document.getElementById("recordDetailCategory");
const recordDetailSubject = document.getElementById("recordDetailSubject");
const recordDetailTimer = document.getElementById("recordDetailTimer");
const recordDetailTime = document.getElementById("recordDetailTime");
const recordDetailDate = document.getElementById("recordDetailDate");
const recordDetailBackButton = document.getElementById("recordDetailBackButton");

const deleteRecordButton = document.getElementById("deleteRecordButton");

// =========================
// 一覧・表示
// =========================

const presetList = document.getElementById("presetList");

const practiceName = document.getElementById("practiceName");
const practiceCategory = document.getElementById("practiceCategory");
const practiceSubject = document.getElementById("practiceSubject");
const practiceTimer = document.getElementById("practiceTimer");

const trainingTitle = document.getElementById("trainingTitle");
const trainingTimer = document.getElementById("trainingTimer");


// =========================
// 新規作成入力
// =========================

const newCategory = document.getElementById("newCategory");
const newSubject = document.getElementById("newSubject");
const newTimerMode = document.getElementById("newTimerMode");
const newTime = document.getElementById("newTime");

const editName = document.getElementById("editName");

const editCategory = document.getElementById("editCategory");
const editSubject = document.getElementById("editSubject");
const editTimerMode = document.getElementById("editTimerMode");
const editTime = document.getElementById("editTime");

const saveEditButton = document.getElementById("saveEditButton");
const cancelEditButton = document.getElementById("cancelEditButton");

const deletePresetButton = document.getElementById("deletePresetButton");


// =========================
// ボタン
// =========================

const startButton = document.getElementById("startButton");

const presetButton = document.getElementById("presetButton");
const backButton = document.getElementById("backButton");

const selectPresetButton = document.getElementById("selectPresetButton");
const newPracticeButton = document.getElementById("newPracticeButton");

const startMenuBackButton =
    document.getElementById("startMenuBackButton");

const practiceBackButton =
    document.getElementById("practiceBackButton");

const newPracticeBackButton =
    document.getElementById("newPracticeBackButton");

const startPracticeButton =
    document.getElementById("startPracticeButton");

const editPracticeButton =
    document.getElementById("editPracticeButton");

const createPracticeButton =
    document.getElementById("createPracticeButton");

const pauseButton =
    document.getElementById("pauseButton");

const finishButton =
    document.getElementById("finishButton");

const savePresetYes =
    document.getElementById("savePresetYes");

const savePresetNo =
    document.getElementById("savePresetNo");

// =========================
// 関数
// =========================

// プリセット詳細を表示
function showPracticeDetail() {

    practiceName.textContent = selectedPreset.name;

    practiceCategory.textContent =
        "カテゴリ：" + selectedPreset.category;

    practiceSubject.textContent =
        "モチーフ：" + selectedPreset.subject;

    if (selectedPreset.timerMode === "countdown") {

        practiceTimer.textContent =
            "タイマー：カウントダウン " + selectedPreset.time + "秒";

    } else if (selectedPreset.timerMode === "countup") {

        practiceTimer.textContent =
            "タイマー：カウントアップ";

    } else {

        practiceTimer.textContent =
            "タイマー：なし";

    }

    practice.style.display = "block";

}


// プリセットボタンを作成
function createPresetButton(presetData) {

    const button = document.createElement("button");

    button.textContent = presetData.name;

    button.addEventListener("click", function () {

        selectedPreset = presetData;

        isTemporaryPractice = false;

        preset.style.display = "none";

        showPracticeDetail();

    });

    presetList.appendChild(button);

}

// =========================
// 初期化
// =========================

for (let i = 0; i < presets.length; i++) {

    createPresetButton(presets[i]);

}

// =========================
// イベント
// =========================

// ホーム → プリセット
presetButton.addEventListener("click", function () {

    home.style.display = "none";
    preset.style.display = "block";

});

// プリセット → ホーム
backButton.addEventListener("click", function () {

    preset.style.display = "none";
    home.style.display = "block";

});

// ホーム → 練習開始メニュー
startButton.addEventListener("click", function () {

    home.style.display = "none";
    startMenu.style.display = "block";

});

// 練習開始メニュー → ホーム
startMenuBackButton.addEventListener("click", function () {

    startMenu.style.display = "none";
    home.style.display = "block";

});

// 練習開始メニュー → プリセット
selectPresetButton.addEventListener("click", function () {

    startMenu.style.display = "none";
    preset.style.display = "block";

});

// 練習開始メニュー → 新しく設定する
newPracticeButton.addEventListener("click", function () {

    startMenu.style.display = "none";
    newPractice.style.display = "block";

});

// 新しく設定する → 練習開始メニュー
newPracticeBackButton.addEventListener("click", function () {

    newPractice.style.display = "none";
    startMenu.style.display = "block";

});

// プリセット詳細 → プリセット一覧
practiceBackButton.addEventListener("click", function () {

    practice.style.display = "none";
    preset.style.display = "block";

});

// 練習開始
startPracticeButton.addEventListener("click", function () {

    clearInterval(timer);

    practiceStartTime = Date.now();
    elapsedPracticeTime = 0;

    trainingTitle.textContent = selectedPreset.name;

    const timerMode = selectedPreset.timerMode;

    pauseButton.textContent = "⏸ 一時停止";
    isPaused = false;

    practice.style.display = "none";
    training.style.display = "block";

    if (timerMode === "none") {

        pauseButton.style.display = "none";

    } else {

        pauseButton.style.display = "inline-block";

    }

    if (timerMode === "countdown") {

        remainingTime = selectedPreset.time;

        updateTimerDisplay(remainingTime);

        timer = setInterval(function () {

            remainingTime--;

            elapsedPracticeTime++;

            updateTimerDisplay(remainingTime);

            if (remainingTime <= 0) {

                clearInterval(timer);

            }

        }, 1000);

    } else if (timerMode === "countup") {

        remainingTime = 0;

        updateTimerDisplay(0);

        timer = setInterval(function () {

            remainingTime++;

            elapsedPracticeTime++;

            updateTimerDisplay(remainingTime);

        }, 1000);

    } else {

        trainingTimer.textContent = "タイマーなし";

    }

});

// 一時停止・再開
pauseButton.addEventListener("click", function () {

    if (!isPaused) {

        pauseStartTime = Date.now();

        clearInterval(timer);

        isPaused = true;

        pauseButton.textContent = "▶ 再開";

    } else {

    practicePausedTime += Date.now() - pauseStartTime;

    isPaused = false;

    pauseButton.textContent = "⏸ 一時停止";

    const timerMode = selectedPreset.timerMode;

    if (timerMode === "countdown") {

        timer = setInterval(function () {

            remainingTime--;

            elapsedPracticeTime++;

            updateTimerDisplay(remainingTime);

            if (remainingTime <= 0) {

                clearInterval(timer);

            }

        }, 1000);

    } else if (timerMode === "countup") {

        timer = setInterval(function () {

            remainingTime++;

            elapsedPracticeTime++;

            updateTimerDisplay(remainingTime);

        }, 1000);

    }

}

});

// 練習終了
finishButton.addEventListener("click", function () {

    clearInterval(timer);

    const record = {
    name: selectedPreset.name,
    category: selectedPreset.category,
    subject: selectedPreset.subject,
    timerMode: selectedPreset.timerMode,
    time: elapsedPracticeTime,
    date: new Date().toLocaleString()
};

console.log("今回の練習時間：" + record.time + "秒");

practiceRecords.push(record);

localStorage.setItem(
    "croquisPracticeRecords",
    JSON.stringify(practiceRecords)
);

    training.style.display = "none";

    if (isTemporaryPractice) {

        savePreset.style.display = "block";

    } else {

        home.style.display = "block";

    }

});

createPracticeButton.addEventListener("click", function () {

    let count = 0;

    for (let i = 0; i < presets.length; i++) {

        if (presets[i].category === newCategory.value) {

            count++;

        }

    }

    selectedPreset = {

        name: newCategory.value + "_" + (count + 1),

        category: newCategory.value,

        subject: newSubject.value,

        timerMode: newTimerMode.value,

        time: Number(newTime.value)

    };

    isTemporaryPractice = true;

    newPractice.style.display = "none";

    showPracticeDetail();

});

savePresetNo.addEventListener("click", function () {

    savePreset.style.display = "none";

    home.style.display = "block";

});

savePresetYes.addEventListener("click", function () {

    presets.push(selectedPreset);

    savePresets();

    createPresetButton(selectedPreset);

    savePreset.style.display = "none";

    home.style.display = "block";

});

editPracticeButton.addEventListener("click", function () {

    editCategory.value = selectedPreset.category;
    editSubject.value = selectedPreset.subject;
    editTimerMode.value = selectedPreset.timerMode;
    editTime.value = selectedPreset.time;

    practice.style.display = "none";
    editPractice.style.display = "block";

});

editPracticeButton.addEventListener("click", function () {

   console.log("編集ボタンがおされました");

   editName.value = selectedPreset.name;

   editCategory.value = selectedPreset.category;
   editSubject.value = selectedPreset.subject;
   editTimerMode.value = selectedPreset.timerMode;
   editTime.value = selectedPreset.time;

   practice.style.display = "none";
   editPractice.style.display = "block";

});

cancelEditButton.addEventListener("click", function () {

    editPractice.style.display = "none";

    practice.style.display = "block";

});

saveEditButton.addEventListener("click", function () {

    selectedPreset.name = editName.value;
    selectedPreset.category = editCategory.value;
    selectedPreset.subject = editSubject.value;
    selectedPreset.timerMode = editTimerMode.value;
    selectedPreset.time = Number(editTime.value);

    if (isTemporaryPractice) {

        presets.push(selectedPreset);

        isTemporaryPractice = false;

}

    savePresets();

    showPracticeDetail();

    editPractice.style.display = "none";

    presetList.innerHTML = "";

    for (let i = 0; i < presets.length; i++) {

        createPresetButton(presets[i]);

    }

});

function savePresets() {

    localStorage.setItem(
        "croquisPresets",
        JSON.stringify(presets)
    );

}

deletePresetButton.addEventListener("click", function () {

    const confirmed = confirm(
        "「" + selectedPreset.name + "」を削除しますか？"
    );

    if (!confirmed) {
        return;
    }

    const index = presets.indexOf(selectedPreset);

    if (index !== -1) {
        presets.splice(index, 1);
    }

    savePresets();

    presetList.innerHTML = "";

    for (let i = 0; i < presets.length; i++) {

        createPresetButton(presets[i]);

    }

    editPractice.style.display = "none";
    preset.style.display = "block";

});

cancelEditButton.addEventListener("click", function () {

    editPractice.style.display = "none";

    practice.style.display = "block";

});

albumButton.addEventListener("click", function () {

    home.style.display = "none";

    showAlbum();

    album.style.display = "block";

});

albumBackButton.addEventListener("click", function () {

    album.style.display = "none";

    home.style.display = "block";

});

function showAlbum() {

    albumList.innerHTML = "";

    if (practiceRecords.length === 0) {

        albumList.textContent = "まだ練習記録がありません。";

        return;

    }

    for (let i = 0; i < practiceRecords.length; i++) {

        const record = practiceRecords[i];

        const recordItem = document.createElement("button");

        recordItem.textContent =
            record.name + " / " +
            record.subject + " / " +
            record.time + "秒 / " +
            record.date;

    recordItem.addEventListener("click", function () {

        selectedRecord = record;

    recordDetailName.textContent =
        record.name;

    recordDetailCategory.textContent =
        "カテゴリ：" + record.category;

    recordDetailSubject.textContent =
        "モチーフ：" + record.subject;

    recordDetailTimer.textContent =
        "タイマー：" + record.timerMode;

    recordDetailTime.textContent =
        "練習時間：" + record.time + "秒";

    recordDetailDate.textContent =
        "日時：" + record.date;

    album.style.display = "none";

    recordDetail.style.display = "block";

    });

    albumList.appendChild(recordItem);  
        
  }

}

recordDetailBackButton.addEventListener("click", function () {

    recordDetail.style.display = "none";

    album.style.display = "block";

});

deleteRecordButton.addEventListener("click", function () {

    if (selectedRecord === null) {
        return;
    }

    const confirmed = confirm(
        "この練習記録を削除しますか？"
    );

    if (!confirmed) {
        return;
    }

    const index = practiceRecords.indexOf(selectedRecord);

    if (index !== -1) {

        practiceRecords.splice(index, 1);

    }

    localStorage.setItem(
        "croquisPracticeRecords",
        JSON.stringify(practiceRecords)
    );

    selectedRecord = null;

    recordDetail.style.display = "none";

    album.style.display = "block";

    showAlbum();

});

function updateTimerDisplay(seconds) {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    trainingTimer.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0");

}