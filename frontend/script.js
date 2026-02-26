// script.js — README Portfolio Builder
// handles form, auto-fill, preview, download

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080/api"
    : "https://github-readme-md-profile-builder.onrender.com/api";

let generatedReadme = "";

// ---- specialization data ----
const SPECS = {
    "AI & Machine Learning": { about: "Passionate about building AI systems, training machine learning models, and solving complex real-world problems with data-driven approaches.", skills: "Python, TensorFlow, PyTorch, Pandas, NumPy, scikit-learn, OpenCV" },
    "Data Science": { about: "Enthusiastic about extracting actionable insights from large datasets, predictive modeling, and data visualization.", skills: "Python, R, SQL, Pandas, Matplotlib, Seaborn, Tableau" },
    "Cyber Security": { about: "Dedicated to securing digital infrastructure, ethical hacking, and ensuring robust protection against cyber threats.", skills: "Python, Bash, Linux, Wireshark, Metasploit, Nmap, Cryptography" },
    "Cloud Computing": { about: "Experienced in designing, deploying, and managing scalable cloud architectures and distributed systems.", skills: "AWS, Azure, GCP, Docker, Kubernetes, Terraform, Linux" },
    "Software Engineering": { about: "Crafting scalable, efficient, and robust software solutions by writing clean and maintainable code.", skills: "Java, C++, Python, Git, Docker, Agile, System Design" },
    "Full Stack Development": { about: "Versatile developer experienced in building dynamic web applications from creative front-end designs to robust back-end APIs.", skills: "JavaScript, TypeScript, React, Node.js, Express, MongoDB, PostgreSQL" },
    "Internet of Things (IoT)": { about: "Fascinated by connected devices, embedded systems, and bridging the physical and digital worlds.", skills: "C, C++, Python, Arduino, Raspberry Pi, MQTT, Embedded Systems" },
    "Blockchain": { about: "Innovating the future of decentralized applications, smart contracts, and Web3 technologies.", skills: "Solidity, Web3.js, Ethereum, Smart Contracts, Rust, Node.js" },
    "Computer Science": { about: "Eager to tackle challenging technical problems and constantly learning new tools and frameworks.", skills: "C, C++, Java, Data Structures, Algorithms, OOP, SQL" },
    "Other": { about: "I love building software and learning new technologies to solve hard problems!", skills: "HTML, CSS, JavaScript, Git, Python" },
};

// auto-fill about + skills when specialization changes
document.addEventListener("DOMContentLoaded", () => {
    const sel = document.getElementById("title");
    const about = document.getElementById("about");
    const skills = document.getElementById("skills");

    sel && sel.addEventListener("change", function () {
        const spec = SPECS[this.value];
        if (!spec) return;
        if (about) about.value = spec.about;
        if (skills) skills.value = spec.skills;
    });

    // Set initial theme
    document.body.className = 'theme-home';
});

// ---- page routing / theme switching ----
function switchPage(pageId) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // Find the clicked button explicitly by an attribute, or just match text. 
    // An easy fallback is checking which button calls switchPage(pageId)
    const btns = document.querySelectorAll('.nav-btn');
    if (pageId === 'home') btns[0].classList.add('active');
    else if (pageId === 'generator') btns[1].classList.add('active');
    else if (pageId === 'about') btns[2].classList.add('active');

    // Update sections
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active', 'hidden'));
    document.querySelectorAll('.page-section').forEach(sec => {
        if (sec.id !== `page-${pageId}`) {
            sec.classList.add('hidden');
        } else {
            sec.classList.add('active');
        }
    });

    // Update body theme class to trigger CSS variable transitions
    document.body.className = `theme-${pageId}`;

    // Scroll to top of main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTop = 0;
}

