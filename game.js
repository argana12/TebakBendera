console.log("Game.js berhasil dimuat!");

let countries = [];
let attemptsLeft = 3;
let selectedAnswer = null;
let autoClosePopupTimeout = null;
let questionLoaded = false;
let isTransitioning = false;
let savedLang = localStorage.getItem("language") || "id";
let tokenPopupShown = false;
let usedFlags = JSON.parse(localStorage.getItem("usedFlags")) || []; // Daftar bendera yang sudah digunakan

document.addEventListener("DOMContentLoaded", () => {
    const loadingElement = document.getElementById("loading");
    if (!loadingElement) {
        console.error("Elemen 'loading' tidak ditemukan!");
        return;
    }
    loadingElement.classList.add("show");

    const popupElement = document.getElementById("popup");
    const tokenPopupElement = document.getElementById("token-popup");
    if (!popupElement || !tokenPopupElement) {
        console.error("Elemen 'popup' atau 'token-popup' tidak ditemukan!");
        return;
    }
    popupElement.classList.remove("show");
    tokenPopupElement.classList.remove("show");

    spawnMeteors();
    spawnParticles();
    checkAutoResetToken();

    fetch("https://restcountries.com/v3.1/all")
        .then(response => {
            if (!response.ok) throw new Error("Gagal mengambil data negara");
            return response.json();
        })
        .then(data => {
            countries = data.filter(country => country.flags && country.name.common);
            console.log("Data negara berhasil diambil:", countries.length);
            // Reset usedFlags jika semua bendera sudah digunakan
            if (usedFlags.length >= countries.length) {
                usedFlags = [];
                localStorage.setItem("usedFlags", JSON.stringify(usedFlags));
                console.log("Semua bendera sudah digunakan, mereset usedFlags.");
            }
            setTimeout(() => {
                loadingElement.classList.remove("show");
                setTimeout(() => showTutorial(), 300);
            }, 500);
        })
        .catch(error => {
            console.error("Gagal mengambil data:", error);
            loadingElement.classList.remove("show");
            showPopup(savedLang === "en" ? 
                "❌ <b>Failed to load data!</b><br>Please check your internet connection." : 
                "❌ <b>Gagal memuat data!</b><br>Silakan periksa koneksi internetmu.", "#DC3545");
        });

    updateLanguage(savedLang);
    setActiveLanguageButton(savedLang);
    updateAttemptsDisplay();

    // Event listener untuk tombol bahasa
    const langEn = document.getElementById("lang-en");
    const langId = document.getElementById("lang-id");
    if (!langEn || !langId) {
        console.error("Tombol bahasa 'lang-en' atau 'lang-id' tidak ditemukan!");
        return;
    }

    langEn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Tombol bahasa Inggris diklik");
        savedLang = "en";
        localStorage.setItem("language", "en");
        updateLanguage("en");
        setActiveLanguageButton("en");
    });

    langId.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Tombol bahasa Indonesia diklik");
        savedLang = "id";
        localStorage.setItem("language", "id");
        updateLanguage("id");
        setActiveLanguageButton("id");
    });
});

function setActiveLanguageButton(lang) {
    const langEn = document.getElementById("lang-en");
    const langId = document.getElementById("lang-id");

    if (!langEn || !langId) {
        console.error("Tombol bahasa 'lang-en' atau 'lang-id' tidak ditemukan di setActiveLanguageButton!");
        return;
    }

    if (lang === "en") {
        langEn.classList.add("active");
        langId.classList.remove("active");
    } else {
        langId.classList.add("active");
        langEn.classList.remove("active");
    }
}

