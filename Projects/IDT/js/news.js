// js/news.js

// Common news data (you can move this to a separate JSON file later)
const newsData = [
    {
        category: "入社情報",
        date: "2025-04-01",
        title: "2025年4月1日より新しいスタッフが東京オフィスに加わりました。",
        summary: "インドネシア出身の皆様との円滑なコミュニケーションを目的に、インドネシア担当コーディネーターとしてMADE（マデ）さんが入社しました。",
        image: "images/news1.jpg"
    },
    {
        category: "連携",
        date: "2025-04-01",
        title: "近隣パートナー企業への新メンバーご紹介",
        summary: "2025年4月上旬、ITFでは新たに入社したスタッフをご紹介するため、東京近郊の提携パートナー企業様に向けて...",
        image: "images/news2.jpg"
    },
    {
        category: "募集",
        date: "2025-04-04",
        title: "『緑樹会』介護施設にて正社員募集を開始しました",
        summary: "ITFの提携先である介護施設『緑樹会（りょくじゅかい）』様にて、介護職の正社員募集がスタートしました。",
        image: "images/news3.jpg"
    }
];

// Function for index.html (latest 3 news)
function renderIndexNews() {
    const newsList = document.querySelector(".list ul");
    if (!newsList) return; // Agar element nahi mila to skip karo
    newsList.innerHTML = "";
    const latestNews = newsData.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    latestNews.forEach(item => {
        newsList.innerHTML += `
            <li class="item">
                <a href="sites/news.html" title="${item.title}">
                    <ul class="tag flex vcenter">
                        <li class="category">${item.category}</li>
                        <li class="date"><time datetime="${item.date}">${item.date.replace(/-/g, "/")}</time></li>
                    </ul>
                    <dl>
                        <dt class="title"><div class="js-t8 line1">${item.title}</div></dt>
                        <dd class="summary">
                            <div class="pc js-t8 line1">${item.summary}</div>
                            <div class="sp js-t8 line2">${item.summary}</div>
                        </dd>
                    </dl>
                </a>
            </li>
        `;
    });
}

// Function for news.html (full list with filter)
function renderNews(filteredData) {
    const newsList = document.getElementById("newsList");
    if (!newsList) return; // Agar element nahi mila to skip karo
    newsList.innerHTML = "";
    filteredData.forEach(item => {
        newsList.innerHTML += `
            <div class="news-item">
                <div class="news-image" style="background-image: url(${item.image});"></div>
                <div class="news-content">
                    <div class="tag">
                        <span class="category">${item.category}</span>
                        <span class="date">${item.date}</span>
                    </div>
                    <div class="title">${item.title}</div>
                    <div class="summary">${item.summary}</div>
                </div>
            </div>
        `;
    });
}

function filterNews() {
    const categoryFilter = document.getElementById("categoryFilter");
    const dateFilter = document.getElementById("dateFilter");
    if (!categoryFilter || !dateFilter) return; // Agar filter elements nahi hain to skip

    let category = categoryFilter.value;
    let dateOrder = dateFilter.value;
    let filtered = [...newsData];

    if (category !== "all") {
        filtered = filtered.filter(item => item.category === category);
    }

    if (dateOrder === "desc") {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (dateOrder === "asc") {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    renderNews(filtered);
}

// Page-specific logic
document.addEventListener("DOMContentLoaded", () => {
    // Check which page is loaded
    if (document.querySelector(".list ul")) {
        renderIndexNews(); // index.html ke liye
    } else if (document.getElementById("newsList")) {
        renderNews(newsData); // news.html ke liye initial render
        document.getElementById("categoryFilter").addEventListener("change", filterNews);
        document.getElementById("dateFilter").addEventListener("change", filterNews);
    }
});