# ⌨️ TypeLogic | Minimalist Typing Speed Test

A high-performance, responsive typing application, designed with a focus on typography, fluid animations, and zero-latency input tracking.

![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-Vanilla_JS_/_CSS3-yellow?style=flat-square)

## 🚀 [View Live Demo](https://github.com/padou-dev/minimal-typing-test)

---

## ✨ Key Features

* **10,000+ Word Lexicon:** Powered by a massive JSON dictionary of common English words.
* **Persistent Theming:** Choose between **Carbon**, **Cyberpunk**, or **Paper**. Your choice is saved to `localStorage` and persists even after refreshing.
* **Standardized WPM Calculation:** Uses the industry-standard formula: `(Characters / 5) / (Time in Minutes)`.
* **Adaptive Word Wrapping:** Custom "Word Container" logic ensures that words never break mid-character at the end of a line.
* **Dynamic Test Lengths:** Instantly switch between 25, 50, or 100-word sprints.
* **Results Dashboard:** Real-time feedback and a post-test modal showing final speed and accuracy.

## 🛠️ Technical Architecture

### 1. The "Invisible Shield" Input Strategy
To ensure a seamless experience on both Desktop and Mobile, the app uses an invisible `textarea` that captures keystrokes while allowing the user to view the beautifully formatted `#quote-display`. We use `pointer-events: none` to ensure the invisible input never blocks the UI buttons.

### 2. CSS Variable Engine
Theming is handled via a root-level CSS variable system. Instead of manually re-painting the DOM with JavaScript, we simply toggle the `data-theme` attribute on the `<html>` element, triggering a global color swap via CSS.

### 3. DOM Manipulation Optimization
Words are rendered as individual `div.word` blocks containing multiple `span` characters. This prevents "line-jumping" bugs and allows for precise caret (cursor) positioning using relative CSS offsets.

## 📂 Project Structure

```text
├── index.html      # Semantic structure & Modal UI
├── style.css       # CSS Variables, Caret Animations, Flexbox Logic
├── script.js      # Core Engine (Async Fetch, WPM Logic, Theme Engine)
├── words.json      # Dictionary Data (10,000 words)
└── LICENSE         # MIT Open Source License
