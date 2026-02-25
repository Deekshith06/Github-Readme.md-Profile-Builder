// script.js — README Profile Builder
// handles form, auto-fill, preview, download

const API_BASE = "http://localhost:8080/api";
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
});


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

    const gv = id => document.getElementById(id).value.trim();
    const f = {
        name: gv("name"), title: gv("title"),
        about: gv("about"), skills: gv("skills") || "Coding",
        github: gv("github"), linkedin: gv("linkedin"),
        twitter: gv("twitter"), email: gv("email"), portfolio: gv("portfolio")
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
    if (window.innerWidth < 960)
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


// ---- offline readme builder ----
function buildReadme(f) {
    const name = f.name || "Your Name";
    const title = f.title || "Developer";
    const about = f.about || "I love coding!";
    const { github, linkedin, twitter, email, portfolio } = f;

    const skills = f.skills.split(",").map(s => s.trim()).filter(Boolean);

    const BADGES = {
        python: ["3776AB", "python", "white"], java: ["ED8B00", "java", "white"],
        javascript: ["F7DF1E", "javascript", "black"], typescript: ["007ACC", "typescript", "white"],
        "c++": ["00599C", "c%2B%2B", "white"], go: ["00ADD8", "go", "white"],
        rust: ["DEA584", "rust", "black"], kotlin: ["7F52FF", "kotlin", "white"],
        swift: ["FA7343", "swift", "white"], html: ["E34F26", "html5", "white"],
        css: ["1572B6", "css3", "white"], react: ["20232A", "react", "61DAFB"],
        vue: ["4FC08D", "vue.js", "white"], angular: ["DD0031", "angular", "white"],
        node: ["339933", "node.js", "white"], nodejs: ["339933", "node.js", "white"],
        django: ["092E20", "django", "white"], flask: ["000000", "flask", "white"],
        spring: ["6DB33F", "spring", "white"], tensorflow: ["FF6F00", "tensorflow", "white"],
        pytorch: ["EE4C2C", "pytorch", "white"], pandas: ["150458", "pandas", "white"],
        numpy: ["013243", "numpy", "white"], mysql: ["4479A1", "mysql", "white"],
        mongodb: ["4EA94B", "mongodb", "white"], docker: ["2496ED", "docker", "white"],
        kubernetes: ["326CE5", "kubernetes", "white"], aws: ["232F3E", "amazon-aws", "white"],
        git: ["F05032", "git", "white"], linux: ["FCC624", "linux", "black"],
        firebase: ["FFCA28", "firebase", "black"], redis: ["DC382D", "redis", "white"],
        postgresql: ["336791", "postgresql", "white"], figma: ["F24E1E", "figma", "white"],
        r: ["276DC3", "r", "white"], dart: ["0175C2", "dart", "white"],
        php: ["777BB4", "php", "white"], ruby: ["CC342D", "ruby", "white"],
        scala: ["DC322F", "scala", "white"], arduino: ["00979D", "arduino", "white"],
        unity: ["000000", "unity", "white"],
    };

    const ICONS = {
        python: "python", java: "java", javascript: "js", typescript: "ts",
        "c++": "cpp", react: "react", aws: "aws", docker: "docker",
        kubernetes: "kubernetes", mysql: "mysql", django: "django",
        github: "github", swift: "swift", nginx: "nginx",
    };
    const iconBase = "https://techstack-generator.vercel.app/";

    const encTitle = title.replace(/ /g, "+").replace(/&/g, "%26");
    const typingLines = encTitle + "+%F0%9F%9A%80"
        + skills.slice(0, 4).map(s => ";" + s.replace(/ /g, "+") + "+Developer+%F0%9F%92%BB").join("")
        + ";Open+Source+Contributor+%E2%9C%A8;Building+the+Future+%F0%9F%A4%96";

    let icons = "";
    skills.forEach(s => {
        const k = s.toLowerCase();
        const match = Object.keys(ICONS).find(l => k === l || k.includes(l));
        if (match) icons += `<img src="${iconBase}${ICONS[match]}-icon.svg" alt="${s}" width="65" height="65" />\n`;
    });
    if (!icons) icons = "*See badges below*\n";

    let badgesHtml = "";
    skills.forEach(s => {
        const k = s.toLowerCase();
        const match = Object.keys(BADGES).find(l => k.includes(l));
        if (match) {
            const [color, logo, logoColor] = BADGES[match];
            const label = s.replace(/ /g, "%20").replace(/-/g, "--");
            badgesHtml += `![${s}](https://img.shields.io/badge/${label}-${color}?style=for-the-badge&logo=${logo}&logoColor=${logoColor})\n`;
        } else {
            badgesHtml += `![${s}](https://img.shields.io/badge/${s.replace(/ /g, "%20")}-gray?style=for-the-badge)\n`;
        }
    });

    const capsTitle = title.replace(/ /g, "%20").replace(/&/g, "%26");
    const aboutSnip = about.replace(/ /g, "%20").substring(0, 50);

    let social = "";
    if (portfolio) social += `<a href="${portfolio}">\n  <img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white" />\n</a>\n`;
    if (linkedin) {
        const u = linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`;
        social += `<a href="${u}">\n  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />\n</a>\n`;
    }
    if (twitter) {
        const u = twitter.startsWith("http") ? twitter : `https://twitter.com/${twitter}`;
        social += `<a href="${u}">\n  <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" />\n</a>\n`;
    }
    if (github) social += `<a href="https://github.com/${github}">\n  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />\n</a>\n`;
    if (email) social += `<a href="mailto:${email}">\n  <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" />\n</a>\n`;

    const stats = github ? `## 📊 GitHub Stats

<div align="center">

[![GitHub Streak](https://streak-stats.demolab.com?user=${github}&theme=radical&hide_border=true&background=0D1117&ring=00D9FF&fire=00D9FF&currStreakLabel=00D9FF)](https://git.io/streak-stats)

<img width="49%" src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${github}&theme=radical" />
<img width="49%" src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=${github}&theme=radical" />
<img width="49%" src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=${github}&theme=radical" />
<img width="49%" src="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=${github}&theme=radical" />

### 🏆 GitHub Trophies

<img src="https://github-profile-trophy.vercel.app/?username=${github}&theme=radical&no-frame=true&no-bg=true&column=4&row=2&margin-w=15" />

### 📈 Contribution Graph

[![Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=${github}&custom_title=Contribution+Graph&hide_border=true&bg_color=0D1117&color=00D9FF&line=00D9FF&point=FFFFFF&area=true)](https://github.com/${github})

</div>

---

` : "";

    const snake = github ? `<img src="https://raw.githubusercontent.com/Platane/snk/output/github-contribution-grid-snake-dark.svg" alt="Snake animation" />\n\n` : "";
    const firstName = name.split(" ")[0];
    const top4 = skills.slice(0, 4).map(s => `"${s}"`).join(", ");

    return `<div align="center">

# 👨‍💻 ${name}

<picture>
  <img alt="Header" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=${capsTitle}&fontSize=45&fontColor=fff&animation=twinkling&fontAlignY=35&desc=${aboutSnip}&descAlignY=55&descSize=18" />
</picture>

<picture>
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=00D9FF&center=true&vCenter=true&multiline=false&repeat=true&width=600&height=100&lines=${typingLines}" alt="Typing Animation">
</picture>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" alt="divider">

${github ? `[![Profile Views](https://komarev.com/ghpvc/?username=${github}&label=Profile%20Views&color=00D9FF&style=for-the-badge)](https://github.com/${github})
[![GitHub followers](https://img.shields.io/github/followers/${github}?logo=github&style=for-the-badge&color=00D9FF&labelColor=0D1117)](https://github.com/${github})` : ""}

</div>

---

## 🚀 About Me

<img align="right" alt="Coding" width="380" src="https://user-images.githubusercontent.com/74038190/229223263-cf2e4b07-2615-4f87-9c38-e37600f8381a.gif">

\`\`\`python
class ${firstName}:
    def __init__(self):
        self.name  = "${name}"
        self.role  = "${title}"
        self.about = "${about}"
        self.skills = [${top4}]

    def say_hi(self):
        return "Thanks for visiting my profile! 🚀"
\`\`\`

<br clear="right"/>

---

## 🛠️ Tech Stack

<div align="center">

### 👨‍💻 Languages & Tools

${icons}

### 📦 All Skills

${badgesHtml}

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="1000">

</div>

---

${stats}## 🌐 Connect With Me

<div align="center">

${social}

### 💭 Dev Quote

![Quote](https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical&border=true)

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="1000">

</div>

---

<div align="center">

### ⚡ "Code is like humor. When you have to explain it, it's bad." – Cory House

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=150&section=footer&animation=twinkling" />

${github ? `**⭐ From [${name}](https://github.com/${github})** | Built with ❤️ and ☕\n\n${snake}` : `**Built with ❤️ and ☕**\n\n`}

</div>
`;
}
