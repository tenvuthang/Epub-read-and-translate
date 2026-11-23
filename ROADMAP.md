# EPUB Reader & Translate — Roadmap

> Status: Proposed roadmap, not a commitment to implement every item. The Project Owner approves milestone scope before work begins.

## Product direction

Build a Windows desktop EPUB reader first, then evolve it into a reliable EPUB translation tool. Prioritize reading comfort, EPUB compatibility, translation quality, recoverability, and preserving the original book's structure and assets. Personal use comes first; keep the architecture public-ready without building online services prematurely.

## Current project baseline

- Desktop application scaffold exists and a Windows `.exe` has been produced.
- Intended stack: Tauri 2, React, TypeScript, Vite, EPUB.js.
- Git/GitHub is used for version control and backup.
- Current milestone: **0.1 — EPUB Reader MVP**. Confirm exact implemented functionality before treating any item as complete.

## Milestone map

| Milestone | Goal | Status |
|---|---|---|
| 0.0 Foundation | Project setup, app scaffold, build pipeline, version control | Started / partially complete |
| 0.1 Reader MVP | Import and open EPUB; basic navigation and reading; remember reading position | Next focus; verify implementation |
| 0.2 Reader usability | Library, reader settings, bookmarks, search and polish | Planned |
| 0.3 Translation MVP | Provider integration, chunked translation, progress, retry and resume | Planned |
| 0.4 Translation quality | Preview, context, glossary and translation profiles | Planned |
| 0.5 EPUB export | Rebuild translated EPUB, preserve resources and validate output | Planned |
| 1.0 Personal release | Stability, test coverage, packaging, documentation and release workflow | Planned |
| 1.x Advanced | Additional providers, PDF-related workflow, TTS, optional sync/backup | Backlog; only if justified |

---

## 0.0 — Foundation

### Goal
Establish a maintainable project that builds and launches reliably on Windows.

### Tasks
- [ ] Confirm project structure and starter files are committed to Git.
- [ ] Confirm dev mode launches successfully.
- [ ] Confirm production build produces an executable/package that can launch on the target Windows machine.
- [ ] Document the basic run/build commands.
- [ ] Record environment prerequisites and known Windows policy/build issues, if any.
- [ ] Keep a small, clear React/TypeScript entry structure; avoid unnecessary architecture layers.

### Acceptance criteria
- [ ] A clean checkout can be followed through documented steps to run/build (subject to prerequisites).
- [ ] The built app launches without a fatal error.
- [ ] Project files and current baseline are committed.

---
## 0.1 — EPUB Reader MVP (current focus)
### Goal
Open a real EPUB and read it comfortably enough to use as a basic desktop reader.

### Scope
- [x] Select/import an EPUB from the local filesystem. _(verified on `tauri dev`)_
- [x] Open and render book content using EPUB.js (or confirm and document an alternative if needed). _(verified on `tauri dev`)_
- [x] Navigate between chapters/sections using the book's navigation data where available. _(verified on `tauri dev`; NCX not tested)_
- [ ] Display basic book information (title/author/cover where available). _(currently filename only)_
- [ ] Provide basic reading controls: previous/next section and/or page navigation supported by the chosen rendering mode. _(scrolled mode + TOC only; no prev/next UI buttons)_
- [ ] Provide a readable default layout and a basic font-size control. _(readable layout done; no font-size control)_
- [x] Save the last reading position locally and restore it when the same book is reopened. _(verified on `tauri dev`; pending verification on new `.exe`/NSIS build)_
- [x] Handle invalid, unsupported, or damaged EPUB files with a user-visible error instead of crashing. _(verified on `tauri dev`)_
- [ ] Test with a small compatibility set: EPUB 2, EPUB 3, image-heavy book, long chapter, unusual layout/encoding.

### Explicit non-goals
- Translation or AI/API integration.
- PDF import/conversion.
- Cloud accounts, sync, social features, or online library.
- Advanced annotations, highlights, or glossary features unless required to fix a core reader problem.