function updateLanguage(lang) {
    const navbar = document.querySelector(".navbar");
    const attemptsElement = document.getElementById("navbar-attempts");
    const sloganElement = document.querySelector(".navbar-brand");
    const rightElement = document.querySelector(".navbar-right");

    if (!navbar || !attemptsElement || !sloganElement || !rightElement) {
        console.error("Elemen navbar, navbar-attempts, navbar-brand, atau navbar-right tidak ditemukan!");
        return;
    }

    attemptsElement.classList.remove("show");
    sloganElement.classList.remove("show");
    rightElement.classList.remove("show");

    setTimeout(() => {
        if (lang === "en") {
            navbar.classList.remove("lang-id");
            navbar.classList.add("lang-en");
            document.getElementById("navbar-slogan").innerHTML = '<i class="fas fa-flag me-2"></i>Flag Quiz';
            document.getElementById("game-title").textContent = "🌍 Guess the Flag";
            document.getElementById("navbar-attempts").textContent = `Attempts: ${attemptsLeft}`;
            document.getElementById("confirm-btn").textContent = "✅ Confirm Answer";
            document.getElementById("ad-placeholder").textContent = "🔹 Ad Space 🔹";
            document.getElementById("back-btn").textContent = "🏠 Back to Menu";
            document.getElementById("loading-text").textContent = "Loading data... ⏳";
            document.getElementById("tutorial-title").textContent = "📜 How to Play & Rules";
            document.getElementById("rule-1").textContent = "1. Choose the answer you think is correct.";
            document.getElementById("rule-2").textContent = "2. Click '✅ Confirm Answer' to submit your choice.";
            document.getElementById("rule-3").textContent = "3. If correct ✅, proceed to the next question.";
            document.getElementById("rule-4").textContent = "4. You get 3 attempts.";
            document.getElementById("rule-5").textContent = "5. If wrong ❌, your attempts decrease.";
            document.getElementById("rule-6").textContent = "6. If attempts run out, you must watch an ad to continue.";
            document.getElementById("start-game-btn").textContent = "Start Game";
            document.getElementById("popup-ok-btn").textContent = "OK";
            document.getElementById("token-message").innerHTML = "⏳ <b>Attempts exhausted!</b><br>Watch an ad to continue playing?";
            document.getElementById("watch-ad-btn").textContent = "Watch Ad";
            document.getElementById("go-to-score-btn").textContent = "No, Go to Score";

            document.querySelector(".navbar-right").appendChild(attemptsElement);

            setTimeout(() => {
                sloganElement.classList.add("show");
                setTimeout(() => {
                    rightElement.classList.add("show");
                    attemptsElement.classList.add("show");
                }, 300);
            }, 10);
        } else {
            navbar.classList.remove("lang-en");
            navbar.classList.add("lang-id");
            document.getElementById("navbar-slogan").innerHTML = '<i class="fas fa-flag me-2"></i>Tebak Bendera';
            document.getElementById("game-title").textContent = "🌍 Tebak Bendera";
            document.getElementById("navbar-attempts").textContent = `Kesempatan: ${attemptsLeft}`;
            document.getElementById("confirm-btn").textContent = "✅ Jawaban Yakin";
            document.getElementById("ad-placeholder").textContent = "🔹 Space Iklan 🔹";
            document.getElementById("back-btn").textContent = "🏠 Kembali ke Menu";
            document.getElementById("loading-text").textContent = "Memuat data... ⏳";
            document.getElementById("tutorial-title").textContent = "📜 Cara Bermain & Peraturan";
            document.getElementById("rule-1").textContent = "1. Pilih jawaban yang menurutmu benar.";
            document.getElementById("rule-2").textContent = "2. Klik tombol '✅ Jawaban Yakin' untuk mengonfirmasi pilihanmu.";
            document.getElementById("rule-3").textContent = "3. Jika jawaban benar ✅, lanjut ke pertanyaan berikutnya.";
            document.getElementById("rule-4").textContent = "4. Kamu akan diberikan 3 kali kesempatan";
            document.getElementById("rule-5").textContent = "5. Jika jawaban salah ❌, kesempatan berkurang.";
            document.getElementById("rule-6").textContent = "6. Jika kesempatan habis, tonton iklan untuk melanjutkan.";
            document.getElementById("start-game-btn").textContent = "Mulai Game";
            document.getElementById("popup-ok-btn").textContent = "OK";
            document.getElementById("token-message").innerHTML = "⏳ <b>Kesempatan habis!</b><br>Tonton iklan untuk melanjutkan bermain?";
            document.getElementById("watch-ad-btn").textContent = "Tonton Iklan";
            document.getElementById("go-to-score-btn").textContent = "Tidak, Lanjut ke Skor";

            if (window.innerWidth >= 768) {
                document.querySelector(".navbar-right").appendChild(attemptsElement);
            } else {
                document.querySelector(".navbar-attempts-container").appendChild(attemptsElement);
            }

            setTimeout(() => {
                sloganElement.classList.add("show");
                setTimeout(() => {
                    if (window.innerWidth >= 768) {
                        rightElement.classList.add("show");
                        attemptsElement.classList.add("show");
                    } else {
                        attemptsElement.classList.add("show");
                        setTimeout(() => {
                            rightElement.classList.add("show");
                        }, 300);
                    }
                }, 300);
            }, 10);
        }
    }, 500);
}

