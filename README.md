# Study Fun

Short study activities: quizzes, drills and practice pages.

- `beren/`: activities for B.
- `mina/`: activities for M.

Content is general study material only. No personal details, school names or class materials.

## Every quiz ends with a "Send Dad my score" button

When the quiz is finished, show a big button that opens Messages with the score typed in. The girl picks Dad herself, so the page holds no phone number. Keep this button even with the usage log below.

```js
// iOS/iPadOS wants sms:&body=, everything else sms:?&body=
function smsHref(text){const t=encodeURIComponent(text);const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);return ios?`sms:&body=${t}`:`sms:?&body=${t}`}
// at the end of the quiz:
document.getElementById('sendScore').href = smsHref(`Mina here! I got ${score}/${total} stars on <Quiz name> 🎉`);
```

```html
<a class="send" id="sendScore" href="#">Send Dad my score</a>
```

Style the button to match the page. Mina's pages: playful, big tap target. Beren's pages: clean and low-key.

## Every page includes the usage log

`assets/log.js` sends one tiny message to Dad's own Google Sheet ("Study pages log", through an Apps Script web app) when a page is opened and when its quiz is finished. It sends only `kid`, `page`, `event` (`open`/`finish`), `score` and `total`. `kid` and `page` come from the URL path (for example `beren/2026-11-11.html` gives `beren`, `2026-11-11`). No cookies, no IDs, no third-party analytics.

```html
<!-- before the page's own script; use ../assets/log.js for pages one folder deep -->
<script src="../../assets/log.js"></script>
```

```js
// where the quiz finishes, next to the "Send Dad my score" code:
if(window.studyLog)studyLog('finish', score, total);
```

The open event is sent automatically on load.

## Friend links (`?who=`)

Friends can use any page with their own link, so their scores don't mix into the girls' numbers:

```
https://mehmetdurkan.github.io/study-fun/mina/<page>/?who=FIRSTNAME
```

- `log.js` logs that visit as kid `friend-firstname` (first name only, letters and hyphen, max 20, lowercased; anything else is ignored and the page logs as usual).
- The page shows a small "Hi Firstname! 👋" badge, the score button reads "Send my score", and its text starts "Firstname here!" instead of "Mina here!" / "Beren here.". This works on existing pages with no page changes, as long as the score text starts with "Mina here" / "Beren here".
- The name is saved on that device (localStorage, per folder), so later plain links there still log as the friend. A new `?who=` replaces it.
- To clear it (for example if a friend's link was opened on Mina's iPad): open any page with `?who=reset` (or `?who=mina` / `?who=beren`). That clears both folders and logs no row for that visit.
- The "Study pages log" web app accepts kid values matching `^friend-[a-z-]{1,20}$` (since Nov 17, deployment version 2, same URL). Names with letters outside a-z (e.g. accents) are rejected there, so use a plain a-z spelling in `?who=`.
- Plain links on a device with no saved name behave exactly as before. Pages need no changes; keep building them the same way. `window.studyWho` is `{name, kid}` for a friend visit, otherwise `null`, if a page wants to say the friend's name itself.
- Never put full names or contact details in a link.
