//////////////////////////////////////////////////////////////////////
// returns menu as object { menu:menu_parent_DOM_node, active:idx, items:[[txt1,href1],...,[txtN,hrefN]] }
function __searchAndParseMenu(aDoc,cls)
{
   var menuItems = [];
   var ssMenu = $xf("//div[@id='" + ID_CONTENT + "']//div["+ $xClass(cls) + "]/div[" + $xClass('container') + "]", 'l', aDoc, aDoc);
   var i, iActive;
   var goldItemsTotal = 0;

   for ( i = 0; i < ssMenu.snapshotLength; ++i )
   {
      var label = "" ;
      var aElem = ssMenu.snapshotItem(i);
      if ( hasClass(aElem,"active") ) { iActive = i; }

      var goldItem = hasClass(aElem,"gold");
      if ( goldItem ) { ++goldItemsTotal; }
      var aLink = $nth_tag(aElem,"a");
      var href = ( aLink ) ? aLink.href : ""; 

      var aSpan = $nth_tag(aElem,"span");
      if ( aSpan )
      {
         label = aSpan.textContent;
      }
      else if ( aLink )
      {
         label = aLink.textContent;
      }

      menuItems.push([trimWhitespaces(label),href,goldItem?1:0]);
   }
   __ASSERT__(ssMenu.snapshotLength > 0, "Can't find menu tabs!")

   return ( menuItems.length > 0 )  ? new TravianMenu(ssMenu.snapshotItem(0).parentNode, iActive, menuItems) : null;
}


//////////////////////////////////////////////////////////////////////
function searchAndParseTabMenu(aDoc)
{
   return __searchAndParseMenu(aDoc,'tabNavi');
}

//////////////////////////////////////////////////////////////////////
function searchAndParseSubMenu(aDoc)
{
   return __searchAndParseMenu(aDoc,'subNavi');
}

//////////////////////////////////////////////////////////////////////
TravianMenu.prototype.getItemNode = function(i)
{
   var ssMenuItem = $xf("./div[" + $xClass('container') + "][" + (i+1) + "]", 'f', this.container, document);
   return ssMenuItem;
};

//////////////////////////////////////////////////////////////////////
// can modify only current document
TravianMenu.prototype.uiModify = function()
{
   __ENTER__
   __DUMP__(this)

   var ssMenu = $xf("./div[" + $xClass('container') + "]", 'l', this.container, document);
   var i;

   for ( i = 0; i < ssMenu.snapshotLength && i < this.items.length; ++i )
   {
      var aElem = ssMenu.snapshotItem(i);
      if ( hasClass(aElem,"active") && i !== this.active ) 
      { 
         delClass(aElem,"active"); addClass(aElem,"normal"); 
      }
      else if ( hasClass(aElem,"normal") && i === this.active ) 
      { 
         delClass(aElem,"normal"); addClass(aElem,"active"); 
      }

      ifClass(aElem, this.items[i][2], "gold");
      var href = this.items[i][1];
      var aLink = $nth_tag(aElem,"a");
      if ( aLink )
      {
         aLink.href = href;
      }
      else
      {
         var aSpan = $nth_tag(aElem,"span");
         if ( aSpan )
         {
            var parentNode = aSpan.parentNode;
            parentNode.removeChild(aSpan);
            parentNode.appendChild($lnk(['href',href],aSpan));
         }
      }
   }

   __EXIT__
};

