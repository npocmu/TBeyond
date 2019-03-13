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
   var upgradeData =  scanUpgradeData(aDoc, ttServer);

   if ( upgradeData )
   {
      if ( gid === GID_SMITHY )
      {
         villageInfo.upi = upgradeData.info;
      }
   }
   __EXIT__

   return upgradeData;
}

//////////////////////////////////////////////////////////////////////
function processUpgradeBuilding(gid)
{
   var upgradeData = getUpgradeInfo(gid, TB3O.ActiveVillageId, document, toTimeStamp(TB3O.serverTime));

   TB3O.UnitsUpgrades = upgradeData.list;
}


//////////////////////////////////////////////////////////////////////
function uiCreateUpgradeBuildingAdviceTable(tix, unitsCount, upgradeCost, lvl)
{
   function uiCreateCountCells(profitCount)
   {
      var aCellMore;
      var aCellTotal = $td(['class', 'tbTotal'], [uiCreateTroopInfoCounter([tix, profitCount])]);

      if ( unitsCount >= profitCount )
      {
         aCellMore = $td(['class', 'tbUpg'],"Upgrade now!");
      }
      else
      {
         aCellMore = $td(['class', 'tbMore'], [uiCreateTroopInfoCounter([tix, profitCount-unitsCount])]);
      }
      return [aCellMore,aCellTotal]
   }

   //-----------------------------------------------------------------
   var aAdvice = null, aAdviceTable;

   var unitStats = uc[tix];

   if ( unitStats )
   {
      var unitCost = totalResources(unitStats);

      // number of units that can be trained instead of upgrade
      var insteadUnitsCount = Math.floor(upgradeCost / unitCost);
      var extraUnitsCount = unitsCount + insteadUnitsCount;

      __DUMP__(upgradeCost, unitCost, insteadUnitsCount, lvl);

      var curStats = getUpgradedUnitStats(unitStats, lvl);
      var upgradeStats = getUpgradedUnitStats(unitStats, lvl+1);

      __DUMP__(curStats, upgradeStats);

      var profitOffUnitsCount = Math.ceil((insteadUnitsCount * curStats.off)/(upgradeStats.off - curStats.off));
      var profitDefIUnitsCount = Math.ceil((insteadUnitsCount * curStats.def_i)/(upgradeStats.def_i - curStats.def_i));
      var profitDefCUnitsCount = Math.ceil((insteadUnitsCount * curStats.def_c)/(upgradeStats.def_c - curStats.def_c));
 
      aAdvice = $div([attrInject$, ["class","+tbUpgradeHint"]], [
                        $span(null, [
                           "Has: ", uiCreateTroopInfoCounter([tix, unitsCount]),
                           ", instead of upgrade it possible to build: ", 
                           uiCreateTroopInfoCounter([tix, insteadUnitsCount])
                        ])
                     ]);
      
      aAdviceTable = $t(["cellspacing","1"], 
                     [
                        $e("thead", null, [
                           $r(null,[
                              $th(["class","tbIco"]),
                              $th(null,     [uiCreateTroopInfoCounter([tix, extraUnitsCount]), $e("br"), $span(['class','level'], "level " + lvl) ]),
                              $th(null,     [uiCreateTroopInfoCounter([tix, unitsCount]), $e("br"), $span(['class','level'], "level " + (lvl + 1)) ]),
                              $th(null, "Need to build"),
                              $th(null, "Total"),
                           ])
                        ]),
                        $e("tbody", null, [
                           //attack power row
                           $r(null,[
                              $th(['class', 'tbIco'], I("att_all")),
                              $td($ls(curStats.off * extraUnitsCount)),
                              $td($ls(upgradeStats.off * unitsCount)),
                              uiCreateCountCells(profitOffUnitsCount)
                           ]),
                           //def power infantry row
                           $r(null,[
                              $th(['class', 'tbIco'], I("def_i")),
                              $td($ls(curStats.def_i * extraUnitsCount)),
                              $td($ls(upgradeStats.def_i * unitsCount)),
                              uiCreateCountCells(profitDefIUnitsCount)
                           ]),
                           //def power cavalry row
                           $r(null,[
                              $th(['class', 'tbIco'], I("def_c")),
                              $td($ls(curStats.def_c * extraUnitsCount)),
                              $td($ls(upgradeStats.def_c * unitsCount)),
                              uiCreateCountCells(profitDefCUnitsCount)
                           ])
                        ])
                     ]);

       aAdvice.appendChild(aAdviceTable);

      /*
      aAdviceTable = $t([attrInject$, ["class","tbUpgradeHint"], ["cellspacing","1"]], 
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
                   */
   }
   return aAdvice;
}

//////////////////////////////////////////////////////////////////////
function uiModifyUpgradeBuilding(gid)
{
   __ENTER__
   var unitsTotal = TB3O.ActiveVillageInfo.uci.ut;

   for (var tix in TB3O.UnitsUpgrades)
   {
      var troopUpgInfo = TB3O.UnitsUpgrades[tix];
      var unitsCount = unitsTotal[getUnitIndexFromTroopIndex(tix)];

      __DUMP__(troopUpgInfo, unitsCount);

      if ( troopUpgInfo.contract && isIntValid(unitsCount) ) 
      {
         var upgradeCost = totalResources(troopUpgInfo.contract.cost);
         var lvl = (troopUpgInfo.lvlNext === undefined ) ? troopUpgInfo.lvl : troopUpgInfo.lvlNext;

         var aAdviceTable = uiCreateUpgradeBuildingAdviceTable(tix, unitsCount, upgradeCost, lvl);

         if ( aAdviceTable )
         {
            if ( troopUpgInfo.linkNode )
            {
               insertBefore(troopUpgInfo.linkNode, aAdviceTable);
            }
            else
            {
               insertLast(troopUpgInfo.container, aAdviceTable);
            }
         }
      }
   }

   __EXIT__
}

