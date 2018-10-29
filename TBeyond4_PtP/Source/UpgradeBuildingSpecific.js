//////////////////////////////////////////////////////////////////////
function scanUpgradeInfo(aDoc, ttServer)
{
   var upgradeInfo =  new UpgradeInfo(); upgradeInfo.ttUpd = ttServer;

   //-----------------------------------------------------------------
   function parseTroopLevel(elem)
   {
      var aImg = __TEST__($nth_tag(elem,"img"));
      if ( aImg )
      {
         var tInfo = getTroopIndexTitleFromImg(aImg);
         var aSpan = __TEST__($nth_tag(elem,"span"));
         if ( aSpan )
         {
            var txtLvl = trimBlanks(aSpan.textContent);
            tInfo.push(txtLvl);
            return tInfo;
         }
      }
      return null;
   }

   //-----------------------------------------------------------------
   function scanUpgradingQueue()
   {
      var queueTb = searchQueueTable(aDoc);
      if ( queueTb )
      {
         var rows = queueTb.rows;

         var xi;
         for (xi = 1; xi < rows.length; ++xi)
         {
            var cells = rows[xi].cells;
            if ( cells.length === 3 )
            {
               var tInfo = parseTroopLevel(cells[0]);
               if ( tInfo )
               {
                  var lvl = scanIntAny(tInfo[2]);
                  if ( isIntValid(lvl) )
                  {
                     var ttEnd = getEventTimeStamp(ttServer, cells[1].textContent);
                     upgradeInfo.evA.push(new UpgradingEvent(tInfo[1], ttEnd, tInfo[0], tInfo[2], lvl));
                  }
               }
            }
         }
         return ( upgradeInfo.evA.length === (queueTb.rows.length - 1) );
      }
      return true;
   }

   //-----------------------------------------------------------------
   function scanUpgradeLevels()
   {
      var unitsData = [];
      var unitsList = $xf("//div[@id='" + ID_CONTENT + "']//div[" + $xClass('information') + "]/div["+ $xClass('title') + "]", 'l', aDoc, aDoc);
      var i, count = 0;
      for ( i = 0; i < unitsList.snapshotLength; ++i )
      {
         var tInfo = parseTroopLevel(unitsList.snapshotItem(i));

         if ( tInfo )
         {
            var lvl = scanIntAny(tInfo[2]);
            if ( isIntValid(lvl) )
            {
               var uix = tInfo[0] - TBU_RACE_DELTA;
               upgradeInfo.uul[uix] = lvl;
               ++count;
            }
         }
      }
      return (count === unitsList.snapshotLength);
   }

   var result = scanUpgradingQueue() && scanUpgradeLevels();

   __DUMP__(upgradeInfo);

   return result ? upgradeInfo : null;
}
