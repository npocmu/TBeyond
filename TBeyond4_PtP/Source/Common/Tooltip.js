//////////////////////////////////////////////////////////////////////
function Tooltip(id, delay)
{
   this.delay = delay;
   this.id = id;
   this.ttD = null;
}

//////////////////////////////////////////////////////////////////////
Tooltip.prototype.init = function () 
{
   if ( !this.ttD )
   {
      this.ttD = $g(this.id);
      if ( !this.ttD )
      {
         this.ttD = $div();
         this.ttD.id = this.id;
         document.body.appendChild(this.ttD);
      }
   }
};

//////////////////////////////////////////////////////////////////////
Tooltip.prototype.addToElement = function (node, contentGenerator) 
{
   var timer = null;
   var self = this;
   var lastMouseEvent;
   var wH, wW;

   //-------------------------------------------------------------
   function cancelTimer()
   {
      if ( timer ) 
      {
         clearTimeout(timer);
         timer = null;
      }
   }

   //-------------------------------------------------------------
   function showTip()
   {
      timer = null;
      var content = contentGenerator(lastMouseEvent);

      if ( content )
      {
         removeChildren(self.ttD);
         self.ttD.appendChild(content);
         self.ttD.style.display = 'block';
         onMouseMove();
      }
   }

   //-------------------------------------------------------------
   function onMouseMove(e)
   {
      if ( !e )
      {
         e = lastMouseEvent;
      }
      else
      {
         lastMouseEvent = e;
      }

      if ( self.ttD && self.ttD.style.display !== 'none' )
      {
         var x, y;
         var dx = 8;
         var dy = 8;
         var dH = self.ttD.clientHeight;
         var dW = self.ttD.clientWidth;

         if ( (e.clientY + dy + dH) > wH ) 
         { 
            y = e.clientY - dy - dH; 
            if ( y < 0 ) { y = 0;}
         }
         else { y = e.clientY + dy; }
         y += window.pageYOffset;

         if ( docDir[0] === 'left' )
         {
            if ( (e.clientX + dx + dW) > wW ) { x = e.clientX - dx - dW; }
            else { x = e.clientX + dx; }
         }
         else 
         {
            if ( (e.clientX - dx - dW) < 0 ) { x = e.clientX + dx; }
            else { x = e.clientX - dx - dW; }
         }
         x += window.pageXOffset;

         self.ttD.style.top = y + "px";
         self.ttD.style.left = x + "px";
      }
   }

   //-------------------------------------------------------------
   function onMouseOver(e)
   {
      self.init();
      cancelTimer();
      timer = setTimeout(showTip, self.delay);
      document.addEventListener("mousemove", onMouseMove, false);
      lastMouseEvent = e;
      wH = document.documentElement.clientHeight; // window.innerHeight;
      wW = document.documentElement.clientWidth; // window.innerWidth;
   }

   //-------------------------------------------------------------
   function onMouseOut(e)
   {
      self.init();
      cancelTimer();
      self.ttD.style.display = 'none';
      lastMouseEvent = null;
      document.removeEventListener("mousemove", onMouseMove, false);
   }

   node.addEventListener("mouseover", onMouseOver, false);
   node.addEventListener("mouseout",  onMouseOut,  false);
};


TB3O.Tooltip = new Tooltip("tb_tooltip", TB3O.Timeouts.tooltip);


//////////////////////////////////////////////////////////////////////
function uiAddTooltip(node, contentGenerator) 
{
   TB3O.Tooltip.addToElement(node, contentGenerator);
}


