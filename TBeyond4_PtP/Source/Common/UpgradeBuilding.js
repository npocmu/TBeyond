//////////////////////////////////////////////////////////////////////
// Fill 'Upgrade in progress' tip table
function uiFillUpgradeProgressTable(aTb, gid, upgradeInfo)
{
   var evA = upgradeInfo.evA;
   if ( evA.length > 0 )
   {
      var ttEnd, ttCurrent = toTimeStamp(getServerTimeNow());
      var dtNow = getDesiredTime(ttCurrent);

      var i, bS;
      for ( i = 0, bS = false; i < evA.length; ++i )
      {
         var upgradingEvent = evA[i];
         ttEnd = upgradingEvent.ttEnd;
         if ( ttCurrent < ttEnd || ttEnd === null )
         {
            if ( !bS )
            {
               aTb.appendChild(uiCreateVillageInfoTipHead(getBuildingIcon(gid)));
               bS = true;
            }
            aTb.appendChild(uiCreateVillageInfoTipRow([getTroopImage(upgradingEvent.tix)," " + upgradingEvent.name], 
                                                      upgradingEvent.txtLvl, dtNow, ttEnd)); 
         }
      }
   }
}

//////////////////////////////////////////////////////////////////////
function uiFillUpiPTable(aTb, upgradeInfo)
{
   uiFillUpgradeProgressTable(aTb, GID_SMITHY, upgradeInfo);
}

//////////////////////////////////////////////////////////////////////
// Create the 'Upgrade in progress' table for a village
// Planned for Dorf3?
/*
function uiCreateUpiPTable(villageId)
{
   return uiCreateVillageInfoTipTable(villageId,"upi",uiFillUpiPTable);
}
*/

//////////////////////////////////////////////////////////////////////
// Used for updates info from refresh callbacks
function getUpgradeInfo(gid, villageId, aDoc, ttServer)
{
   __ENTER__

   var villageInfo = TB3O.VillagesInfo[villageId];
   var upgradeInfo =  scanUpgradeInfo(aDoc, ttServer);

   if ( upgradeInfo )
   {
      if ( gid === GID_SMITHY )
      {
         villageInfo.upi = upgradeInfo;
      }
   }
   __EXIT__

   return !!upgradeInfo;
}

//////////////////////////////////////////////////////////////////////
function processUpgradeBuilding(gid)
{
   getUpgradeInfo(gid, TB3O.ActiveVillageId, document, toTimeStamp(TB3O.serverTime));
}
