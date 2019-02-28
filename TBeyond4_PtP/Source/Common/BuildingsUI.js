//////////////////////////////////////////////////////////////////////
function uiCreateResourceBuildingAdviceTable(cost, cc, prod_profit)
{
   var aAdviceTable = null;
   var produce = prod_profit[0];
   var profit = prod_profit[1];

   if ( profit > 0 )
   {
      var resTot = totalResources(cost);

      var resImg = "r" + (produce + 1);

      var secToProduce = Math.ceil(resTot/(profit-cc) * 3600);
      var strTimeSpan = formatTimeSpan(secToProduce, 1);

      aAdviceTable = $t([attrInject$, ["class","tbBuildHint"], ["cellspacing","1"]], 
                   [
                      $e("thead", null, [
                         $r(null,[
                            $th(["class","tbTotal tbCost"], [TX("PROD_HINT_COLS",0),$e("br"),I("r0")]),
                            $th(null,                       [TX("PROD_HINT_COLS",1),$e("br"),I(resImg)]),
                            $th(["class","tbProd"],         [TX("PROD_HINT_COLS",2),$e("br"),I("r0")," = ",I(resImg)," \u2212 ",I("r5")]),
                            $th(["class","tbTimeSpan"],     TX("PROD_HINT_COLS",3))
                         ])
                      ]),
                      $e("tbody", null, [
                         $r(null,[
                            $td($ls(resTot)),
                            $td($ls(profit)),
                            $td($ls(profit - cc)),
                            $td(strTimeSpan)
                         ])
                      ])
                   ]);
   }
   return aAdviceTable;
}

//////////////////////////////////////////////////////////////////////
function calculateBuildProfit(gid, new_production, prev_production /*opt*/)
{
   //-----------------------------------------------------------------
   function getIncreasedCumulativeOasesBoost(oasesBoost, increaseFactor)
   {
      var oi, ri;
      var cumulativeBoost = [0,0,0,0];

      for (oi = 0; oi < oasesBoost.length; ++oi)
      {
         for (ri = 0; ri < 4; ++ri)
         {
            cumulativeBoost[ri] += oasesBoost[oi][ri] + Math.round(oasesBoost[oi][ri]*increaseFactor);
         }
      }

      return cumulativeBoost;
   }

   //-----------------------------------------------------------------
   var bInfo = bCost[gid][0][BCI_INFO];

   if ( prev_production === undefined )
   {
      prev_production = 0
   }
   var profit = new_production - prev_production;

   // profit in percents?
   if ( bInfo.upg_type === 1 )
   {
      var PpH = getFieldsTotalBasePpH(TB3O.ActiveVillageInfo.csi.b)[bInfo.produce];
      __DUMP__(PpH)
      // slightly incorrect because need to round a production of each building 
      // exact formula:
      //    profit = sum(round(pph*newboost) - round(pph*oldboost))
      profit = Math.floor(profit/100 * PpH);
   } 
   else if ( bInfo.upg_type === 2 ) // Waterworks
   {
      profit = 0;

      if ( TB3O.VillageOases )
      {
         var oi, ri, fi;
         var normalBoost = [];
         for (oi = 0; oi < TB3O.VillageOases.length; ++oi)
         {
            normalBoost.push(oasisTypes[TB3O.VillageOases[oi]]);
         }

         var currentCumBoost = getIncreasedCumulativeOasesBoost(normalBoost, prev_production/100);
         var possibleCumBoost = getIncreasedCumulativeOasesBoost(normalBoost, new_production/100);
         var b = TB3O.ActiveVillageInfo.csi.b;
         var factoriesBoost = [0,0,0,0];

         for ( ri = 0; ri < 4; ++ri )
         {
            factoriesBoost[ri] = getFactoriesTotalBoost(b, ri);
         }

         __DUMP__(factoriesBoost, normalBoost, currentCumBoost, possibleCumBoost)

         var fields = getFieldsBasePpH(b);
         //__DUMP__(fields)

         for ( fi = 0; fi < fields.length; ++fi )
         {
            var fieldInfo = fields[fi];
            ri = fieldInfo.produce;
            var currentBoostPpH = Math.round(fieldInfo.pph * (factoriesBoost[ri] + currentCumBoost[ri])/100);
            var possibleBoostPpH = Math.round(fieldInfo.pph * (factoriesBoost[ri] + possibleCumBoost[ri])/100);
            profit += possibleBoostPpH - currentBoostPpH;
         }
      }
   }

   return [bInfo.produce, profit];
}


//////////////////////////////////////////////////////////////////////
// Modify all buildings that produce resources
function uiModifyResourceBuilding(gid)
{
   //-----------------------------------------------------------------
   function getIncreasedCumulativeOasesBoost(oasesBoost, increaseFactor)
   {
      var oi, ri;
      var cumulativeBoost = [0,0,0,0];

      for (oi = 0; oi < oasesBoost.length; ++oi)
      {
         for (ri = 0; ri < 4; ++ri)
         {
            cumulativeBoost[ri] += oasesBoost[oi][ri] + Math.round(oasesBoost[oi][ri]*increaseFactor);
         }
      }

      return cumulativeBoost;
   }

   //-----------------------------------------------------------------
   __ENTER__

   __ASSERT__(canBuildingProduceResources(gid))

   var productionInfo = TB3O.BuildingProductionInfo;
   var contract = TB3O.BuildingContracts[0];

   if ( contract && productionInfo && productionInfo.possible )
   {
      var prev_production = ( productionInfo.inProgress ) ? productionInfo.inProgress.production : productionInfo.current.production;

      var prod_profit = calculateBuildProfit(gid, productionInfo.possible.production, prev_production);

      var aAdviceTable = uiCreateResourceBuildingAdviceTable(contract.cost, contract.cc, prod_profit);

      if ( aAdviceTable )
      {
         insertAfter(productionInfo.container.parentNode, aAdviceTable);
      }
   }

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiModifyBuildNew()
{
   __ENTER__
   __DUMP__(TB3O.BuildingContracts)

   var i;

   for ( i = 0; i < TB3O.BuildingContracts.length; ++i )
   {
      var contract = TB3O.BuildingContracts[i];
      var gid = contract.gid;
      
      if ( gid && canBuildingProduceResources(gid) ) 
      {
         var prod_profit = calculateBuildProfit(gid, 5);
         var aAdviceTable = uiCreateResourceBuildingAdviceTable(contract.cost, contract.cc, prod_profit);

         if ( aAdviceTable )
         {
            insertAfter(contract.costNode, aAdviceTable);
         }
      }
   }

   __EXIT__
}
