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
// return array of {id, produce, pph} for all resource fields
function getFieldsBasePpH(b)
{
   var fields = [];
   var id; 
   for ( id = 1; id <= 18; ++id )
   {
      if ( b[id] ) 
      {
         var info = getFieldBasePpH(b[id][0], b[id][1]);
         if ( info.pph )
         {
            info.id = id;
            fields.push(info);
         }
      }
   }
   return fields;
}

//////////////////////////////////////////////////////////////////////
// return array [lumber,clay,iron,crop] with sum of base production 
// of all fields
function getFieldsTotalBasePpH(b)
{
   var prod = [0, 0, 0, 0];

   var fields = getFieldsBasePpH(b);
   var i; 
   for ( i = 0; i < fields.length; ++i )
   {
      var fieldInfo = fields[i];
      prod[fieldInfo.produce] += fieldInfo.pph;
   }
   return prod;
}

//////////////////////////////////////////////////////////////////////
// returns the percentage boost for the resource production of type @ri 
// obtained by the corresponding factories. 0 if no such factories present.
function getFactoriesTotalBoost(b, ri)
{
   function getPPB(gid)
   {
      var buildingInfo = getBuildingInfoByGid(b, gid);
      if ( buildingInfo )
      {
         return getFactoryPPB(buildingInfo.gid, buildingInfo.lvl).ppb;
      }
      return 0;
   }

   var ppb = 0; 

   if ( ri === RI_LUMBER )
   {
      ppb = getPPB(GID_SAWMILL);
   }
   else if ( ri === RI_CLAY )
   {
      ppb = getPPB(GID_BRICKYARD);
   }
   else if ( ri === RI_IRON )
   {
      ppb = getPPB(GID_IRON_FOUNDRY);
   }
   else if ( ri === RI_CROP )
   {
      ppb = getPPB(GID_GRAIN_MILL) + getPPB(GID_BAKERY);
   }

   return ppb;
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
   return isSomeOf(gid, GID_BARRACKS, GID_STABLE, GID_WORKSHOP, GID_RESIDENCE, GID_PALACE, 
                        GID_COMMANDCENTER, GID_GREAT_BARRACK, GID_GREAT_STABLE, GID_TRAPPER);
}

//////////////////////////////////////////////////////////////////////
// check that some building can produce resources
function canBuildingProduceResources(gid)
{
   var info;
   var bData = bCost[gid];
   if ( bData )
   {
      info = bCost[gid][0][BCI_INFO];
   }
   return ( info && hasOwnProperty(info,"produce") )
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

   for ( i = 0; i < contractsNodes.length; i++ )
   {
      var contractNode = contractsNodes[i];
      var contractInfo = scanCommonContractInfo(contractNode);
      
      if ( contractInfo ) 
      {
         contracts.push(contractInfo);
      }
   }

   return contracts;
}

//////////////////////////////////////////////////////////////////////
// proccess common info about building
function processBuilding(gid)
{
   __ENTER__

   if ( gid )
   {
      var info = getCommonBuildingInfo(gid, TB3O.ActiveVillageId);

      if ( info )
      {
         var productionInfo = scanBuildingProductionInfo(gid, info.level);
         __DUMP__(productionInfo)
         if ( productionInfo )
         {
            TB3O.BuildingProductionInfo = productionInfo;
         }
      }
   }

   var contracts = getBuildingContracts();
   __DUMP__(contracts)
   TB3O.BuildingContracts = contracts;

   __EXIT__
}
