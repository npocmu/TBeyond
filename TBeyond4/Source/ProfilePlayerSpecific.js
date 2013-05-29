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
   activeMapId = xy2id(TB3O.ActiveVillageInfo.x, TB3O.ActiveVillageInfo.y);

   var villagesTable = villages.table;
   var i;
   for ( i = 0; i < villagesTable.length; i++ )
   {
      var mapId = villagesTable[i][0];
      if ( activeMapId == mapId )
      {
         addClass(uTb.rows[i+1],"hl");
      }
   }
   __EXIT__
}
