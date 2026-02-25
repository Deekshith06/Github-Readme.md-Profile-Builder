# 🛠️ README Profile Builder

![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=flat-square&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=flat-square&logo=spring&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML/CSS](https://img.shields.io/badge/HTML%2FCSS-Modern_UI-2299EC?style=flat-square&logo=html5&logoColor=white)

A dynamic web application that generates stunning, professional **GitHub Profile READMEs** with a few clicks. Features a modern brutalist design, dynamic categorization, and an offline JavaScript fallback builder.

### 🌐 Live Demo
**[Try it out here!](https://github-readme-md-profile-builder.vercel.app/)** 
*No installation required!*

---

## 🔄 How It Works

```mermaid
graph TD
    subgraph Step 1: User Input
        A["User visits Frontend"] -->|Fills form| B["Name, Skills, Socials"]
        B -->|Selects options| C["Category Chips"]
    end

    subgraph Step 2: Generation Engine
        C -->|Submit| D{"Backend / Falback"}
        D -->|Online: Spring Boot API| E["ReadmeGenerator.java"]
        D -->|Offline: Vanilla JS| F["buildReadme()"]
        E -->|Processes templates| G["Markdown Output"]
        F -->|Processes templates| G
    end

    subgraph Step 3: Result
        G --> H["Preview in Browser"]
        H -->|Copy| I["Clipboard"]
        H -->|Download| J["README.md file"]
    end
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/Deekshith06/README-Profile-Builder.git
cd README-Profile-Builder

# Start the Backend (Java 17+ & Maven required)
cd backend
mvn spring-boot:run
# Server runs on http://localhost:8080

# Open the Frontend
cd ../frontend
open index.html # Or just double click the file
```

> ⚡ **Offline Mode**: The tool works completely offline without the backend running, utilizing a powerful JavaScript fallback generator!

---

## 📂 Project Structure

```text
├── backend/                       # Spring Boot Java Backend
│   ├── src/main/java/.../         # Core API and Generator code
│   │   ├── MainApplication.java   # Spring Boot entry point
│   │   ├── ReadmeGenerator.java   # Builds the README markdown
│   │   └── Controller.java        # REST API endpoints
│   └── pom.xml                    # Maven dependencies
└── frontend/                      # Vanilla JS/CSS Frontend
    ├── index.html                 # Main interface
    ├── style.css                  # Modern UI styling
    └── script.js                  # Form logic & Offline Builder
```

---

## 🔧 Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, Vanilla CSS, Vanilla JS |
| Backend API | Java 17, Spring Boot 3.2 |
| Build Tool | Maven |

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| **Dynamic Headers** | Capsule-render animated waving banners |
| **Typing Animation** | Cycles through your top skills |
| **Categorization** | Auto-categorizes skills into languages, AI, DBs, etc. |
| **Rich Badges** | Shields.io and TechStack SVGs |
| **GitHub Stats** | Streak, Summaries, Trophies, and Contribution heatmaps |

---

## 👤 Author

**Seelaboyina Deekshith**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Deekshith06)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/deekshith030206)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:seelaboyinadeekshith@gmail.com)

---

> ⭐ Star this repo if it helped you!
