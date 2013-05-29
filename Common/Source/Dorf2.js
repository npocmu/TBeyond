//////////////////////////////////////////////////////////////////////
// Scan and store dorf2 specific info
function processDorf2() 
{
   __ENTER__

   TB3O.pageSelector = "dorf2";
   setBiP(TB3O.ActiveVillageId, document, toTimeStamp(TB3O.serverTime));

   TB3O.BuildingsInfo = new BuildingsInfo();
   getInnerBuildings(document, TB3O.BuildingsInfo);

   // sync TB3O.BuildingsInfo with BiP
   TB3O.BuildingsInfo.syncWithBiP(TB3O.ActiveVillageInfo.BiP);
   TB3O.BuildingsInfo.exportB(TB3O.ActiveVillageInfo.b,false);

   var id, gid, crtLevel, b = TB3O.ActiveVillageInfo.b;

   //set the required cookies (OBSOLETE)
   for ( id = 19; id < b.length; ++id )
   {
      if ( b[id] )
      {
         gid = b[id][0];
         crtLevel = b[id][1];
         switch ( gid )
         {
            case GID_RESIDENCE:
               TB3O.d2spB[0] = GID_RESIDENCE;
               break; //residence is available
            case GID_PALACE:
               TB3O.d2spB[0] = GID_PALACE;
               break; //palace is available
            case GID_BARRACKS:
               TB3O.d2spB[1] = GID_BARRACKS;
               if ( TBU_RACE === '' ) { getRaceFromBarracks(); }
               break;
            case GID_GREAT_BARRACK:
               TB3O.d2spB[2] = GID_GREAT_BARRACK;
               break;
            case GID_WORKSHOP:
               TB3O.d2spB[3] = GID_WORKSHOP;
               break;
            case GID_STABLE:
               TB3O.d2spB[4] = GID_STABLE;
               break;
            case GID_GREAT_STABLE:
               TB3O.d2spB[5] = GID_GREAT_STABLE;
               break;
            case GID_TOURNAMENT_SQUARE:
               TB3O.d2spB[6] = crtLevel;
               break;
            case GID_TOWNHALL:
               TB3O.d2spB[7] = GID_TOWNHALL;
               break;
            case GID_HORSEDT:
               TB3O.d2spB[8] = crtLevel;
               break;
         }
      }
   }
   setGMcookieV2('specBuildings', TB3O.d2spB, TB3O.ActiveVillageId);

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
      var bInfo = TB3O.BuildingsInfo._[i];
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
   var arrB = new Array(41);
   var arrBA = new Array(41);
   var resourcesInfo = getActualResourcesInfoNow(TB3O.ActiveVillageInfo.r, false);
   TB3O.BuildingsInfo.exportB(arrB, true);
   var refreshTimeout = getBuildingsAvailability(arrBA, 19,40, TB3O.ActiveVillageId, arrB, resourcesInfo);

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

