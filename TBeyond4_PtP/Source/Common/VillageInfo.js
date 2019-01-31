/////////////////////////////////////////////////////////////////////
function VillageInfo() 
{
   this.name = '';
   this.id = 0;
   this.x = null;
   this.y = null;
   this.type = undefined; // village type by resources fields
                          // (1-12) types of villages (T3.5 or higher)
                          // (1-6)  types of villages (if < T3.5)
 
   this.pop = undefined; // village population

   this.mark = '\u2022'; // default mark is bullet char
   this.markt = 0;       // 0 - use <mark>, 1 - village under attack

   this.posInListOrg = null;
   this.posInListCur = null;

   this.BiP = []; // buildings in progress
   this.TM  = []; // troop movements

   this.mCap =  TB3O.DefaultMerchantsCapacity[TBU_RACE] * TB3O.nMerchantCapacityFactor[TB3O.nServerType];

   this.csi = new ConstructionInfo();  // buildings in this village
   this.uci = new UnitsCountInfo();
   this.cpi = new CulturePointsInfo(2);
   this.thi = new TownHallInfo();
   this.upi = new UpgradeInfo();  // armoury/smithy upgrades

   this.r = new ResourcesInfo();
   this.r.Res = [750,750,750,750]; // resources available
   this.r.Cap = [800,800,800,800]; // resource storage capacity

   return this;
}

/////////////////////////////////////////////////////////////////////
function initVillageBiP(info, aBiP) 
{
   info.BiP = aBiP;
}

/////////////////////////////////////////////////////////////////////
function initVillageTM(info, aTM) 
{
   info.TM = aTM;
}

M4_DEBUG({{
/////////////////////////////////////////////////////////////////////
// Debug!!!
function getVillageInfoView(info) 
{
   var str = "", i;
   for ( i in info ) 
   {
      if ( typeof info[i] !== "function" )
      {
         if ( i === "BiP" )
         {
            str += "BiP = " + getBiPView(info.BiP);
         }
         else if ( i === "r" )
         {
            str += getResourcesInfoView(info.r);
         }
         else
         {
            str += i + " = " + $toStr(info[i]) + "\n";
         }
      }
   }

   str += "mapId = " + xy2id(info.x,info.y);

   return str;
}

/////////////////////////////////////////////////////////////////////
function showVillageInfo(info) 
{
   alert(getVillageInfoView(info));
}
}})

/////////////////////////////////////////////////////////////////////
function loadVillagesInfo() 
{
   __ENTER__

   var villagesInfo = loadPersistentUserObject('VillagesInfo',{});
   var villageId, villageInfo;
   var defVillageInfo = new VillageInfo();

   for ( villageId in villagesInfo ) 
   {
      villageInfo = villagesInfo[villageId];
      cloneUndefinedProperties(defVillageInfo, villageInfo);
      removeUndefinedProperties(defVillageInfo, villageInfo);
   }
   __EXIT__

   return villagesInfo;
}

/////////////////////////////////////////////////////////////////////
function saveVillagesInfo(villagesInfo) 
{
   __ENTER__
   savePersistentUserObject('VillagesInfo', villagesInfo);
   __EXIT__
}

/////////////////////////////////////////////////////////////////////
// remove outdated events (all events in array MUST BE sorted by time)
function reconcileEvents(evA, ttCurrent)
{
   var i;
   for ( i = 0; i < evA.length && ttCurrent >= evA[i].ttEnd; ++i ) continue;

   if ( i > 0 )
   {
      M4_DEBUG(
         for (var j = 0; j < i; ++j )
         {
            __LOG__(5, "reconcile event: " + JSON.stringify(evA[j]))
         } 
      )
      evA.splice(0,i);
   }
}

/////////////////////////////////////////////////////////////////////
// update info. At this point all available info must be loaded
function reconcileVillagesInfo(villagesInfo)
{
   __ENTER__

   var villageId, i, 
       ttCurrent = toTimeStamp(getServerTimeNow());

   for ( villageId in villagesInfo ) 
   {
      var villageInfo = villagesInfo[villageId];

      // cleanup BiP
      var arrBip = villageInfo.BiP;
      for ( i = 0; i < arrBip.length; )
      {
         if ( ttCurrent >= arrBip[i].endTime && arrBip[i].endTime !== null )
         {
            __LOG__(5,villagesInfo[villageId].name +  " reconcile BiP record: " + JSON.stringify(arrBip[i]))
            arrBip.splice(i,1);
         }
         else
         {
            ++i;
         }
      }

      // cleanup TM
      var arrTM = villageInfo.TM;
      for ( i = 0; i < arrTM.length; )
      {
         if ( ttCurrent >= arrTM[i].fT && arrTM[i].fT !== null )
         {
            __LOG__(5,villagesInfo[villageId].name +  " reconcile TM record: " + JSON.stringify(arrTM[i]))
            arrTM.splice(i,1);
         }
         else
         {
            ++i;
         }
      }

      reconcileEvents(villageInfo.thi.evA, ttCurrent);
      reconcileEvents(villageInfo.upi.evA, ttCurrent);
      IF_TB3(reconcileEvents(villageInfo.upai.evA, ttCurrent);)
   }
   __EXIT__
}

