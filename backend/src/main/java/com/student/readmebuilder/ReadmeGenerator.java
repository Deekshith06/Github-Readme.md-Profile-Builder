package com.student.readmebuilder;

import org.springframework.stereotype.Component;
import java.util.*;

// This class builds the entire README markdown as a big string.
// Skills are auto-categorized into sections like Languages, AI/ML, Web, etc.
@Component
public class ReadmeGenerator {

        // Badge map: keyword → [hex_color, logo_name, logo_color]
        // Used to generate shields.io badge URLs
        private static final Object[][] BADGES = {
                        // === Languages ===
                        { "python", "3776AB", "python", "white" },
                        { "java", "ED8B00", "java", "white" },
                        { "javascript", "F7DF1E", "javascript", "black" },
                        { "typescript", "007ACC", "typescript", "white" },
                        { "c++", "00599C", "c%2B%2B", "white" },
                        { "c#", "239120", "csharp", "white" },
                        { "golang", "00ADD8", "go", "white" },
                        { "rust", "DEA584", "rust", "black" },
                        { "kotlin", "7F52FF", "kotlin", "white" },
                        { "swift", "FA7343", "swift", "white" },
                        { "php", "777BB4", "php", "white" },
                        { "ruby", "CC342D", "ruby", "white" },
                        { "dart", "0175C2", "dart", "white" },
                        { "scala", "DC322F", "scala", "white" },
                        { "perl", "39457E", "perl", "white" },
                        { "haskell", "5D4F85", "haskell", "white" },
                        { "lua", "2C2D72", "lua", "white" },
                        { "matlab", "0076A8", "mathworks", "white" },
                        { "bash", "4EAA25", "gnu-bash", "white" },
                        { "shell", "4EAA25", "gnu-bash", "white" },
                        { "groovy", "4298B8", "apachegroovy", "white" },
                        { "elixir", "6E4A7E", "elixir", "white" },
                        { "fortran", "734F96", "fortran", "white" },
                        { "clojure", "5881D8", "clojure", "white" },
                        { "erlang", "A90533", "erlang", "white" },
                        { "julia", "9558B2", "julia", "white" },
                        { "nim", "FFE953", "nim", "black" },
                        { "zig", "F7A41D", "zig", "white" },
                        { "solidity", "363636", "solidity", "white" },
                        { "vba", "217346", "microsoft", "white" },
                        { "cobol", "005CA5", "ibm", "white" },
                        // === AI / ML ===
                        { "tensorflow", "FF6F00", "tensorflow", "white" },
                        { "pytorch", "EE4C2C", "pytorch", "white" },
                        { "keras", "D00000", "keras", "white" },
                        { "scikit-learn", "F7931E", "scikit-learn", "white" },
                        { "sklearn", "F7931E", "scikit-learn", "white" },
                        { "pandas", "150458", "pandas", "white" },
                        { "numpy", "013243", "numpy", "white" },
                        { "opencv", "5C3EE8", "opencv", "white" },
                        { "huggingface", "FFD21E", "huggingface", "black" },
                        { "nltk", "3776AB", "python", "white" },
                        { "spacy", "09A3D5", "spacy", "white" },
                        { "xgboost", "189AB4", "python", "white" },
                        { "lightgbm", "02569B", "python", "white" },
                        { "catboost", "FFCC00", "python", "black" },
                        { "onnx", "005CED", "onnx", "white" },
                        { "mlflow", "0194E2", "mlflow", "white" },
                        { "scipy", "8CAAE6", "scipy", "white" },
                        { "langchain", "1C3C3C", "chainlink", "white" },
                        { "transformers", "FFD21E", "huggingface", "black" },
                        { "dask", "FDA061", "dask", "black" },
                        { "statsmodels", "3776AB", "python", "white" },
                        // === Web ===
                        { "react", "20232A", "react", "61DAFB" },
                        { "vue", "4FC08D", "vue.js", "white" },
                        { "angular", "DD0031", "angular", "white" },
                        { "next.js", "000000", "next.js", "white" },
                        { "nextjs", "000000", "next.js", "white" },
                        { "nuxt", "00DC82", "nuxtdotjs", "white" },
                        { "svelte", "FF3E00", "svelte", "white" },
                        { "gatsby", "663399", "gatsby", "white" },
                        { "astro", "FF5D01", "astro", "white" },
                        { "node", "339933", "node.js", "white" },
                        { "express", "000000", "express", "white" },
                        { "django", "092E20", "django", "white" },
                        { "flask", "000000", "flask", "white" },
                        { "fastapi", "009688", "fastapi", "white" },
                        { "spring", "6DB33F", "spring", "white" },
                        { "laravel", "FF2D20", "laravel", "white" },
                        { "rails", "CC0000", "ruby-on-rails", "white" },
                        { "nestjs", "E0234E", "nestjs", "white" },
                        { "html", "E34F26", "html5", "white" },
                        { "css", "1572B6", "css3", "white" },
                        { "bootstrap", "7952B3", "bootstrap", "white" },
                        { "tailwind", "38B2AC", "tailwind-css", "white" },
                        { "jquery", "0769AD", "jquery", "white" },
                        { "graphql", "E10098", "graphql", "white" },
                        { "webpack", "8DD6F9", "webpack", "black" },
                        { "vite", "646CFF", "vite", "white" },
                        { "redux", "764ABC", "redux", "white" },
                        { "deno", "000000", "deno", "white" },
                        { "bun", "FBF0DF", "bun", "black" },
                        // === Cloud / DevOps ===
                        { "aws", "232F3E", "amazon-aws", "white" },
                        { "azure", "0078D4", "microsoftazure", "white" },
                        { "gcp", "4285F4", "google-cloud", "white" },
                        { "docker", "2496ED", "docker", "white" },
                        { "kubernetes", "326CE5", "kubernetes", "white" },
                        { "jenkins", "D24939", "jenkins", "white" },
                        { "terraform", "7B42BC", "terraform", "white" },
                        { "ansible", "EE0000", "ansible", "white" },
                        { "circleci", "343434", "circleci", "white" },
                        { "heroku", "430098", "heroku", "white" },
                        { "vercel", "000000", "vercel", "white" },
                        { "netlify", "00C7B7", "netlify", "white" },
                        { "firebase", "FFCA28", "firebase", "black" },
                        { "supabase", "3ECF8E", "supabase", "white" },
                        { "nginx", "009639", "nginx", "white" },
                        { "github actions", "2088FF", "github-actions", "white" },
                        { "cloudflare", "F38020", "cloudflare", "white" },
                        { "digitalocean", "0080FF", "digitalocean", "white" },
                        { "travis", "3EAAAF", "travis-ci", "white" },
                        { "linux", "FCC624", "linux", "black" },
                        { "ubuntu", "E95420", "ubuntu", "white" },
                        { "apache", "D22128", "apache", "white" },
                        // === Databases ===
                        { "mysql", "4479A1", "mysql", "white" },
                        { "postgresql", "316192", "postgresql", "white" },
                        { "mongodb", "4EA94B", "mongodb", "white" },
                        { "redis", "DC382D", "redis", "white" },
                        { "sqlite", "003B57", "sqlite", "white" },
                        { "oracle", "F80000", "oracle", "white" },
                        { "cassandra", "1287B1", "apachecassandra", "white" },
                        { "elasticsearch", "005571", "elasticsearch", "white" },
                        { "dynamodb", "4053D6", "amazondynamodb", "white" },
                        { "neo4j", "008CC1", "neo4j", "white" },
                        { "influxdb", "22ADF6", "influxdb", "white" },
                        { "mariadb", "003545", "mariadb", "white" },
                        { "snowflake", "29B5E8", "snowflake", "white" },
                        { "bigquery", "4285F4", "googlebigquery", "white" },
                        { "prisma", "2D3748", "prisma", "white" },
                        { "hadoop", "66CCFF", "apachehadoop", "white" },
                        { "spark", "E25A1C", "apachespark", "white" },
                        // === Data Visualization ===
                        { "matplotlib", "11557C", "python", "white" },
                        { "seaborn", "3776AB", "python", "white" },
                        { "plotly", "3F4F75", "plotly", "white" },
                        { "tableau", "E97627", "tableau", "white" },
                        { "power bi", "F2C811", "powerbi", "black" },
                        { "powerbi", "F2C811", "powerbi", "black" },
                        { "d3.js", "F9A03C", "d3.js", "white" },
                        { "bokeh", "F37626", "python", "white" },
                        { "grafana", "F46800", "grafana", "white" },
                        { "kibana", "005571", "kibana", "white" },
                        { "looker", "4285F4", "looker", "white" },
                        { "metabase", "509EE3", "metabase", "white" },
                        { "superset", "E53935", "apachesuperset", "white" },
                        { "excel", "217346", "microsoftexcel", "white" },
                        { "altair", "3776AB", "python", "white" },
                        // === Tools & Platforms ===
                        { "git", "F05032", "git", "white" },
                        { "github", "181717", "github", "white" },
                        { "gitlab", "FC6D26", "gitlab", "white" },
                        { "bitbucket", "0052CC", "bitbucket", "white" },
                        { "vscode", "007ACC", "visual-studio-code", "white" },
                        { "intellij", "000000", "intellij-idea", "white" },
                        { "pycharm", "000000", "pycharm", "white" },
                        { "jupyter", "F37626", "jupyter", "white" },
                        { "postman", "FF6C37", "postman", "white" },
                        { "figma", "F24E1E", "figma", "white" },
                        { "arduino", "00979D", "arduino", "white" },
                        { "unity", "000000", "unity", "white" },
                        { "unreal", "313131", "unrealengine", "white" },
                        { "blender", "F5792A", "blender", "white" },
                        { "photoshop", "31A8FF", "adobephotoshop", "white" },
                        { "illustrator", "FF9A00", "adobeillustrator", "white" },
                        { "jira", "0052CC", "jira", "white" },
                        { "notion", "000000", "notion", "white" },
                        { "slack", "4A154B", "slack", "white" },
                        { "android", "3DDC84", "android", "white" },
                        { "raspberry", "C51A4A", "raspberrypi", "white" },
                        { "windows", "0078D4", "windows", "white" },
                        { "macos", "000000", "apple", "white" },
        };

