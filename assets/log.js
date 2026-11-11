// Study pages log: tells Dad's own Google Sheet that a page was opened or finished.
// Sends only {kid, page, event, score, total}. No cookies, no IDs, no third-party analytics.
// Usage: <script src="../../assets/log.js"></script>  then  studyLog('finish', score, total)
(function(){
  var URL = 'https://script.google.com/macros/s/AKfycbxR4LNhRuWGWF62GkCftSlAQhIM43bVFnkBczcJoYNNGIRmjixRORIeOTxSonpYKsM3/exec';
  var parts = location.pathname.replace(/\/index\.html$/,'').split('/').filter(Boolean);
  var i = parts.findIndex(function(p){return p==='beren'||p==='mina'});
  var kid = i>=0 ? parts[i] : '';
  var page = i>=0 ? (parts.slice(i+1).join('/').replace(/\.html$/,'') || 'index') : '';
  function send(event, score, total){
    if(!kid || URL.indexOf('https://')!==0) return;
    var body = new URLSearchParams({kid:kid, page:page.slice(0,80), event:event,
      score: score==null?'':String(score), total: total==null?'':String(total)});
    try{ if(navigator.sendBeacon && navigator.sendBeacon(URL, body)) return; }catch(e){}
    try{ fetch(URL,{method:'POST',mode:'no-cors',keepalive:true,body:body}); }catch(e){}
  }
  window.studyLog = send;
  send('open');
})();
