/////////////////////////////////////////////////////////////////////
// work fo old versions of Travian
function _getPlayerId(aDoc)
{
   var uid;
   var img = $xf("//div[contains(@class,'sideInfoHero') or contains(@id,'sidebarBoxHero')]//img[contains(@class,'heroImage')]", 'f', aDoc, aDoc);

   if ( img )
   {
      uid = parseUri(img.src).queryKey.uid;
   }

   return uid;
}

/////////////////////////////////////////////////////////////////////
function getPlayerId()
{
   var player_uuid;
   var uid = _getPlayerId(document);

   //-----------------------------------------------------------------
   function _getPlayerIdFromStatPage(aDoc)
   {
      __ENTER__

      var aLink = __TEST__({{$qf("#player .hl .pla a",'f', aDoc, aDoc)}});

      if ( aLink )
      {
         uid = parseUri(aLink.getAttribute("href")).queryKey.uid;

         if ( isStrValid(uid) )
         {
            __DUMP__(player_uuid, uid)
            persistence.saveObject(null, "uuid", uid, player_uuid);
         }
      }
       __EXIT__
   }


   //-----------------------------------------------------------------
   // if can't get the player uid from any page then try to get it once from statistiken.php
   // and store it in the local storage using the player_uuid as key
   if ( !isStrValid(uid) )
   {
      try 
      {
         player_uuid = unsafeWindow._player_uuid;
         if ( isStrValid(player_uuid) )
         {
            player_uuid = player_uuid.toUpperCase();

            var uuidMap = persistence.loadObject(null, "uuid");
            if  ( uuidMap.hasOwnProperty(player_uuid) )
            {
               uid = uuidMap[player_uuid];
            }
            else
            {
               ajaxLoadDocument("statistiken.php", _getPlayerIdFromStatPage);
            }
         }
      }
      __CATCH__
   }

   return uid;
}


/////////////////////////////////////////////////////////////////////
// Detect race, can be called for every page
// return race name
function getRace()
{
   __ENTER__

   var race,racex;

   // try get race from quest master image
   var imgQM = $g("questmasterButton");
   if ( imgQM )
   {
      if ( hasClass(imgQM,/vid_(\d+)/) )
      { 
         racex = parseInt10(RegExp.$1) - 1; 
         race = TB3O.KnownRaces[racex];
      }
   } 

   if ( !isStrValid(race) )
   {
      // T4.0
      var imgBig = $xf("//div[@id='" + ID_SIDE_INFO + "']//img[contains(@class,'nationBig')]");
      var prefix = "nationBig";
      if ( !imgBig ) 
      {
         //T4.2
         imgBig = $xf("//div[@id='sidebarBoxHero']//img[contains(@class,'nation')]");
         prefix = "nation";
      }

      if ( imgBig )
      {
         if ( hasClass(imgBig,new RegExp(prefix + "(\\d+)")) )
         { 
            racex = parseInt10(RegExp.$1) - 1; 
            race = TB3O.KnownRaces[racex];
         }
      }
   }

   __DUMP__(race)
   __ASSERT__(isStrValid(race), "Can't detect race for player from this page")

   __EXIT__
   return race;
}

/////////////////////////////////////////////////////////////////////
// race cookies are undefined - enter the barracks
function getRaceFromBarracks()
{
   ajaxRequest(bksLnk, 'GET', null, 
      function (ajaxResp)
      {
         //race recognition - first image in table of troops
         if ( ajaxResp.responseText.search(/unit u(\d+)/) !== -1 ) 
         {
            setRaceFromTroopIndex(parseInt10(RegExp.$1));
         }
         __ASSERT__(TBU_RACE !== '', "Can't detect race for player from barraks")
      }
   );
}

//////////////////////////////////////////////////////////////////////
// Select all contracts except: 
//   - contracts for units training (has parent div.details)
//   - trade route descriptions (in table#trading_routes)
function searchBuildingContractsNodes(aDoc /*opt*/)
{
   var contracts = $xf1("//div[@id='" + ID_CONTENT + "']//*[not(self::div and " + $xClass("details") + ")]/div[" + $xClass("showCosts") + "][not(ancestor::table[@id='trading_routes'])]", 'a', aDoc, aDoc);
   __ASSERT__(contracts.length, "Can't find any contracts")
   return contracts;
}

//////////////////////////////////////////////////////////////////////
// Return object:
// { 
//    costNode,   - DOM node
//    cost,       - Array(4) - resources needed
//    cc,         - (optional) crop consumption
//    ts,         - (optional) seconds to build
//    gid         - (optional) building gid
// }
// or null if can't parse contract
//
function scanCommonContractInfo(costNode)
{
   var v, cc, ts, gid;

   var resNodes = $qf(".resourceWrapper .value", 'a', costNode);
   var Res = getResourcesFromNodes(resNodes);

   var ccNode = resNodes[4];
   if ( ccNode )
   {
      v = parseSeparatedInt10(resNodes[4].textContent);
      if ( isIntValid(v) )
      {
         cc = v;
      }
   }

   __ASSERT__(Res,"Can't parse resources needed for contract")

   if ( Res )
   {
      var aSpan = $xf("ancestor::*[@id='contract']/following::*//*[" + $xClass("clocks") + "]//span[" + $xClass("value") + "]", 'f', costNode);
      if ( aSpan )
      {
         ts = parseTimeSpan(aSpan.textContent);
      }

      if ( ts === undefined )
      {
         aSpan = $qf(".clocks .value", 'f', costNode);
         ts = parseTimeSpan(aSpan.textContent);
      }

      if ( !isIntValid(ts) )
      {
         ts = undefined;
         __ERROR__("Can't parse time span for contract")
      }

      // try to find building gid ( on build new building pages )
      var container = $xf("ancestor::*[contains(@id,'contract_building')]", 'f', costNode);

      if ( container )
      {
         v = scanIntWithPrefix("contract_building",container.id);
         if ( isIntValid(v) )
         {
            gid = v;
         }
      }
   }

   return Res ? { costNode:costNode, cost:Res, cc:cc, ts:ts, gid:gid } : null;
}

