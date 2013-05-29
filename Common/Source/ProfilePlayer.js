//////////////////////////////////////////////////////////////////////
function savePlayerInfo()
{
   setGMcookieV2('UserInfo', TB3O.U, 'UsI');
}

//////////////////////////////////////////////////////////////////////
function loadPlayerInfo()
{
   var bResult = true;
   var bFirstTry = false;
   IF_TB3({{var bRequestForCapital = false;}})

   var aTB3U = getGMcookieV2('UserInfo');
   if ( !aTB3U || !aTB3U['UsI'] )
   {
      bFirstTry = true;
      savePlayerInfo();
   }
   else 
   {
      TB3O.U = aTB3U['UsI'];
   }

   if ( TBU_RACE === '' ) 
   {
      getRace();
      if ( TBU_RACE === '' && bFirstTry ) 
      {
         getRaceFromBarracks();
      }
   }

   // user information is critical
   // for first run just shedule required ajax requests and stop normal execution
   if ( TBU_NAME === '' || TBU_RACE_LOCAL === '' || TBU_CAPITAL_NAME === '' || TBU_CAPITAL_MAPID === '' || TBU_CAPITAL_XY === '' ) 
   {
      IF_TB3({{bRequestForCapital = true;}})
      ajaxLoadDocument(spLnk, 
         function (xhr_doc)
         {
            getCommonPlayerProfileInfo(xhr_doc);
            IF_TB3({{if ( TBU_CAPITAL_ID === '' ) { getCapitalIdFromDorf3(); } }})
         }
      );
      bResult = false;
   }

   IF_TB3({{
   // if single village account and Travian version 3.X or less we need to visit dorf3 page 
   // to detect id of village. For other cases id of the capital will be detected after village list
   // processing 
   if ( TBU_CAPITAL_ID === '' && !bRequestForCapital )
   {
      getCapitalIdFromDorf3();
      bResult = false;
   }
   }})

   return bResult;
}

/////////////////////////////////////////////////////////////////////
function setPlayerName(aUN)
{
   if ( aUN )
   {
      TBU_NAME = aUN;
      savePlayerInfo();
   }
}

/////////////////////////////////////////////////////////////////////
function setRaceLocalName(name)
{
   if ( name )
   {
      TBU_RACE_LOCAL = name;
      savePlayerInfo();
   }
}

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
            saveCapitalInfo(parseUri(aVal.href).queryKey.d, aVal.textContent);
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
         var villagesTable = parsePlayerProfileVillagesTable(uTb).table;
         if ( villagesTable.length === 1 ) // single village account?
         {
            // assume single village as capital
            saveCapitalInfo(villagesTable[0][0], villagesTable[0][2]);
         }
      }
   }

   setPlayerName(getPlayerName(aDoc));
   setRaceLocalName(getRaceLocalName(aDoc));
   __DUMP__(TB3O.U)
   __EXIT__
}


/////////////////////////////////////////////////////////////////////
function parsePlayerProfileVillagesTable(uTb)
{
   var vPop = 0, totP = 0, villagesTable = [];
   var i, vLnk, mapId, aRow, vName;
   for (i = IIF_TB4(1,2); i < uTb.rows.length; i++)
   {
      aRow = uTb.rows[i];
      vLnk = $nth_tag(aRow.cells[0], "a", 0);
      if ( vLnk )
      {
         vPop = parseInt10(aRow.cells[IIF_TB4(2,1)].textContent);
         totP += vPop;
         
         mapId = parseInt10(parseUri(vLnk.href).queryKey.d);
         vName = vLnk.textContent;
         villagesTable.push([mapId, vPop, vName]);
      }
   }
   return {population: totP, table: villagesTable};
}

/////////////////////////////////////////////////////////////////////
function getVillagesPopulation(aDoc)
{
   var uTb = searchPlayerProfileVillagesTable(aDoc);
   if ( uTb )
   {
      var villagesTable = parsePlayerProfileVillagesTable(uTb).table;
      var mapIdDict = getVillagesMapIdDict(TB3O.VillagesInfo);

      for ( i = 0; i < villagesTable.length; ++i )
      {
         var mapId = villagesTable[i][0];
         TB3O.VillagesInfo[mapIdDict[mapId]].pop = villagesTable[i][1];
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
   getVillagesPopulation(document);

   __EXIT__
}


/////////////////////////////////////////////////////////////////////
// convert coord to link to map
function uiModifyPlayerProfileCoords(uTb, villages)
{
   __ENTER__
   activeMapId = xy2id(TB3O.ActiveVillageInfo.x, TB3O.ActiveVillageInfo.y);

   var villagesTable = villages.table;
   var i;
   for ( i = 0; i < villagesTable.length; i++ )
   {
      var mapId = villagesTable[i][0];
      var aCell = uTb.rows[i+2].cells[2];
      if ( !$nth_tag(aCell, "a", 0) )
      {
         aCell.appendChild(uiCreateIntMapLink(mapId, aCell.childNodes, {disable_expansion:true}));
      }

      if ( activeMapId == mapId )
      {
         addClass(uTb.rows[i+2],"hl");
      }
   }
   __EXIT__
}

/////////////////////////////////////////////////////////////////////
function uiAddPlayerStatistics(uTb, villages)
{
   __ENTER__

   var headerRows = IIF_TB4(1,2);
   var totV = uTb.rows.length - headerRows;
   var totP = villages.population;
   var csp1 = IIF_TB4(2,1);
   var csp2 = uTb.rows[headerRows].cells.length - 2;
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
      var villages = parsePlayerProfileVillagesTable(uTb);
      uiAddPlayerStatistics(uTb, villages);
      uiModifyPlayerProfileVillagesTable(uTb, villages);
   }

   __EXIT__
}
