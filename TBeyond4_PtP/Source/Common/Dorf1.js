//////////////////////////////////////////////////////////////////////
function getCommonDorf1Info(villageId, aDoc, ttServer)
{
   var bSuccess = setTroopMovements(villageId, aDoc, ttServer) &&
                  setBiP(villageId, aDoc, ttServer);

   var villageInfo = TB3O.VillagesInfo[villageId];
   if ( !villageInfo.type )
   {
      villageInfo.type = getVillageType(aDoc);
   }
   bSuccess = bSuccess && !!villageInfo.type;

   return bSuccess;

   //-----------------------------------------------------------------
   function getVillageType(aDoc)
   {
      var rDiv = $xf("//div[starts-with(@id,'village_map')]",'f',aDoc,aDoc);
      var vType;
      if ( rDiv ) 
      {
         if ( rDiv.className )
         {  
            rDiv.className.search(/f(\d+)/); 
            vType = parseInt10(RegExp.$1);
         }
      }
      else
      {
         rDiv = $xf("//div[starts-with(@id,'f')]",'f',aDoc,aDoc);
         if ( rDiv )
         {
            rDiv.id.search(/f(\d+)/);
            vType = parseInt10(RegExp.$1);
         }
      }
      vType = (isFinite(vType) && vType > 0 && vType <= 12) ? vType : undefined;

      __ASSERT__(vType,"Can't determine village type!")

      return vType;
   }
}

//////////////////////////////////////////////////////////////////////
function getOuterBuildings(villageId, aDoc, ttServer)
{
   var bSuccess = false;
   var villageInfo = TB3O.VillagesInfo[villageId];

   if ( villageInfo.type )
   {
      var b = scanOuterBuildings(aDoc, villageInfo.type);
      updateOuterConstructionInfo(villageInfo.csi, b, ttServer);
      bSuccess = true;
   }

   return bSuccess;
}

//////////////////////////////////////////////////////////////////////
// Scan and store dorf1 specific info
function processDorf1() 
{
   __ENTER__

   TB3O.pageSelector = "dorf1";

   var ttServer = toTimeStamp(TB3O.serverTime);

   getCommonDorf1Info(TB3O.ActiveVillageId, document, ttServer);
   getOuterBuildings(TB3O.ActiveVillageId, document, ttServer);

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
// Create the resource fields upgrade table
function uiCreateResUpgradeTable(tableId, villageId, resourcesInfo, arrBA)
{
   var id, gid, crtLevel;
   var i, j, xi;

   var grid = new Array(4);
   for ( i = 0; i < 4; i++ )
   {
      grid[i] = new Array(26);
      for ( j = 0; j <= 25; j++ )
      {
         grid[i][j] = 0;
      }
   }

   var b = TB3O.VillagesInfo[villageId].csi.b;
   for ( id = 1; id <= 18; id++ )
   {
      gid = b[id][0];
      crtLevel = b[id][1];
      grid[gid - 1][crtLevel] = id;
   }

   var bsUT = false;
   var nE = [0, 0, 0, 0];
   var nR = 0;

   //create the resource fields upgrade table
   var aTb = $t([['id', tableId], ['class', 'tbUpgTable']]);
   var aRow1 = $r();

   aTb.appendChild(aRow1);

   for ( i = 0; i < 4; i++ )
   {
      gid = i + 1;

      var td1 = $c(gIc["r" + (i + 1)], [['class', 'tb3uthc']]);
      aRow1.appendChild(td1);

      for ( j = 0; j < 25; j++ )
      {
         id = grid[i][j];

         if ( id > 0 && arrBA[id][0] !== 4 )
         {
            nE[i] += 1;
            if ( nR < nE[i] )
            {
               ++nR;
               var bRow = $r();
               for ( xi = 0; xi < 4; xi++ )
               {
                  bRow.appendChild($c("", [['class', 'tb3utbc']]));
               }
               aTb.appendChild(bRow);
            }

            bsUT = true;

            var tb2 = $t();
            aTb.rows[nE[i]].cells[i].appendChild(tb2);
            var aRow3 = $r();
            addChildren(aRow3, 
               [ $e("td",[],
                    $e("a", [['href', "build.php?id=" + id]], 
                         $e("div", [['class', 'tbImgCnt']], [
                             $img([['src', image["upgr" + i]], ['title', T('RES' + gid)]]),
                             uiCreateCNDiv(j, arrBA[id][0], false)
                         ])
                      )
                   ),
                 $e("td",[],uiCreateBuildingResAndTimeTable(arrBA, resourcesInfo, gid, id, j))
               ]);
            tb2.appendChild(aRow3);
         }
      }
   }

   return bsUT ? aTb : null;
}

//////////////////////////////////////////////////////////////////////
function uiCreateResUpgradeWidget(resourcesInfo,arrBA)
{
   __ENTER__

   if ( TBO_SHOW_RESUPGTABLE === '1')
   {
      var oldtb = $g('tb_resupg');
      removeElement(oldtb);
      if ( oldtb )
      {
         uiFloatWindow_Remove('resupgTT');
      }

      var tb = uiCreateResUpgradeTable('tb_resupg', TB3O.ActiveVillageId, resourcesInfo, arrBA);

      if ( tb )
      {
         var dxy = TBO_RESUPGTABLE_XY.split("|");
         $df(682, dxy[0], dxy[1], " ", 'resupg', "resupgTT", false, tb);
      }
   }

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiRefreshDorf1()
{
   var arrBA = new Array(19);
   var resourcesInfo = getActualResourcesInfoNow(TB3O.ActiveVillageInfo.r, false);
   var refreshTimeout = getBuildingsAvailability(arrBA, 1,18, TB3O.ActiveVillageId, TB3O.ActiveVillageInfo.csi.b, resourcesInfo);

   uiCreateDorf1CenterNumbers(arrBA);
   uiCreateResUpgradeWidget(resourcesInfo,arrBA);

   if ( isFinite(refreshTimeout) )
   {
      setTimeout(uiRefreshDorf1,refreshTimeout*1000);
   }
}

//////////////////////////////////////////////////////////////////////
function uiModifyDorf1()
{
   __ENTER__

   if ( TBO_SHOW_COLOR_RES_LEVELS === "1" || TBO_SHOW_RESUPGTABLE === '1' )
   {
      uiRefreshDorf1();
   }
   uiCreateDorf1AttDefInfoSign(); 

   __EXIT__
}