//////////////////////////////////////////////////////////////////////
// return building info gathered from html page
// {
//    name,    - building name
//    level    - building level
// }
function scanCommonBuildingInfo(aDoc /*opt*/)
{
   var name, level;
   var aHeader = __TEST__($xf("//div[@id='" + ID_CONTENT + "']//h1",'f', aDoc, aDoc));
   if ( aHeader )
   {
      name = trimWhitespaces(aHeader.firstChild.textContent);
      level = scanIntAny(aHeader.textContent);
   }

   return ( name !== '' && isIntValid(level) )  ? {name:name, level:level} : null;
}

//////////////////////////////////////////////////////////////////////
function scanBuildingProductionInfo(gid, crtLevel, aDoc /*opt*/)
{
   var productionInfo = {};
   var bIsValid = false;

   function searchAndScanProduction(container, selector, mode)
   {
      var val, lvl;
      var aRow = $qf(selector, mode, container, aDoc);

      if ( aRow )
      {
         var cells = aRow.cells;

         if ( cells && cells.length >= 2 )
         {
            lvl = scanIntAny(cells[0].textContent);
            var prodNode = $qf(".number", 'f', cells[1], aDoc);
            val = parseSeparatedInt10(prodNode.textContent);
         }
      }
      return { lvl: lvl, production: val };
   }

   var infoNode = __TEST__($qf("#build_value", 'f', aDoc, aDoc));
   if ( infoNode )
   {
      var current =  searchAndScanProduction(infoNode, ".currentLevel", 'f');
      if ( isIntValid(current.production) )
      {
         current.lvl = crtLevel;
         productionInfo.current = current;
         bIsValid = true;
      }

      // It possible to have several ".underConstruction" nodes
      // Need to select last one
      var inProgress = searchAndScanProduction(infoNode, ".underConstruction", 'l');
      if ( isIntValid(inProgress.production) )
      {
         productionInfo.inProgress = inProgress;
         bIsValid = true;
      }

      var possible = searchAndScanProduction(infoNode, ".nextPossible", 'f');
      if ( isIntValid(possible.production) )
      {
         productionInfo.possible = possible;
         bIsValid = true;
      }

      productionInfo.container = infoNode;

      __ASSERT__(bIsValid, "Can't parse building production")
   }
   return bIsValid ? productionInfo : null;
}

//////////////////////////////////////////////////////////////////////
function searchNavigationLinks(aDoc)
{
   var navLinks = $xf("//div[@id='" + ID_CONTENT + "']//a[contains(@href, 'page=')]", 'l', aDoc, aDoc);
   return navLinks;
}

//////////////////////////////////////////////////////////////////////
function scanCulturePoints(aDoc)
{
   var container = __TEST__($qf("#expansionCulturePoints", 'f', aDoc));

   function searchAndScanNode(selector,nth)
   {
      var val;
      var aNode;
      
      if ( nth )
      {
         aNode = __TEST__($qf(selector, 'n', nth, container, aDoc));
      }
      else
      {
         aNode = __TEST__($qf(selector, 'f', container, aDoc));
      }

      if ( aNode )
      {
         val = parseSeparatedInt10(aNode.textContent);
      }
      return val;
   }

   var result = null;
   var aNode;
   var curVillageCP, curTotalCP, prodTotalCP, needCP;

   if ( container )
   {
      curVillageCP = searchAndScanNode(".culturePointsProduction td");
      prodTotalCP = searchAndScanNode(".culturePointsProduction .totalRow td");
      curTotalCP = searchAndScanNode(".culturePointsSummary td",0);
      needCP = searchAndScanNode(".culturePointsSummary td",1);
      
      if ( isIntValid(curVillageCP) && isIntValid(curTotalCP) && 
           isIntValid(prodTotalCP) && isIntValid(needCP) )
      {
         result = {
            "curVillageCP": curVillageCP, 
            "curTotalCP":   curTotalCP, 
            "prodTotalCP":  prodTotalCP, 
            "needCP":       needCP,
            "container":    container
         };

         __DUMP__(result)
      }
   } 
   
   __ASSERT__( result, "Can't parse culture points" )

   return result;
}

//////////////////////////////////////////////////////////////////////
function searchQueueTable(aDoc)
{
   return $xf("//div[@id='" + ID_CONTENT + "']//table[" + $xClass('under_progress') + "]", 'f', aDoc, aDoc);
}

//////////////////////////////////////////////////////////////////////
function searchTroopImgNode(aParent)
{
   return $qf("img.unit, i.unit", 'f', aParent);
}