        // Techstack-generator animated SVG icon URLs for popular tools
        private static final String[][] TECH_ICONS = {
                        { "python", "https://techstack-generator.vercel.app/python-icon.svg" },
                        { "java", "https://techstack-generator.vercel.app/java-icon.svg" },
                        { "javascript", "https://techstack-generator.vercel.app/js-icon.svg" },
                        { "typescript", "https://techstack-generator.vercel.app/ts-icon.svg" },
                        { "c++", "https://techstack-generator.vercel.app/cpp-icon.svg" },
                        { "c#", "https://techstack-generator.vercel.app/csharp-icon.svg" },
                        { "react", "https://techstack-generator.vercel.app/react-icon.svg" },
                        { "aws", "https://techstack-generator.vercel.app/aws-icon.svg" },
                        { "docker", "https://techstack-generator.vercel.app/docker-icon.svg" },
                        { "kubernetes", "https://techstack-generator.vercel.app/kubernetes-icon.svg" },
                        { "mysql", "https://techstack-generator.vercel.app/mysql-icon.svg" },
                        { "django", "https://techstack-generator.vercel.app/django-icon.svg" },
                        { "github", "https://techstack-generator.vercel.app/github-icon.svg" },
                        { "swift", "https://techstack-generator.vercel.app/swift-icon.svg" },
                        { "nginx", "https://techstack-generator.vercel.app/nginx-icon.svg" },
                        { "golang", "https://techstack-generator.vercel.app/go-icon.svg" },
                        { "rust", "https://techstack-generator.vercel.app/rust-icon.svg" },
        };

