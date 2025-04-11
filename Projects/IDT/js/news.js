// js/news.js
const newsData = [
    {
        category: "入社情報",
        date: "2025-04-01",
        title: "2025年4月1日より新しいスタッフが東京オフィスに加わりました。",
        summary: "インドネシア出身の皆様との円滑なコミュニケーションを目的に、インドネシア担当コーディネーターとしてMADE（マデ）さんが入社しました。インドネシア出身の皆様との円滑なコミュニケーションを目的に、インドネシア担当コーディネーターとしてMADE（マデ）さんが入社しました。インドネシア出身の皆様との円滑なコミュニケーションを目的に、インドネシア担当コーディネーターとしてMADE（マデ）さんが入社しました。",
        shortSummary: "インドネシア出身のMADEさんが東京オフィスにコーディネーターとして入社。",
        image: "images/news1.jpg",
        postedBy: "ITF Admin"
    },
    {
        category: "連携",
        date: "2025-04-01",
        title: "近隣パートナー企業への新メンバーご紹介",
        summary: "2025年4月上旬、ITFでは新たに入社したスタッフをご紹介するため、東京近郊の提携パートナー企業様に向けて...東京近郊の提携パートナー企業様に向けて...東京近郊の提携パートナー企業様に向けて...",
        shortSummary: "新メンバーを東京近郊のパートナー企業にご紹介。",
        image: "images/news2.jpg",
        postedBy: "HR Team"
    },
    {
        category: "募集",
        date: "2025-04-04",
        title: "『緑樹会』介護施設にて正社員募集を開始しました",
        summary: "ITFの提携先である介護施設『緑樹会（りょくじゅかい）』様にて、介護職の正社員募集がスタートしました。ITFの提携先である介護施設『緑樹会（りょくじゅかい）』様にて、介護職の正社員募集がスタートしました。ITFの提携先である介護施設『緑樹会（りょくじゅかい）』様にて、介護職の正社員募集がスタートしました。",
        shortSummary: "『緑樹会』介護施設で正社員募集開始。",
        image: "images/news3.jpg",
        postedBy: "ITF Admin"
    },
    {
        category: "イベント",
        date: "2025-04-12",
        title: "外国人材向けキャリアフェア2025を開催",
        summary: "ITF主催のキャリアフェアが大阪で開催されます。ベトナム、インドネシア、フィリピンからの人材と日本企業をつなぐイベントです。ベトナム、インドネシア、フィリピンからの人材と日本企業をつなぐイベントです。ベトナム、インドネシア、フィリピンからの人材と日本企業をつなぐイベントです。",
        shortSummary: "大阪で外国人材向けキャリアフェア開催。",
        image: "images/news4.jpg",
        postedBy: "HR Team"
    },
    {
        category: "連携",
        date: "2025-04-15",
        title: "タイ企業との新たなパートナーシップ締結",
        summary: "ITFはタイのトップ人材紹介会社と提携し、タイ人エンジニアの日本企業への紹介を強化します。タイ人エンジニアの日本企業への紹介を強化します。タイ人エンジニアの日本企業への紹介を強化します。",
        shortSummary: "タイ企業と新パートナーシップ締結。",
        image: "images/news5.jpg",
        postedBy: "ITF Admin"
    },
    {
        category: "募集",
        date: "2025-04-18",
        title: "東京オフィスで通訳スタッフ募集開始",
        summary: "英語と日本語のバイリンガル通訳者を募集開始。外国人材と企業のスムーズなコミュニケーションをサポートします。外国人材と企業のスムーズなコミュニケーションをサポートします。外国人材と企業のスムーズなコミュニケーションをサポートします。Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni nesciunt nisi sunt doloremque libero. Nostrum sequi fuga non obcaecati mollitia, quasi dolor enim sit et atque molestias. Mollitia neque incidunt autem nemo, amet nisi impedit soluta accusamus dicta ab maiores delectus assumenda, reiciendis omnis consequatur ratione laudantium voluptate, quisquam ullam nostrum pariatur reprehenderit. Consequuntur perspiciatis, quibusdam facere vel, nisi libero facilis ducimus tenetur, aut dicta officiis maxime tempora ad repellat eum quod vitae ut! Consectetur maiores ad reprehenderit nemo. Ullam nobis repellendus officia aut repudiandae esse accusamus amet nemo. Cupiditate ex soluta et error repellat! Doloribus sapiente nulla distinctio deserunt totam et maiores consequuntur consectetur culpa eum repellendus est libero nisi inventore a dolorem eaque rem, iusto aliquam architecto. Atque magnam perferendis labore, quisquam consectetur molestias est distinctio corporis officia enim dolorum eius magni, optio quis dolore aspernatur facilis adipisci praesentium. Facere vero, nam quis iusto ab enim quidem id sit! Quae quia qui amet ratione deserunt magnam? Eligendi ratione, eum quae, rem unde exercitationem, in itaque delectus voluptas vel dolorem quisquam. Consequatur rem quidem mollitia accusamus hic aperiam maxime impedit temporibus iusto fugiat cumque expedita nesciunt odio possimus recusandae id eligendi suscipit nulla soluta, illum nobis dolores illo aliquid! Deserunt, voluptatem. Quis dolorum cupiditate delectus odio? Eligendi at hic reprehenderit modi est et illum nihil animi, deleniti adipisci maxime natus optio eos quasi inventore? Id pariatur ducimus aliquam perferendis itaque enim veniam totam reprehenderit obcaecati laboriosam, impedit atque debitis eum officiis asperiores saepe, corporis fugit possimus deserunt eos eligendi dolor optio. Quia velit consequuntur consectetur odit sunt quo non aliquid? Dicta, inventore unde perferendis ullam molestias molestiae, cupiditate non incidunt eveniet voluptatem deserunt, velit consequuntur necessitatibus aliquid ipsa laudantium pariatur sed iste quia quos? Laboriosam alias vel, excepturi eaque laborum sapiente. Optio aliquam deserunt deleniti, vel sunt molestiae laudantium!",
        shortSummary: "英語と日本語のバイリンガル通訳者を募集開始。外国人材と企業のスムーズなコミュニケーションをサポートします。外国人材と企業のスムーズなコミュニケーションをサポートします。外国人材と企業のスムーズなコミュニケーションをサポートします。",
        image: "images/cat.jpg",
        postedBy: "HR Team"
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
                <div class="news-details">
                    <div class="news-image" style="background-image: url(${item.image});"></div>
                    <div class="news-content">
                        <div class="tag">
                            <span class="date">${item.date}</span>
                            <span class="category">${item.category}</span>
                            <span class="posted-by">Posted By: ${item.postedBy}</span>
                        </div>
                        <div class="title">${item.title}</div>
                        <div class="summary">${item.shortSummary} <a href="news.html?id=${newsData.indexOf(item)}">もっと見る...</a></div>
                    </div>
                </div>
            </div>
        `;
    });
}

function filterNews() {
    const categoryFilter = document.getElementById("categoryFilter");
    const dateFilter = document.getElementById("dateFilter");
    const postedByFilter = document.getElementById("postedByFilter");
    if (!categoryFilter || !dateFilter || !postedByFilter) return;

    let category = categoryFilter.value;
    let dateOrder = dateFilter.value;
    let postedBy = postedByFilter.value;
    let filtered = [...newsData];

    if (category !== "all") {
        filtered = filtered.filter(item => item.category === category);
    }

    if (postedBy !== "all") {
        filtered = filtered.filter(item => item.postedBy === postedBy);
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

    // Filter bar ko hide karne ke liye
    const filterBar = document.querySelector(".filter-bar");
    if (filterBar) {
        if (newsId !== null) {
            filterBar.style.display = "none"; // Full news view mein filter bar hide
        } else {
            filterBar.style.display = "flex"; // Default news list mein show
        }
    }

    // "ITFからの最新ニュースやお知らせをこちらに掲載します。" line ko hide karne ke liye
    const introText = document.querySelector(".text");
    if (introText) {
        if (newsId !== null) {
            introText.style.display = "none"; // Full news view mein text hide
        } else {
            introText.style.display = "block"; // Default news list mein show
        }
    }

    if (document.querySelector(".list ul")) {
        renderIndexNews();
    } else if (document.getElementById("newsList")) {
        if (newsId !== null) {
            const selectedNews = newsData[newsId];
            if (selectedNews) {
                const newsList = document.getElementById("newsList");
                newsList.innerHTML = `
                    <div class="news-item">
                        <div class="news-wrapper">
                            <div class="news-image" style="background-image: url(${selectedNews.image});"></div>
                            <div class="news-content">
                                <div class="tag">
                                    <span class="date">${selectedNews.date}</span>
                                    <span class="category">${selectedNews.category}</span>
                                    <span class="posted-by">Posted By: ${selectedNews.postedBy}</span>
                                </div>
                                <div class="title">${selectedNews.title}</div>
                                <div class="summary">${selectedNews.summary}</div>
                            </div>
                        </div>
                    </div>
                    <div class="read-more-btn">
                        <a href="news.html" class="read-more">おしらせへ戻る</a>
                    </div>
                `;
            }
        } else {
            renderNews(newsData);
            document.getElementById("categoryFilter").addEventListener("change", filterNews);
            document.getElementById("dateFilter").addEventListener("change", filterNews);
            document.getElementById("postedByFilter").addEventListener("change", filterNews);
        }
    }
});