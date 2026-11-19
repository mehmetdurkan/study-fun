// "What should tomorrow be?" pop-up. Load it AFTER assets/log.js.
//   Mina pages: assets/more.js loads it; the pop-up comes ~1.5 s after the "Want more?" card shows.
//   Other pages (Beren's Night notes): <script src="../assets/wish.js"></script>; it comes ~2.5 s after studyLog('finish').
// Once per day per device. A button tap logs one open row <page>#wish-<key>.
// The optional typed idea logs one "idea" row (text in Sheet column G): letters, numbers and . , ! ? ' - only,
// 2-80 characters, no links, emails or phone-like numbers (the log script checks the same rules).
// Works with ?who= friends: rows log under the friend's name (log.js).
(function(){
  if(!window.studyLog || window.__wishLoaded) return;
  window.__wishLoaded = true;
  var parts = location.pathname.split('/');
  var kid = window.__wishKid || (parts.indexOf('beren') >= 0 ? 'beren' : 'mina');  // __wishKid: demo/wish.html only
  var OPTS = {
    mina:  [['game','🎮','A game'],['puzzle','🧩','Harder puzzles'],['story','📖','A story'],['experiment','🔬','An experiment'],['surprise','🎁','Surprise me!']],
    beren: [['practice','📝','Practice test'],['flash','🃏','Flashcards'],['game','🎮','A quick game'],['explain','💡','Explain it simply'],['surprise','🎁','Surprise me']]
  }[kid];
  var KEY = 'studyWishDay';
  function today(){ try{ return new Date().toLocaleDateString('en-CA',{timeZone:'America/Chicago'}); }catch(e){ return new Date().toISOString().slice(0,10); } }
  function store(fn){ try{ return fn(window.localStorage); }catch(e){ return null; } }
  function askedToday(){ return store(function(s){ return s.getItem(KEY); }) === today(); }
  function markAsked(){ store(function(s){ s.setItem(KEY, today()); }); }
  function okIdea(t){
    if(t.length < 2 || t.length > 80) return false;
    var re; try{ re = new RegExp("^[\\p{L}\\p{N}][\\p{L}\\p{N} .,!?'\\-]*$", 'u'); }catch(e){ re = /^[A-Za-z0-9][A-Za-z0-9 .,!?'\-]*$/; }
    if(!re.test(t)) return false;
    return !(/\d{5,}/.test(t.replace(/[ .\-]/g,'')) || /https?|www/i.test(t));
  }

  var CSS = '.sw-scrim{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.45);opacity:0;transition:opacity .25s}' +
    '.sw-scrim.on{opacity:1}' +
    '.sw-sheet{position:fixed;left:0;right:0;bottom:0;z-index:9999;margin:0 auto;max-width:560px;max-height:92vh;overflow:auto;' +
      'background:#fff;color:#2b2233;font:16px/1.45 Nunito,system-ui,-apple-system,sans-serif;border-radius:24px 24px 0 0;' +
      'padding:18px 16px max(18px,env(safe-area-inset-bottom,0px));transform:translateY(105%);' +
      'transition:transform .35s cubic-bezier(.2,.8,.2,1);box-shadow:0 -10px 30px rgba(0,0,0,.2)}' +
    '.sw-sheet.on{transform:none}' +
    '.sw-grab{width:44px;height:5px;border-radius:9px;background:#e6dccb;margin:0 auto 12px}' +
    '.sw-h{font:700 24px/1.2 Fredoka,Nunito,system-ui,sans-serif;margin:0 0 4px;text-align:center}' +
    '.sw-sub{margin:0 0 14px;text-align:center;color:#776c80}' +
    '.sw-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '.sw-opt{font:inherit;font-weight:800;color:inherit;background:transparent;border:2px solid #efe3cc;border-radius:18px;padding:10px 8px;' +
      'min-height:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer}' +
    '.sw-opt:last-child{grid-column:1/-1;min-height:54px;flex-direction:row}' +
    '.sw-opt .sw-e{font-size:28px;line-height:1}' +
    '.sw-opt[aria-pressed=true]{border-color:#7b4dff;background:rgba(123,77,255,.12)}' +
    '.sw-opt:disabled{cursor:default}' +
    '.sw-idea{display:flex;gap:8px;margin-top:14px}' +
    '.sw-in{flex:1;min-width:0;font:inherit;font-size:16px;color:inherit;background:transparent;border:2px solid #efe3cc;border-radius:14px;padding:10px 12px;min-height:50px}' +
    '.sw-send{font:inherit;font-weight:800;border:0;border-radius:14px;padding:0 16px;min-height:50px;color:#fff;background:linear-gradient(135deg,#ff7a3d,#7b4dff);cursor:pointer}' +
    '.sw-msg{min-height:22px;margin:8px 0 0;text-align:center;font-weight:800}' +
    '.sw-note{margin:6px 0 0;font-size:13px;color:#776c80;text-align:center}' +
    '.sw-later{display:block;margin:6px auto 0;font:inherit;font-weight:800;color:#776c80;background:none;border:0;min-height:44px;padding:0 16px;cursor:pointer}' +
    '.sw-sheet button:focus-visible,.sw-in:focus-visible{outline:3px solid #7b4dff;outline-offset:2px}' +
    '@media (prefers-color-scheme:dark){.sw-sheet{background:#2a2232;color:#f6eefc}.sw-grab,.sw-opt,.sw-in{border-color:#3d3347}' +
      '.sw-sub,.sw-note,.sw-later{color:#bdb0c9}.sw-opt[aria-pressed=true]{border-color:#a68bff;background:rgba(166,139,255,.16)}}' +
    '@media (prefers-reduced-motion:reduce){.sw-scrim,.sw-sheet{transition:none}}';

  function el(tag, cls, text){ var e = document.createElement(tag); if(cls) e.className = cls; if(text != null) e.textContent = text; return e; }

  var opened = false;
  function open(){
    if(opened || askedToday()) return;
    opened = true; markAsked();
    var st = el('style'); st.textContent = CSS; document.head.appendChild(st);
    var scrim = el('div', 'sw-scrim'), sheet = el('div', 'sw-sheet');
    sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-labelledby', 'swTitle');
    sheet.appendChild(el('div', 'sw-grab'));
    var h = el('h2', 'sw-h', 'What should tomorrow be? 🌟'); h.id = 'swTitle'; sheet.appendChild(h);
    var sub = el('p', 'sw-sub', kid === 'beren' ? "Pick one for tomorrow's Night note, or type your own idea." : "Pick one, or type your own idea. I'll make it for you!");
    sheet.appendChild(sub);
    var grid = el('div', 'sw-grid'), picked = false;
    var btns = OPTS.map(function(o){
      var b = el('button', 'sw-opt'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('span', 'sw-e', o[1])); b.appendChild(document.createTextNode(o[2]));
      b.onclick = function(){
        if(picked) return; picked = true;
        try{ studyLog('wish_' + o[0]); }catch(e){}
        btns.forEach(function(z){ z.disabled = true; z.setAttribute('aria-pressed', z === b ? 'true' : 'false'); });
        msg.textContent = 'Got it! 🎉 Watch for it tomorrow.';
        later.textContent = 'Done';
      };
      grid.appendChild(b); return b;
    });
    sheet.appendChild(grid);
    var row = el('div', 'sw-idea');
    var inp = el('input', 'sw-in'); inp.type = 'text'; inp.maxLength = 80; inp.autocomplete = 'off';
    inp.placeholder = 'My own idea…'; inp.setAttribute('aria-label', 'Type your own idea for tomorrow');
    var send = el('button', 'sw-send', 'Send'); send.type = 'button';
    row.appendChild(inp); row.appendChild(send); sheet.appendChild(row);
    sheet.appendChild(el('p', 'sw-note', 'Just the idea. No names or phone numbers, please.'));
    var msg = el('p', 'sw-msg'); msg.setAttribute('aria-live', 'polite'); sheet.appendChild(msg);
    var later = el('button', 'sw-later', 'Not now'); later.type = 'button'; sheet.appendChild(later);
    var sent = 0;
    function submit(){
      var t = inp.value.replace(/\s+/g, ' ').trim();
      if(!t) return;
      if(!okIdea(t)){ msg.textContent = 'Use just letters and numbers, please 🙂'; return; }
      if(sent >= 3){ msg.textContent = 'Thanks! That is plenty of ideas for today 😄'; return; }
      sent++;
      try{ studyLog('idea', t); }catch(e){}
      inp.value = ''; msg.textContent = 'Idea sent! 💡 Thank you!'; later.textContent = 'Done';
    }
    send.onclick = submit;
    inp.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); submit(); } });
    function close(){ scrim.classList.remove('on'); sheet.classList.remove('on'); document.removeEventListener('keydown', esc);
      setTimeout(function(){ scrim.remove(); sheet.remove(); }, 400); }
    function esc(e){ if(e.key === 'Escape') close(); }
    later.onclick = close; scrim.onclick = close; document.addEventListener('keydown', esc);
    document.body.appendChild(scrim); document.body.appendChild(sheet);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ scrim.classList.add('on'); sheet.classList.add('on'); }); });
    setTimeout(function(){ try{ btns[0].focus({preventScroll:true}); }catch(e){} }, 380);
  }

  // Mina pages (more.js): open after the "Want more?" card appears. Other pages: after the finish.
  var withMore = !!document.querySelector('script[src*="more.js"]');
  if(withMore){
    var mo = new MutationObserver(function(){ if(document.getElementById('moreCard')){ mo.disconnect(); setTimeout(open, 1500); } });
    mo.observe(document.body || document.documentElement, {childList:true, subtree:true});
  }else{
    var orig = window.studyLog;
    window.studyLog = function(ev, score, total){
      orig(ev, score, total);
      if(ev === 'finish') setTimeout(open, 2500);
    };
  }
})();
