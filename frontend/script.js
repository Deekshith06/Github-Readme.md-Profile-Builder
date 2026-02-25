// ============================================================
//  README Profile Builder - script.js
//  Handles form submit, API call, preview rendering, download
// ============================================================

// The backend lives here – change if you deploy elsewhere
const API_BASE = "http://localhost:8080/api";

// Store the last generated README content globally so we can copy/download easily
let generatedReadme = "";

// ---- CREATE PARTICLE BACKGROUND ----
// Spawn small glowing dots across the screen for the background effect
(function createParticles() {
    const container = document.getElementById("particles");
    const count = 40;

    for (let i = 0; i < count; i++) {
        const dot = document.createElement("div");
        dot.className = "particle";

        // Random position, size, animation duration and delay
        const size = Math.random() * 3 + 1;  // 1px to 4px
        const x = Math.random() * 100;     // % from left
        const y = Math.random() * 100;     // % from top
        const dur = Math.random() * 4 + 3;   // 3s to 7s per twinkle cycle
        const delay = Math.random() * 5;       // stagger start

        dot.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      --dur: ${dur}s;
      --delay: ${delay}s;
    `;

        container.appendChild(dot);
    }
})();


// ---- QUICK-ADD SKILL CHIPS ----
// Called from the HTML onclick; appends the skill to the textarea
function addSkill(skill) {
    const ta = document.getElementById("skills");
    const current = ta.value.trim();

    // Don't add duplicates (case-insensitive check)
    const existing = current.split(",").map(s => s.trim().toLowerCase());
    if (existing.includes(skill.toLowerCase())) {
        showToast("⚠️ " + skill + " already added!", "warn");
        return;
    }

    ta.value = current ? current + ", " + skill : skill;

    // Highlight the chip briefly to give feedback
    event.target.style.background = "rgba(0,217,255,0.35)";
    setTimeout(() => event.target.style.background = "", 500);
}

// ---- SWITCH CHIP CATEGORY TAB ----
// Shows the chip panel for the selected category tab, hides the rest
function switchChipTab(category, btn) {
    document.querySelectorAll(".chip-panel").forEach(p => p.classList.add("hidden"));
    document.querySelectorAll(".chip-tab").forEach(b => b.classList.remove("active"));
    const panel = document.getElementById("chip-" + category);
    if (panel) panel.classList.remove("hidden");
    if (btn) btn.classList.add("active");
}


// ---- FORM SUBMIT ----
document.getElementById("readmeForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Grab all form values
    const formData = {
        name: document.getElementById("name").value.trim(),
        title: document.getElementById("title").value.trim(),
        about: document.getElementById("about").value.trim(),
        skills: document.getElementById("skills").value.trim() || "Coding",
        github: document.getElementById("github").value.trim(),
        linkedin: document.getElementById("linkedin").value.trim(),
        twitter: document.getElementById("twitter").value.trim(),
        email: document.getElementById("email").value.trim(),
        portfolio: document.getElementById("portfolio").value.trim()
    };

    // Show loading state, hide any previous result/empty state
    showState("loading");

    // Change button to loading style
    const btn = document.getElementById("generateBtn");
    btn.classList.add("loading");
    btn.querySelector(".btn-text").textContent = "Generating...";

    try {
        // POST to our Java backend
        const response = await fetch(API_BASE + "/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error("Server returned " + response.status);
        }

        const data = await response.json();
        generatedReadme = data.readme;

        // Show the result
        document.getElementById("markdownContent").textContent = generatedReadme;
        showState("result");

        // Default to markdown tab
        switchTab("markdown");

        // Smooth scroll to the preview on mobile
        if (window.innerWidth < 960) {
            document.getElementById("resultState").scrollIntoView({ behavior: "smooth", block: "start" });
        }

    } catch (err) {
        // If backend not running, generate locally as fallback
        console.warn("Backend unreachable, using local fallback:", err.message);
        generatedReadme = generateLocalFallback(formData);
        document.getElementById("markdownContent").textContent = generatedReadme;
        showState("result");
        switchTab("markdown");
        showToast("⚠️ Using offline mode (backend not running)", "warn");
    } finally {
        btn.classList.remove("loading");
        btn.querySelector(".btn-text").textContent = "Generate README";
    }
});


// ---- SWITCH TABS (Markdown / Preview) ----
function switchTab(tab) {
    const markdownView = document.getElementById("markdownView");
    const previewView = document.getElementById("previewView");
    const tabMd = document.getElementById("tabMarkdown");
    const tabPrev = document.getElementById("tabPreview");

    if (tab === "markdown") {
        markdownView.classList.remove("hidden");
        previewView.classList.add("hidden");
        tabMd.classList.add("active");
        tabPrev.classList.remove("active");
    } else {
        // Render a simple HTML preview from the markdown
        markdownView.classList.add("hidden");
        previewView.classList.remove("hidden");
        tabMd.classList.remove("active");
        tabPrev.classList.add("active");
        renderMarkdownPreview(generatedReadme);
    }
}


// ---- SIMPLE MARKDOWN RENDERER ----
// This is a very basic renderer – just enough to show structure
// GitHub renders it properly; this is just a preview hint
function renderMarkdownPreview(md) {
    let html = md
        // Headings
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        // Bold & italic
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        // Code blocks (fenced)
        .replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        // Inline code
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        // Images (hide them in preview, show placeholder)
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '<span style="color:#00d9ff;font-size:0.8rem">[Image: $1]</span>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        // Horizontal rule
        .replace(/^---$/gm, "<hr>")
        // Blockquote (shields.io badges shown as inline)
        .replace(/^\> (.+)$/gm, "<blockquote>$1</blockquote>")
        // Line breaks
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br>");

    document.getElementById("renderedPreview").innerHTML = "<p>" + html + "</p>";
}


// ---- COPY README ----
function copyReadme() {
    if (!generatedReadme) return;

    navigator.clipboard.writeText(generatedReadme)
        .then(() => showToast("✅ Copied to clipboard!"))
        .catch(() => {
            // Fallback for older browsers
            const ta = document.createElement("textarea");
            ta.value = generatedReadme;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            showToast("✅ Copied to clipboard!");
        });
}


// ---- DOWNLOAD README.md ----
function downloadReadme() {
    if (!generatedReadme) return;

    // Try backend download first (which streams the saved file)
    // If backend is unavailable, trigger a client-side download
    const a = document.createElement("a");
    const blob = new Blob([generatedReadme], { type: "text/markdown;charset=utf-8" });
    a.href = URL.createObjectURL(blob);
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("⬇️ Downloading README.md...");
}


// ---- SHOW/HIDE UI STATES ----
function showState(state) {
    document.getElementById("emptyState").classList.add("hidden");
    document.getElementById("loadingState").classList.add("hidden");
    document.getElementById("resultState").classList.add("hidden");

    if (state === "loading") {
        document.getElementById("loadingState").classList.remove("hidden");
    } else if (state === "result") {
        document.getElementById("resultState").classList.remove("hidden");
    } else {
        document.getElementById("emptyState").classList.remove("hidden");
    }
}


// ---- TOAST NOTIFICATION ----
let toastTimer = null;
function showToast(message, type) {
    const toast = document.getElementById("toast");
    const msg = document.getElementById("toastMsg");

    msg.textContent = message;
    toast.classList.remove("hidden");

    // Force reflow so the transition fires
    toast.offsetHeight;
    toast.classList.add("show");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.classList.add("hidden"), 350);
    }, 2800);
}


// ---- LOCAL FALLBACK README GENERATOR ----
// Runs entirely in the browser when backend is not reachable.
// Produces the same style of output as the Java backend.
// Useful for demos without starting the server.
function generateLocalFallback(f) {
    const name = f.name || "Your Name";
    const title = f.title || "Developer";
    const about = f.about || "I love coding!";
    const github = f.github || "";
    const linkedin = f.linkedin || "";
    const twitter = f.twitter || "";
    const email = f.email || "";
    const portfolio = f.portfolio || "";

    // Skills as array
    const skills = f.skills.split(",").map(s => s.trim()).filter(s => s);

    // Skill badge definitions (same as Java backend)
    const SKILL_BADGES = {
        "python": ["3776AB", "python", "white"],
        "java": ["ED8B00", "java", "white"],
        "javascript": ["F7DF1E", "javascript", "black"],
        "typescript": ["007ACC", "typescript", "white"],
        "c++": ["00599C", "c%2B%2B", "white"],
        "go": ["00ADD8", "go", "white"],
        "rust": ["DEA584", "rust", "black"],
        "kotlin": ["7F52FF", "kotlin", "white"],
        "swift": ["FA7343", "swift", "white"],
        "html": ["E34F26", "html5", "white"],
        "css": ["1572B6", "css3", "white"],
        "react": ["20232A", "react", "61DAFB"],
        "vue": ["4FC08D", "vue.js", "white"],
        "angular": ["DD0031", "angular", "white"],
        "nodejs": ["339933", "node.js", "white"],
        "node": ["339933", "node.js", "white"],
        "django": ["092E20", "django", "white"],
        "flask": ["000000", "flask", "white"],
        "spring": ["6DB33F", "spring", "white"],
        "tensorflow": ["FF6F00", "tensorflow", "white"],
        "pytorch": ["EE4C2C", "pytorch", "white"],
        "pandas": ["150458", "pandas", "white"],
        "numpy": ["013243", "numpy", "white"],
        "mysql": ["4479A1", "mysql", "white"],
        "mongodb": ["4EA94B", "mongodb", "white"],
        "docker": ["2496ED", "docker", "white"],
        "kubernetes": ["326CE5", "kubernetes", "white"],
        "aws": ["232F3E", "amazon-aws", "white"],
        "git": ["F05032", "git", "white"],
        "linux": ["FCC624", "linux", "black"],
        "firebase": ["FFCA28", "firebase", "black"],
        "redis": ["DC382D", "redis", "white"],
        "postgresql": ["336791", "postgresql", "white"],
        "figma": ["F24E1E", "figma", "white"],
        "r": ["276DC3", "r", "white"],
        "dart": ["0175C2", "dart", "white"],
        "php": ["777BB4", "php", "white"],
        "ruby": ["CC342D", "ruby", "white"],
        "scala": ["DC322F", "scala", "white"],
        "arduino": ["00979D", "arduino", "white"],
        "unity": ["000000", "unity", "white"],
    };

    // Techstack-generator icon URLs for popular languages
    const LANG_ICONS = {
        "python": "https://techstack-generator.vercel.app/python-icon.svg",
        "java": "https://techstack-generator.vercel.app/java-icon.svg",
        "javascript": "https://techstack-generator.vercel.app/js-icon.svg",
        "typescript": "https://techstack-generator.vercel.app/ts-icon.svg",
        "c++": "https://techstack-generator.vercel.app/cpp-icon.svg",
        "react": "https://techstack-generator.vercel.app/react-icon.svg",
        "aws": "https://techstack-generator.vercel.app/aws-icon.svg",
        "docker": "https://techstack-generator.vercel.app/docker-icon.svg",
        "kubernetes": "https://techstack-generator.vercel.app/kubernetes-icon.svg",
        "mysql": "https://techstack-generator.vercel.app/mysql-icon.svg",
        "django": "https://techstack-generator.vercel.app/django-icon.svg",
        "github": "https://techstack-generator.vercel.app/github-icon.svg",
        "swift": "https://techstack-generator.vercel.app/swift-icon.svg",
        "nginx": "https://techstack-generator.vercel.app/nginx-icon.svg",
    };

    // Build typing animation lines
    const encodedTitle = title.replace(/ /g, "+").replace(/&/g, "%26");
    let typingLines = encodedTitle + "+%F0%9F%9A%80";
    skills.slice(0, 4).forEach(s => {
        typingLines += ";" + s.replace(/ /g, "+") + "+Developer+%F0%9F%92%BB";
    });
    typingLines += ";Open+Source+Contributor+%E2%9C%A8;Building+the+Future+%F0%9F%A4%96";

    // Build language icon HTML
    let langIconsHtml = "";
    skills.forEach(s => {
        const key = s.toLowerCase();
        for (const [lang, url] of Object.entries(LANG_ICONS)) {
            if (key === lang || key.includes(lang)) {
                langIconsHtml += `<img src="${url}" alt="${s}" width="65" height="65" />\n`;
                break;
            }
        }
    });
    if (!langIconsHtml) langIconsHtml = "*See badges below*\n";

    // Build skill badges
    let badgesHtml = "";
    skills.forEach(s => {
        const key = s.toLowerCase();
        let found = false;
        for (const [lang, [color, logo, logoColor]] of Object.entries(SKILL_BADGES)) {
            if (key.includes(lang)) {
                const label = s.replace(/ /g, "%20").replace(/-/g, "--");
                badgesHtml += `![${s}](https://img.shields.io/badge/${label}-${color}?style=for-the-badge&logo=${logo}&logoColor=${logoColor})\n`;
                found = true;
                break;
            }
        }
        if (!found) {
            badgesHtml += `![${s}](https://img.shields.io/badge/${s.replace(/ /g, "%20")}-gray?style=for-the-badge)\n`;
        }
    });

    // Encode title for capsule-render
    const capsTitle = title.replace(/ /g, "%20").replace(/&/g, "%26");
    const aboutSnip = about.replace(/ /g, "%20").substring(0, 50);

    // Build social badges
    let socialLinks = "";
    if (portfolio) socialLinks += `<a href="${portfolio}">\n  <img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white" />\n</a>\n`;
    if (linkedin) {
        const url = linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`;
        socialLinks += `<a href="${url}">\n  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />\n</a>\n`;
    }
    if (twitter) {
        const url = twitter.startsWith("http") ? twitter : `https://twitter.com/${twitter}`;
        socialLinks += `<a href="${url}">\n  <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" />\n</a>\n`;
    }
    if (github) socialLinks += `<a href="https://github.com/${github}">\n  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />\n</a>\n`;
    if (email) socialLinks += `<a href="mailto:${email}">\n  <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" />\n</a>\n`;

    // GitHub stats section
    let statsHtml = "";
    if (github) {
        statsHtml = `## 📊 GitHub Stats

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

`;
    }

    const snakeLine = github
        ? `<img src="https://raw.githubusercontent.com/Platane/snk/output/github-contribution-grid-snake-dark.svg" alt="Snake animation" />\n\n`
        : "";

    const firstName = name.split(" ")[0];
    const top4Skills = skills.slice(0, 4).map(s => `"${s}"`).join(", ");

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
        self.name = "${name}"
        self.role = "${title}"
        self.about = "${about}"
        self.skills = [${top4Skills}]

    def say_hi(self):
        return "Thanks for visiting my profile! 🚀"
\`\`\`

<br clear="right"/>

---

## 🛠️ Tech Stack

<div align="center">

### 👨‍💻 Languages & Tools

${langIconsHtml}

### 📦 All Skills

${badgesHtml}

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="1000">

</div>

---

${statsHtml}## 🌐 Connect With Me

<div align="center">

${socialLinks}

### 💭 Dev Quote

![Quote](https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical&border=true)

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="1000">

</div>

---

<div align="center">

### ⚡ "Code is like humor. When you have to explain it, it's bad." – Cory House

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=150&section=footer&animation=twinkling" />

${github ? `**⭐ From [${name}](https://github.com/${github})** | Built with ❤️ and ☕\n\n${snakeLine}` : `**Built with ❤️ and ☕**\n\n`}

</div>
`;
}
