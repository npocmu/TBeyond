//////////////////////////////////////////////////////////////////////
function getStatisticsMenu(aDoc)
{
   __ENTER__
   var tM;
   var statMenu = getGMcookieV2('statistics');
   var items = 0;

   tM = $xf("//div[@id='" + ID_CONTENT + "']//div[contains(@class,'tabNavi')]//a", 'l', aDoc, aDoc);
   items += processMenuSnapshot(statMenu, tM);

   tM = $xf("//div[@id='" + ID_CONTENT + "']//div[contains(@class,'subNavi')]//a", 'l', aDoc, aDoc);
   items += processMenuSnapshot(statMenu, tM);

   if ( items ) 
   { 
      setGMcookieV2('statistics', statMenu); 
   }

   __EXIT__

   function processMenuSnapshot(statMenu, tM)
   {
      var i, items = 0;

      if ( tM.snapshotLength > 0 )
      {
         for ( i = 0; i < tM.snapshotLength; i++)
         {
            var aNode = tM.snapshotItem(i);
            var url = parseUri(aNode.getAttribute("href"));
            var arS = [aNode.text, url.relative];
            var im = ( url.queryKey.id === undefined ) ? 1 : parseInt10(url.queryKey.id);
            statMenu[im] = arS;
            ++items;
         }
      }
      __ASSERT__(tM.snapshotLength,"Can't detect statistics menu!");

      return items;
   }
}