// ---- particle background ----
(function () {
    const box = document.getElementById("particles");
    for (let i = 0; i < 40; i++) {
        const d = document.createElement("div");
        d.className = "particle";
        const sz = Math.random() * 3 + 1;
        d.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;--dur:${Math.random() * 4 + 3}s;--delay:${Math.random() * 5}s`;
        box.appendChild(d);
    }
})();


// ---- chip helpers ----
function addSkill(skill) {
    const ta = document.getElementById("skills");
    const cur = ta.value.trim();
    if (cur.split(",").map(s => s.trim().toLowerCase()).includes(skill.toLowerCase())) {
        showToast("⚠️ " + skill + " already added!", "warn");
        return;
    }
    ta.value = cur ? cur + ", " + skill : skill;
    event.target.style.background = "rgba(0,217,255,0.35)";
    setTimeout(() => event.target.style.background = "", 500);
}

function switchChipTab(cat, btn) {
    document.querySelectorAll(".chip-panel").forEach(p => p.classList.add("hidden"));
    document.querySelectorAll(".chip-tab").forEach(b => b.classList.remove("active"));
    document.getElementById("chip-" + cat)?.classList.remove("hidden");
    btn?.classList.add("active");
}

// ---- generic collapsible toggle ----
function toggleSection(panelId, arrowId) {
    document.getElementById(panelId)?.classList.toggle("open");
    document.getElementById(arrowId)?.classList.toggle("open");
}
function toggleExtras() { toggleSection("extrasPanel", "extrasArrow"); }

// ---- build coding profiles section ----
function buildCodingSection() {
    const lc = document.getElementById("leetcode")?.value.trim();
    const hr = document.getElementById("hackerrank")?.value.trim();
    const he = document.getElementById("hackerearth")?.value.trim();
    if (!lc && !hr && !he) return "";

    let s = "## 🏅 Coding Profiles\n\n<div align=\"center\">\n\n";
    if (lc) s += `<a href="https://leetcode.com/${lc}">\n  <img src="https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black" />\n</a>\n`;
    if (hr) s += `<a href="https://hackerrank.com/${hr}">\n  <img src="https://img.shields.io/badge/HackerRank-2EC866?style=for-the-badge&logo=hackerrank&logoColor=white" />\n</a>\n`;
    if (he) s += `<a href="https://hackerearth.com/@${he}">\n  <img src="https://img.shields.io/badge/HackerEarth-2C3454?style=for-the-badge&logo=hackerearth&logoColor=white" />\n</a>\n`;
    s += "\n</div>\n\n---\n\n";
    return s;
}

// ---- strip unchecked extras from generated markdown ----
function filterReadme(md) {
    const on = id => document.getElementById(id)?.checked !== false;
    if (!on("opt_views")) md = md.replace(/\[!\[Profile Views\][^\n]+\n/g, "");
    if (!on("opt_streak")) md = md.replace(/\[!\[GitHub Streak\][^\n]+\n\n/g, "");
    if (!on("opt_stats")) md = md.replace(/<img[^>]*github-profile-summary-cards[^>]*>\n/g, "");
    if (!on("opt_trophy")) md = md.replace(/### 🏆 GitHub Trophies[\s\S]*?github-profile-trophy[^\n]*\n\n/m, "");
    if (!on("opt_graph")) md = md.replace(/### 📈 Contribution Graph[\s\S]*?activity-graph[^\n]*\n\n/m, "");
    if (!on("opt_snake")) md = md.replace(/<img[^>]*Platane\/snk[^>]*>\n\n/m, "");
    return md;
}


// ---- form submit ----
document.getElementById("readmeForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const gv = id => (document.getElementById(id)?.value || "").trim();
    const f = {
        name: gv("name"), title: gv("title"),
        about: gv("about"), skills: gv("skills") || "Coding",
        github: gv("github"), linkedin: gv("linkedin"),
        twitter: gv("twitter"), email: gv("email"), portfolio: gv("portfolio"),
        instagram: gv("instagram"), location: gv("location"), spotify: gv("spotify"),
        currentProject: gv("currentProject"), currentProjectUrl: gv("currentProjectUrl"),
        collaborateProject: gv("collaborateProject"), collaborateProjectUrl: gv("collaborateProjectUrl"),
        askMeAbout: gv("askMeAbout")
    };

    showState("loading");
    const btn = document.getElementById("generateBtn");
    btn.classList.add("loading");
    btn.querySelector(".btn-text").textContent = "Generating...";

    try {
        const res = await fetch(API_BASE + "/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(f)
        });
        if (!res.ok) throw new Error("Server returned " + res.status);
        generatedReadme = (await res.json()).readme;
    } catch (err) {
        console.warn("Backend unreachable, using local fallback:", err.message);
        generatedReadme = buildReadme(f);
        showToast("⚠️ Using offline mode (backend not running)", "warn");
    }

    generatedReadme = filterReadme(generatedReadme);

    // inject coding profiles section before Connect section
    const codingSection = buildCodingSection();
    if (codingSection)
        generatedReadme = generatedReadme.replace("## 🌐 Connect With Me", codingSection + "## 🌐 Connect With Me");

    document.getElementById("markdownContent").textContent = generatedReadme;
    showState("result");
    switchTab("markdown");
    document.getElementById("resultState").scrollIntoView({ behavior: "smooth", block: "start" });

    btn.classList.remove("loading");
    btn.querySelector(".btn-text").textContent = "Generate README";
});


// ---- tab switching ----
function switchTab(tab) {
    const isMarkdown = tab === "markdown";
    document.getElementById("markdownView").classList.toggle("hidden", !isMarkdown);
    document.getElementById("previewView").classList.toggle("hidden", isMarkdown);
    document.getElementById("tabMarkdown").classList.toggle("active", isMarkdown);
    document.getElementById("tabPreview").classList.toggle("active", !isMarkdown);
    if (!isMarkdown) renderPreview(generatedReadme);
}

function renderPreview(md) {
    document.getElementById("renderedPreview").innerHTML = "<p>" + md
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '<span style="color:#00d9ff;font-size:0.8rem">[Image: $1]</span>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/^---$/gm, "<hr>")
        .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
        .replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")
        + "</p>";
}


// ---- copy / download ----
function copyReadme() {
    if (!generatedReadme) return;
    navigator.clipboard.writeText(generatedReadme)
        .then(() => showToast("✅ Copied to clipboard!"))
        .catch(() => {
            const t = document.createElement("textarea");
            t.value = generatedReadme;
            document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t);
            showToast("✅ Copied to clipboard!");
        });
}

function downloadReadme() {
    if (!generatedReadme) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([generatedReadme], { type: "text/markdown;charset=utf-8" }));
    a.download = "README.md"; a.click(); URL.revokeObjectURL(a.href);
    showToast("⬇️ Downloading README.md...");
}


// ---- ui state / toast ----
function showState(s) {
    ["emptyState", "loadingState", "resultState"].forEach(id => document.getElementById(id).classList.add("hidden"));

    const map = { loading: "loadingState", result: "resultState" };
    document.getElementById(map[s] || "emptyState").classList.remove("hidden");
}

let toastTimer = null;
function showToast(msg) {
    const toast = document.getElementById("toast");
    document.getElementById("toastMsg").textContent = msg;
    toast.classList.remove("hidden");
    toast.offsetHeight; // force reflow
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.classList.add("hidden"), 350);
    }, 2800);
}


// ---- offline readme builder (Synced with ReadmeGenerator.java) ----
function getCategory(skill) {
    const s = skill.toLowerCase().trim();
    if (["matplotlib", "seaborn", "plotly", "tableau", "power bi", "powerbi", "d3.js", "d3 ", "bokeh", "altair", "grafana", "kibana", "looker", "metabase", "superset", "excel"].some(k => s.includes(k))) return "DATAVIZ";
    if (["tensorflow", "pytorch", "keras", "scikit", "sklearn", "pandas", "numpy", "opencv", "huggingface", "nltk", "spacy", "xgboost", "lightgbm", "catboost", "onnx", "mlflow", "scipy", "statsmodels", "transformers", "langchain", "dask"].some(k => s.includes(k))) return "AI";
    if (["react", "vue", "angular", "next", "nuxt", "svelte", "gatsby", "astro", "node", "express", "django", "flask", "fastapi", "spring", "laravel", "rails", "nestjs", "html", "css", "bootstrap", "tailwind", "jquery", "graphql", "webpack", "vite", "redux", "deno", "bun"].some(k => s.includes(k))) return "WEB";
    if (["mysql", "postgresql", "postgres", "mongodb", "redis", "sqlite", "oracle", "cassandra", "elasticsearch", "dynamodb", "neo4j", "influxdb", "mariadb", "snowflake", "bigquery", "prisma", "hadoop", "spark", "hive"].some(k => s.includes(k))) return "DB";
    if (["aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "jenkins", "terraform", "ansible", "circleci", "heroku", "vercel", "netlify", "firebase", "supabase", "nginx", "github actions", "cloudflare", "digitalocean", "travis", "devops", "ci/cd", "apache", "ubuntu"].some(k => s.includes(k))) return "CLOUD";
    if (["machine learning", "deep learning", "computer vision", "nlp", "natural language", "data structure", "algorithm", "oop", "microservice", "system design", "agile", "scrum", "mlops", "blockchain", "iot", "embedded", "robotics", "cybersecurity", "neural network", "reinforcement"].some(k => s.includes(k))) return "CONCEPTS";
    if (["git", "gitlab", "bitbucket", "vscode", "vs code", "intellij", "pycharm", "jupyter", "postman", "figma", "arduino", "unity", "unreal", "blender", "photoshop", "illustrator", "jira", "notion", "slack", "android", "raspberry", "windows", "macos", "linux"].some(k => s.includes(k))) return "TOOLS";
    if (["python", "java", "javascript", "typescript", "c++", "c#", "golang", "rust", "kotlin", "swift", "php", "ruby", "dart", "scala", "perl", "haskell", "lua", "matlab", "bash", "shell", "groovy", "elixir", "fortran", "clojure", "erlang", "julia", "nim", "zig", "solidity", "cobol", "vba"].some(k => s.includes(k))) return "LANG";
    if (s === "c" || s === "r") return "LANG";
    return "OTHER";
}

function buildReadme(f) {
    const name = f.name || "Your Name";
    const title = f.title || "Developer";
    const about = f.about || "I love coding!";
    const github = f.github || "";
    const linkedin = f.linkedin || "";
    const twitter = f.twitter || "";
    const email = f.email || "";
    const portfolio = f.portfolio || "";
    const instagram = f.instagram || "";
    const location = f.location || "";
    const curProj = f.currentProject || "";
    const curProjUrl = f.currentProjectUrl || "";
    const collabProj = f.collaborateProject || "";
    const collabUrl = f.collaborateProjectUrl || "";
    const askAbout = f.askMeAbout || "";
    const spotify = f.spotify || "";

    const all = (f.skills || "Python").split(",").map(s => s.trim()).filter(Boolean);

    const catMap = { LANG: [], AI: [], WEB: [], CLOUD: [], DB: [], DATAVIZ: [], TOOLS: [], CONCEPTS: [], OTHER: [] };
    all.forEach(s => catMap[getCategory(s)].push(s));

    const langs = catMap.LANG;
    const top4 = all.length > 4 ? all.slice(0, 4) : all;
    const fn = name.split(" ")[0] || "Dev";

    let sb = "";

    // Header Section
    sb += `<div align="center">\n\n# 👨‍💻 ${name}\n\n`;
    const encTitle = title.replace(/ /g, "%20").replace(/&/g, "%26");
    const encAbout = about.replace(/ /g, "%20").replace(/,/g, "%2C").replace(/&/g, "%26").substring(0, Math.min(about.length, 50));
    const capsuleUrl = `https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=${encTitle}&fontSize=45&fontColor=fff&animation=twinkling&fontAlignY=35&desc=${encAbout}&descAlignY=55&descSize=18`;

    sb += `<picture>\n  <source media="(prefers-color-scheme: dark)" srcset="${capsuleUrl}">\n  <img alt="Header" src="${capsuleUrl}">\n</picture>\n\n`;

    let lines = encTitle + "+%F0%9F%9A%80";
    all.slice(0, 4).forEach(s => lines += ";" + s.replace(/ /g, "+") + "+%F0%9F%92%BB");
    lines += ";Open+Source+Contributor+%E2%9C%A8;Building+the+Future+%F0%9F%A4%96";

    sb += `<picture>\n  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=00D9FF&center=true&vCenter=true&repeat=true&width=600&height=100&lines=${lines}" alt="Typing Animation">\n</picture>\n\n`;
    sb += `<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="divider">\n\n`;

    // Stat Badges
    if (github) {
        sb += `[![Profile Views](https://komarev.com/ghpvc/?username=${github}&label=Profile%20Views&color=00D9FF&style=for-the-badge)](https://github.com/${github})\n`;
        sb += `[![GitHub followers](https://img.shields.io/github/followers/${github}?logo=github&style=for-the-badge&color=00D9FF&labelColor=0D1117)](https://github.com/${github})\n`;
        if (twitter) {
            const tw = twitter.startsWith("http") ? twitter.split("/").pop() : twitter;
            sb += `[![Twitter Follow](https://img.shields.io/twitter/follow/${tw}?logo=twitter&style=for-the-badge&color=00D9FF&labelColor=0D1117)](https://twitter.com/${tw})\n`;
        }
        sb += `[![Repos](https://badges.pufler.dev/repos/${github}?style=for-the-badge&color=00D9FF&labelColor=0D1117)](https://github.com/${github}?tab=repositories)\n`;
        sb += `[![Years](https://badges.pufler.dev/years/${github}?style=for-the-badge&color=00D9FF&labelColor=0D1117)](https://github.com/${github})\n`;
        sb += `[![Commits](https://badges.pufler.dev/commits/monthly/${github}?style=for-the-badge&color=00D9FF&labelColor=0D1117)](https://github.com/${github})\n\n`;
    }
    sb += `</div>\n\n---\n\n## 🚀 About Me\n\n`;
    sb += `<img align="right" alt="Coding" width="400" src="https://user-images.githubusercontent.com/74038190/229223263-cf2e4b07-2615-4f87-9c38-e37600f8381a.gif">\n\n`;

    // Code Block Generation
    sb += `\`\`\`python\nclass ${fn}:\n    def __init__(self):\n`;
    sb += `        self.name = "${name}"\n        self.role = "${title}"\n`;
    if (location) sb += `        self.location = "${location}"\n`;

    const langList = langs.length === 0 ? top4 : (langs.length > 4 ? langs.slice(0, 4) : langs);
    sb += `        self.languages = [${langList.map(l => `"${l}"`).join(", ")}]\n`;

    const interestPool = [...catMap.AI, ...catMap.CONCEPTS, ...catMap.WEB];
    if (interestPool.length > 0) {
        const top3i = interestPool.length > 3 ? interestPool.slice(0, 3) : interestPool;
        sb += `        self.interests = [${top3i.map(i => `"${i}"`).join(", ")}]\n`;
    }

    if (curProj || collabProj || askAbout) {
        sb += `\n    def current_work(self):\n        return {\n`;
        if (curProj) sb += `            "🎯 project": "${curProj}",\n`;
        if (collabProj) sb += `            "🤝 collaborating": "${collabProj}",\n`;
        if (askAbout) sb += `            "💬 ask me about": "${askAbout}"\n`;
        sb += `        }\n`;
    }
    sb += `\n    def get_daily_routine(self):\n        return "☕ Code → 🧠 Learn → 🔄 Repeat"\n\`\`\`\n\n<br clear="right"/>\n\n---\n\n`;

    // Focus Section
    if (curProj || collabProj || askAbout) {
        sb += `## 🔥 Current Focus\n\n`;
        const fireGif = `<img src="https://user-images.githubusercontent.com/74038190/212284087-bbe7e430-757e-4901-90bf-4cd2ce3e1852.gif" width="28">`;
        if (curProj) sb += `${fireGif} Building **${curProjUrl ? `[${curProj}](${curProjUrl})` : curProj}**\n\n`;
        if (collabProj) sb += `${fireGif} Open to collaborate on **${collabUrl ? `[${collabProj}](${collabUrl})` : collabProj}**\n\n`;
        if (askAbout) sb += `${fireGif} Ask me about **${askAbout}**\n\n`;
        sb += `---\n\n`;
    }

    // Tech Stack
    sb += `## 🛠️ Tech Stack\n\n<div align="center">\n\n`;
    const catInfo = [
        ["LANG", "👨‍💻", "Programming Languages"], ["AI", "🤖", "AI / ML & Data Science"],
        ["WEB", "🌐", "Web Development"], ["CLOUD", "☁️", "Cloud & DevOps"],
        ["DB", "🗄️", "Databases"], ["DATAVIZ", "📊", "Data Visualization"],
        ["TOOLS", "⚙️", "Tools & Platforms"], ["CONCEPTS", "🧠", "Core Concepts"],
        ["OTHER", "🔧", "Other Skills"]
    ];

    catInfo.forEach(([catKey, emoji, label]) => {
        const cSkills = catMap[catKey];
        if (!cSkills || cSkills.length === 0) return;

        sb += `### ${emoji} ${label}\n\n`;
        if (!["CONCEPTS", "DATAVIZ", "OTHER"].includes(catKey)) {
            const icons = buildTechIcons(cSkills);
            if (icons) sb += icons + "\n";
        }
        if (catKey === "TOOLS") {
            const gifs = buildToolGifs(cSkills);
            if (gifs) sb += gifs + "\n";
        }
        sb += buildBadges(cSkills) + "\n";
        sb += `<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="700">\n\n`;
    });
    sb += `</div>\n\n---\n\n`;

    if (github) {
        sb += `## 📊 Performance Metrics\n\n<div align="center">\n\n`;
        sb += `[![GitHub Streak](https://streak-stats.demolab.com?user=${github}&theme=radical&hide_border=true&background=0D1117&ring=00D9FF&fire=00D9FF&currStreakLabel=00D9FF&stroke=00D9FF&sideNums=00D9FF&sideLabels=C9D1D9&dates=C9D1D9)](https://git.io/streak-stats)\n\n`;
        sb += `<img width="49%" src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${github}&theme=radical" />\n`;
        sb += `<img width="49%" src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=${github}&theme=radical" />\n`;
        sb += `<img width="49%" src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=${github}&theme=radical" />\n`;
        sb += `<img width="49%" src="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=${github}&theme=radical" />\n`;
        sb += `<img width="49%" src="https://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=${github}&theme=radical&utcOffset=5.5" />\n\n</div>\n\n---\n\n`;

        sb += `## 🏆 GitHub Achievements\n\n<div align="center">\n\n`;
        sb += `<img src="https://github-profile-trophy.vercel.app/?username=${github}&theme=radical&no-frame=true&no-bg=true&column=4&row=2&margin-w=15&margin-h=15" />\n\n</div>\n\n---\n\n`;

        sb += `## 📈 Contribution Heatmap\n\n<div align="center">\n\n`;
        sb += `<img src="https://ghchart.rshah.org/00D9FF/${github}" alt="GitHub Contribution Chart" width="90%" />\n\n`;
        sb += `[![Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=${github}&custom_title=Contribution+Graph&hide_border=true&bg_color=0D1117&color=00D9FF&line=00D9FF&point=FFFFFF&area=true&area_color=00D9FF)](https://github.com/${github})\n\n</div>\n\n---\n\n`;
    }

    // Connect Section
    sb += `## 🌐 Connect With Me\n\n<div align="center">\n\n`;
    if (portfolio) sb += `<a href="${portfolio}">\n  <img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white" />\n</a>\n`;
    if (linkedin) sb += `<a href="${linkedin.startsWith("http") ? linkedin : "https://linkedin.com/in/" + linkedin}">\n  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />\n</a>\n`;
    if (twitter) sb += `<a href="${twitter.startsWith("http") ? twitter : "https://twitter.com/" + twitter}">\n  <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" />\n</a>\n`;
    if (instagram) sb += `<a href="${instagram.startsWith("http") ? instagram : "https://instagram.com/" + instagram}">\n  <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" />\n</a>\n`;
    if (github) sb += `<a href="https://github.com/${github}">\n  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />\n</a>\n`;
    if (email) sb += `<a href="mailto:${email}">\n  <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" />\n</a>\n`;

    sb += `\n<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="1000">\n\n`;
    sb += `### 💭 Dev Quote of the Day\n\n![Quote](https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical&border=true)\n\n`;

    if (spotify) {
        sb += `### 🎵 Currently Vibing To\n\n`;
        sb += `[![spotify](https://spotify-github-profile.kittinanx.com/api/view?uid=${spotify}&cover_image=true&theme=compact&show_offline=false&background_color=0d1117&interchange=false&bar_color=00d9ff&bar_color_cover=true)](https://spotify-github-profile.kittinanx.com/api/view?uid=${spotify}&redirect=true)\n\n`;
    }
    sb += `<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="1000">\n\n</div>\n\n---\n\n`;

    // Footer Section
    sb += `<div align="center">\n\n### ⚡ "Code is like humor. When you have to explain it, it's bad." – Cory House\n\n`;
    sb += `<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=150&section=footer&animation=twinkling" alt="Footer Wave" />\n\n`;
    if (github) {
        sb += `**⭐ From [${name}](https://github.com/${github}) | Building the future with AI 🚀**\n\n`;
        sb += `<img src="https://raw.githubusercontent.com/Platane/snk/output/github-contribution-grid-snake-dark.svg" alt="Snake animation" />\n\n`;
    }
    sb += `</div>\n`;

    return sb;
}

const TECH_ICONS = [
    ["python", "https://techstack-generator.vercel.app/python-icon.svg"], ["java", "https://techstack-generator.vercel.app/java-icon.svg"], ["javascript", "https://techstack-generator.vercel.app/js-icon.svg"], ["typescript", "https://techstack-generator.vercel.app/ts-icon.svg"], ["c++", "https://techstack-generator.vercel.app/cpp-icon.svg"], ["c#", "https://techstack-generator.vercel.app/csharp-icon.svg"], ["react", "https://techstack-generator.vercel.app/react-icon.svg"], ["aws", "https://techstack-generator.vercel.app/aws-icon.svg"], ["docker", "https://techstack-generator.vercel.app/docker-icon.svg"], ["kubernetes", "https://techstack-generator.vercel.app/kubernetes-icon.svg"], ["mysql", "https://techstack-generator.vercel.app/mysql-icon.svg"], ["django", "https://techstack-generator.vercel.app/django-icon.svg"], ["github", "https://techstack-generator.vercel.app/github-icon.svg"], ["swift", "https://techstack-generator.vercel.app/swift-icon.svg"], ["nginx", "https://techstack-generator.vercel.app/nginx-icon.svg"], ["golang", "https://techstack-generator.vercel.app/go-icon.svg"], ["rust", "https://techstack-generator.vercel.app/rust-icon.svg"]
];

const TOOL_GIFS = [
    ["vscode", "https://user-images.githubusercontent.com/74038190/212257454-16e3712e-945a-4ca2-b238-408ad0bf87e6.gif"], ["vs code", "https://user-images.githubusercontent.com/74038190/212257454-16e3712e-945a-4ca2-b238-408ad0bf87e6.gif"], ["github", "https://user-images.githubusercontent.com/74038190/212257468-1e9a91f1-b626-4baa-b15d-5c385dfa7ed2.gif"], ["docker", "https://user-images.githubusercontent.com/74038190/212281775-b468df30-4edc-4bf8-a4ee-f52e1aaddc86.gif"], ["figma", "https://user-images.githubusercontent.com/74038190/238200428-67f477ed-6624-42da-99f0-1a7b1a16eecb.gif"], ["postman", "https://user-images.githubusercontent.com/74038190/212257460-738ff888-c2f9-4204-a999-87f0bbb9d0a4.gif"]
];

const BADGE_MAP = [
    ["python", "3776AB", "python", "white"], ["java", "ED8B00", "java", "white"], ["javascript", "F7DF1E", "javascript", "black"], ["typescript", "007ACC", "typescript", "white"], ["c++", "00599C", "c%2B%2B", "white"], ["c#", "239120", "csharp", "white"], ["golang", "00ADD8", "go", "white"], ["rust", "DEA584", "rust", "black"], ["kotlin", "7F52FF", "kotlin", "white"], ["swift", "FA7343", "swift", "white"], ["php", "777BB4", "php", "white"], ["ruby", "CC342D", "ruby", "white"], ["dart", "0175C2", "dart", "white"], ["scala", "DC322F", "scala", "white"], ["perl", "39457E", "perl", "white"], ["haskell", "5D4F85", "haskell", "white"], ["lua", "2C2D72", "lua", "white"], ["matlab", "0076A8", "mathworks", "white"], ["bash", "4EAA25", "gnu-bash", "white"], ["shell", "4EAA25", "gnu-bash", "white"], ["groovy", "4298B8", "apachegroovy", "white"], ["elixir", "6E4A7E", "elixir", "white"], ["fortran", "734F96", "fortran", "white"], ["clojure", "5881D8", "clojure", "white"], ["erlang", "A90533", "erlang", "white"], ["julia", "9558B2", "julia", "white"], ["nim", "FFE953", "nim", "black"], ["zig", "F7A41D", "zig", "white"], ["solidity", "363636", "solidity", "white"], ["vba", "217346", "microsoft", "white"], ["cobol", "005CA5", "ibm", "white"], ["tensorflow", "FF6F00", "tensorflow", "white"], ["pytorch", "EE4C2C", "pytorch", "white"], ["keras", "D00000", "keras", "white"], ["scikit-learn", "F7931E", "scikit-learn", "white"], ["sklearn", "F7931E", "scikit-learn", "white"], ["pandas", "150458", "pandas", "white"], ["numpy", "013243", "numpy", "white"], ["opencv", "5C3EE8", "opencv", "white"], ["huggingface", "FFD21E", "huggingface", "black"], ["nltk", "3776AB", "python", "white"], ["spacy", "09A3D5", "spacy", "white"], ["xgboost", "189AB4", "python", "white"], ["lightgbm", "02569B", "python", "white"], ["catboost", "FFCC00", "python", "black"], ["onnx", "005CED", "onnx", "white"], ["mlflow", "0194E2", "mlflow", "white"], ["scipy", "8CAAE6", "scipy", "white"], ["langchain", "1C3C3C", "chainlink", "white"], ["transformers", "FFD21E", "huggingface", "black"], ["dask", "FDA061", "dask", "black"], ["statsmodels", "3776AB", "python", "white"], ["react", "20232A", "react", "61DAFB"], ["vue", "4FC08D", "vue.js", "white"], ["angular", "DD0031", "angular", "white"], ["next.js", "000000", "next.js", "white"], ["nextjs", "000000", "next.js", "white"], ["nuxt", "00DC82", "nuxtdotjs", "white"], ["svelte", "FF3E00", "svelte", "white"], ["gatsby", "663399", "gatsby", "white"], ["astro", "FF5D01", "astro", "white"], ["node", "339933", "node.js", "white"], ["express", "000000", "express", "white"], ["django", "092E20", "django", "white"], ["flask", "000000", "flask", "white"], ["fastapi", "009688", "fastapi", "white"], ["spring", "6DB33F", "spring", "white"], ["laravel", "FF2D20", "laravel", "white"], ["rails", "CC0000", "ruby-on-rails", "white"], ["nestjs", "E0234E", "nestjs", "white"], ["html", "E34F26", "html5", "white"], ["css", "1572B6", "css3", "white"], ["bootstrap", "7952B3", "bootstrap", "white"], ["tailwind", "38B2AC", "tailwind-css", "white"], ["jquery", "0769AD", "jquery", "white"], ["graphql", "E10098", "graphql", "white"], ["webpack", "8DD6F9", "webpack", "black"], ["vite", "646CFF", "vite", "white"], ["redux", "764ABC", "redux", "white"], ["deno", "000000", "deno", "white"], ["bun", "FBF0DF", "bun", "black"], ["aws", "232F3E", "amazon-aws", "white"], ["azure", "0078D4", "microsoftazure", "white"], ["gcp", "4285F4", "google-cloud", "white"], ["docker", "2496ED", "docker", "white"], ["kubernetes", "326CE5", "kubernetes", "white"], ["jenkins", "D24939", "jenkins", "white"], ["terraform", "7B42BC", "terraform", "white"], ["ansible", "EE0000", "ansible", "white"], ["circleci", "343434", "circleci", "white"], ["heroku", "430098", "heroku", "white"], ["vercel", "000000", "vercel", "white"], ["netlify", "00C7B7", "netlify", "white"], ["firebase", "FFCA28", "firebase", "black"], ["supabase", "3ECF8E", "supabase", "white"], ["nginx", "009639", "nginx", "white"], ["github actions", "2088FF", "github-actions", "white"], ["cloudflare", "F38020", "cloudflare", "white"], ["digitalocean", "0080FF", "digitalocean", "white"], ["travis", "3EAAAF", "travis-ci", "white"], ["linux", "FCC624", "linux", "black"], ["ubuntu", "E95420", "ubuntu", "white"], ["apache", "D22128", "apache", "white"], ["mysql", "4479A1", "mysql", "white"], ["postgresql", "316192", "postgresql", "white"], ["mongodb", "4EA94B", "mongodb", "white"], ["redis", "DC382D", "redis", "white"], ["sqlite", "003B57", "sqlite", "white"], ["oracle", "F80000", "oracle", "white"], ["cassandra", "1287B1", "apachecassandra", "white"], ["elasticsearch", "005571", "elasticsearch", "white"], ["dynamodb", "4053D6", "amazondynamodb", "white"], ["neo4j", "008CC1", "neo4j", "white"], ["influxdb", "22ADF6", "influxdb", "white"], ["mariadb", "003545", "mariadb", "white"], ["snowflake", "29B5E8", "snowflake", "white"], ["bigquery", "4285F4", "googlebigquery", "white"], ["prisma", "2D3748", "prisma", "white"], ["hadoop", "66CCFF", "apachehadoop", "white"], ["spark", "E25A1C", "apachespark", "white"], ["matplotlib", "11557C", "python", "white"], ["seaborn", "3776AB", "python", "white"], ["plotly", "3F4F75", "plotly", "white"], ["tableau", "E97627", "tableau", "white"], ["power bi", "F2C811", "powerbi", "black"], ["powerbi", "F2C811", "powerbi", "black"], ["d3.js", "F9A03C", "d3.js", "white"], ["bokeh", "F37626", "python", "white"], ["grafana", "F46800", "grafana", "white"], ["kibana", "005571", "kibana", "white"], ["looker", "4285F4", "looker", "white"], ["metabase", "509EE3", "metabase", "white"], ["superset", "E53935", "apachesuperset", "white"], ["excel", "217346", "microsoftexcel", "white"], ["altair", "3776AB", "python", "white"], ["git", "F05032", "git", "white"], ["github", "181717", "github", "white"], ["gitlab", "FC6D26", "gitlab", "white"], ["bitbucket", "0052CC", "bitbucket", "white"], ["vscode", "007ACC", "visual-studio-code", "white"], ["intellij", "000000", "intellij-idea", "white"], ["pycharm", "000000", "pycharm", "white"], ["jupyter", "F37626", "jupyter", "white"], ["postman", "FF6C37", "postman", "white"], ["figma", "F24E1E", "figma", "white"], ["arduino", "00979D", "arduino", "white"], ["unity", "000000", "unity", "white"], ["unreal", "313131", "unrealengine", "white"], ["blender", "F5792A", "blender", "white"], ["photoshop", "31A8FF", "adobephotoshop", "white"], ["illustrator", "FF9A00", "adobeillustrator", "white"], ["jira", "0052CC", "jira", "white"], ["notion", "000000", "notion", "white"], ["slack", "4A154B", "slack", "white"], ["android", "3DDC84", "android", "white"], ["raspberry", "C51A4A", "raspberrypi", "white"], ["windows", "0078D4", "windows", "white"], ["macos", "000000", "apple", "white"]
];

function buildTechIcons(skills) {
    let b = "";
    const done = new Set();
    skills.forEach(skill => {
        const sLower = skill.toLowerCase();
        TECH_ICONS.forEach(([k, url]) => {
            if ((sLower === k || sLower.includes(k)) && !done.has(k)) {
                b += `<img src="${url}" alt="${skill}" width="65" height="65" />\n`;
                done.add(k);
            }
        });
    });
    return b;
}

function buildToolGifs(skills) {
    let b = "";
    const done = new Set();
    skills.forEach(skill => {
        const sLower = skill.toLowerCase();
        TOOL_GIFS.forEach(([k, url]) => {
            if (sLower.includes(k) && !done.has(k)) {
                b += `<img src="${url}" alt="${skill}" width="65" height="65" />\n`;
                done.add(k);
            }
        });
    });
    return b;
}

function buildBadges(skills) {
    let b = "";
    skills.forEach(skill => {
        if (!skill.trim()) return;
        const sLower = skill.toLowerCase();
        const match = BADGE_MAP.find(([k]) => sLower.includes(k));

        if (match) {
            const [_, color, logo, logoColor] = match;
            const encoded = skill.trim().replace(/ /g, "%20").replace(/-/g, "--");
            b += `![${skill.trim()}](https://img.shields.io/badge/${encoded}-${color}?style=for-the-badge&logo=${logo}&logoColor=${logoColor})\n`;
        } else {
            b += `![${skill.trim()}](https://img.shields.io/badge/${skill.trim().replace(/ /g, "%20")}-gray?style=for-the-badge)\n`;
        }
    });
    return b;
}



function shareToBot(bot) {
    if (!generatedReadme) {
        showToast("⚠️ No README generated yet!");
        return;
    }

    let url = "";
    if (bot === 'chatgpt') url = "https://chatgpt.com/";
    else if (bot === 'claude') url = "https://claude.ai/new";
    else if (bot === 'gemini') url = "https://gemini.google.com/app";

    // Direct opening synchronous with the click avoids popup blockers
    if (url) {
        window.open(url, '_blank');
    }

    navigator.clipboard.writeText(generatedReadme).then(() => {
        showToast(`✅ Copied! Paste your README in ${bot}`);
    }).catch(() => {
        const t = document.createElement("textarea");
        t.value = generatedReadme;
        document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t);
        showToast(`✅ Copied! Paste your README in ${bot}`);
    });
}

// ---- initialize skills UI ----
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.chip-panel').forEach(panel => {
        // Add icons tracking
        panel.querySelectorAll('.chip').forEach(btn => {
            const skill = btn.textContent.trim().toLowerCase();
            const match = BADGE_MAP.find(([k]) => skill.includes(k) || k.includes(skill) || skill === k);
            if (match) {
                const color = match[1];
                const logo = match[2];
                const iconUrl = `https://cdn.simpleicons.org/${logo}/${color}`;
                btn.innerHTML = `<img src="${iconUrl}" class="chip-icon" alt="${skill}" /> ${btn.textContent}`;
            } else {
                btn.innerHTML = `<span class="chip-dot"></span> ${btn.textContent}`;
            }
        });
    });
});
