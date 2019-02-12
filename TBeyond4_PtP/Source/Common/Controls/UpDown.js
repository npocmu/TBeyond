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

   var up = I("tbiUp",[['title','+' + delta],
                       ['click', bind(onClick,[+delta]), false],
                       ['mousedown', bind2(onMouseDown,[+delta]), false]]);
   var down = I("tbiDown",[['title','-' + delta],
                           ['click', bind(onClick,[-delta]), false],
                           ['mousedown', bind2(onMouseDown,[-delta]), false]]);

   var ctrl = $div(['class','tbBuiltin'], $div(['class','tbUpDown'],[up,down]));

   buddy.addEventListener('focus', onBuddyFocused, false);
   buddy.addEventListener('blur', onBuddyBlur, false);

   return ctrl;
}

//////////////////////////////////////////////////////////////////////
function uiAddBuiltinUpDownControl(buddy, delta)
{
   //-----------------------------------------------------------------
   function positionControl(ctrl, buddy, bstyles)
   {
      __DUMP_NODE__(ctrl)
      var buddy = buddy || ctrl.parentNode.previousSibling;
      if ( buddy )
      {
         __DUMP_NODE__(buddy)
         var h = buddy.clientHeight;

         if ( h === 0 )
         {
            // it's happen when buddy not added to DOM and not displayed yet
            return false;
         }

         var bstyles = bstyles || window.getComputedStyle(buddy, null);
         var bposition = bstyles.position;
         var offsetV = 0, offsetH = 0;
         var ctrlUp = ctrl.querySelector(".tbiUp");
         var ctrlDown = ctrl.querySelector(".tbiDown");

         var cstyles = window.getComputedStyle(ctrl, null);

         var cborderSize  = parseFloat(cstyles['border' + DOMdocDir[0] + 'Width']);
         var bpaddingSize = parseFloat(bstyles['padding' + DOMdocDir[1]]);
         var bborderSize  = parseFloat(bstyles['border' + DOMdocDir[1] + 'Width']);
         var bmarginSize  = parseFloat(bstyles['margin' + DOMdocDir[1]]);
         var bborderTopWidth = parseFloat(bstyles.borderTopWidth);
         var bmarginTop = parseFloat(bstyles.marginTop);
         var borderColor = bstyles['border' + DOMdocDir[1] + 'Color'];

         if ( bposition === "relative" )
         {
            offsetV = parseFloat(bstyles.top);
            if ( isNaN(offsetV) )
            {
               offsetV = -parseFloat(bstyles.bottom);
               if ( isNaN(offsetV) )
               {
                  offsetV = 0;
               }
            }

            offsetH = parseFloat(bstyles[docDir[0]]);
            if ( isNaN(offsetH) )
            {
               offsetH = -parseFloat(bstyles[docDir[1]]);
               if ( isNaN(offsetH) )
               {
                  offsetH = 0;
               }
            }
            console.log(offsetV,offsetH)
         }

         var h = buddy.clientHeight;
         var seph = cborderSize; // button separator height
         var buth = Math.floor((h - seph) / 2);  // button client height
         var butw = ( buth < 10 ) ? 10 : buth; // button client width (min 10 px)
         
         buddy.style['padding' + DOMdocDir[1]] = (bpaddingSize + butw + cborderSize) + 'px';

         ctrl.style.top = (offsetV + bmarginTop + bborderTopWidth) + 'px';
         ctrl.style[docDir[0]] = offsetH - (butw + bborderSize + bmarginSize) + 'px';

         ctrl.style.color = borderColor;
         ctrl.style['border' + DOMdocDir[0] + 'Color'] = borderColor;

         ctrl.style.height = h + 'px';
         ctrl.style.width = butw + 'px';

         ctrlDown.style.height = ctrlUp.style.height = buth + 'px';
         ctrlDown.style.borderTopColor = borderColor;

         return true;
      }
      return false;
   }

   //-----------------------------------------------------------------
   function repositionControl(ctrl)
   {
      if ( positionControl(ctrl) )
      {
         show(ctrl);
      }
   }

   //-----------------------------------------------------------------
   var container = null;
   var bstyles = window.getComputedStyle(buddy, null);
   var bposition = bstyles.position;

   if ( bposition === "static" || bposition === "relative" )
   {
      container = uiCreateUpDownControl(buddy, delta);
      insertAfter(buddy, container);

      var ctrl = container.querySelector(".tbUpDown");
      if ( !positionControl(ctrl, buddy, bstyles) )
      {
         // delay reposition to next cycle
         hide(ctrl);
         setTimeout(bind(repositionControl,[ctrl]), 0);
      }
   }
   return container;
}