        // Animated GIF icons for the Tools section (from
        // user-images.githubusercontent.com)
        private static final String[][] TOOL_GIFS = {
                        { "vscode",
                                        "https://user-images.githubusercontent.com/74038190/212257454-16e3712e-945a-4ca2-b238-408ad0bf87e6.gif" },
                        { "vs code",
                                        "https://user-images.githubusercontent.com/74038190/212257454-16e3712e-945a-4ca2-b238-408ad0bf87e6.gif" },
                        { "github",
                                        "https://user-images.githubusercontent.com/74038190/212257468-1e9a91f1-b626-4baa-b15d-5c385dfa7ed2.gif" },
                        { "docker",
                                        "https://user-images.githubusercontent.com/74038190/212281775-b468df30-4edc-4bf8-a4ee-f52e1aaddc86.gif" },
                        { "figma",
                                        "https://user-images.githubusercontent.com/74038190/238200428-67f477ed-6624-42da-99f0-1a7b1a16eecb.gif" },
                        { "postman",
                                        "https://user-images.githubusercontent.com/74038190/212257460-738ff888-c2f9-4204-a999-87f0bbb9d0a4.gif" },
        };

        // Returns which display category a skill belongs to
        private String getCategory(String skill) {
                String s = skill.toLowerCase().trim();

                // Check Data Viz first to avoid overlap with AI/ML (e.g. matplotlib)
                for (String k : new String[] { "matplotlib", "seaborn", "plotly", "tableau", "power bi", "powerbi",
                                "d3.js",
                                "d3 ", "bokeh", "altair", "grafana", "kibana", "looker", "metabase", "superset",
                                "excel" })
                        if (s.contains(k.trim()))
                                return "DATAVIZ";

                for (String k : new String[] { "tensorflow", "pytorch", "keras", "scikit", "sklearn", "pandas", "numpy",
                                "opencv", "huggingface", "nltk", "spacy", "xgboost", "lightgbm", "catboost", "onnx",
                                "mlflow", "scipy",
                                "statsmodels", "transformers", "langchain", "dask" })
                        if (s.contains(k.trim()))
                                return "AI";

                for (String k : new String[] { "react", "vue", "angular", "next", "nuxt", "svelte", "gatsby", "astro",
                                "node",
                                "express", "django", "flask", "fastapi", "spring", "laravel", "rails", "nestjs", "html",
                                "css",
                                "bootstrap", "tailwind", "jquery", "graphql", "webpack", "vite", "redux", "deno",
                                "bun" })
                        if (s.contains(k.trim()))
                                return "WEB";

                for (String k : new String[] { "mysql", "postgresql", "postgres", "mongodb", "redis", "sqlite",
                                "oracle",
                                "cassandra", "elasticsearch", "dynamodb", "neo4j", "influxdb", "mariadb", "snowflake",
                                "bigquery",
                                "prisma", "hadoop", "spark", "hive" })
                        if (s.contains(k.trim()))
                                return "DB";

                for (String k : new String[] { "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "jenkins",
                                "terraform", "ansible", "circleci", "heroku", "vercel", "netlify", "firebase",
                                "supabase", "nginx",
                                "github actions", "cloudflare", "digitalocean", "travis", "devops", "ci/cd", "apache",
                                "ubuntu" })
                        if (s.contains(k.trim()))
                                return "CLOUD";

                for (String k : new String[] { "machine learning", "deep learning", "computer vision", "nlp",
                                "natural language", "data structure", "algorithm", "oop", "microservice",
                                "system design", "agile",
                                "scrum", "mlops", "blockchain", "iot", "embedded", "robotics", "cybersecurity",
                                "neural network",
                                "reinforcement" })
                        if (s.contains(k.trim()))
                                return "CONCEPTS";

                for (String k : new String[] { "git", "gitlab", "bitbucket", "vscode", "vs code", "intellij", "pycharm",
                                "jupyter", "postman", "figma", "arduino", "unity", "unreal", "blender", "photoshop",
                                "illustrator",
                                "jira", "notion", "slack", "android", "raspberry", "windows", "macos", "linux" })
                        if (s.contains(k.trim()))
                                return "TOOLS";

                // Languages last
                for (String k : new String[] { "python", "java", "javascript", "typescript", "c++", "c#", "golang",
                                "rust",
                                "kotlin", "swift", "php", "ruby", "dart", "scala", "perl", "haskell", "lua", "matlab",
                                "bash", "shell",
                                "groovy", "elixir", "fortran", "clojure", "erlang", "julia", "nim", "zig", "solidity",
                                "cobol", "vba" })
                        if (s.contains(k.trim()))
                                return "LANG";

                if (s.equals("c") || s.equals("r"))
                        return "LANG";
                return "OTHER";
        }

