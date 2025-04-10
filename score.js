console.log("Score.js berhasil dimuat!");

let savedLang = localStorage.getItem("language") || "id";
let autoClosePopupTimeout = null;
const TOTAL_COUNTRIES = 252;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing...");

    spawnMeteors();
    spawnParticles();
    initializeFictionalLeaderboard();
    displayScore();
    displayLeaderboard();
    updateLanguage(savedLang);
    setActiveLanguageButton(savedLang);

    const langEn = document.getElementById("lang-en");
    const langId = document.getElementById("lang-id");
    if (langEn) {
        langEn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.setItem("language", "en");
            updateLanguage("en");
            setActiveLanguageButton("en");
        });
    }
    if (langId) {
        langId.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.setItem("language", "id");
            updateLanguage("id");
            setActiveLanguageButton("id");
        });
    }
});

function setActiveLanguageButton(lang) {
    const langEn = document.getElementById("lang-en");
    const langId = document.getElementById("lang-id");
    if (langEn && langId) {
        if (lang === "en") {
            langEn.classList.add("active");
            langId.classList.remove("active");
        } else {
            langId.classList.add("active");
            langEn.classList.remove("active");
        }
    }
}

function updateLanguage(lang) {
    const navbar = document.querySelector(".navbar");
    const sloganElement = document.querySelector(".navbar-brand");
    if (!navbar || !sloganElement) return;

    sloganElement.classList.remove("show");
    setTimeout(() => {
        if (lang === "en") {
            navbar.classList.remove("lang-id");
            navbar.classList.add("lang-en");
            document.getElementById("navbar-slogan").innerHTML = '<i class="fas fa-flag me-2"></i>Flag Quiz';
            document.getElementById("score-title").textContent = "Game Results";
            document.getElementById("score-display").textContent = `Your Final Score: ${parseInt(localStorage.getItem("correctAnswers") || 0) * 10}`;
            document.getElementById("token-display").childNodes[0].textContent = "Remaining Tokens: ";
            document.getElementById("correct-answers").childNodes[0].textContent = "Correct Answers: ";
            document.getElementById("achievement-text").textContent = `🌟 You've mastered ${parseInt(localStorage.getItem("correctAnswers") || 0)} flags from around the globe!`;
            document.getElementById("play-again-btn").textContent = "Play Again";
            document.getElementById("share-btn").textContent = "Share Score";
            document.getElementById("menu-btn").textContent = "Back to Menu";
            document.getElementById("leaderboard-title").textContent = "🏆 Leaderboard";
            document.getElementById("table-name").textContent = "Name";
            document.getElementById("table-level").textContent = "Level";
            document.getElementById("table-score").textContent = "Score";
            document.getElementById("table-correct").textContent = "Correct";
            document.getElementById("footer-copyright").textContent = "© 2025 Ghozy Games. All Rights Reserved - Crafted with Passion.";
            document.getElementById("footer-email").childNodes[0].textContent = "Contact us at: ";
            document.getElementById("footer-follow").textContent = "Follow us on:";
            document.getElementById("popup-ok-btn").textContent = "OK";
        } else {
            navbar.classList.remove("lang-en");
            navbar.classList.add("lang-id");
            document.getElementById("navbar-slogan").innerHTML = '<i class="fas fa-flag me-2"></i>Tebak Bendera';
            document.getElementById("score-title").textContent = "Hasil Permainan";
            document.getElementById("score-display").textContent = `Skor Akhir Anda: ${parseInt(localStorage.getItem("correctAnswers") || 0) * 10}`;
            document.getElementById("token-display").childNodes[0].textContent = "Token Tersisa: ";
            document.getElementById("correct-answers").childNodes[0].textContent = "Jawaban yang Sebetulnya: ";
            document.getElementById("achievement-text").textContent = `🌟 Kamu telah menguasai ${parseInt(localStorage.getItem("correctAnswers") || 0)} bendera dari seluruh dunia!`;
            document.getElementById("play-again-btn").textContent = "Main Lagi";
            document.getElementById("share-btn").textContent = "Share Skor";
            document.getElementById("menu-btn").textContent = "Kembali ke Menu";
            document.getElementById("leaderboard-title").textContent = "🏆 Papan Skor";
            document.getElementById("table-name").textContent = "Nama";
            document.getElementById("table-level").textContent = "Level";
            document.getElementById("table-score").textContent = "Skor";
            document.getElementById("table-correct").textContent = "Benar";
            document.getElementById("footer-copyright").textContent = "© 2025 Ghozy Games. Semua Hak Dilindungi - Dibuat dengan Semangat.";
            document.getElementById("footer-email").childNodes[0].textContent = "Hubungi kami di: ";
            document.getElementById("footer-follow").textContent = "Ikuti kami di:";
            document.getElementById("popup-ok-btn").textContent = "OK";
        }
        setTimeout(() => sloganElement.classList.add("show"), 10);
    }, 500);

    displayLeaderboard();
    displayScore();
}

