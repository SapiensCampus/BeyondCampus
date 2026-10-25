# BeyondCampus walkthrough plan

Closed-group draft of the Sapiens Campus Ikigai journey. Static site only. No account, no database. Progress stays in this browser.

This draft shows the whole path from the roadmap source and the “journey at a glance” diagram. It is a clickable preview, not finished research.

## What the visitor should feel

A student can start from who they are, name what pulls them, try it, and see whether they love it and are good at it. If it fits, they reach a Profile v1 card and a peer-group invite. Sapiens Campus then shows what that path can pay and what the world needs. Industry connect is marked coming next.

A tester who does not want to answer everything can skip a step, simulate that step, or load one fictional student and jump to any stage.

## Screens

| Screen id | Journey node | What it shows |
| --- | --- | --- |
| `landing` | Start | Promise, the journey at a glance, start, simulate full journey, jump list |
| `character` | Character · Who you are | 10 scenario questions plus 2 work-style questions, then the top two of 6 types |
| `interests` | Interests · What pulls you | 3 suggested tracks, a short taste, excitement, a “what do you already do for fun” note, shortlist of 2 or 3 |
| `tasks` | Little tasks · Try it for real | Taste, Try, and Stretch for each shortlisted track, with love and good-at ratings |
| `path` | Confirmed path | Love vs good-at 2×2. Yes continues. “Not a fit, try next” returns to interests |
| `profile` | Checkpoint | Profile v1 card: character, path, tasks, strengths, work style |
| `peers` | Peer group | Interest-channel invite. Links stay placeholders |
| `paid` | Paid for | Sample career map for the confirmed track. No salary figures |
| `world` | World needs | Sample challenges, a nameless sample story, future needs, problem of the month |
| `industry` | Industry connect | Coming-next teaser: talks, office hours, live briefs, referrals |
| `overview` | Step jumper | Same stages, each opens directly without wiping progress |

The stepper on every screen after landing mirrors the diagram order:

Character → Interests → Little tasks → Confirmed path → Profile → Peer group → Paid for → World needs → Industry connect

Paid for and World needs are sequential in the preview so a phone can show both. Copy on both screens says they branch from the peer group and meet again at industry connect.

## Flow

1. Landing. Start the journey, or Simulate full journey.
2. Character quiz. One question per screen. Result names the top two types and solo/team plus structure/freedom. Those styles do not change the interest. They show up on tasks and the profile.
3. Interests. Tracks come from the top two character types. The student reacts, notes what they already do for fun, and keeps 2 or 3.
4. Little tasks. Each kept interest has Taste (about 15 minutes), Try (about 1 hour), and Stretch (a weekend). After each, the student marks love and good-at from 1 to 5.
5. Confirmed path. Scores land in one of four quadrants: Your path, Grow this skill, Useful skill not passion, Drop it. The strongest “your path” interest is the confirmed path. If none land there, “Not a fit, try next” goes back to interests.
6. Profile v1, then the peer-group invite for that interest.
7. Step 3 and Step 4 content for that interest, labelled sample.
8. Industry connect, coming next.

Restart clears this browser’s saved journey.

## Data and files

| File | Role |
| --- | --- |
| `index.html` | Shell. Loads `content.js` then `app.js` |
| `content.js` | Tracks, character types, quiz, tasks, sample career and world copy, fictional persona, invite placeholders |
| `app.js` | State, scoring, screens, skip, simulate, stepper |
| `styles.css` | Existing multi-colour palette plus draft banner, stepper, matrix, cards |
| `docs/WALKTHROUGH_PLAN.md` | This plan |

Invite placeholders live in `INVITE_LINKS` at the top of `content.js`, with a TODO to replace them. They are dummy `https://chat.whatsapp.com/beyondcampus-…` links and open in a new tab.

Interest tracks: Tech, Data & research, Design, Content & media, Community, Entrepreneurship, Organising. Character types map onto them:

| Type | Leans towards |
| --- | --- |
| Builder | Tech, Data & research, Organising |
| Thinker | Data & research, Tech, Design |
| Creator | Design, Content & media, Community |
| Helper | Community, Content & media, Organising |
| Leader | Entrepreneurship, Community, Tech |
| Organiser | Organising, Entrepreneurship, Data & research |

The top two types contribute their tracks. The screen shows the first three unique suggestions.

Storage key: `beyondcampus.journey.v1`. The older Discover key is left untouched.

## Skip and simulate

On every step screen:

- **Skip to next step.** Moves forward. If that step has no answers yet, it keeps a clearly marked sample so the next screen can render.
- **Simulate.** Fills that step with the fictional student’s answers or ratings and shows the result of that step.
- **Stepper and Journey map.** Jump to any stage. Progress already saved stays saved.
- **Simulate full journey.** Loads Meera, a fictional second-year student, through every stage, and opens the confirmed-path screen. Later stages are filled and can be opened from the stepper.
- **Restart.** Clears `beyondcampus.journey.v1` and returns to the landing screen.

Meera is labelled fictional everywhere she appears. She is not a real person.

## Draft labelling

- A persistent banner on every screen: “Draft preview, for closed-group testing. Questions, tasks and content are drafts.”
- A small Draft tag on each question, task, career block, and world-needs block.
- Career and world copy says “Sample, to be researched”. No salary numbers. No named real people. People-stories say they are not a real person.

## Wording and visual

Keep the current cream, paper, yellow, green, pink, lilac, and sky palette, thick ink borders, and offset shadows. Use the name Sapiens Campus. Do not use CodeSapiens.

Landing and section lines borrow the campus voice: a place to become, find what makes you you, no grades, curious looks good on you, by the students for the students.

## Acceptance checklist

- Banner is visible on landing, character, interests, tasks, path, profile, peers, paid, world, industry, and the journey map.
- Draft tags show on a question, a task, a career block, and a world-needs block.
- Character quiz can be answered to a result, or simulated.
- Interests can be shortlisted, or simulated.
- Taste, Try, and Stretch accept love and good-at scores.
- The 2×2 places a loved and strong interest in “Your path”.
- “Not a fit, try next” returns to interests.
- Profile v1 shows character, path, and task signal.
- Peer invite uses the placeholder for that track and opens in a new tab.
- Paid and world screens show sample labels and no salary figures or real people.
- Industry connect says coming next.
- Skip works on each step.
- Simulate full journey fills Meera and opens the path.
- Stepper opens each stage.
- Restart clears the journey.
- No console errors during those walks.
- Mobile width 390px does not trap the main actions off screen.
