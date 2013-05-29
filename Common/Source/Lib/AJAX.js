//////////////////////////////////////////////////////////////////////
function ajaxRequest(url, aMethod, param, onSuccess, onFailure /*opt*/)
{
   __LOG__(8,"AJAX " + aMethod + " " + url);

   var aR = new XMLHttpRequest();
   aR.onreadystatechange = onReadyStateChange;
   aR.open(aMethod, url, true);
   if (aMethod === 'POST') { aR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8'); }
   aR.send(param);


   function onReadyStateChange()
   {
      if ( aR.readyState === 4 )
      {
         if ( aR.status === 200 ) 
         {
            onSuccess(aR);
         }
         else if ( onFailure ) 
         {
            onFailure(aR);
         }
      }
   }
}

//////////////////////////////////////////////////////////////////////

//function ajaxLoadDocument(url, onSuccess, onFailure /*opt*/)
/*{
   ajaxRequest(url, "GET", null, 
      function (resp)
      {
         var range = document.createRange();
         range.setStartAfter(document.body);
         var xhr_frag = range.createContextualFragment(resp.responseText);
         var xhr_doc = createHTMLDocument();
         xhr_doc.adoptNode(xhr_frag);
         xhr_doc.documentElement.appendChild(xhr_frag);
         onSuccess(xhr_doc);
      },
      onFailure
   );
}
*/

function ajaxLoadDocument(url, onSuccess, onFailure /*opt*/)
{
   ajaxRequest(url, "GET", null, 
      function (resp)
      {
         var xhr_doc = createHTMLDocument();
         var range = xhr_doc.createRange();
         var xhr_frag = range.createContextualFragment(resp.responseText);
         xhr_doc.body.appendChild(xhr_frag);
         onSuccess(xhr_doc);
      },
      onFailure
   );
}


//////////////////////////////////////////////////////////////////////
/*
AJAXSequencer allows synchronize numerous AJAX requests and process them as
one batch.

Create sequencer:
  var sequencer = new AJAXSequencer(options);

options exlained:
{
   load_policy: one of "immediately", "wait_random", "wait_serially". By default has "immediately" behavior
   process_policy: processing policy for successfully loaded documents
       one of "immediately", "serially". By default has "immediately" behavior
   onprogress: onProgressHandler (optional)
   onload: onLoadHandler (optional)
   onfail: onFailHandler (optional)
   oncomplete: onCompleteHandler (optional)
}

onCompleteHandler(bResult) - bResult is true if all documents successfully loaded and processed

onLoadHandler(doc)

onFailHandler()

onProgressHandler(event)
event exlained:
{
   eventType: type of event, one of "queued","requested","loaded","processed","failed","cancelled"
   state:
      0 -  not processed yet
      1 -  requested
      2 -  successfully loaded
        3 -  onload handler return true
        4 -  onload handler return false
      5 -  load failed for some reason
      6 -  request cancelled

   old_state: previous state 

   cnt_total - total requests in queue  cnt_total == cnt_wait + cnt_requested + cnt_done
   cnt_wait -  pending requests in queue
   cnt_requested -  requests in progress
   cnt_done -  completed requests ( both successed and failed )
}
*/

function AJAXSequencer(options)
{
   this._options = options || {};
   this._queue = [];

   if ( this._options.load_policy === undefined ) { this._options.load_policy = "immediately"; }
   if ( this._options.process_policy === undefined ) { this._options.process_policy = "immediately"; }
}

//////////////////////////////////////////////////////////////////////
// return counters for each possible state
AJAXSequencer.prototype._getStat = function()
{
   var stats = [0,0,0,0,0,0,0];
   var id, length;

   for ( id = 0, length = this._queue.length; id < length; ++id )
   {
      ++stats[this._queue[id].state];
   }
   return stats;
}

//////////////////////////////////////////////////////////////////////
AJAXSequencer.prototype._onProgress = function(eventType, id)
{
   if ( this._options.onprogress )
   {
      var stats = this._getStat();
      this._options.onprogress(
         { eventType:eventType, state:this._queue[id].state, old_state:this._queue[id].old_state,
           cnt_total: this._queue.length, cnt_wait:stats[0], cnt_requested: stats[1], cnt_done:stats[2]+stats[3]+stats[4]+stats[5]+stats[6]
         }
      );
   }
   __LOG__(7,{{"AJAXSequencer event '" + eventType + "', id=" + id + 
             ", state=" + this._queue[id].old_state + "-->" + this._queue[id].state + 
             ", url=" + this._queue[id].url + ", stats=" + this._getStat()}})
}

//////////////////////////////////////////////////////////////////////
AJAXSequencer.prototype._changeState = function(eventType, id, newState)
{
   var q = this._queue[id];
   q.old_state = q.state;
   q.state = newState;
   this._onProgress(eventType, id);
}

//////////////////////////////////////////////////////////////////////
AJAXSequencer.prototype._processDocument = function(id, xhr_doc)
{
   var q = this._queue[id];
   var handler = q.onload || this._options.onload;
   var bResult = handler(xhr_doc); 
   this._changeState("processed", id, (bResult) ? 3 : 4);
}

//////////////////////////////////////////////////////////////////////
AJAXSequencer.prototype._checkQueue = function()
{
   var stats = this._getStat();
   var total = this._queue.length;
   var processed = stats[3]+stats[4]+stats[5]+stats[6];

   if ( total === processed )
   {
      __LOG__(7,"AJAXSequencer complete batch of " + total + " request(s)")
      var handler = this._options.oncomplete;
      if ( handler )  { handler( total === stats[3] ); }
   }
   else if ( total === (stats[2] + processed) ) // all loaded but some not processed
   {
      var id, length;

      for ( id = 0; id < total; ++id )
      {
         var q = this._queue[id];
         if ( q.state === 2 )
         {
            this._processDocument(id, q.doc);
         }
      }

      this._checkQueue(); // _processDocument can change state of sequencer
   }
}

//////////////////////////////////////////////////////////////////////
AJAXSequencer.prototype._onSuccess = function(id, xhr_doc)
{
   var q = this._queue[id];
   if ( q.state === 1 ) // request can be cancelled
   {
      this._changeState("loaded", id, 2);
      if ( this._options.process_policy === "immediately" ) 
      { 
         this._processDocument(id, xhr_doc);
      }
      else // store document for later use
      {
         q.doc = xhr_doc;
      }
   }
   this._checkQueue();
}

//////////////////////////////////////////////////////////////////////
AJAXSequencer.prototype._onFailure = function(id)
{
   var q = this._queue[id];

   if ( q.state === 1 ) // request can be cancelled
   {
      this._changeState("failed", id, 5);
      var handler = q.onfail || this._options.onfail;
      if ( handler )  { handler(); }
   }
   this._checkQueue();
}

//////////////////////////////////////////////////////////////////////
AJAXSequencer.prototype._processQueue = function()
{
   var bImm = ( this._options.load_policy === "immediately" );
   var id, length;

   for ( id = 0, length = this._queue.length; id < length; ++id )
   {
      var q = this._queue[id];
      if ( q.state === 0 && bImm )
      {
         ajaxLoadDocument(q.url, xbindMethod2(this,this._onSuccess,id), xbindMethod2(this,this._onFailure,id));
         this._changeState("requested", id, 1);
      }
   }
}

/***************************** PUBLIC *******************************/
//////////////////////////////////////////////////////////////////////
// add a request to a queue
AJAXSequencer.prototype.load = function(url, onSuccess/*opt*/, onFailure /*opt*/)
{
   var id = this._queue.push({url:url, onload:onSuccess, onfail:onFailure, state:0})-1;
   this._onProgress("queued", id);
   this._processQueue();
}

//////////////////////////////////////////////////////////////////////
// stop processing for all queued requests
AJAXSequencer.prototype.cancel = function()
{
   var id, length;

   for ( id = 0, length = this._queue.length; id < length; ++id )
   {
      var state = this._queue[id].state;
      if ( state === 0 || state === 1 || state === 2 )
      {
         this._changeState("cancelled", id, 6);
      }
   }
   this._checkQueue();
}
                                                     