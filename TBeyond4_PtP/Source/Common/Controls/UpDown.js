//////////////////////////////////////////////////////////////////////
function uiCreateUpDownControl(buddy, delta)
{
   //-------------------------------------------------------------
   function cancelTimer()
   {
      uiCreateUpDownControl.repeats = 0;
      if ( uiCreateUpDownControl.timer ) 
      {
         clearTimeout(uiCreateUpDownControl.timer);
         uiCreateUpDownControl.timer = null;
      }
   }

   //-------------------------------------------------------------
   function doChanges(delta)
   {
      var v = ( buddy.value === "" ) ? 0 : Number(buddy.value); 

      if ( !isNaN(v) )
      {
         v += delta;
         if ( Math.abs(delta) < 1 )
         {
           v = v.toFixed(Math.round(-Math.log(Math.abs(delta))*Math.LOG10E)); // show same number of digits as delta has
         }
         buddy.value = v;

         var e = document.createEvent("Events");
         e.initEvent("change", true, false);
         buddy.dispatchEvent(e);
      }
   }

   //-------------------------------------------------------------
   function onDelay()
   {
      ++uiCreateUpDownControl.repeats;
      doChanges(uiCreateUpDownControl.delta);
      var delay = ifGreater(uiCreateUpDownControl.repeats, 15,100, 10,150, 6,200, 3,250, 400);
      uiCreateUpDownControl.timer = setTimeout(onDelay, delay);
   }

   //-------------------------------------------------------------
   function onMouseDown(delta,e)
   {
      cancelTimer();
      if ( e.button === 0 )
      {
         uiCreateUpDownControl.delta = delta;
         uiCreateUpDownControl.timer = setTimeout(onDelay, 600);
      }
   }

   //-------------------------------------------------------------
   function onClick(delta)
   {
      if ( !uiCreateUpDownControl.repeats )
      {
         doChanges(delta);
      }
      cancelTimer();
   }

   //-------------------------------------------------------------
   function onMouseWheel(e)
   {
//      var movement = e.detail / -3;
      onClick( ( e.detail > 0 ) ? -delta:delta, buddy);
      e.stopPropagation();
      e.preventDefault();
      return false;
   }

   //-------------------------------------------------------------
   function onBuddyFocused(e)
   {
      window.addEventListener('DOMMouseScroll', onMouseWheel, false);
      document.addEventListener('mousewheel', onMouseWheel, false);
   }

   //-------------------------------------------------------------
   function onBuddyBlur(e)
   {
      window.removeEventListener('DOMMouseScroll', onMouseWheel, false);
      document.removeEventListener('mousewheel', onMouseWheel, false);
   }

   //-------------------------------------------------------------
   delta = delta || 1;
   var up = I("arrow_up8",[['title','+' + delta],['class','tbiUp'],
                           ['click', bind(onClick,[+delta]), false],
                           ['mousedown', bind2(onMouseDown,[+delta]), false]]);
   var down = I("arrow_down8",[['title','-' + delta],['class','tbiDown'],
                               ['click', bind(onClick,[-delta]), false],
                               ['mousedown', bind2(onMouseDown,[-delta]), false]]);

   var ctrl = $div([['class','tbUpDown']], [up,down]);

   buddy.addEventListener('focus', onBuddyFocused, false);
   buddy.addEventListener('blur', onBuddyBlur, false);

   return ctrl;
}

//////////////////////////////////////////////////////////////////////
function uiAddBuiltinUpDownControl(buddy, delta)
{
   var ctrl = uiCreateUpDownControl(buddy, delta);
   ctrl.className += " tbBuiltin";
   insertAfter(buddy,ctrl);

   var styles = window.getComputedStyle(buddy,null);
   ctrl.style.lineHeight = styles.lineHeight;
   //ctrl.style.verticalAlign = styles.verticalAlign;
   buddy.style['padding' + DOMdocDir[1]] = (parseInt10(styles['padding' + DOMdocDir[1]]) + 9) + 'px';
   ctrl.style[docDir[0]] = (-9 - parseInt10(styles['border' + DOMdocDir[1] + 'Width']) - parseInt10(styles['margin' + DOMdocDir[1]])) + 'px';
   /*
   if ( styles.verticalAlign === 'baseline' ) 
   {
      ctrl.style.top = '-13px';
   }
   else
   
   {
      ctrl.style.top = '-9px';
   }
   */

   return ctrl;
}

