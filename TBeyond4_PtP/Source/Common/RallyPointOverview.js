//////////////////////////////////////////////////////////////////////
// calculate overall units count
function getVillageUnitsCount(villageInfo, rallyPointInfo)
{
   __ENTER__
   if ( rallyPointInfo )
   {
      var ti;
      var mapId = xy2id(villageInfo.x,villageInfo.y);
      var unitsTotal = fillArray(new Array(TG_UNITS_COUNT),0);

      for ( ti = 0; ti < rallyPointInfo.t.length; ++ti )
      {
         var troopDetailsInfo = rallyPointInfo.t[ti];
         if ( troopDetailsInfo.h_id === mapId && troopDetailsInfo.o_id === undefined ) 
         {
            accumulateArray(unitsTotal, troopDetailsInfo.u);
         }
      }

      villageInfo.uci.ut = unitsTotal;
      villageInfo.uci.ttUpd = rallyPointInfo.ttUpd;

      __DUMP__(villageInfo.uci)
   }
   else
   {
      villageInfo.uci.ttUpd = undefined;
   }
   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function processRallyPointOverview()
{
   __ENTER__

   var rallyPointInfo = getRallyPointInfo(TB3O.ActiveVillageId, document, toTimeStamp(TB3O.serverTime), false);
   __ASSERT__(rallyPointInfo,"Can't parse rally point info")

   //TB3O.VillagesRPInfo.
   //processRallyPointOverview.RPI = rallyPointInfo; // save for later use

   //savePersistentVillageObject("RPI", processRallyPointOverview.RPI);

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiModifyRallyPointOverview()
{
   __ENTER__


   __EXIT__
}