        // Build the full README markdown string
        public String generate(String name, String title, String about,
                        String skillsRaw, String github,
                        String linkedin, String twitter,
                        String email, String portfolio) {

                // Parse skills list
                List<String> all = new ArrayList<>();
                for (String s : skillsRaw.split(",")) {
                        String t = s.trim();
                        if (!t.isEmpty())
                                all.add(t);
                }

                // Group skills by category, preserving insertion order
                Map<String, List<String>> catMap = new LinkedHashMap<>();
                String[] catOrder = { "LANG", "AI", "WEB", "CLOUD", "DB", "DATAVIZ", "TOOLS", "CONCEPTS", "OTHER" };
                for (String c : catOrder)
                        catMap.put(c, new ArrayList<>());
                for (String skill : all)
                        catMap.get(getCategory(skill)).add(skill);

                StringBuilder sb = new StringBuilder();

                // === HEADER ===
                sb.append("<div align=\"center\">\n\n# 👨\u200D💻 ").append(name).append("\n\n");
                String encTitle = title.replace(" ", "%20").replace("&", "%26");
                String encAbout = about.replace(" ", "%20").replace(",", "%2C").replace("&", "%26")
                                .substring(0, Math.min(about.length(), 50));
                sb.append(
                                "<picture>\n  <img alt=\"Header\" src=\"https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=")
                                .append(encTitle)
                                .append("&fontSize=45&fontColor=fff&animation=twinkling&fontAlignY=35&desc=")
                                .append(encAbout).append("&descAlignY=55&descSize=18\" />\n</picture>\n\n");

                // Typing animation — cycles through title + top skills
                StringBuilder lines = new StringBuilder(encTitle).append("+%F0%9F%9A%80");
                int tc = 0;
                for (String s : all) {
                        if (tc++ >= 4)
                                break;
                        lines.append(";").append(s.trim().replace(" ", "+")).append("+%F0%9F%92%BB");
                }
                lines.append(";Open+Source+Contributor+%E2%9C%A8;Building+the+Future+%F0%9F%A4%96");
                sb.append(
                                "<picture>\n  <img src=\"https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=00D9FF&center=true&vCenter=true&repeat=true&width=600&height=100&lines=")
                                .append(lines).append("\" alt=\"Typing Animation\">\n</picture>\n\n");

                sb.append(
                                "<img src=\"https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif\" width=\"100%\" alt=\"divider\">\n\n");

                if (github != null && !github.isBlank()) {
                        sb.append("[![Profile Views](https://komarev.com/ghpvc/?username=").append(github)
                                        .append("&label=Profile%20Views&color=00D9FF&style=for-the-badge)](https://github.com/")
                                        .append(github).append(")\n");
                        sb.append("[![GitHub followers](https://img.shields.io/github/followers/").append(github)
                                        .append("?logo=github&style=for-the-badge&color=00D9FF&labelColor=0D1117)](https://github.com/")
                                        .append(github).append(")\n\n");
                }
                sb.append("</div>\n\n---\n\n");

                // === ABOUT ME ===
                sb.append("## 🚀 About Me\n\n");
                sb.append(
                                "<img align=\"right\" alt=\"Coding\" width=\"380\" src=\"https://user-images.githubusercontent.com/74038190/229223263-cf2e4b07-2615-4f87-9c38-e37600f8381a.gif\">\n\n");
                String fn = name.split(" ")[0];
                List<String> top4 = all.size() > 4 ? all.subList(0, 4) : all;
                sb.append("```python\nclass ").append(fn).append(":\n    def __init__(self):\n")
                                .append("        self.name = \"").append(name).append("\"\n")
                                .append("        self.role = \"").append(title).append("\"\n")
                                .append("        self.about = \"").append(about).append("\"\n")
                                .append("        self.top_skills = [");
                for (int i = 0; i < top4.size(); i++) {
                        sb.append("\"").append(top4.get(i)).append("\"");
                        if (i < top4.size() - 1)
                                sb.append(", ");
                }
                sb.append(
                                "]\n\n    def say_hi(self):\n        return \"Thanks for visiting! 🚀\"\n```\n\n<br clear=\"right\"/>\n\n---\n\n");

                // === TECH STACK (categorized) ===
                sb.append("## 🛠️ Tech Stack\n\n<div align=\"center\">\n\n");

                String[][] catInfo = {
                                { "LANG", "👨\u200D💻", "Programming Languages" },
                                { "AI", "🤖", "AI / ML & Data Science" },
                                { "WEB", "🌐", "Web Development" },
                                { "CLOUD", "☁️", "Cloud & DevOps" },
                                { "DB", "🗄️", "Databases" },
                                { "DATAVIZ", "📊", "Data Visualization" },
                                { "TOOLS", "⚙️", "Tools & Platforms" },
                                { "CONCEPTS", "🧠", "Core Concepts" },
                                { "OTHER", "🔧", "Other Skills" },
                };

                for (String[] ci : catInfo) {
                        String catKey = ci[0];
                        List<String> cSkills = catMap.get(catKey);
                        if (cSkills == null || cSkills.isEmpty())
                                continue;

                        sb.append("### ").append(ci[1]).append(" ").append(ci[2]).append("\n\n");

                        // Animated SVG icons for Language / Cloud / Web / DB sections
                        if (!catKey.equals("CONCEPTS") && !catKey.equals("DATAVIZ") && !catKey.equals("OTHER")) {
                                String icons = buildTechIcons(cSkills);
                                if (!icons.isEmpty())
                                        sb.append(icons).append("\n");
                        }

                        // Animated GIF icons for Tools section
                        if (catKey.equals("TOOLS")) {
                                String gifs = buildToolGifs(cSkills);
                                if (!gifs.isEmpty())
                                        sb.append(gifs).append("\n");
                        }

                        // Shield.io badges for ALL skills in this category
                        sb.append(buildBadges(cSkills)).append("\n");
                        sb.append(
                                        "<img src=\"https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif\" width=\"700\">\n\n");
                }

                sb.append("</div>\n\n---\n\n");

                // === GITHUB STATS ===
                if (github != null && !github.isBlank()) {
                        sb.append("## 📊 GitHub Stats\n\n<div align=\"center\">\n\n");
                        sb.append("[![GitHub Streak](https://streak-stats.demolab.com?user=").append(github)
                                        .append("&theme=radical&hide_border=true&background=0D1117&ring=00D9FF&fire=00D9FF&currStreakLabel=00D9FF)](https://git.io/streak-stats)\n\n");
                        sb.append(
                                        "<img width=\"49%\" src=\"https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=")
                                        .append(github).append("&theme=radical\" />\n");
                        sb.append(
                                        "<img width=\"49%\" src=\"https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=")
                                        .append(github).append("&theme=radical\" />\n");
                        sb.append(
                                        "<img width=\"49%\" src=\"https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=")
                                        .append(github).append("&theme=radical\" />\n");
                        sb.append(
                                        "<img width=\"49%\" src=\"https://github-profile-summary-cards.vercel.app/api/cards/stats?username=")
                                        .append(github).append("&theme=radical\" />\n\n");
                        sb.append("### 🏆 GitHub Trophies\n\n");
                        sb.append("<img src=\"https://github-profile-trophy.vercel.app/?username=").append(github)
                                        .append("&theme=radical&no-frame=true&no-bg=true&column=4&row=2&margin-w=15\" />\n\n");
                        sb.append("### 📈 Contribution Graph\n\n");
                        sb.append("[![Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=")
                                        .append(github)
                                        .append("&custom_title=Contribution+Graph&hide_border=true&bg_color=0D1117&color=00D9FF&line=00D9FF&point=FFFFFF&area=true)](https://github.com/")
                                        .append(github).append(")\n\n");
                        sb.append("</div>\n\n---\n\n");
                }

                // === CONNECT ===
                sb.append("## 🌐 Connect With Me\n\n<div align=\"center\">\n\n");
                if (portfolio != null && !portfolio.isBlank())
                        sb.append("<a href=\"").append(portfolio).append(
                                        "\">\n  <img src=\"https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white\" />\n</a>\n");
                if (linkedin != null && !linkedin.isBlank()) {
                        String u = linkedin.startsWith("http") ? linkedin : "https://linkedin.com/in/" + linkedin;
                        sb.append("<a href=\"").append(u).append(
                                        "\">\n  <img src=\"https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white\" />\n</a>\n");
                }
                if (twitter != null && !twitter.isBlank()) {
                        String u = twitter.startsWith("http") ? twitter : "https://twitter.com/" + twitter;
                        sb.append("<a href=\"").append(u).append(
                                        "\">\n  <img src=\"https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white\" />\n</a>\n");
                }
                if (github != null && !github.isBlank())
                        sb.append("<a href=\"https://github.com/").append(github).append(
                                        "\">\n  <img src=\"https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white\" />\n</a>\n");
                if (email != null && !email.isBlank())
                        sb.append("<a href=\"mailto:").append(email).append(
                                        "\">\n  <img src=\"https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white\" />\n</a>\n");

                sb.append(
                                "\n### 💭 Dev Quote\n\n![Quote](https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical&border=true)\n\n");
                sb.append(
                                "<img src=\"https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif\" width=\"1000\">\n\n</div>\n\n---\n\n");

                // === FOOTER ===
                sb.append(
                                "<div align=\"center\">\n\n### ⚡ \"Code is like humor. When you have to explain it, it's bad.\" – Cory House\n\n");
                sb.append(
                                "<img src=\"https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=150&section=footer&animation=twinkling\" />\n\n");
                if (github != null && !github.isBlank()) {
                        sb.append("**⭐ From [").append(name).append("](https://github.com/").append(github)
                                        .append(")** | Built with ❤️ and ☕\n\n");
                        sb.append(
                                        "<img src=\"https://raw.githubusercontent.com/Platane/snk/output/github-contribution-grid-snake-dark.svg\" alt=\"Snake animation\" />\n\n");
                }
                sb.append("</div>\n");
                return sb.toString();
        }

