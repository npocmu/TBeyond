//////////////////////////////////////////////////////////////////////
function getStatisticsMenu(aDoc)
{
   __ENTER__

   var menu = searchAndParseSubMenu(aDoc);

   __ASSERT__(menu,"Can't detect statistics menu!");

   if ( menu ) 
   {
      var i, statMenu = {};
      for ( i = 0; i < menu.items.length; ++i )
      {
         var menuItem = menu.items[i];
         var url = parseUri(menuItem[1]);
         var id = url.queryKey.id || 0;
         statMenu[id] = menuItem[0];
      }
      __DUMP__(statMenu)

      if ( i )
      {
         savePersistentUserObject('statistics', statMenu)
      }
   }

   __EXIT__

}
