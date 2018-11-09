/*

   Utility function for work with buildings in format
   like described in ConstructionInfo.b
*/

//////////////////////////////////////////////////////////////////////
// return info about first available building with @gid
// return null if no such building(s) exist
function getBuildingInfoByGid(b, gid)
{
   var id; 
   for ( id = 1; id < b.length; ++id )
   {
      if ( b[id] && b[id][0] === gid ) 
      { 
         return new BuildingInfo(null, null, id, gid, b[id][1]); 
      }
   }
   return null;
}

//////////////////////////////////////////////////////////////////////
function getBuildingIdByGid(b, gid)
{
   var buildingInfo = getBuildingInfoByGid(b, gid);
   return ( buildingInfo ) ? buildingInfo.id : null;
}

//////////////////////////////////////////////////////////////////////
function getBuildingsTotalCost(b,costIndex)
{
   var val = 0;
   var id; 
   for ( id = 1; id < b.length; ++id )
   {
      if ( b[id] ) 
      {
         var gid = b[id][0];
         var bData = bCost[gid];
         var cost;

         if ( bData )
         {
            var maxlvl = Math.min(b[id][1], bData.length - 1);
            cost = bData[maxlvl][costIndex];
            val += cost;
         }

         //__DUMP__(gid,cost,val)
      }
   }
   return val;
}

//////////////////////////////////////////////////////////////////////
function getBuildingsCP(b)
{
   return getBuildingsTotalCost(b,BCI_CP);
}

//////////////////////////////////////////////////////////////////////
function getBuildingsCropConsumption(b)
{
   return getBuildingsTotalCost(b,BCI_CC);
}

//////////////////////////////////////////////////////////////////////
function getBuildingIconName(gid)
{
   return (gid ? "g" + gid + "Icon " : "") + "gebIcon";
}

//////////////////////////////////////////////////////////////////////
function getBuildingIcon(gid)
{
   return I(getBuildingIconName(gid));
}

//////////////////////////////////////////////////////////////////////
function isBuildingPresent(villageId, gid)
{
   var b = TB3O.VillagesInfo[villageId].csi.b;
   var id = getBuildingIdByGid(b,gid);
   return ( !!id && b[id][1] > 0 );
}

//////////////////////////////////////////////////////////////////////
// fast check that some building can potentially train units
function canBuildingTrainUnits(gid)
{
   return isSomeOf(gid,GID_BARRACKS,GID_STABLE,GID_WORKSHOP,GID_RESIDENCE,GID_PALACE,GID_GREAT_BARRACK,GID_GREAT_STABLE,GID_TRAPPER);
}

//////////////////////////////////////////////////////////////////////
// check that some building can produce resources
function canBuildingProduceResources(gid)
{
   return isSomeOf(gid,GID_LUMBER,GID_CLAY,GID_IRON,GID_CROP);
}

//////////////////////////////////////////////////////////////////////
// get common info about bulding
function getCommonBuildingInfo(gid, villageId, aDoc /*opt*/)
{
   var info = scanCommonBuildingInfo(aDoc);
   if ( info )
   {
      T.saveLocaleString("BN_GID" + gid, info.name);
   }
   return info;
}

//////////////////////////////////////////////////////////////////////
// Search and parse all contracts for building
function getBuildingContracts()
{
   var i;
   var contractsNodes = searchBuildingContractsNodes();
   var contracts = [];

   for ( i = 0; i < contractsNodes.snapshotLength; i++ )
   {
      var costNode = contractsNodes.snapshotItem(i);
      var contractInfo = scanCommonContractInfo(costNode);
      
      if ( contractInfo ) 
      {
         contracts.push(contractInfo);
      }
   }

   return contracts;
}

//////////////////////////////////////////////////////////////////////
// proccess common info about bulding
function processBuilding(gid)
{
   __ENTER__

   var info = getCommonBuildingInfo(gid, TB3O.ActiveVillageId);
   //__DUMP__(info)

   if ( info )
   {
      var productionInfo = scanBuildingProductionInfo(gid, info.level);
      __DUMP__(productionInfo)
      if ( productionInfo )
      {
         TB3O.BuildingProductionInfo = productionInfo;
      }
   }

   var contracts = getBuildingContracts();
   //__DUMP__(contracts)
   TB3O.BuildingContracts = contracts;

   __EXIT__
}
