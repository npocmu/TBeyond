//////////////////////////////////////////////////////////////////////
//return the number of villages that can be built based on the number of CP available
function cp2villages(cp)
{
   var noVil;

   if ( TB3O.nServerType === 0 )
   {
      noVil = Math.round(Math.pow(cp / 1600, 1 / 2.3));
   }
   else
   {
      var speed = TB3O.nMerchantSpeedFactor[TB3O.nServerType];
      noVil = Math.round(Math.pow(speed * cp / 1600, 1 / 2.3));
   }

   return noVil;
}

//////////////////////////////////////////////////////////////////////
//return the no of CP needed to create a specific no of villages (version from fr3nchlover)
function villages2cp(noVil)
{
   var cp;
   if ( noVil <= 1 )
   {
      cp = 0;
   } 
   else if ( TB3O.nServerType === 0 )
   {
      cp = Math.round(1.6 * Math.pow(noVil-1, 2.3)) * 1000;
   }
   else
   {
      var speed = TB3O.nMerchantSpeedFactor[TB3O.nServerType];
      cp = Math.round(16 / speed * Math.pow(noVil-1, 2.3) ) * 100;
   }

   return cp;
}


//////////////////////////////////////////////////////////////////////
// create the new cp to villages table
function uiCreateCulturePointsTable(titleCP, crtVil, crtTotalCP, prodTotalCP)
{
   var cpTable = $t([['id', 'cptable']],
                    $e("thead",null,
                    [
                       $r(null,
                       [
                          $td([['rowspan', 2]], T('VILLAGE')),
                          $td([['colspan', 2]], I("cp",[['title',titleCP]])),
                          $td([['colspan', 2]], I("clock"))
                       ]),
                       $r(null,
                       [
                          $td([],T('TOTAL')),
                          $td([],T('YOUNEED')),
                          $td([],T('NEWVILLAGEAV')),
                          $td([],T('TIMEUNTIL'))
                       ])
                    ]));

   var maxNewVillages = 1;
   var boolReachedMaxNewVillages = false;
   var i,xi;

   for ( i = 0; i < maxNewVillages && i < 50; i++ )
   {
      var cellsContent, strClass;
      //get the necessary CP for building/conquering a new village
      var reqCP = villages2cp(crtVil + i + 1);

      if ( reqCP <= crtTotalCP )
      {
         cellsContent = [crtVil + i + 1, reqCP, '0', T('NOW'), '0:00:00'];
         strClass = 'CG';
         maxNewVillages += 1;
      }
      else
      {
         if ( !boolReachedMaxNewVillages )
         {
            maxNewVillages += 2;
            boolReachedMaxNewVillages = true;
         }
         //time until able to build/conquer a new village
         var tiempo = ((reqCP - crtTotalCP) / prodTotalCP) * 86400;
         
         cellsContent = [crtVil + i + 1, reqCP, reqCP - crtTotalCP, formatDateTimeRelative(tiempo, 0), formatTimeSpan(tiempo, 1)];
         strClass = 'CR';
      }

      var cpRow = $r();
      for ( xi = 0; xi < 5; xi++ )
      {
         cpRow.appendChild($td([['class', strClass]],cellsContent[xi]));
      }
      cpTable.appendChild(cpRow);
   }
   return cpTable;
}

//////////////////////////////////////////////////////////////////////
// Used for updates info from refresh callbacks
function getCultureTabInfo(villageId, aDoc, ttServer)
{
   __ENTER__

   var info = scanCulturePoints(aDoc);
   if  ( info )
   {
      var villageInfo = TB3O.VillagesInfo[villageId];
      villageInfo.cpi.cp = info.curVillageCP;
      villageInfo.cpi.ttUpd = ttServer;
   }
   __EXIT__

   return !!info;
}


//////////////////////////////////////////////////////////////////////
function processCultureTab()
{
   __ENTER__

   TB3O.pageSelector = "culture";
   getCultureTabInfo(TB3O.ActiveVillageId, document, toTimeStamp(TB3O.serverTime));

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiModifyCultureTab()
{
   __ENTER__

   var info = scanCulturePoints();
   if  ( info )
   {
      //CP for all villages
      var prodTotalCP = info.prodTotalCP;
      //Current no of CP
      var crtTotalCP = info.curTotalCP;
      //CP needed to create a new village
      var needCP = info.needCP;
      //No of current villages
      var crtVil = cp2villages(needCP);

      var titleCP = "Culture";
      var menu = searchAndParseSubMenu();
      if ( menu ) { titleCP = menu.items[menu.active][0]; }

      var cpTable = uiCreateCulturePointsTable(titleCP, crtVil, crtTotalCP, prodTotalCP);
      info.container.appendChild(cpTable);
   }

   __EXIT__
}
