// js/news.js

const newsData = [
    {
        category: "入社情報",
        date: "2025-04-01",
        title: "2025年4月1日より新しいスタッフが東京オフィスに加わりました。",
        summary: "インドネシア出身の皆様との円滑なコミュニケーションを目的に、インドネシア担当コーディネーターとしてMADE（マデ）さんが入社しました。",
        shortSummary: "インドネシア出身のMADEさんが東京オフィスにコーディネーターとして入社。",
        image: "images/news1.jpg"
    },
    {
        category: "連携",
        date: "2025-04-01",
        title: "近隣パートナー企業への新メンバーご紹介",
        summary: "2025年4月上旬、ITFでは新たに入社したスタッフをご紹介するため、東京近郊の提携パートナー企業様に向けて...",
        shortSummary: "新メンバーを東京近郊のパートナー企業にご紹介。",
        image: "images/news2.jpg"
    },
    {
        category: "募集",
        date: "2025-04-04",
        title: "『緑樹会』介護施設にて正社員募集を開始しました",
        summary: "ITFの提携先である介護施設『緑樹会（りょくじゅかい）』様にて、介護職の正社員募集がスタートしました。",
        shortSummary: "『緑樹会』介護施設で正社員募集開始。",
        image: "images/news3.jpg"
    },
    {
        category: "イベント",
        date: "2025-04-12",
        title: "外国人材向けキャリアフェア2025を開催",
        summary: "ITF主催のキャリアフェアが大阪で開催されます。ベトナム、インドネシア、フィリピンからの人材と日本企業をつなぐイベントです。",
        shortSummary: "大阪で外国人材向けキャリアフェア開催。",
        image: "images/news4.jpg"
    },
    {
        category: "連携",
        date: "2025-04-15",
        title: "タイ企業との新たなパートナーシップ締結",
        summary: "ITFはタイのトップ人材紹介会社と提携し、タイ人エンジニアの日本企業への紹介を強化します。",
        shortSummary: "タイ企業と新パートナーシップ締結。",
        image: "images/news5.jpg"
    },
    {
        category: "募集",
        date: "2025-04-18",
        title: "東京オフィスで通訳スタッフ募集開始",
        summary: "英語と日本語のバイリンガル通訳者を募集開始。外国人材と企業のスムーズなコミュニケーションをサポートします。",
        shortSummary: "東京オフィスで通訳スタッフ募集。",
        image: "images/news6.jpg"
    }
];

function renderIndexNews() {
    const newsList = document.querySelector(".list ul");
    if (!newsList) return;
    newsList.innerHTML = "";
    const latestNews = newsData.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    latestNews.forEach((item, index) => {
        newsList.innerHTML += `
            <li class="item">
                <a href="news.html?id=${newsData.indexOf(item)}" title="${item.title}">
                    <ul class="tag flex vcenter">
                        <li class="category">${item.category}</li>
                        <li class="date"><time datetime="${item.date}">${item.date.replace(/-/g, "/")}</time></li>
                    </ul>
                    <dl>
                        <dt class="title"><div class="js-t8 line1">${item.title}</div></dt>
                        <dd class="summary">
                            <div class="pc js-t8 line1">${item.shortSummary}</div>
                            <div class="sp js-t8 line2">${item.shortSummary}</div>
                        </dd>
                    </dl>
                </a>
            </li>
        `;
    });
}

function renderNews(filteredData) {
    const newsList = document.getElementById("newsList");
    if (!newsList) return;
    newsList.innerHTML = "";
    filteredData.forEach((item, index) => {
        newsList.innerHTML += `
            <div class="news-item">
                <div class="news-image" style="background-image: url(${item.image});"></div>
                <div class="news-content">
                    <div class="tag">
                        <span class="category">${item.category}</span>
                        <span class="date">${item.date}</span>
                    </div>
                    <div class="title">${item.title}</div>
                    <div class="summary">${item.shortSummary} <a href="news.html?id=${newsData.indexOf(item)}">See More...</a></div>
                </div>
            </div>
        `;
    });
}

function filterNews() {
    const categoryFilter = document.getElementById("categoryFilter");
    const dateFilter = document.getElementById("dateFilter");
    if (!categoryFilter || !dateFilter) return;

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

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get("id");

    if (document.querySelector(".list ul")) {
        renderIndexNews();
    } else if (document.getElementById("newsList")) {
        if (newsId !== null) {
            const selectedNews = newsData[newsId];
            if (selectedNews) {
                const newsList = document.getElementById("newsList");
                newsList.innerHTML = `
                    <div class="news-item">
                        <div class="news-image" style="background-image: url(${selectedNews.image});"></div>
                        <div class="news-content">
                            <div class="tag">
                                <span class="category">${selectedNews.category}</span>
                                <span class="date">${selectedNews.date}</span>
                            </div>
                            <div class="title">${selectedNews.title}</div>
                            <div class="summary">${selectedNews.summary}</div>
                        </div>
                    </div>
                `;
            }
        } else {
            renderNews(newsData);
            document.getElementById("categoryFilter").addEventListener("change", filterNews);
            document.getElementById("dateFilter").addEventListener("change", filterNews);
        }
    }
});