//////////////////////////////////////////////////////////////////////
// normalize saved positions in list
// all position must be between 0 and vCount, no duplicates allowed
// return array of villages Ids in custom order
function getNormalizedCustomVillagesOrder()
{
   var mapPos2Id = [];
   var aUnPosId = [];
   var i, pos, villageId;

   for ( villageId in TB3O.VillagesInfo ) 
   {
      pos = parseInt10(TB3O.VillagesInfo[villageId].posInListCur);

      if ( !isNaN(pos) && mapPos2Id[pos] === undefined )
         mapPos2Id[pos] = villageId;
      else
         aUnPosId[aUnPosId.length] = villageId;
   }

   // remove undefined entries
   for ( pos = 0; pos < mapPos2Id.length; ++pos )
   {
      if ( mapPos2Id[pos] === undefined )
         mapPos2Id.splice(pos,1);
   }
   M4_DEBUG({{
   if ( mapPos2Id.length + aUnPosId.length !== TB3O.VillagesCount ) alert("Shit happens");
   }})

   // sort unpositioned villages
   aUnPosId.sort(function(id1, id2) 
                 {
                    return TB3O.VillagesInfo[id1].posInListOrg-TB3O.VillagesInfo[id2].posInListOrg;
                    //return compare(TB3O.VillagesInfo[id1].name,TB3O.VillagesInfo[id2].name);
                 });

   // concatenate two arrays
   for ( i = 0; pos < TB3O.VillagesCount; ++pos,++i )
   {
      mapPos2Id[pos] = aUnPosId[i];
   }

   return mapPos2Id;
}


/////////////////////////////////////////////////////////////////////
// return preffered villages order. Assume that villagesInfo already normalized
// prefferedOrder = null,undefined or "current" - return villages in order as they must be displayed
//                  "custom"     - return villages in user customized order
//                  "original"   - return villages in original order
//                  "random"     - return villages in random order
function getVillagesOrder(villagesInfo,prefferedOrder)
{
   var bCustomOrder = (TBO_CUSTOMIZE_VLIST === "1" || prefferedOrder === "custom") && prefferedOrder !== "original";
   var orderedIds = [];
   var pos,villageId,villageInfo;

   for ( villageId in villagesInfo ) 
   {
      villageInfo = villagesInfo[villageId];
      pos = bCustomOrder ? villageInfo.posInListCur : villageInfo.posInListOrg;
      orderedIds[pos] = villageId;
   }

   if ( prefferedOrder === "random" )
   {
      shuffle(orderedIds);
   }
   return orderedIds;
}

//////////////////////////////////////////////////////////////////////
function getVillagesMapIdDict(villagesInfo)
{
   var villageId,villageInfo,mapId;
   var mapIdDict = {};

   for ( villageId in villagesInfo )
   {
      villageInfo = villagesInfo[villageId];
      mapId = xy2id(villageInfo.x,villageInfo.y);
      mapIdDict[mapId] = villageId;
   }

   return mapIdDict;
}

//////////////////////////////////////////////////////////////////////
function getVillageInfoByMapId(villagesInfo, mapId)
{
   var villageId,villageInfo;

   if ( mapId )
   {
      for ( villageId in villagesInfo )
      {
         villageInfo = villagesInfo[villageId];
         if ( mapId == xy2id(villageInfo.x,villageInfo.y) )
         {
            return villageInfo;
         }
      }
   }

   return null;
}

//////////////////////////////////////////////////////////////////////
function getActualVillageCP(villageInfo)
{
   var cp;
   var constructionInfo = villageInfo.csi;
   var culturePointsInfo = villageInfo.cpi;

   var ttConstructionInfoUpd = getConstructionInfoTimestamp(constructionInfo);

   if ( (ttConstructionInfoUpd && culturePointsInfo.ttUpd && ttConstructionInfoUpd < culturePointsInfo.ttUpd) ||
        (!ttConstructionInfoUpd && culturePointsInfo.ttUpd) )
   {
      cp = culturePointsInfo.cp;
   }
   else
   {
      cp = getBuildingsCP(constructionInfo.b);
   }

   return cp;
}


//////////////////////////////////////////////////////////////////////
// TODO: need to redesign (like CP calculation)
function getActualVillagePopulation(villageInfo)
{
   var pop;

   if ( villageInfo.pop !== undefined )
   {
      pop = villageInfo.pop;
   }
   else
   {
      pop = getBuildingsCropConsumption(villageInfo.csi.b);
   }

   return pop;
}


//////////////////////////////////////////////////////////////////////
function getTotalPopulation()
{
   var villageId;
   var pop = 0;

   for ( villageId in TB3O.VillagesInfo )
   {
      pop += getActualVillagePopulation(TB3O.VillagesInfo[villageId]);
   }

   return pop;
}

