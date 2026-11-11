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
