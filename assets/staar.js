// Daily STAAR question for Mina's pages (parent, 2026-11-18: "prep STAAR as early as possible").
// Loaded by assets/more.js, so every page that has the "Want more?" picker gets it.
// When the page (and bonus) ends: one grade-4 STAAR-style question for today, then the picker.
// Bank: mina/staar/items.js -> window.STAAR_ITEMS = [{id, date:'YYYY-MM-DD', subject:'math'|'reading',
//   teks, level:'easy'|'challenge', type:'mc'|'multi'|'entry'|'ab', passage?, q, o, a, why, parts?}]
//   mc: a = index; multi: a = [indexes] ("Select TWO"); entry: a = '5005' (commas ignored);
//   ab: parts = [{q,o,a}, {q,o,a}] (Part A / Part B, 1 point each).
// One question per day per device: once answered, other pages that day go straight to the picker.
// Logs studyLog('staar_<id>', score, total) -> finish row page#staar-<id>. Nothing else is sent.
(function(){
  var S = document.currentScript;
  if(!S) return;
  var base = new URL('../mina/staar/', S.src).href;
  var KEY = 'staarDone';
  function store(fn){ try{ return fn(window.localStorage); }catch(e){ return null; } }
  function done(){ return store(function(s){ try{ return JSON.parse(s.getItem(KEY)||'{}')||{}; }catch(e){ return {}; } }) || {}; }
  function mark(id, score){ store(function(s){ var d = done(); d[id] = score; s.setItem(KEY, JSON.stringify(d)); }); }
  function today(){ try{ return new Date().toLocaleDateString('en-CA',{timeZone:'America/Chicago'}); }catch(e){ return new Date().toISOString().slice(0,10); } }

  var items = null, waiting = [];
  var tag = document.createElement('script');
  tag.src = base + 'items.js';
  tag.onload = function(){ items = window.STAAR_ITEMS || []; waiting.splice(0).forEach(function(f){ f(); }); };
  tag.onerror = function(){ items = []; waiting.splice(0).forEach(function(f){ f(); }); };
  document.head.appendChild(tag);

  // Today's item; if none is dated today, the newest earlier one not yet answered on this device.
  function pick(){
    var t = today(), d = done(), best = null;
    for(var i=0;i<items.length;i++){ var x = items[i]; if(x.date === t) return d[x.id]!=null ? null : x; }
    for(var j=0;j<items.length;j++){ var y = items[j];
      if(y.date < t && d[y.id]==null && (!best || y.date > best.date)) best = y; }
    return best;
  }

  function el(tagName, style, text){ var e = document.createElement(tagName); if(style) e.setAttribute('style', style); if(text!=null) e.textContent = text; return e; }
  var BTN = 'display:block;width:100%;text-align:left;font:inherit;font-weight:700;padding:12px 14px;margin:0 0 8px;border-radius:14px;' +
    'border:2px solid color-mix(in srgb,currentColor 30%,transparent);background:color-mix(in srgb,currentColor 5%,transparent);color:inherit;cursor:pointer;min-height:48px';
  // Page button colors (every Mina page defines --accent / --accent-ink). Not currentColor: in a button's own
  // background it means the button's text color, so text and box came out the same color (empty box on iPhone).
  var GO = 'font:inherit;font-weight:800;font-size:18px;padding:12px 18px;border-radius:14px;border:0;cursor:pointer;' +
    'background:var(--accent,#3a6ff0);color:var(--accent-ink,#fff);min-height:48px';
  var L = 'ABCDEFG';

  // One question (mc / multi / entry). cb(correct)
  function ask(box, x, cb){
    box.appendChild(el('p', 'margin:0 0 10px;font-weight:800;font-size:18px', x.q));
    if(x.type === 'entry'){
      var row = el('div', 'display:flex;gap:8px;align-items:center');
      var inp = el('input', 'font:inherit;font-size:20px;font-weight:800;width:9em;padding:10px;border-radius:12px;border:2px solid color-mix(in srgb,currentColor 35%,transparent);background:transparent;color:inherit');
      inp.setAttribute('inputmode', 'numeric'); inp.setAttribute('aria-label', 'Your answer');
      var go = el('button', GO, 'Check'); go.type = 'button';
      go.onclick = function(){ var v = inp.value.replace(/[\s,]/g,''); if(!v) return; inp.disabled = go.disabled = true;
        cb(v === String(x.a).replace(/[\s,]/g,'')); };
      row.appendChild(inp); row.appendChild(go); box.appendChild(row);
      return;
    }
    var multi = x.type === 'multi', picked = [];
    var bs = x.o.map(function(t, k){
      var b = el('button', BTN, L[k] + '.  ' + t); b.type = 'button';
      b.onclick = function(){
        if(!multi){ bs.forEach(function(z){ z.disabled = true; }); paint(bs, [k], [x.a]); cb(k === x.a); return; }
        var at = picked.indexOf(k); if(at>=0) picked.splice(at,1); else picked.push(k);
        b.style.outline = at>=0 ? '' : '3px solid currentColor';
      };
      box.appendChild(b); return b;
    });
    if(multi){
      var need = x.a.length;
      var chk = el('button', GO, 'Check my ' + need); chk.type = 'button';
      chk.onclick = function(){
        if(picked.length !== need){ chk.textContent = 'Pick exactly ' + need; return; }
        bs.forEach(function(z){ z.disabled = true; }); chk.disabled = true;
        paint(bs, picked, x.a);
        cb(picked.slice().sort().join() === x.a.slice().sort().join());
      };
      box.appendChild(chk);
    }
  }
  function paint(bs, picked, right){
    bs.forEach(function(b, k){
      if(right.indexOf(k)>=0){ b.style.borderColor = '#2e9d5b'; b.style.background = 'rgba(46,157,91,.16)'; }
      else if(picked.indexOf(k)>=0){ b.style.borderColor = '#d0563b'; b.style.background = 'rgba(208,86,59,.14)'; }
      b.style.outline = '';
    });
  }

  function render(x, next){
    // Lead-in + gentle reveal, so it reads as the next step after the score card (parent, 2026-11-18).
    var lead = el('p', 'margin:28px auto 0;max-width:640px;text-align:center;font-weight:900;font-size:22px', '🎯 One more challenge!');
    lead.setAttribute('aria-hidden', 'true');
    var card = el('section', 'margin:8px auto 0;max-width:640px;padding:18px;border-radius:22px;' +
      'border:3px solid color-mix(in srgb,currentColor 35%,transparent);background:color-mix(in srgb,currentColor 4%,transparent)');
    card.id = 'staarCard';
    card.setAttribute('aria-label', 'Today\'s STAAR question');
    var hard = x.level === 'challenge';
    card.appendChild(el('p', 'margin:0;font-weight:900;font-size:21px', hard ? '🏆 STAAR Challenge' : '⭐ STAAR Practice'));
    card.appendChild(el('p', 'margin:2px 0 12px;opacity:.75;font-size:15px',
      'Today\'s STAAR question · Grade 4 ' + (x.subject === 'math' ? 'Math' : 'Reading') + (hard ? ' · a tricky one!' : '')));
    if(x.passage){
      var p = el('div', 'max-height:260px;overflow:auto;padding:12px 14px;margin:0 0 12px;border-radius:14px;font-size:16px;line-height:1.5;' +
        'background:color-mix(in srgb,currentColor 6%,transparent)');
      if(x.title) p.appendChild(el('p', 'margin:0 0 6px;font-weight:800', x.title));
      String(x.passage).split(/\n+/).forEach(function(par, n){ p.appendChild(el('p', 'margin:0 0 8px', (x.numbered ? '(' + (n+1) + ') ' : '') + par)); });
      card.appendChild(p);
    }
    var box = el('div'); card.appendChild(box);
    var parts = x.type === 'ab' ? x.parts.map(function(pt, n){ return {type: pt.type || 'mc', q: (n ? 'Part B: ' : 'Part A: ') + pt.q, o: pt.o, a: pt.a}; }) : [x];
    var score = 0, n = 0;
    function step(){
      var cur = parts[n], sub = el('div', n ? 'margin-top:14px' : ''); box.appendChild(sub);
      ask(sub, cur, function(ok){
        if(ok) score++;
        n++;
        if(n < parts.length){ setTimeout(step, 500); return; }
        finish();
      });
    }
    function finish(){
      var total = parts.length, all = score === total;
      var msg = all ? (hard ? '🎉 You beat the challenge!' : '✅ Nailed it!') : (score ? 'Part right! ' : 'Almost! ');
      box.appendChild(el('p', 'margin:12px 0 6px;font-weight:800', msg + (total > 1 ? ' (' + score + '/' + total + ')' : '')));
      box.appendChild(el('p', 'margin:0 0 12px', x.why));
      mark(x.id, score);
      try{ window.studyLog && studyLog('staar_' + x.id, score, total); }catch(e){}
      var nx = el('button', GO + ';display:block;width:100%', 'Want more? Pick a subject ➜'); nx.type = 'button';
      nx.onclick = function(){ nx.disabled = true; next(); };
      box.appendChild(nx);
    }
    step();
    var wrap = document.querySelector('.wrap') || document.body;
    var anchor = document.querySelector('#sendScore, a.send');
    while(anchor && anchor.parentElement && anchor.parentElement !== wrap) anchor = anchor.parentElement;
    var calm = false; try{ calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
    [lead, card].forEach(function(x){ if(!calm){ x.style.opacity = '0'; x.style.transform = 'translateY(12px)';
      x.style.transition = 'opacity .5s ease, transform .5s ease'; } });
    var at = (anchor && anchor.parentElement === wrap) ? anchor.nextSibling : null;
    wrap.insertBefore(lead, at); wrap.insertBefore(card, at);
    // Show the lead-in a moment after the score card, then the question.
    setTimeout(function(){ lead.style.opacity = '1'; lead.style.transform = 'none'; }, calm ? 0 : 700);
    setTimeout(function(){ card.style.opacity = '1'; card.style.transform = 'none'; }, calm ? 0 : 1100);
    setTimeout(function(){ try{ lead.scrollIntoView({behavior: calm ? 'auto' : 'smooth', block:'start'}); }catch(e){} }, 900);
  }

  // more.js calls studyGate(show) when the page ends.
  window.studyGate = function(next){
    function go(){ var x = null; try{ x = pick(); }catch(e){} if(x) render(x, next); else next(); }
    if(items) go(); else { waiting.push(go); setTimeout(function(){ if(!items){ items = []; waiting.splice(0).forEach(function(f){ f(); }); } }, 4000); }
  };
})();
