/////////////////////////////////////////////////////////////////////
function getCommonPlayerProfileInfo(aDoc)
{
   //----------------------------------------------------------------
   function setCapitalInfo(aSpan)
   {
      if ( aSpan )
      {
         var aVal = $nth_tag(aSpan.parentNode,'a',0);
         if ( aVal )
         {
            saveCapitalInfo(parseUri(aVal.getAttribute("href")).queryKey.d, aVal.textContent);
            return;
         }
      }
      saveCapitalInfo(); // reset capital info
   }

   //----------------------------------------------------------------
   __ENTER__
   setCapitalInfo(searchCapitalSpan(aDoc));

   if ( TBU_CAPITAL_MAPID === '-' ) // no capital?
   {
      var uTb = searchPlayerProfileVillagesTable(aDoc);
      if ( uTb )
      {
         var profileVillagesTableInfo = parsePlayerProfileVillagesTable(uTb);
         if ( profileVillagesTableInfo )
         {
            var villagesTable = profileVillagesTableInfo.table;
            if ( villagesTable.length === 1 ) // single village account?
            {
               // assume single village as capital
               saveCapitalInfo(villagesTable[0].map_id, villagesTable[0].name);
            }
         }
      }
   }

   setPlayerName(getPlayerName(aDoc));
   setRaceLocalName(getRaceLocalName(aDoc));
   __EXIT__
}


/////////////////////////////////////////////////////////////////////
function getVillagesInfoFromProfile(aDoc)
{
   var uTb = searchPlayerProfileVillagesTable(aDoc);
   if ( uTb )
   {
      var profileVillagesTableInfo = parsePlayerProfileVillagesTable(uTb);
      if ( profileVillagesTableInfo )
      {
         var villagesTable = profileVillagesTableInfo.table;
         var mapIdDict = getVillagesMapIdDict(TB3O.VillagesInfo);

         for (var i = 0; i < villagesTable.length; ++i )
         {
            var mapId = villagesTable[i].map_id;
            var villageId = mapIdDict[mapId];
            var villageInfo = TB3O.VillagesInfo[villageId];
            villageInfo.pop = villagesTable[i].pop;
            villageInfo.rx = villagesTable[i].rx;
         }
      }
   }
}

/////////////////////////////////////////////////////////////////////
// process only common information, villages list not processed yet
function processPlayerProfile()
{
   __ENTER__

   TB3O.pageSelector = "profile_my";

   if ( crtUrl.queryKey.uid && crtUrl.queryKey.uid != TB3O.UserID ) 
   {
      TB3O.pageSelector = "profile_other";
   }

   if ( crtUrl.queryKey.s ) 
   {
      TB3O.pageSelector = "profile_tab";
   }

   if ( TB3O.pageSelector === "profile_my" )
   {
      // need to check a menu, because profile editing reset url
      var menu = searchAndParseSubMenu();
      if ( !menu || (menu && menu.active === 0) ) // sitters have not menu
      {
         getCommonPlayerProfileInfo(document);
      }
      else
      {
         TB3O.pageSelector = "profile_tab";
      }
   }

   __EXIT__
}

/////////////////////////////////////////////////////////////////////
// process all other profile information, villages list already processed
function processMyProfile()
{
   __ENTER__

   getCapitalId();
   getVillagesInfoFromProfile(document);

   __EXIT__
}

/////////////////////////////////////////////////////////////////////
function uiAddPlayerStatistics(uTb, villages)
{
   __ENTER__

   var totV = villages.table.length;
   var totP = villages.population;
   var csp1 = villages.popColIdx;
   var csp2 = uTb.rows[1].cells.length - csp1;
   //total row (population, villages)
   var trT = $r([['class', 'tb3rnb']],[
                 $td([['class', 'tb3chnb'], ['colspan', csp1]], T('TOTAL')),
                 $td([['class', 'tb3chnb'], ['style', 'text-align:center;']], totP),
                 $td([['class', 'tb3chnb'], ['colspan', csp2]])]);
   uTb.appendChild(trT);

   //average population per village
   var trAv = $r([['class', 'tb3rnb']],[
                 $td([['class', 'tb3chnb'], ['colspan', csp1]], T('AVPPV')),
                 $td([['class', 'tb3chnb'], ['style', 'text-align:center;']], Math.round(totP / totV)),
                 $td([['class', 'tb3chnb'], ['colspan', csp2]])]);
   uTb.appendChild(trAv);

   __EXIT__
}

/////////////////////////////////////////////////////////////////////
function uiModifyPlayerProfile()
{
   __ENTER__

   var uProfile = searchPlayerProfileTable();
   if ( uProfile )
   {
      uiModifyPlayerProfileName(uProfile);
      uiModifyPlayerProfileDescription(uProfile);
   }

   var uTb = searchPlayerProfileVillagesTable();
   if ( uTb )
   {
      var profileVillagesTableInfo = parsePlayerProfileVillagesTable(uTb);
      if ( profileVillagesTableInfo )
      {
         uiAddPlayerStatistics(uTb, profileVillagesTableInfo);
         uiModifyPlayerProfileVillagesTable(uTb, profileVillagesTableInfo);
      }
   }

   __EXIT__
}
