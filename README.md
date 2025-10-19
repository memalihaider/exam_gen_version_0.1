# exam_gen_version_0.1

Short description
-----------------
Exam Generator (exam_gen_version_0.1) is a lightweight tool to generate exam papers, quizzes, and answer keys from question banks and templates. It's intended for teachers, tutors, and course creators who want to automate building varied exam papers from an existing dataset of questions.

Features
--------
- Create randomized exam papers from question banks
- Support for multiple question types (MCQ, short answer, essay)
- Export to PDF and/or printable HTML
- Configurable templates (header/footer, marks, time limits)
- Generate answer keys and metadata (difficulty, topic)
- Command-line interface for batch generation
- Simple plugin-friendly architecture for adding custom export formats or question transforms

Tech stack
----------
- Language: (fill-in) — e.g., Python / Node.js / Dart / Flutter — update to actual used stack
- Template engine: (fill-in) — e.g., Jinja2 / Handlebars
- PDF export: (fill-in) — e.g., wkhtmltopdf / WeasyPrint / Puppeteer
- CLI: standard OS shell (PowerShell, bash)

If your repository uses a specific stack, replace the placeholders above with the real technologies.

Getting started (quickstart)
----------------------------
Prerequisites
- Git (>= 2.20)
- Runtime: Node.js (>= 18) or Python (>= 3.8) — whichever your project uses
- For PDF export: wkhtmltopdf or headless Chromium (if required by your exporter)
- (Optional) Virtual environment / nvm / nodenv for isolating dependencies

Clone the repo (PowerShell)
```
git clone https://github.com/memalihaider/exam_gen_version_0.1.git
cd exam_gen_version_0.1
```

Install dependencies (examples — replace with your project's commands)

Node.js:
```
npm install
# or
yarn install
```

Python:
```
python -m venv .venv
.venv\Scripts\Activate        # PowerShell/Windows
# or
source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
```

Run (examples)
```
# CLI usage - example
# Node
node cli.js generate --config config/exam_config.yml

# Python
python -m exam_gen.cli generate --config config/exam_config.yml
```

Replace commands above with the actual entrypoint in your project (e.g., `npm run start`, `python main.py`, `dart run`, etc.).

Configuration
-------------
The generator uses a configuration file and a question bank:

- config/exam_config.yml (example)
  - title: "Midterm - Biology"
  - num_questions: 10
  - sections:
    - name: "Multiple Choice"
      count: 6
      marks_each: 1
    - name: "Short Answer"
      count: 3
      marks_each: 4
    - name: "Essay"
      count: 1
      marks_each: 10
  - random_seed: 42
  - output:
    - format: pdf
    - filename: "midterm_bio_2025-10-19.pdf"

- data/questions.json (or questions.yml / CSV)
  - Each question entry should include:
    - id
    - type (mcq | short | essay)
    - text
    - choices (for mcq)
    - answer
    - topic
    - difficulty

Example question in JSON:
```json
{
  "id": "q001",
  "type": "mcq",
  "text": "Which process produces the most ATP in eukaryotic cells?",
  "choices": ["Glycolysis", "Citric Acid Cycle", "Oxidative phosphorylation", "Fermentation"],
  "answer": 2,
  "topic": "Cellular respiration",
  "difficulty": "medium"
}
```

Templates
---------
- Templates live in `templates/` and support placeholders for:
  - exam title, date, instructions, questions, marks
- Use your template engine's syntax (Jinja2/Handlebars/etc.) to create/modify templates.

File structure (suggested)
--------------------------
- README.md
- LICENSE
- config/
  - exam_config.yml
- data/
  - questions.json
- templates/
  - exam_template.html
- src/ or app/
  - core generator code
- cli.js or exam_gen/cli.py
- exports/
  - pdf_exporter.js or exporter.py
- .gitignore

Common commands
---------------
- Show status
```
git status
```
- Create and switch to main (if needed)
```
git checkout -b main
```
- Commit changes
```
git add .
git commit -m "describe changes"
```
- Push to origin main
```
git remote add origin https://github.com/memalihaider/exam_gen_version_0.1.git
git push -u origin main
```

Troubleshooting
---------------
Detached HEAD or strange parent files appearing
- Symptom: `HEAD detached at <sha>`; `git status` shows files from your user profile or parent folders (e.g., AppData, Documents)
- Cause: a `.git` folder was accidentally created in a parent directory (e.g., your user home), so Git considers that parent directory the repository root.
- Fix:
  - Run:
    ```
    git rev-parse --show-toplevel
    ```
    If output is your home directory or a folder above the project, remove the unintended `.git` there (only if you are sure):
    ```
    Remove-Item -LiteralPath C:\Users\<YourUser>\.git -Recurse -Force
    ```
    or use File Explorer to delete the .git folder.
  - Then reinitialize git inside the project:
    ```
    cd path\to\exam_gen_version_0.1
    git init
    git add .
    git commit -m "initial commit"
    git remote add origin https://github.com/memalihaider/exam_gen_version_0.1.git
    git push -u origin main
    ```
- If `error: remote origin already exists.` then remove and re-add:
```
git remote remove origin
git remote add origin https://github.com/memalihaider/exam_gen_version_0.1.git
```

README issues from session logs
- If `git add README.md` returns `pathspec 'README.md' did not match any files`, create the file first (see Quickstart above).
- If you see permission warnings about Windows profile directories when committing, that typically means the repo root is set to a parent folder.

Security / Privacy
------------------
- Do NOT commit credentials, .env files, API keys, or SSH private keys.
- Add a .gitignore that excludes OS, IDE, and private files. Example entries:
```
# OS
Thumbs.db
.DS_Store

# Windows profile junk that can appear
AppData/
Application Data/
Local Settings/

# Node/Python
node_modules/
.env
.venv/
*.pyc
```

Testing
-------
- If you have tests, run them with:
```
# Node
npm test

# Python (pytest)
pytest
```
Include unit tests for:
- Question parsing
- Template rendering
- Randomization consistency (seeded)
- PDF/HTML export

Contributing
------------
Contributions, issues and feature requests are welcome.
- Fork the repo
- Create a branch: `git checkout -b feature/my-feature`
- Commit your changes: `git commit -m "Add my feature"`
- Push to the branch and open a PR

Code style
- Follow whatever linter/formatter your project uses (e.g., Prettier, ESLint, Black, Flake8). Add the configuration files to the repo.

License
-------
- Add your chosen license file (e.g., MIT). Example:
```
MIT License
Copyright (c) 2025 Your Name
...
```

Contact
-------
- Author: memalihaider
- GitHub: https://github.com/memalihaider
- Email: (add your contact email)

Appendix — Example usage scenarios
---------------------------------
1. Generate a single exam for printing:
```
exam-gen generate --config config/exam_config.yml --seed 1234 --output out/exam1.pdf
```
2. Batch generate 10 variants (seeded):
```
exam-gen batch --config config/exam_config.yml --variants 10 --outdir out/
```

Final notes
-----------
- Replace placeholder sections (tech stack, commands, entrypoints) with details specific to this repository.
- If you want, paste the contents of your `package.json`, `requirements.txt`, or `pyproject.toml` and I will update the README commands to match your project exactly.
