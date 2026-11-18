// "Want more?" subject picker for Mina's pages. Load it right AFTER assets/log.js:
//   <script src="../../assets/log.js"></script><script src="../../assets/more.js"></script>
// It shows a card with 4 subject buttons when the page is finished:
//   - after studyLog('finish') when the page has no bonus round,
//   - after studyLog('extra_no') / studyLog('extra_finish') when it does.
// A tap logs one open row tagged <page>#more-<subject> (or #more-no for "I'm done")
// and opens mina/more/<subject>.html, a fresh set on this week's topic.
// Nothing else is sent. Works with ?who= friends (log.js keeps the name).
(function(){
  var S = document.currentScript;
  if(!S || !window.studyLog) return;
  var base = new URL('../mina/more/', S.src).href;
  var SUBJ = [
    ['math',    '🧮', 'Math'],
    ['science', '🔬', 'Science'],
    ['reading', '📖', 'Reading & Writing'],
    ['social',  '🤠', 'Texas History']
  ];
  var shown = false;

  function show(){
    if(shown) return; shown = true;
    var card = document.createElement('section');
    card.id = 'moreCard';
    card.setAttribute('aria-label', 'Want more practice?');
    card.setAttribute('style', 'margin:16px auto 0;max-width:640px;padding:18px;border-radius:22px;' +
      'border:2px dashed currentColor;border-color:color-mix(in srgb,currentColor 25%,transparent);' +
      'display:flex;flex-direction:column;gap:12px');
    var h = document.createElement('p');
    h.textContent = 'Want more? Pick a subject 👇';
    h.setAttribute('style', 'margin:0;font-weight:800;font-size:20px');
    card.appendChild(h);
    var grid = document.createElement('div');
    grid.setAttribute('style', 'display:grid;grid-template-columns:1fr 1fr;gap:10px');
    SUBJ.forEach(function(s){
      var a = document.createElement('a');
      a.href = base + s[0] + '.html';
      a.textContent = s[1] + ' ' + s[2];
      a.setAttribute('data-more', s[0]);
      a.setAttribute('style', 'display:flex;align-items:center;justify-content:center;text-align:center;min-height:56px;' +
        'padding:10px;border-radius:16px;font-weight:800;font-size:17px;text-decoration:none;color:inherit;' +
        'border:2px solid color-mix(in srgb,currentColor 30%,transparent);background:color-mix(in srgb,currentColor 6%,transparent)');
      a.addEventListener('click', function(e){
        e.preventDefault();
        try{ studyLog('more_' + s[0]); }catch(err){}
        var go = a.href; setTimeout(function(){ location.href = go; }, 150);
      });
      grid.appendChild(a);
    });
    card.appendChild(grid);
    var no = document.createElement('button');
    no.type = 'button';
    no.textContent = "I'm done for today";
    no.setAttribute('style', 'font:inherit;font-weight:700;padding:10px;border-radius:14px;border:0;background:transparent;' +
      'color:inherit;opacity:.7;text-decoration:underline;cursor:pointer');
    no.addEventListener('click', function(){
      try{ studyLog('more_no'); }catch(err){}
      card.innerHTML = '';
      var p = document.createElement('p');
      p.textContent = 'Great work today! See you tomorrow 🌟';
      p.setAttribute('style', 'margin:0;font-weight:800;text-align:center');
      card.appendChild(p);
    });
    card.appendChild(no);

    // Put it right under the card that holds the score button.
    var wrap = document.querySelector('.wrap') || document.body;
    var anchor = document.querySelector('#sendScore, a.send');
    while(anchor && anchor.parentElement && anchor.parentElement !== wrap) anchor = anchor.parentElement;
    if(anchor && anchor.parentElement === wrap) wrap.insertBefore(card, anchor.nextSibling);
    else wrap.appendChild(card);
    setTimeout(function(){ try{ card.scrollIntoView({behavior:'smooth', block:'nearest'}); }catch(e){} }, 1200);
  }

  var orig = window.studyLog;
  window.studyLog = function(ev, score, total){
    orig(ev, score, total);
    if(ev === 'finish') setTimeout(function(){
      if(!/Want 5 bonus questions\?/.test(document.body.innerText || '')) show();
    }, 400);
    if(ev === 'extra_no' || ev === 'extra_finish') setTimeout(show, 400);
  };
})();
