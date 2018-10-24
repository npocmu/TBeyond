//////////////////////////////////////////////////////////////////////
// @bOpened - initial state of control
// @title one of:
//     str - control tip
//    [str1,str2] - tips for different states: opened and closed respectively
function uiCreateRollDownControl(bOpened, title, onChange /*opt*/)
{
   //-------------------------------------------------------------
   function sendEvent(target, bOpened)
   {
      var e = document.createEvent("Events");
      e.initEvent("change", true, false);
      e.opened = bOpened;
      return target.dispatchEvent(e);
   }

   //-------------------------------------------------------------
   function onClick(e)
   {
      var newState = !e.target.getState();
      e.target.setState(newState);
      sendEvent(e.target,newState);
   }

   //-------------------------------------------------------------
   var ctrl = $span(['class','tbRollDown']);

   ctrl.getState = function ()
   {
      var state = hasClass(this,'tbOpened');
      if ( !state && !hasClass(this,'tbClosed') ) { state = undefined; }
      return state;
   }

   ctrl.setState = function (bOpened)
   {
      delClass(this,'tbOpened tbClosed');
      addClass(this, bOpened ? 'tbOpened' : 'tbClosed');
      this.textContent = bOpened ? '\u25BC' : '\u25BA';

      var t = title;
      if ( t instanceof Array ) { t = title[bOpened?1:0]; }
      $at(this,['title',t])
   }

   ctrl.setState(bOpened);

   ctrl.addEventListener('click', onClick, false);

   if ( onChange )
   {
      ctrl.addEventListener('change', onChange, false);
   }

   return ctrl;
}