function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function checkAutoResetToken() {
    const currentTime = getCurrentTime();
    const resetTime = "18:00";
    let lastReset = localStorage.getItem("lastReset") || "00:00";

    if (currentTime >= resetTime && lastReset < resetTime) {
        localStorage.setItem("token", 7);
        localStorage.setItem("lastReset", currentTime);
    }

    setInterval(() => {
        const timeNow = getCurrentTime();
        let lastResetCheck = localStorage.getItem("lastReset") || "00:00";
        if (timeNow === resetTime && lastResetCheck !== resetTime) {
            localStorage.setItem("token", 7);
            localStorage.setItem("lastReset", timeNow);
        }
    }, 60000);
}

function loadQuestion() {
    if (questionLoaded || countries.length === 0 || isTransitioning) return;

    questionLoaded = true;
    isTransitioning = true;
    selectedAnswer = null;
    const confirmBtn = document.getElementById("confirm-btn");
    if (confirmBtn) {
        confirmBtn.disabled = true;
    }
    updateAttemptsDisplay();

    // Pilih negara yang belum digunakan
    let availableCountries = countries.filter(country => !usedFlags.includes(country.cca3));
    if (availableCountries.length === 0) {
        // Jika tidak ada negara yang tersedia, reset usedFlags dan mulai ulang
        usedFlags = [];
        localStorage.setItem("usedFlags", JSON.stringify(usedFlags));
        availableCountries = countries;
        console.log("Semua bendera sudah digunakan, mereset usedFlags dan memulai ulang.");
    }

    let correctCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
    
    // Tambahkan negara ke usedFlags
    usedFlags.push(correctCountry.cca3);
    localStorage.setItem("usedFlags", JSON.stringify(usedFlags));
    console.log("usedFlags diperbarui:", usedFlags);

    let choices = new Set([correctCountry]);

    while (choices.size < 4) {
        let choice = countries[Math.floor(Math.random() * countries.length)];
        if (!choices.has(choice)) choices.add(choice);
    }

    let shuffledChoices = [...choices].sort(() => Math.random() - 0.5);

    const flagImg = document.getElementById("flag-img");
    if (!flagImg) {
        console.error("Elemen 'flag-img' tidak ditemukan!");
        return;
    }
    flagImg.classList.remove("flag-exit", "flag-transition", "fade-in", "shake");
    flagImg.style.opacity = "0";
    flagImg.src = "";
    setTimeout(() => {
        flagImg.src = correctCountry.flags.png;
        flagImg.classList.add("flag-transition");
        flagImg.style.opacity = "1";
        isTransitioning = false;
    }, 550);

    document.querySelectorAll(".choice-btn").forEach((btn, index) => {
        let country = shuffledChoices[index];
        btn.innerText = country.name.common;
        btn.classList.remove("selected");
        btn.onclick = () => selectAnswer(country, correctCountry, btn);
    });
}

