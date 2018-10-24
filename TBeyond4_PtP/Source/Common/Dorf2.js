//////////////////////////////////////////////////////////////////////
function getInnerBuildings(villageId, aDoc, ttServer)
{
   var bSuccess = false;
   var villageInfo = TB3O.VillagesInfo[villageId];

   var buildingsInfo = scanInnerBuildings(document);

   if ( villageId === TB3O.ActiveVillageId )
   {
      TB3O.BuildingsInfo = buildingsInfo;
   }

   var b = buildingsInfo.exportB(false);
   updateInnerConstructionInfo(villageInfo.csi, b, ttServer);
   bSuccess = true;

   return bSuccess;
}

//////////////////////////////////////////////////////////////////////
// Scan and store dorf2 specific info
function processDorf2() 
{
   __ENTER__

   TB3O.pageSelector = "dorf2";

   var ttServer = toTimeStamp(TB3O.serverTime);

   setBiP(TB3O.ActiveVillageId, document, ttServer);
   getInnerBuildings(TB3O.ActiveVillageId, document, ttServer);

   // sync TB3O.BuildingsInfo with BiP
   TB3O.BuildingsInfo.syncWithBiP(TB3O.ActiveVillageInfo.BiP);

   __EXIT__
}


//////////////////////////////////////////////////////////////////////
// Create the buildings upgrade table
function uiCreateBldUpgradeTable(tableId, villageId, resourcesInfo, arrBA, buildingsInfo)
{
   var i;
   var intCpR = 3;
   var bsUT = false;

   var aTb = $t([['id', tableId], ['class', 'tbUpgTable']]);
   var iFilledCellsCount = 0;

   var tb2, aRow, aCell;

   for ( i = 0; i < buildingsInfo._.length; ++i )
   {
      var bInfo = buildingsInfo._[i];
      var id = bInfo.id;
      var gid = bInfo.gid;
      var crtLevel = bInfo.uplvl;

      //create a new cell in the building uprade table if necessary
      if ( gid > 0 && crtLevel >= 0 && arrBA[id][0] !== 4 )
      {
         var strNewLevel = ( crtLevel === bInfo.lvl ) ? "" : " (\u2191 " + (crtLevel + 1) + ")";

         //create a new row if necessary
         if ( (iFilledCellsCount % intCpR) === 0 )
         {
            aRow = $r();
            aTb.appendChild(aRow);
         }
         iFilledCellsCount++;
         bsUT = true;


         aCell = $c("", [['class', 'tb3utbc'], ['style', 'width:' + Math.floor(100 / intCpR) + '%;']]);
         aRow.appendChild(aCell);

         tb2 = $t();
         aCell.appendChild(tb2);

         var href = "build.php?id=" + id;

         addChildren(tb2,[
            $e("tr", [],
               $e("td", [['colspan', "2"], ['class', 'center']],
                  $a(bInfo.title + strNewLevel, [['href', href]]))),
            $e("tr", [], [
               $e("td", [],
                  $e("a", [['href', href]],
                     $img([['class', bInfo.imgClass],['src', bInfo.imgSrc],['title',bInfo.name]]))),
               $e("td", [], uiCreateBuildingResAndTimeTable(arrBA, resourcesInfo, gid, id, crtLevel))
            ])

         ])
      }
   }

   if ( bsUT )
   {
      while ( (iFilledCellsCount % intCpR) !== 0 )
      {
         aRow.appendChild($c());
         iFilledCellsCount++;
      }
   }

   return bsUT ? aTb : null;
}


//////////////////////////////////////////////////////////////////////
function uiCreateBldUpgradeWidget(resourcesInfo, arrBA)
{
   __ENTER__

   if ( TBO_SHOW_BLDUPGTABLE === '1' )
   {
      var oldtb = $g('tb_bldupg');
      removeElement(oldtb);
      if ( oldtb )
      {
         uiFloatWindow_Remove('bupgTT');
      }

      var tb = uiCreateBldUpgradeTable('tb_bldupg', TB3O.ActiveVillageId, resourcesInfo, arrBA, TB3O.BuildingsInfo);

      if ( tb )
      {
         var dxy = TBO_BLDUPGTABLE_XY.split("|");
         $df(682, dxy[0], dxy[1], " ", 'bupg', "bupgTT", false, tb);
      }
   }

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiRefreshDorf2()
{
   var arrBA = new Array(41);
   var resourcesInfo = getActualResourcesInfoNow(TB3O.ActiveVillageInfo.r, false);
   var arrB = TB3O.BuildingsInfo.exportB(true);
   var refreshTimeout = getBuildingsAvailability(arrBA, 19,arrB.length-1, TB3O.ActiveVillageId, arrB, resourcesInfo);

   uiCreateDorf2CenterNumbers(arrBA);
   uiCreateBldUpgradeWidget(resourcesInfo, arrBA);

   if ( isFinite(refreshTimeout) )
   {
      setTimeout(uiRefreshDorf2,refreshTimeout*1000);
   }
}


//////////////////////////////////////////////////////////////////////
function uiModifyDorf2()
{
   __ENTER__

   if ( TBO_SHOW_CENTER_NUMBERS === "1" || TBO_SHOW_BLDUPGTABLE === '1' )
   {
      if ( TBO_SHOW_SORTED_BLDUPGTABLE === '1')  
      { 
         TB3O.BuildingsInfo.sortByName();
      }

      uiRefreshDorf2();
   }

   __EXIT__
}

