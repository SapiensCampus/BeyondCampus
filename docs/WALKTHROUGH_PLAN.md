# BeyondCampus presenter mock

A desktop-first mock for the Sapiens Campus core team. It is for a laptop or a projector in a team meeting. It is not a student-facing app.

Static files only. No account, no database. The sample student stays in this browser.

## What the room should understand

Ikigai here is four questions. The student drives the first two. Sapiens Campus provides the last two. Industry connect comes after, and is still closed.

1. What you love. Character, then interests.
2. What you are good at. Little tasks, then love vs good-at.
3. What you will be paid for. Career paths the campus shows.
4. What the world needs. Problems, a nameless sample story, and what is coming.

Between 2 and 3 sits a checkpoint: Profile v1, then a peer group. A path that does not fit sends the student back to interests. Paid for and world needs both leave the peer group and meet at industry connect.

## Layout

Desktop is a slide, not a phone page.

- One slim strip across the top: “Draft mock for core-team review. Questions, tasks and content are drafts.”
- A journey map pinned under the header, on every slide. Stages match the diagram and sit in groups: What you love, What you are good at, Checkpoint, Paid for, World needs, Industry connect. The current stage is highlighted. Any stage can be clicked. The map says which part the student drives and which part Sapiens Campus provides.
- The slide itself is a split. Left: a phone frame of what the student sees, already filled with the sample student. Right: narration.
- Narration is four plain pieces: a one-line “What’s happening”, “Why it matters”, “Who drives it” (Student, Sapiens Campus, Peers, or Industry), and “Output”, meaning what this step hands to the next one.
- A dock with Back, a progress count such as “4 of 11”, and Next. Left and right arrow keys do the same, unless the presenter is typing.
- On a narrow screen the narration stacks under the phone. The map scrolls sideways. The dock stays reachable.

Colour is the approved palette, used as a code for the four Ikigai steps: pink for love, yellow for good-at, blue for paid for, green for world needs. Purple marks the checkpoint. Borders and shadows stay, without covering the content.

## Slides

Eleven slides. The first and last are for the room. The nine in the middle are the journey.

| # | Id | Map group | Who drives it | Phone shows | Hands off |
| --- | --- | --- | --- | --- | --- |
| 1 | `intro` | — | Student, then Sapiens Campus | The four questions | The shared map. Names Meera once. |
| 2 | `character` | What you love | Student | Two types and work style | Types that choose the interests |
| 3 | `interests` | What you love | Student | Three tastes, shortlist kept | Two or three interests |
| 4 | `tasks` | What you are good at | Student | Taste, Try, Stretch with scores | Love and skill scores |
| 5 | `path` | What you are good at | Student | Four plain places | One confirmed path, or back to interests |
| 6 | `profile` | Checkpoint | Student | Profile v1 card | The card the peer group is built on |
| 7 | `peers` | Checkpoint | Peers | Placeholder invite | A joined group for that path |
| 8 | `paid` | Paid for | Sapiens Campus | Sample roles and ladder | A career picture, no pay figures |
| 9 | `world` | World needs | Sapiens Campus | Sample problems and a nameless story | Problems worth solving |
| 10 | `industry` | Industry connect | Industry | Coming next | Talks, hours, briefs, referrals |
| 11 | `summary` | — | All four | Meera’s path in one card | The handoffs, said once |

## Sample student

Meera is a fictional second-year student. She is not a real person. The intro says so once. A small label beside the phone says so on every slide. She is not repeated as a banner inside the phone.

Her answers make her a Thinker who also builds. She keeps Data and research, Tech, and Design. Tech is the path (loved it, and it went well). Data and research is a skill to grow. Design is useful, not a passion. The peer group, the career picture, and the world-needs picture are all for Tech.

The mock is simulated by default. Meera is already filled in. No skip button, no simulate button, no “sample fill” notice.

“Try it yourself” is one switch in the header. It makes the phone interactive: answer the scenes, keep interests, rate tasks. The narration does not change. Turning the switch off returns the phone to Meera. Answers typed in try-mode stay in this browser until the switch is turned off and the page is reloaded, and they never replace Meera’s sample.

## Draft and research labels

- The top strip is the only draft banner.
- A small Draft tag appears only on a question or a task inside the phone.
- Career and world copy still say “Sample, to be researched”.
- The people-story says it is not a real person. No name is invented.
- No salary figures.
- WhatsApp links stay the placeholders in `INVITE_LINKS` and open in a new tab.

## Files

| File | Role |
| --- | --- |
| `index.html` | Shell. Loads `content.js`, then `app.js`. |
| `content.js` | Tracks, quiz, tasks, sample career and world copy, Meera, invite placeholders, slide narration |
| `app.js` | Slide index, map, phone, narration, try-mode, keys |
| `styles.css` | Presenter layout, phone frame, map, dock |
| `docs/WALKTHROUGH_PLAN.md` | This plan |

Storage key: `beyondcampus.presenter.v1`. Older keys are left untouched.

## Acceptance

- The top strip is the only draft banner, and it is on every slide.
- Intro, a middle step, and the summary can be read without scrolling past banners to find the point.
- The map is visible on every slide, grouped under the Ikigai steps, with the current stage highlighted.
- Clicking a stage opens it. Back, Next, and the arrow keys move one slide.
- Progress reads “n of 11”.
- Meera is named as fictional in the intro and in the small phone label, and not in a box on every phone screen.
- Try it yourself lets a scene be answered, and turning it off shows Meera again.
- The path phone uses plain places, not axis jargon.
- Paid and world screens say sample, and contain no pay figures and no real person.
- The peer invite is the Tech placeholder and opens in a new tab.
- At 1440×900 the phone and the narration sit side by side.
- At a mobile width the narration sits under the phone, and Back / Next remain usable.
- No console errors during that walk.