function selectAnswer(selected, correct, button) {
    selectedAnswer = { selected, correct };
    const confirmBtn = document.getElementById("confirm-btn");
    if (confirmBtn) {
        confirmBtn.disabled = false;
    }

    document.querySelectorAll(".choice-btn").forEach(btn => {
        btn.classList.remove("selected");
    });

    button.classList.add("selected");
}

function confirmAnswer() {
    if (!selectedAnswer) return;

    let { selected, correct } = selectedAnswer;
    let correctAnswers = parseInt(localStorage.getItem("correctAnswers")) || 0;
    let token = parseInt(localStorage.getItem("token")) || 0;

    const flagImg = document.getElementById("flag-img");
    if (!flagImg) {
        console.error("Elemen 'flag-img' tidak ditemukan di confirmAnswer!");
        return;
    }
    flagImg.classList.remove("flag-transition");

    if (selected.name.common === correct.name.common) {
        correctAnswers += 1;
        localStorage.setItem("correctAnswers", correctAnswers);
        showPopup(savedLang === "en" ? "✅ <b>Correct answer!</b>" : "✅ <b>Jawaban benar!</b>", "#28A745");
        questionLoaded = false;
    } else {
        // Jawaban salah: kurangi kesempatan dan tambahkan getaran
        attemptsLeft--;
        updateAttemptsDisplay();
        flagImg.classList.add("shake");

        // Tambahkan getaran di perangkat mobile (200ms)
        if ("vibrate" in navigator) {
            navigator.vibrate(200); // Getar selama 200ms
        } else {
            console.log("Perangkat tidak mendukung getaran.");
        }

        if (attemptsLeft > 0) {
            showPopup(savedLang === "en" ? 
                `❌ <b>Wrong answer!</b><br>Attempts left: <b>${attemptsLeft}</b>` : 
                `❌ <b>Jawaban salah!</b><br>Kesempatan tersisa: <b>${attemptsLeft}</b>`, "#DC3545");
            questionLoaded = false;
        } else {
            // Baik bahasa Inggris maupun Indonesia: tampilkan pop-up token habis
            showTokenPopup();
            return;
        }
    }
}

function showTutorial() {
    let tutorialPopup = document.getElementById("tutorial-popup");
    if (!tutorialPopup) {
        console.error("Elemen 'tutorial-popup' tidak ditemukan!");
        return;
    }
    tutorialPopup.style.visibility = "visible";
    setTimeout(() => tutorialPopup.classList.add("show"), 10);
}

function closeTutorial() {
    let tutorialPopup = document.getElementById("tutorial-popup");
    if (!tutorialPopup) {
        console.error("Elemen 'tutorial-popup' tidak ditemukan di closeTutorial!");
        return;
    }
    tutorialPopup.classList.remove("show");
    tutorialPopup.classList.add("hide");

    setTimeout(() => {
        tutorialPopup.style.visibility = "hidden";
        tutorialPopup.classList.remove("hide");
        loadQuestion();
    }, 300);
}

function updateAttemptsDisplay() {
    const attemptsElement = document.getElementById("navbar-attempts");
    if (!attemptsElement) {
        console.error("Elemen 'navbar-attempts' tidak ditemukan di updateAttemptsDisplay!");
        return;
    }
    const attemptsText = savedLang === "en" ? `Attempts: ${attemptsLeft}` : `Kesempatan: ${attemptsLeft}`;
    attemptsElement.textContent = attemptsText;
}

function showPopup(message, bgColor) {
    let popup = document.getElementById("popup");
    let popupMessage = document.getElementById("popup-message");

    if (!popup || !popupMessage) {
        console.error("Elemen 'popup' atau 'popup-message' tidak ditemukan di showPopup!");
        return;
    }

    popupMessage.innerHTML = message;
    popup.style.backgroundColor = bgColor;
    
    popup.classList.remove("hide");
    popup.style.visibility = "visible";
    setTimeout(() => popup.classList.add("show"), 10);

    autoClosePopupTimeout = setTimeout(() => {
        closePopup();
    }, 4000);
}