function getLevelByPercentage(pct) {
    console.log(`Persentase: ${pct}%`);
    const levels = [
        { min: 0, max: 10, name: "Wanderer of the Void", icon: ["fa-question-circle"], color: "gray-to-dark", gradient: "linear-gradient(to right, #4b5563, #1f2937)", rank: 1 },
        { min: 11, max: 25, name: "Seeker of Nations", icon: ["fa-compass"], color: "yellow-to-orange", gradient: "linear-gradient(to right, #facc15, #f97316)", rank: 2 },
        { min: 26, max: 40, name: "Cartographer's Disciple", icon: ["fa-map"], color: "lime-to-yellow", gradient: "linear-gradient(to right, #84cc16, #facc15)", rank: 3 },
        { min: 41, max: 55, name: "Knight of the Atlas", icon: ["fa-shield-halved"], color: "green-to-lime", gradient: "linear-gradient(to right, #16a34a, #84cc16)", rank: 4 },
        { min: 56, max: 70, name: "Warden of Borders", icon: ["fa-landmark"], color: "blue-to-green", gradient: "linear-gradient(to right, #2563eb, #16a34a)", rank: 5 },
        { min: 71, max: 85, name: "Oracle of Geographies", icon: ["fa-eye"], color: "indigo-to-blue", gradient: "linear-gradient(to right, #4f46e5, #2563eb)", rank: 6 },
        { min: 86, max: 99, name: "Sage of Nations", icon: ["fa-globe"], color: "purple-to-indigo", gradient: "linear-gradient(to right, #9333ea, #4f46e5)", rank: 7 },
        { min: 100, max: 100, name: "Deus Flagrum", icon: ["fa-crown", "fa-flag"], color: "yellow-to-red", gradient: "linear-gradient(to right, #facc15, #ef4444)", rank: 8 }
    ];
    return levels.find(level => pct >= level.min && pct <= level.max) || levels[0];
}

function displayScore() {
    console.log("Menampilkan skor...");
    const correctAnswers = parseInt(localStorage.getItem("correctAnswers")) || 0;
    const token = parseInt(localStorage.getItem("token")) || 0;
    const score = correctAnswers * 10;
    const percentage = (correctAnswers / TOTAL_COUNTRIES) * 100;
    const level = getLevelByPercentage(percentage);

    console.log(`Correct Answers: ${correctAnswers}, Token: ${token}, Score: ${score}, Percentage: ${percentage}`);

    const scoreDisplay = document.getElementById("score-display");
    const tokenCount = document.getElementById("token-count");
    const correctCount = document.getElementById("correct-count");
    const achievementText = document.getElementById("achievement-text");

    if (scoreDisplay) scoreDisplay.textContent = savedLang === "en" ? `Your Final Score: ${score}` : `Skor Akhir Anda: ${score}`;
    if (tokenCount) tokenCount.textContent = token;
    if (correctCount) correctCount.textContent = correctAnswers;
    if (achievementText) achievementText.textContent = savedLang === "en" ?
        `🌟 You've mastered ${correctAnswers} flags from around the globe!` :
        `🌟 Kamu telah menguasai ${correctAnswers} bendera dari seluruh dunia!`;

    const levelDisplay = document.getElementById("level-display");
    const levelIcon = document.getElementById("level-icon");
    const levelName = document.getElementById("level-name");
    const levelPing = document.getElementById("level-ping");

    if (levelDisplay && levelIcon && levelName && levelPing) {
        levelDisplay.className = "level-badge " + level.color;
        levelDisplay.style.background = level.gradient;
        levelIcon.className = "fas level-icon " + level.icon.join(" ");
        levelName.textContent = level.name;
        levelPing.className = "level-ping";
        levelPing.style.background = level.gradient;
    }

    saveToLeaderboard(score, correctAnswers);
}

