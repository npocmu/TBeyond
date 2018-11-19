
//////////////////////////////////////////////////////////////////////
function getWaterworksOases()
{
   var result = null;
   var oases = [];
   var aTable = __TEST__($qf("table.oasesOwned"));

   if ( aTable && aTable.tBodies.length >= 1 )
   {
      var aRows = aTable.tBodies[0].rows;
      var oasesCount = aRows.length;

      for ( var i = 0; i < oasesCount; ++i )
      {
         var oasisType = getOasisTypeFromNode(aRows[i].cells[2]);
         if ( oasisType )
         {
            oases.push(oasisType);
         }
      }

      if ( oases.length === oasesCount )
      {
         result = oases;
      }
      else
      {
         __ERROR__("Can't parse oases info")
         __DUMP__(oasesCount, oases)
      }
   }

   return result;
}

//////////////////////////////////////////////////////////////////////
function processWaterworks()
{
   __ENTER__

   TB3O.pageSelector = "waterworks";
   TB3O.VillageOases = getWaterworksOases();
   __DUMP__(TB3O.VillageOases)

   __EXIT__
}

