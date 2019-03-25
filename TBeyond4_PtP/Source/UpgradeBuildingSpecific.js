//////////////////////////////////////////////////////////////////////
function scanUpgradeData(aDoc, ttServer)
{
   var upgradeInfo = new UpgradeInfo(); upgradeInfo.ttUpd = ttServer;
   var upgradesList = {};

   //-----------------------------------------------------------------
   function parseTroopLevel(elem)
   {
      var aImg = __TEST__(searchTroopImgNode(elem));
      if ( aImg )
      {
         var tInfo = getTroopIndexTitleFromImg(aImg);
         var aSpan = __TEST__($nth_tag(elem,"span"));
         if ( isIntValid(tInfo[0]) && aSpan )
         {
            var txtLvl = trimWhitespaces(aSpan.textContent);
            var lvl = scanIntAny(txtLvl);

            if ( isIntValid(lvl) )
            {
               var troopUpgInfo = {
                  "tix":    tInfo[0],
                  "label":  tInfo[1],
                  "txtLvl": txtLvl,
                  "lvl":    lvl
               };

               return troopUpgInfo;
            }
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
               var troopUpgInfo = parseTroopLevel(cells[0]);
               if ( troopUpgInfo )
               {
                  var ttEnd = getEventTimeStamp(ttServer, cells[1].textContent);
                  upgradeInfo.evA.push(new UpgradingEvent(troopUpgInfo.label, ttEnd, troopUpgInfo.tix, troopUpgInfo.txtLvl, troopUpgInfo.lvl));
               }
            }
         }
         return ( upgradeInfo.evA.length === (queueTb.rows.length - 1) );
      }
      return true;
   }

   //-----------------------------------------------------------------
   function scanUpgrades()
   {
      var unitsData = [];
      var upgradeNodes = $xf1("//div[@id='" + ID_CONTENT + "']//div[" + $xClass('information') + "]", 'a', aDoc, aDoc);

      var i, count = 0;
      for ( i = 0; i < upgradeNodes.length; ++i )
      {
         var containerNode = upgradeNodes[i];
         var labelNode = $qf(".title", 'f', containerNode);

         var troopUpgInfo = parseTroopLevel(labelNode);

         if ( troopUpgInfo )
         {
            var uix = getUnitIndexFromTroopIndex(troopUpgInfo.tix);
            upgradeInfo.uul[uix] = troopUpgInfo.lvl;
            ++count;

            troopUpgInfo.contract = scanCommonContractInfo(containerNode);
            troopUpgInfo.container = containerNode;

            troopUpgInfo.linkNode = $qf(".contracting", 'f', containerNode);

            upgradesList[troopUpgInfo.tix] = troopUpgInfo;
         }
      }
      return (count === upgradeNodes.length);
   }

   //-----------------------------------------------------------------
   var result = scanUpgradingQueue() && scanUpgrades();

   if ( result )
   {
      for ( var i = 0; i < upgradeInfo.evA.length; ++i )
      {
         var upgradingEvent = upgradeInfo.evA[i];
         var troopUpgInfo = upgradesList[upgradingEvent.tix];
         if ( troopUpgInfo )
         {
            troopUpgInfo.lvlNext = upgradingEvent.lvl;
         }
      }

      //__DUMP__(upgradeInfo);
      //__DUMP__(upgradesList);

      return { "info" : upgradeInfo, "list": upgradesList };
   }


   return null;
}
