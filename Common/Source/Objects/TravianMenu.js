//////////////////////////////////////////////////////////////////////
// returns menu as object { menu:menu_parent_DOM_node, active:idx, items:[[txt1,href1],...,[txtN,hrefN]] }
function TravianMenu(container, active, items)
{
   this.container = container;
   this.active = active;
   this.items = items;
}

//////////////////////////////////////////////////////////////////////
TravianMenu.prototype.countLinks = function()
{
   var i, aLinks = 0;
   for ( i = 0; i < this.items.length; ++i )
   {
      if ( this.items[i][1] !== "" ) { ++aLinks; }
   }
   return aLinks;
};

//////////////////////////////////////////////////////////////////////
TravianMenu.prototype.countLockedItems = function()
{
   var i, locks = 0;
   for ( i = 0; i < this.items.length; ++i )
   {
      if ( this.items[i][2] ) { ++locks; }
   }
   return locks;
};