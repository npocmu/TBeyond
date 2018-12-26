M4_DEBUG({{
//--------------------------------------------------------------------
//                         log functions                          
//--------------------------------------------------------------------
var $$logging_fun = null;

function $$top_args() 
{
   var args = null;

   if ( TB3O.call_stack && TB3O.call_stack.length > 0 ) 
   {
      args = TB3O.call_stack[TB3O.call_stack.length - 1];
   }
   return args;
}


//--------------------------------------------------------------------
function $log(level, text) 
{
   var maxlevel = (TB3O.O && isIntValid(parseInt10(TBO_CONSOLE_LOG_LEVEL))) ? parseInt10(TBO_CONSOLE_LOG_LEVEL) : 10;

   if ( level <= maxlevel ) 
   {
      var args = $$top_args();
      if ( args )
      {
         text = args.callee.name + ": " + text;
      }

      if ( TB3O && TB3O.gServer )
      {
         text = "[" + TB3O.gServer + "]" + text;
      }

      if ( TB3O.call_stack )
      {
         text = "{" + TB3O.call_stack.length + "}" + text;
      }

      if ( !$$logging_fun )
      {
         $$logging_fun = ( typeof(GM_log) === "function" ) ? GM_log : console.log;
      }

      $$logging_fun(text);
   }
}

//--------------------------------------------------------------------
function $enter(args) 
{
   if ( !TB3O.call_stack ) 
   {
      TB3O.call_stack = [];
   }
   args.start = new Date();
   TB3O.call_stack.push(args);
   $log(8, ">>> called at " + args.start);
}

//--------------------------------------------------------------------
function $exit() 
{
   var end = new Date();
   var args = $$top_args();
   if ( args ) 
   {
      $log(8, "<<< completed at " + end + ", elapsed: " + (end - args.start));
   }
   else
   {
      $log(0, "!!! EXIT without ENTER !!!" );
   }
   TB3O.call_stack.pop();
}

//--------------------------------------------------------------------
function $test(text, v) 
{
   if ( v )
   {
      $log(10, "expression " + text + " returns " + v); 
   }
   else
   {
      $log(5, "! expression " + text + " failed"); 
   }
   return v;
}

//--------------------------------------------------------------------
function $toStr(v) 
{
   var strv;
   if ( v instanceof Array ) 
   {
      strv = uneval(v) + ", length = " + v.length;
   }
   if ( v instanceof Date ) 
   {
      strv = v.toString() + ", timestamp = " + v.getTime();
   }
   else if ( typeof(v) === "object" ) 
   {
      strv = uneval(v);
   }
   else if ( v === undefined )
   {
      strv = "undefined";
   }
   else
   {
      strv = v.toString();
   }
   return strv;
}

//--------------------------------------------------------------------
function $dump_expr(expr, e /*, exprN, eN */) 
{
   var str = "", i;
   for ( i = 0; i+1 < arguments.length; i+=2 )
   {
      if ( i > 0 ) 
      {
         str += ",  ";
      }
      str += arguments[i] + " = '" + $toStr(arguments[i+1]) + "'";
   }
   $log(9, str);
}

//--------------------------------------------------------------------
function $log_node(level, expr, e) 
{
   var str,styles;

   $test(expr, e);

   if ( e )
   {
      str = "DOM Node tag=" + e.tagName + ", id='" + e.id + "', class='" + e.className + "'\n";
      if ( level >= 9 )
      {
         str += "text content='" + e.textContent + "'";
      }
      $log(level, str); 
   }
}

//--------------------------------------------------------------------
function $log_style(level, expr, e) 
{
   var str,styles;

   $test(expr, e);

   if ( e )
   {
      var propList = ["position", "top", "left", "bottom", "right", "width", "height", "min-width", "min-height"];

      str = "Computed styles for element (id='" + e.id + "', class='" + e.className + "'):\n";
      styles = window.getComputedStyle(e,null);

      for ( i = 0; i < propList.length; ++i )
      {
         str += "\t" + propList[i] + ":" + styles.getPropertyValue(propList[i]) + ";\n";
      }
      str += "offsetTop=" + e.offsetTop + ", offsetLeft=" + e.offsetLeft + ", offsetWidth=" + e.offsetWidth + ", offsetHeight=" + e.offsetHeight + "\n";
      str += "clientTop=" + e.clientTop + ", clientLeft=" + e.clientLeft + ", clientWidth=" + e.clientWidth + ", clientHeight=" + e.clientHeight + "\n";
      str += "scrollTop=" + e.scrollTop + ", scrollLeft=" + e.scrollLeft + ", scrollWidth=" + e.scrollWidth + ", scrollHeight=" + e.scrollHeight + "\n";
      str += "X=" + getX(e) + ", Y=" + getY(e);
      $log(level, str); 
   }
}

//--------------------------------------------------------------------
function $log_event(level, expr, e) 
{
   var str, strKey = "";

   $test(expr, e);

   if ( e )
   {
      str = expr + ":= Event type='" + e.type + 
            "', phase='" + ["CAPTURING_PHASE","AT_TARGET","BUBBLING_PHASE"][e.eventPhase-1] + 
            "', bubbles='" + e.bubbles + "'\n";
      str +="  target element " + e.target.tagName + " (id='" + e.target.id + "', class='" + e.target.className + "')\n";
      str +="  current target element "+ ( e.currentTarget ? e.currentTarget.tagName + " (id='" + e.currentTarget.id + "', class='" + e.currentTarget.className + "')" : e.currentTarget ) + "\n";
      if ( e.altKey ) strKey += "+ALT";
      if ( e.ctrlKey ) strKey += "+CTRL";
      if ( e.shiftKey ) strKey += "+SHIFT";
      if ( strKey ) str += "  " + strKey + "\n";
      $log(level, str); 
   }
}

}})