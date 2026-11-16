// Study pages log: tells Dad's own Google Sheet that a page was opened or finished.
// Sends only {kid, page, event, score, total}. No cookies, no IDs, no third-party analytics.
// Usage: <script src="../../assets/log.js"></script>  then  studyLog('finish', score, total)
// Bonus round: studyLog('extra_yes') / studyLog('extra_no') / studyLog('extra_finish', score, total)
(function(){
  var URL = 'https://script.google.com/macros/s/AKfycbxR4LNhRuWGWF62GkCftSlAQhIM43bVFnkBczcJoYNNGIRmjixRORIeOTxSonpYKsM3/exec';
  var parts = location.pathname.replace(/\/index\.html$/,'').split('/').filter(Boolean);
  var i = parts.findIndex(function(p){return p==='beren'||p==='mina'});
  var kid = i>=0 ? parts[i] : '';
  var page = i>=0 ? (parts.slice(i+1).join('/').replace(/\.html$/,'') || 'index') : '';
  // Bonus-round events. The Sheet script only accepts open/finish, so these are
  // sent as open/finish rows with a page tag: page#extra-yes, page#extra-no, page#extra.
  var EXTRA = {extra_yes:['open','#extra-yes'], extra_no:['open','#extra-no'], extra_finish:['finish','#extra']};
  function send(event, score, total){
    if(!kid || URL.indexOf('https://')!==0) return;
    var pg = page, x = EXTRA[event];
    if(x){ event = x[0]; pg = page.slice(0,70) + x[1]; }
    var body = new URLSearchParams({kid:kid, page:pg.slice(0,80), event:event,
      score: score==null?'':String(score), total: total==null?'':String(total)});
    try{ if(navigator.sendBeacon && navigator.sendBeacon(URL, body)) return; }catch(e){}
    try{ fetch(URL,{method:'POST',mode:'no-cors',keepalive:true,body:body}); }catch(e){}
  }
  window.studyLog = send;
  send('open');
})();
