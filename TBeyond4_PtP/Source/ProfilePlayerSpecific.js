/////////////////////////////////////////////////////////////////////
function getPlayerName(aDoc)
{
   var aUN = '';
   // 4.0
   var aNode = $xf("//div[contains(@class,'sideInfoPlayer')]//a[contains(@href, 'spieler.php')]", 'f', aDoc, aDoc);
   if ( !aNode ) // 4.2
   {
      aNode = $xf("//div[@id='sidebarBoxHero']//div[contains(@class,'playerName')]", 'f', aDoc, aDoc);
   }

   if ( aNode )
   {
      aUN = trimWhitespaces(aNode.textContent);
   }
   __ASSERT__(aUN,"Can't detect player name");
   return aUN;
}

/////////////////////////////////////////////////////////////////////
function searchCapitalSpan(aDoc)
{
   return __TEST__({{$xf("//div[@id='" + ID_CONTENT + "']//table[@id='villages']//span[contains(@class,'mainVillage')]", 'f', aDoc, aDoc)}});
}

/////////////////////////////////////////////////////////////////////
function getRaceLocalName(aDoc)
{
   var name = '';
   var aValue = __TEST__({{$xf("//table[@id='details']/tbody/tr[2]/td", 'f', aDoc, aDoc)}});

   if ( aValue )
   {
      name = trimBlanks(aValue.textContent);
   }
   return name;
}

/////////////////////////////////////////////////////////////////////
function searchPlayerProfileTable()
{
   return __TEST__($g("details"));
}

/////////////////////////////////////////////////////////////////////
function searchPlayerProfileVillagesTable(aDoc)
{
   return __TEST__({{$g("villages",aDoc)}});
}

/////////////////////////////////////////////////////////////////////
function parsePlayerProfileVillagesTable(uTb)
{
   __ENTER__
   var totP = 0, villagesTable = [];
   var i, vPop, vLnk, mapId, aRow, vName, popCell, col, racex, raceCell;
   for (i = 1; i < uTb.rows.length; i++)
   {
      aRow = uTb.rows[i];
      racex = mapId = vName = vPop = null;

      vLnk = __TEST__($qf("td.name a",'f',aRow));
      if ( vLnk )
      {
         mapId = parseInt10(parseUri(vLnk.getAttribute('href')).queryKey.d);
         vName = vLnk.textContent;
      }

      popCell = __TEST__($qf("td.inhabitants",'f',aRow));
      if ( popCell )
      {
         vPop = parseInt10(popCell.textContent);
         totP += vPop;

         if ( col === undefined )
         {
            col = getCellIndexInRow(aRow, popCell);
         }
      }

      raceCell = $qf('i[class^="tribe"]','f',aRow);
      if ( raceCell )
      {
         if ( hasClass(raceCell,/tribe(\d+)/) )
         { 
            racex = parseInt10(RegExp.$1) - 1; 
            if ( !TB3O.KnownRaces[racex] )
            {
               racex = null;
            }
         }
      }

      if ( !isIntValid(racex) )
      {
         if ( TB3O.ServerInfo.features.path_to_pandora )
         {
            __ERROR__("Can't get race for village '" + vName + "'")
         }
      }

      if ( isIntValid(mapId) && isIntValid(vPop) && isStrValid(vName) )
      {
         villagesTable.push({map_id: mapId, pop: vPop, name: vName, rx:racex} );
      }
   }

   var info = null;
   if ( villagesTable.length && isIntValid(col) )
   {
      info = {population: totP, popColIdx:col, table: villagesTable};
      __DUMP__(info);
   }

   __ASSERT__(info,"Can't parse villages list from profile")

   __EXIT__
   return info;
}


/////////////////////////////////////////////////////////////////////
function uiModifyPlayerProfileName(uProfile)
{
   var title = __TEST__($xf("//div[@id='" + ID_CONTENT + "']//h1"));
   if ( title )
   {
      var parts = title.textContent.split(" - ");
      if ( parts.length > 1 )
      {
         title.innerHTML = parts[0] + " - <a href='" + crtPage + "'>" + parts[1] + "</a>"
      }
   }
}

/////////////////////////////////////////////////////////////////////
function uiModifyPlayerProfileDescription(uProfile)
{
   var desc = __TEST__($xf("//div[@id='" + ID_CONTENT + "']//div[contains(@class,'description1')]"));
   if ( desc ) { uiModifyMsgBody(desc); }

   desc = __TEST__($xf("//div[@id='" + ID_CONTENT + "']//div[contains(@class,'description2')]"));
   if ( desc ) { uiModifyMsgBody(desc); }
}

/////////////////////////////////////////////////////////////////////
// convert coord to link to map
function uiModifyPlayerProfileVillagesTable(uTb, villages)
{
   __ENTER__
   var villagesTable = villages.table;
   var i;
   for ( i = 0; i < villagesTable.length; i++ )
   {
      var mapId = villagesTable[i].map_id;
      if ( TB3O.ActiveVillageMapId == mapId )
      {
         addClass(uTb.rows[i+1],"hl");
      }
   }
   __EXIT__
}
