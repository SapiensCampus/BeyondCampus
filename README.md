# BeyondCampus

A presenter mock of the Sapiens Campus Ikigai journey, for the core team. It is meant for a laptop or a projector. It is not a student-facing app.

The room moves through slides. A phone on the left shows what a student would see. Notes on the right say what is happening, why the step exists, who drives it, and what it hands to the next step. A journey map stays on screen. Arrow keys and Back / Next move between slides.

Meera, a fictional student, is filled in already. Try it yourself makes the phone interactive. Nothing is uploaded.

Files: `index.html`, `content.js`, `app.js`, and `styles.css`. No build. The plan is `docs/WALKTHROUGH_PLAN.md`.

Slide position stays in this browser under `localStorage` key `beyondcampus.presenter.v1`.

WhatsApp invites are placeholders in `INVITE_LINKS` at the top of `content.js`. Career paths and world needs are labelled sample. Industry connect says coming next.

Vercel’s GitHub integration deploys this folder. Pushes to `main` go to production. No build command.