function initializeFictionalLeaderboard() {
    let fictionalLeaderboard = JSON.parse(localStorage.getItem("fictionalLeaderboard")) || [];
    if (fictionalLeaderboard.length === 0) {
        const fictionalData = [
            { name: "Nyra of the North", correctAnswers: 0, score: 0 },
            { name: "Aurelia Mapwell", correctAnswers: 0, score: 0 },
            { name: "Bang Atlas", correctAnswers: 0, score: 0 },
            { name: "Zephyria Nomadica", correctAnswers: 0, score: 0 },
            { name: "Kael Dominion", correctAnswers: 0, score: 0 },
            { name: "Mbok Peta", correctAnswers: 0, score: 0 },
            { name: "BenderaMan", correctAnswers: 0, score: 0 },
            { name: "Aeris Luma", correctAnswers: 0, score: 0 },
            { name: "Talia Mirelle", correctAnswers: 0, score: 0 },
            { name: "Elion Vire", correctAnswers: 0, score: 0 },
            { name: "Solana Ravea", correctAnswers: 0, score: 0 },
            { name: "Kairo Enys", correctAnswers: 0, score: 0 },
            { name: "GhostAtlas", correctAnswers: 0, score: 0 },
            { name: "NeoNex", correctAnswers: 0, score: 0 },
            { name: "SpecterFlag", correctAnswers: 0, score: 0 },
            { name: "GlobyX", correctAnswers: 0, score: 0 },
            { name: "PetaManiak", correctAnswers: 0, score: 0 },
            { name: "Flagzilla", correctAnswers: 0, score: 0 },
            { name: "Tebaknoob", correctAnswers: 0, score: 0 },
            { name: "OmGeoSalah", correctAnswers: 0, score: 0 },
            { name: "NegarawanTersesat", correctAnswers: 0, score: 0 },
            { name: "Raj Flagdeep", correctAnswers: 0, score: 0 },
            { name: "ShadowGeoX", correctAnswers: 0, score: 0 },
            { name: "MrFlagPhantom", correctAnswers: 0, score: 0 },
            { name: "NovaAtlas", correctAnswers: 0, score: 0 },
            { name: "Xenoglobe", correctAnswers: 0, score: 0 },
            { name: "TheFlagverse", correctAnswers: 0, score: 0 },
            { name: "SkyMapper", correctAnswers: 0, score: 0 },
            { name: "EchoGlobe", correctAnswers: 0, score: 0 },
            { name: "VortexFlag", correctAnswers: 0, score: 0 },
            { name: "LunaGeo", correctAnswers: 0, score: 0 },
            { name: "BlazeAtlas", correctAnswers: 0, score: 0 },
            { name: "MysticMap", correctAnswers: 0, score: 0 },
            { name: "StarSeeker", correctAnswers: 0, score: 0 },
            { name: "GeoWanderer", correctAnswers: 0, score: 0 },
            { name: "FlagSentry", correctAnswers: 0, score: 0 },
            { name: "TerraNova", correctAnswers: 0, score: 0 },
            { name: "ChronoMap", correctAnswers: 0, score: 0 },
            { name: "NebulaFlag", correctAnswers: 0, score: 0 },
            { name: "HorizonScout", correctAnswers: 0, score: 0 },
            { name: "ShadowFlagMaster", correctAnswers: 0, score: 0 },
            { name: "RasenganGeoScout", correctAnswers: 0, score: 0 },
            { name: "PirateMapSeeker", correctAnswers: 0, score: 0 },
            { name: "OnePunchAtlas", correctAnswers: 0, score: 0 },
            { name: "SoulReaperFlag", correctAnswers: 0, score: 0 },
            { name: "HunterGeoElite", correctAnswers: 0, score: 0 },
            { name: "ShinobiMapPro", correctAnswers: 0, score: 0 },
            { name: "StrawHatGlobe", correctAnswers: 0, score: 0 },
            { name: "CyborgFlagZero", correctAnswers: 0, score: 0 },
            { name: "ZanpakutoGeo", correctAnswers: 0, score: 0 },
            { name: "Mbok Darmi", correctAnswers: 0, score: 0 },
            { name: "Pak RT", correctAnswers: 0, score: 0 },
            { name: "Kang Nasi Goreng", correctAnswers: 0, score: 0 },
            { name: "Budi Pekerti", correctAnswers: 0, score: 0 },
            { name: "Siswa Teladan", correctAnswers: 0, score: 0 },
            { name: "Guru Mapel", correctAnswers: 0, score: 0 },
            { name: "Pedagang Kaki Lima", correctAnswers: 0, score: 0 },
            { name: "Ojol Bang Jago", correctAnswers: 0, score: 0 }
        ];

        fictionalData.forEach(entry => {
            entry.correctAnswers = Math.floor(Math.random() * TOTAL_COUNTRIES); // Maksimum 251
            entry.score = entry.correctAnswers * 10;
            const percentage = (entry.correctAnswers / TOTAL_COUNTRIES) * 100;
            const level = getLevelByPercentage(percentage);
            entry.level = level.name;
            entry.levelRank = level.rank;
        });

        fictionalLeaderboard = fictionalData.sort(() => Math.random() - 0.5);
        localStorage.setItem("fictionalLeaderboard", JSON.stringify(fictionalLeaderboard));
    } else {
        fictionalLeaderboard.forEach(entry => {
            if (entry.correctAnswers > TOTAL_COUNTRIES) entry.correctAnswers = TOTAL_COUNTRIES;
            entry.score = entry.correctAnswers * 10;
            const percentage = (entry.correctAnswers / TOTAL_COUNTRIES) * 100;
            const level = getLevelByPercentage(percentage);
            entry.level = level.name;
            entry.levelRank = level.rank;
        });
        localStorage.setItem("fictionalLeaderboard", JSON.stringify(fictionalLeaderboard));
    }
}

