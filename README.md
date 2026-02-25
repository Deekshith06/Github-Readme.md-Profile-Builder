# 🛠️ README Profile Builder

> A simple web app to generate stunning GitHub profile READMEs — built as a college project using Java Spring Boot and plain HTML/CSS/JS.

---

## 📁 Project Structure

```
README-Profile-Builder/
├── backend/
│   ├── pom.xml                          ← Maven build file
│   └── src/main/java/com/student/readmebuilder/
│       ├── MainApplication.java         ← Spring Boot entry point
│       ├── ReadmeGenerator.java         ← Builds the README markdown
│       └── Controller.java             ← REST API endpoints
├── frontend/
│   ├── index.html                       ← Main page with form + preview
│   ├── style.css                        ← Dark theme styling
│   └── script.js                        ← Form logic, API calls, download
├── generated/
│   └── README.md                        ← Sample output (auto-saved here)
└── README.md                            ← This file
```

---

## 🚀 How to Run

### Step 1 — Start the Backend

You need Java 17+ and Maven installed.

```bash
cd backend
mvn spring-boot:run
```

The server starts at `http://localhost:8080`

### Step 2 — Open the Frontend

Just open `frontend/index.html` in your browser.  
No build step needed — it's plain HTML!

```bash
open frontend/index.html
# or just double-click the file
```

> ⚡ **Offline mode**: The frontend also works without the backend!  
> If the server isn't running, it generates the README locally using JavaScript.

---

## 🎯 What It Does

1. User fills in the form (name, title, skills, GitHub, social links)
2. Frontend sends the data to `POST /api/generate`
3. Java backend builds the README markdown with badges, stats, animations
4. Preview appears in the browser (markdown tab + rendered tab)
5. User can **copy** to clipboard or **download** as `README.md`

---

## ✨ Features of the Generated README

| Feature | Description |
|--------|-------------|
| 🎨 Animated header | Capsule-render wave banner with custom title |
| ⌨️ Typing animation | Cycles through your title and top skills |
| 🖼️ Language icons | Animated SVG icons (techstack-generator) for popular languages |
| 🏷️ Skill badges | Shields.io badges for all listed skills with correct colors |
| 📊 GitHub stats | Streak, profile summary cards, trophy showcase |
| 📈 Contribution graph | Activity heatmap from github-readme-activity-graph |
| 🐍 Snake animation | Contribution grid snake |
| 🌐 Social links | Badges for LinkedIn, Twitter, GitHub, Email, Portfolio |
| 💭 Dev quote | Random dev quote of the day |

---

## 🔧 Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Java 17, Spring Boot 3.2 |
| Frontend | HTML5, Vanilla CSS, Vanilla JS |
| Build | Maven |
| Markdown | Generated as a string (no templates) |

---

## 🧑‍💻 How the Code Works (Student Explanation)

### Backend Flow
```
Browser → POST /api/generate → Controller.java
                                     ↓
                             ReadmeGenerator.java
                             (builds markdown string)
                                     ↓
                             Returns JSON { readme: "..." }
                             Also saves to generated/README.md
```

### Frontend Flow
```
User fills form → submit event → fetch("POST /api/generate")
                                        ↓
                              Show result in <pre> tag
                              User clicks Download → create Blob → <a> download
```

### `ReadmeGenerator.java` Logic
- Takes name, title, about, skills etc. as parameters
- Matches each skill against a hardcoded badge list (e.g., "python" → blue badge)
- Matches skills against language icon list (e.g., "java" → techstack-generator SVG)
- Concatenates everything into a big markdown string
- Returns that string to the controller

---

## 📝 Sample Output

See [`generated/README.md`](generated/README.md) for a sample of what the tool generates for an AI/ML engineer profile.

---

## ⚠️ Limitations (It's a Student Project!)

- No database — everything is generated on the fly
- Only one README saved at a time (file gets overwritten)
- The "preview" tab in the browser is a rough approximation — the real look is on GitHub
- Skills are matched by keyword, so unusual names might get a generic badge

---

## 👨‍💻 About

Built by a final-year Computer Science student as a fun personal project.  
The goal was to make something useful while keeping the code simple and readable.

**Not a SaaS product. Not enterprise software. Just a cool student project. 😄**
