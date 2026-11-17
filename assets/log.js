// Study pages log: tells Dad's own Google Sheet that a page was opened or finished.
// Sends only {kid, page, event, score, total}. No cookies, no IDs, no third-party analytics.
// Usage: <script src="../../assets/log.js"></script>  then  studyLog('finish', score, total)
// Bonus round: studyLog('extra_yes') / studyLog('extra_no') / studyLog('extra_finish', score, total)
//
// Friends: a link with ?who=NAME (first name only) logs as kid "friend-NAME", says
// "Hi Name!" on the page, and remembers NAME on that device (localStorage, per folder:
// mina/ or beren/) so later plain links there still log as that friend. ?who=reset (or ?who=mina / ?who=beren)
// forgets it (that visit logs no open row). With no saved name and no ?who, nothing changes.
(function(){
  var URL = 'https://script.google.com/macros/s/AKfycbxR4LNhRuWGWF62GkCftSlAQhIM43bVFnkBczcJoYNNGIRmjixRORIeOTxSonpYKsM3/exec';
  var KIDS = ['beren','mina'];
  var parts = location.pathname.replace(/\/index\.html$/,'').split('/').filter(Boolean);
  var i = parts.findIndex(function(p){return KIDS.indexOf(p)>=0});
  var kid = i>=0 ? parts[i] : '';
  var page = i>=0 ? (parts.slice(i+1).join('/').replace(/\.html$/,'') || 'index') : '';

  // ---- friend name (?who=) ----
  var KEY = 'studyFriend-'+kid, RESET = ['reset','clear','me','none'].concat(KIDS);
  function clean(raw){
    if(raw==null) return '';
    var w = String(raw).trim().split(/\s+/)[0] || '';
    var ok;
    try{ ok = /^[\p{L}]+(?:-[\p{L}]+)*$/u.test(w); }catch(e){ ok = /^[A-Za-z]+(?:-[A-Za-z]+)*$/.test(w); }
    if(!ok) return '';
    return w.toLowerCase().slice(0,20).replace(/-+$/,'');
  }
  function store(fn){ try{ return fn(window.localStorage); }catch(e){ return null; } }
  var who = '';
  var q = null;
  try{ q = new URLSearchParams(location.search).get('who'); }catch(e){}
  if(q!=null){
    var c = clean(q);
    if(RESET.indexOf(c)>=0 || RESET.indexOf(String(q).trim().toLowerCase())>=0){
      // Forget the friend in every folder. This visit is upkeep, so it sends no open row.
      store(function(s){ KIDS.forEach(function(k){ s.removeItem('studyFriend-'+k); }); });
      var resetVisit = true;
    }else if(c){
      who = c; store(function(s){ s.setItem(KEY, c); });
    }else{
      who = clean(store(function(s){ return s.getItem(KEY); }));
    }
  }else{
    who = clean(store(function(s){ return s.getItem(KEY); }));
    if(RESET.indexOf(who)>=0) who = '';
  }
  var display = who ? who.split('-').map(function(p){return p.charAt(0).toUpperCase()+p.slice(1)}).join('-') : '';
  var logKid = who ? 'friend-'+who : kid;
  window.studyWho = who ? {name: display, kid: logKid} : null;

  // Bonus-round events. The Sheet script only accepts open/finish, so these are
  // sent as open/finish rows with a page tag: page#extra-yes, page#extra-no, page#extra.
  var EXTRA = {extra_yes:['open','#extra-yes'], extra_no:['open','#extra-no'], extra_finish:['finish','#extra']};
  function send(event, score, total){
    if(!kid || URL.indexOf('https://')!==0) return;
    var pg = page, x = EXTRA[event];
    if(x){ event = x[0]; pg = page.slice(0,70) + x[1]; }
    var body = new URLSearchParams({kid:logKid, page:pg.slice(0,80), event:event,
      score: score==null?'':String(score), total: total==null?'':String(total)});
    try{ if(navigator.sendBeacon && navigator.sendBeacon(URL, body)) return; }catch(e){}
    try{ fetch(URL,{method:'POST',mode:'no-cors',keepalive:true,body:body}); }catch(e){}
  }
  window.studyLog = send;
  if(!resetVisit) send('open');

  if(!who || !kid) return;

  // ---- friend touches on the page ----
  // Score text: "Mina here! ..." / "Beren here. ..." becomes "Name here! ...".
  var own = kid.charAt(0).toUpperCase()+kid.slice(1);
  function friendText(t){
    var re = new RegExp('^\\s*'+own+' here[!.:,]?\\s*');
    return re.test(t) ? t.replace(re, display+' here! ') : display+' here! '+t;
  }
  function fixSms(a){
    var h = a.getAttribute('href') || '';
    var m = h.match(/^(sms:[^]*?[?&]body=)(.*)$/);
    if(!m || a.getAttribute('data-friend')===h) return;
    var t; try{ t = decodeURIComponent(m[2]); }catch(e){ return; }
    var nh = m[1] + encodeURIComponent(friendText(t));
    a.setAttribute('href', nh); a.setAttribute('data-friend', nh);
  }
  function fixLabel(a){
    if(/Send Dad my score/.test(a.textContent)) a.textContent = a.textContent.replace('Send Dad my score','Send my score');
  }
  function sweep(root){
    var list = (root.querySelectorAll ? root : document).querySelectorAll('a');
    for(var k=0;k<list.length;k++){ fixLabel(list[k]); if(/^sms:/.test(list[k].getAttribute('href')||'')) fixSms(list[k]); }
  }
  // Rewrite at tap time too, so a link whose href is set late is still right.
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href^="sms:"]') : null;
    if(a) fixSms(a);
  }, true);
  function greet(){
    if(document.getElementById('friendHi')) return;
    var d = document.createElement('div');
    d.id = 'friendHi';
    d.textContent = 'Hi ' + display + '! 👋';
    d.setAttribute('style','position:fixed;top:10px;right:10px;z-index:9999;padding:6px 12px;border-radius:999px;'+
      'background:#fff;color:#333;font:600 15px/1.3 system-ui,-apple-system,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.18)');
    document.body.appendChild(d);
    sweep(document);
    try{ new MutationObserver(function(){ sweep(document); }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['href']}); }catch(e){}
  }
  if(document.body) greet(); else document.addEventListener('DOMContentLoaded', greet);
})();