function closePopup() {
    let popup = document.getElementById("popup");
    if (!popup) {
        console.error("Elemen 'popup' tidak ditemukan di closePopup!");
        return;
    }
    popup.classList.remove("show");
    popup.classList.add("hide");

    clearTimeout(autoClosePopupTimeout);

    setTimeout(() => {
        popup.style.visibility = "hidden";
        popup.classList.remove("hide");

        if (attemptsLeft > 0 && countries.length > 0 && !isTransitioning) {
            const flagImg = document.getElementById("flag-img");
            if (flagImg) {
                flagImg.classList.add("flag-exit");
                setTimeout(() => {
                    flagImg.classList.remove("shake", "flag-exit");
                    flagImg.style.opacity = "0";
                    questionLoaded = false;
                    loadQuestion();
                }, 500);
            }
        }
    }, 300);
}

function showTokenPopup() {
    if (tokenPopupShown) return;
    tokenPopupShown = true;

    let tokenPopup = document.getElementById("token-popup");
    if (!tokenPopup) {
        console.error("Elemen 'token-popup' tidak ditemukan di showTokenPopup!");
        return;
    }
    tokenPopup.classList.remove("hide");
    tokenPopup.style.visibility = "visible";
    setTimeout(() => tokenPopup.classList.add("show"), 10);
}

function closeTokenPopup() {
    let tokenPopup = document.getElementById("token-popup");
    if (!tokenPopup) {
        console.error("Elemen 'token-popup' tidak ditemukan di closeTokenPopup!");
        return;
    }
    tokenPopup.classList.remove("show");
    tokenPopup.classList.add("hide");

    setTimeout(() => {
        tokenPopup.style.visibility = "hidden";
        tokenPopup.classList.remove("hide");
        tokenPopupShown = false;
    }, 300);
}

function watchAd() {
    closeTokenPopup();

    // Simulasi sementara (akan diganti dengan AdSense/AdMob)
    setTimeout(() => {
        attemptsLeft += 1; // Hanya tambah kesempatan, token tidak bertambah
        updateAttemptsDisplay();
        showPopup(savedLang === "en" ? 
            "✅ <b>Ad watched!</b><br>1 attempt added. Continuing game..." : 
            "✅ <b>Iklan ditonton!</b><br>1 kesempatan ditambahkan. Melanjutkan permainan...", "#28A745");
        questionLoaded = false;
    }, 3000);
}

function goToScore() {
    closeTokenPopup();
    window.location.href = "score.html";
}

function spawnMeteors() {
    setInterval(() => {
        for (let i = 0; i < 3; i++) {
            let meteor = document.createElement("div");
            meteor.classList.add("meteor");

            let startX = Math.random() * window.innerWidth;
            let startY = Math.random() * -100 - 50;
            meteor.style.left = `${startX}px`;
            meteor.style.top = `${startY}px`;

            let size = 60 + Math.random() * 60;
            let speed = 1 + Math.random() * 2;
            meteor.style.height = `${size}px`;
            meteor.style.animationDuration = `${speed}s`;

            let angle = -45 + (Math.random() * 20 - 10);
            meteor.style.transform = `rotate(${angle}deg)`;

            document.body.appendChild(meteor);
            setTimeout(() => meteor.remove(), speed * 1000 + 500);
        }
    }, 1000);
}

function spawnParticles() {
    const particleContainer = document.querySelector(".particle-container");
    if (!particleContainer) {
        console.error("Elemen 'particle-container' tidak ditemukan!");
        return;
    }
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        let particle = document.createElement("div");
        particle.classList.add("particle");

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        let delay = Math.random() * 5;
        let duration = 4 + Math.random() * 3;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        particleContainer.appendChild(particle);
    }
}