        // Techstack-generator animated SVG icons for recognized skills
        private String buildTechIcons(List<String> skills) {
                StringBuilder b = new StringBuilder();
                Set<String> done = new HashSet<>();
                for (String skill : skills) {
                        String s = skill.toLowerCase();
                        for (String[] ti : TECH_ICONS) {
                                if ((s.equals(ti[0]) || s.contains(ti[0])) && done.add(ti[0]))
                                        b.append("<img src=\"").append(ti[1]).append("\" alt=\"").append(skill)
                                                        .append("\" width=\"65\" height=\"65\" />\n");
                        }
                }
                return b.toString();
        }

        // Animated GIF icons for well-known tools
        private String buildToolGifs(List<String> skills) {
                StringBuilder b = new StringBuilder();
                Set<String> done = new HashSet<>();
                for (String skill : skills) {
                        String s = skill.toLowerCase();
                        for (String[] tg : TOOL_GIFS) {
                                if (s.contains(tg[0]) && done.add(tg[0]))
                                        b.append("<img src=\"").append(tg[1]).append("\" alt=\"").append(skill)
                                                        .append("\" width=\"65\" height=\"65\" />\n");
                        }
                }
                return b.toString();
        }

        // Shield.io badge pills
        private String buildBadges(List<String> skills) {
                StringBuilder b = new StringBuilder();
                for (String skill : skills) {
                        String s = skill.trim();
                        if (s.isEmpty())
                                continue;
                        boolean found = false;
                        for (Object[] bd : BADGES) {
                                if (s.toLowerCase().contains((String) bd[0])) {
                                        String label = s.replace(" ", "%20").replace("-", "--");
                                        b.append("![").append(s).append("](https://img.shields.io/badge/")
                                                        .append(label).append("-").append(bd[1])
                                                        .append("?style=for-the-badge&logo=").append(bd[2])
                                                        .append("&logoColor=").append(bd[3]).append(")\n");
                                        found = true;
                                        break;
                                }
                        }
                        if (!found)
                                b.append("![").append(s).append("](https://img.shields.io/badge/")
                                                .append(s.replace(" ", "%20")).append("-gray?style=for-the-badge)\n");
                }
                return b.toString();
        }
}
