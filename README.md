# Study Fun

Short study activities: quizzes, drills and practice pages.

- `beren/`: activities for B.
- `mina/`: activities for M.

Content is general study material only. No personal details, school names or class materials.

## Every quiz ends with a "Send Dad my score" button

When the quiz is finished, show a big button that opens Messages with the score typed in. The girl picks Dad herself, so the page holds no phone number, and nothing is tracked or sent anywhere else. No analytics or third-party scripts.

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