function saveToLeaderboard(score, correctAnswers) {
    let playerLeaderboard = JSON.parse(localStorage.getItem("playerLeaderboard")) || [];
    const percentage = (correctAnswers / TOTAL_COUNTRIES) * 100;
    const level = getLevelByPercentage(percentage);
    playerLeaderboard = [{ name: "You", score, correctAnswers, level: level.name, levelRank: level.rank }];
    localStorage.setItem("playerLeaderboard", JSON.stringify(playerLeaderboard));
    displayLeaderboard();
}

function displayLeaderboard() {
    const leaderboardList = document.getElementById("leaderboard-list");
    if (!leaderboardList) return;

    const fictionalLeaderboard = JSON.parse(localStorage.getItem("fictionalLeaderboard")) || [];
    const playerLeaderboard = JSON.parse(localStorage.getItem("playerLeaderboard")) || [];
    const combinedLeaderboard = [...fictionalLeaderboard, ...playerLeaderboard]
        .sort((a, b) => b.score - a.score || b.levelRank - a.levelRank);

    leaderboardList.innerHTML = combinedLeaderboard.map((entry, index) => `
        <tr class="${entry.name === "You" ? "player-row" : ""}">
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td><span>${entry.level}</span></td>
            <td><span>${entry.score}</span></td>
            <td><span>${entry.correctAnswers}</span></td>
        </tr>
    `).join("");
}

function playAgain() {
    localStorage.setItem("correctAnswers", 0);
    window.location.href = "game.html";
}

function createSharePamflet(score, correctAnswers, level) {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext("2d");

        const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
        gradient.addColorStop(0, "#000957");
        gradient.addColorStop(1, "#344CB7");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 800);

        const worldMap = new Image();
        worldMap.crossOrigin = "Anonymous";
        worldMap.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/World_map_with_countries_labeled.svg/1200px-World_map_with_countries_labeled.svg.png";
        worldMap.onload = () => {
            ctx.globalAlpha = 0.3;
            ctx.drawImage(worldMap, 0, 0, 1200, 800);
            ctx.globalAlpha = 1.0;

            ctx.fillStyle = "#FFD700";
            ctx.font = "bold 80px Poppins";
            ctx.textAlign = "center";
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 10;
            ctx.fillText(savedLang === "en" ? "Flag Quiz Triumph" : "Kemenangan Tebak Bendera", 600, 150);
            ctx.shadowBlur = 0;

            ctx.fillStyle = "white";
            ctx.font = "bold 60px Poppins";
            ctx.fillText(savedLang === "en" ? `Final Score: ${score}` : `Skor Akhir: ${score}`, 600, 300);

            ctx.font = "48px Poppins";
            ctx.fillText(savedLang === "en" ? `Correct Flags: ${correctAnswers}` : `Bendera Benar: ${correctAnswers}`, 600, 400);

            ctx.fillStyle = "#FFD700";
            ctx.font = "bold 56px Poppins";
            ctx.fillText(`Level: ${level}`, 600, 500);

            ctx.fillStyle = "white";
            ctx.font = "32px Poppins";
            ctx.fillText(savedLang === "en" ? "Challenge yourself at Flag Quiz!" : "Tantang dirimu di Tebak Bendera!", 600, 650);

            ctx.font = "24px Poppins";
            ctx.fillText("© 2025 Ghozy Games", 600, 750);

            ctx.font = "80px 'Font Awesome 5 Free'";
            ctx.fillStyle = "#FFD700";
            ctx.fillText("\uf024", 100, 100);

            const dataUrl = canvas.toDataURL("image/png", 1.0);
            resolve(dataUrl);
        };
        worldMap.onerror = () => {
            console.error("Gagal memuat peta dunia, menggunakan gradien saja.");
            ctx.fillStyle = "#FFD700";
            ctx.font = "bold 80px Poppins";
            ctx.fillText(savedLang === "en" ? "Flag Quiz Triumph" : "Kemenangan Tebak Bendera", 600, 150);
            ctx.fillStyle = "white";
            ctx.font = "bold 60px Poppins";
            ctx.fillText(savedLang === "en" ? `Final Score: ${score}` : `Skor Akhir: ${score}`, 600, 300);
            ctx.font = "48px Poppins";
            ctx.fillText(savedLang === "en" ? `Correct Flags: ${correctAnswers}` : `Bendera Benar: ${correctAnswers}`, 600, 400);
            ctx.fillStyle = "#FFD700";
            ctx.font = "bold 56px Poppins";
            ctx.fillText(`Level: ${level}`, 600, 500);
            ctx.fillStyle = "white";
            ctx.font = "32px Poppins";
            ctx.fillText(savedLang === "en" ? "Challenge yourself at Flag Quiz!" : "Tantang dirimu di Tebak Bendera!", 600, 650);
            ctx.font = "24px Poppins";
            ctx.fillText("© 2025 Ghozy Games", 600, 750);
            ctx.font = "80px 'Font Awesome 5 Free'";
            ctx.fillStyle = "#FFD700";
            ctx.fillText("\uf024", 100, 100);
            const dataUrl = canvas.toDataURL("image/png", 1.0);
            resolve(dataUrl);
        };
    });
}