### Acceptance criteria
- [ ] Import/open at least three representative EPUB test files.
- [ ] Contents render and chapter navigation works for the test set.
- [ ] Images and essential formatting are not needlessly stripped.
- [ ] Reading position is restored after closing and reopening the app/book.
- [ ] A broken/unreadable file produces a clear error state.
- [ ] No known blocking issue prevents a normal reading session.

### Exit review
Review actual behavior, known EPUB compatibility gaps, and architecture before moving to 0.2. Do not add new feature scope during acceptance testing unless it blocks the MVP.

---
## 0.2 — Reader usability
### Goal
Make the reader practical for repeated, long-term use.

### Tasks (prioritized)
- [ ] Library list/grid for imported books.
- [ ] Persist library entries and file locations; handle moved/missing files gracefully.
- [ ] Book cover and metadata display where present.
- [ ] Reading preferences: font family (if feasible), font size, line spacing, margins, theme/background.
- [ ] Save preferences globally and optionally per book.
- [ ] Bookmarks.
- [ ] Search within a book.
- [ ] Basic reading progress indicator.
- [ ] Improve empty, loading, error, and file-missing states.

### Acceptance criteria
- [ ] User can manage and reopen a small library without re-importing every time.
- [ ] Preferences persist across restarts.
- [ ] Bookmark and in-book search work on representative EPUBs.
- [ ] Core reader remains responsive and does not lose reading position.

### Optional / defer
- Highlights and notes.
- Multiple reading profiles.
- Elaborate library sorting, tagging, or collection management.

---
## 0.3 — Translation MVP
### Goal
Translate an EPUB into a chosen target language with visible progress and recovery from common failures.

### Architecture principles
- Keep translation orchestration separate from UI and EPUB rendering.
- Define a provider interface so Gemini is the first provider but additional providers can be added later without rewriting the translation workflow.
- Never expose API secrets in source code, frontend bundles, logs, or Git.
- Treat EPUB content as structured content: translate text while retaining XHTML/HTML structure, inline markup, CSS, images, fonts, metadata and package relationships as appropriate. Do not flatten the book into plain text and discard the source structure.

### Tasks
- [ ] Define translation settings: source language (auto-detect where suitable), target language, selected provider/model.
- [ ] Implement Gemini API provider behind a provider interface.
- [ ] Establish safe extraction of translatable text from EPUB content while preserving markup and non-text resources.
- [ ] Chunk text to fit model limits, with a consistent strategy for boundaries and context.
- [ ] Track per-book, per-chapter, and per-chunk status.
- [ ] Show overall progress and current chapter; show ETA only if the estimate is meaningful and explain it may fluctuate.
- [ ] Retry transient failures with bounded retry/backoff.
- [ ] Persist translation progress and completed chunks so work can resume after interruption.
- [ ] Provide cancel/pause behavior if it can be implemented reliably.
- [ ] Store provider/model settings and secrets safely using an appropriate local secure-storage approach; investigate before selecting implementation.
- [ ] Add basic translation error reporting without leaking sensitive content or credentials.

### Acceptance criteria
- [ ] A representative book can be translated from beginning to end into the chosen target language.
- [ ] Translation output is mapped back to the correct original content locations.
- [ ] Failures are surfaced clearly; retry does not duplicate or corrupt completed work.
- [ ] App restart can recover a translation job at least from persisted completed work.
- [ ] API keys are not committed or bundled into frontend code.
- [ ] Basic cost/usage visibility is provided where data is available; avoid fabricated estimates.

### Non-goals
- Multiple providers simultaneously.
- Automatic style training or sophisticated book analysis.
- Perfect literary translation in the first release.

---
## 0.4 — Translation quality and personalization
### Goal
Improve consistency and user control over translation output after the basic pipeline is reliable.

### Tasks
- [ ] Preview translation of a small sample (e.g., selected pages/sections) before full-book translation.
- [ ] Allow user to review/edit preview instructions and retry samples.
- [ ] Translation style presets (e.g., faithful, natural, literary) with clearly defined behavior.
- [ ] Per-book or per-series glossary for names, places, terms and preferred translations.
- [ ] Provide context to translation chunks (chapter context, nearby text, glossary) without exceeding limits.
- [ ] Preserve user-approved glossary entries and translation preferences.
- [ ] Consider translation memory for previously translated segments only after storage and matching rules are designed.