async function shareScore() {
    const correctAnswers = parseInt(localStorage.getItem("correctAnswers")) || 0;
    const score = correctAnswers * 10;
    const percentage = (correctAnswers / TOTAL_COUNTRIES) * 100;
    const level = getLevelByPercentage(percentage).name;
    const shareText = savedLang === "en" ?
        `I scored ${score} points on Flag Quiz! Can you beat my score? 🎉` :
        `Saya mendapatkan skor ${score} di Tebak Bendera! Bisakah kamu mengalahkan skor saya? 🎉`;
    const shareUrl = window.location.href;

    try {
        const dataUrl = await createSharePamflet(score, correctAnswers, level);
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "flag-quiz-score.png", { type: "image/png" });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: savedLang === "en" ? "Flag Quiz Score" : "Skor Tebak Bendera",
                text: shareText,
                url: shareUrl,
                files: [file]
            });
        } else {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "flag-quiz-score.png";
            link.click();
            showPopup(savedLang === "en" ?
                "✅ <b>Score image downloaded!</b><br>You can share it manually." :
                "✅ <b>Gambar skor diunduh!</b><br>Kamu bisa membagikannya secara manual.", "#28A745");
        }
    } catch (err) {
        console.error("Gagal membagikan:", err);
        if (navigator.share) {
            navigator.share({
                title: savedLang === "en" ? "Flag Quiz Score" : "Skor Tebak Bendera",
                text: shareText,
                url: shareUrl
            }).catch(fallbackShare(score));
        } else {
            fallbackShare(score);
        }
    }
}

function fallbackShare(score) {
    const shareText = savedLang === "en" ?
        `I scored ${score} points on Flag Quiz! Can you beat my score? 🎉 ${window.location.href}` :
        `Saya mendapatkan skor ${score} di Tebak Bendera! Bisakah kamu mengalahkan skor saya? 🎉 ${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
        showPopup(savedLang === "en" ?
            "✅ <b>Score copied to clipboard!</b><br>You can paste it to share." :
            "✅ <b>Skor disalin ke clipboard!</b><br>Kamu bisa tempel untuk membagikan.", "#28A745");
    }).catch(() => {
        showPopup(savedLang === "en" ?
            "❌ <b>Failed to copy score!</b><br>Please try again." :
            "❌ <b>Gagal menyalin skor!</b><br>Silakan coba lagi.", "#DC3545");
    });
}

function backToMenu() {
    window.location.href = "index.html";
}

function showPopup(message, bgColor) {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    if (!popup || !popupMessage) return;

    popupMessage.innerHTML = message;
    popup.style.backgroundColor = bgColor;
    popup.classList.remove("hide");
    popup.style.visibility = "visible";
    setTimeout(() => popup.classList.add("show"), 10);

    autoClosePopupTimeout = setTimeout(closePopup, 4000);
}

function closePopup() {
    const popup = document.getElementById("popup");
    if (!popup) return;
    popup.classList.remove("show");
    popup.classList.add("hide");
    clearTimeout(autoClosePopupTimeout);
    setTimeout(() => {
        popup.style.visibility = "hidden";
        popup.classList.remove("hide");
    }, 300);
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
    if (!particleContainer) return;
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