### Acceptance criteria
- [ ] Preview settings are applied consistently to the full translation job.
- [ ] Glossary terms remain consistent in a test book/series.
- [ ] User can change the translation profile for a book without affecting unrelated books.
- [ ] Quality features have measurable test examples and do not destabilize translation recovery.

### Deferred
- Automatic character/relationship knowledge graph.
- Large-scale automatic style extraction.
- Cross-book semantic memory unless user opts in and scope is clear.

---
## 0.5 — EPUB reconstruction and export
### Goal
Produce a valid translated EPUB that remains readable in this app and external readers.

### Tasks
- [ ] Preserve original container/package structure where possible.
- [ ] Replace translated text in the appropriate XHTML/HTML documents.
- [ ] Preserve images, fonts, stylesheets, metadata, navigation, and other non-translated resources.
- [ ] Update package/nav content only as required by translation and validation.
- [ ] Export to a user-selected location without overwriting the source by default.
- [ ] Validate output archive and required EPUB structure.
- [ ] Reopen exported EPUB in the app and test representative external reader(s).

### Acceptance criteria
- [ ] Exported file is a valid EPUB and opens in this app.
- [ ] At least one external reader can open the test export.
- [ ] Chapter order, images, essential styles and navigation are retained for test cases.
- [ ] Source file remains untouched unless user explicitly chooses otherwise.

---
## 1.0 — Personal release
### Goal
Make the app dependable enough for everyday personal use and prepare a clean public release if desired.

### Tasks
- [ ] Test import, read, persistence, translate, resume, and export end-to-end.
- [ ] Fix priority bugs and document known limitations.
- [ ] Remove development-only UI, debug logs and unused dependencies.
- [ ] Review dependency licenses and attribution obligations.
- [ ] Review API key and local-data handling.
- [ ] Document install, use, configuration, troubleshooting and backup of local library/job data.
- [ ] Establish versioning and release notes.
- [ ] Test packaged app on a clean Windows environment if practical.
- [ ] Tag a release and retain the source revision corresponding to the release binary.

### Release definition
A version is considered 1.0 only when core workflows are stable, known limitations are documented, and the app can be installed/run without development tooling.

---
## 1.x — Advanced backlog (not committed)
Only promote an item into an active milestone when there is a concrete user need and a clear scope.

- [ ] Additional AI providers (after provider interface and Gemini flow are proven).
- [ ] Model selection and provider comparison.
- [ ] Cost/usage tracking and budgeting controls.
- [ ] Dual reading (original and translated content side-by-side or synchronized).
- [ ] Text-to-speech.
- [ ] PDF workflow (evaluate quality and legal/technical constraints before implementation).
- [ ] Optional library/job backup or sync; avoid server infrastructure until there is a demonstrated need.
- [ ] More advanced glossary/translation memory tools.
- [ ] Optional community-facing distribution and contribution workflow.

## Working rules for roadmap execution
1. Work on one milestone at a time; avoid parallel feature branches of scope unless necessary.
2. Before a milestone begins, agree on its scope and break it into small tasks.
3. Antigravity implements only the task described in the approved prompt; it must not silently add unrelated features or architecture.
4. Review the code diff and test the actual app after implementation.
5. Update `PROJECT_STATE.md` with what is actually done, what is broken, decisions, and the next task.
6. Update `DECISIONS.md` when a decision is confirmed; roadmap items are not decisions by themselves.
7. Mark items complete only after acceptance criteria are verified, not merely because code was generated.
8. Prefer simple, maintainable solutions. Add abstractions only when a current requirement justifies them or a near-term requirement clearly needs them.

## Next action
Verify the newly built production `.exe` and NSIS installer (`EPUB Reader_0.1.0_x64-setup.exe`) on Windows, then complete the Milestone 0.1 exit review before moving to 0.2 or translation work.
