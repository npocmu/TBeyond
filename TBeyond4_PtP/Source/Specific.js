/////////////////////////////////////////////////////////////////////
function getPlayerId(aDoc)
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
         if ( hasClass(imgBig,new RegExp(prefix + "(\d+)")) )
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
   var contracts = $xf("//div[@id='" + ID_CONTENT + "']//*[not(self::div and " + $xClass("details") + ")]/div[" + $xClass("showCosts") + "][not(ancestor::table[@id='trading_routes'])]", 'l', aDoc, aDoc);
   __ASSERT__(contracts.snapshotLength, "Can't find any contracts")
   return contracts;
}

//////////////////////////////////////////////////////////////////////
// Return object:
// { 
//    costNode,   - DOM node
//    cost,       - Array(4) - resources needed
//    cc,         - crop consumption
//    ts,         - seconds to build
// }
// or null if can't parse contract
//
function scanCommonContractInfo(costNode)
{
   var i, ri;
   var res = Array(4);
   var cc, ts;
   var aSpan, Spans = costNode.getElementsByTagName("span");
   for ( i = 0; i < Spans.length; ++i )
   {
      aSpan = Spans[i];
      var tri = scanIntWithPrefix("r",aSpan.className);
      if ( isIntValid(tri) && tri >=1 && tri <= 5 )
      {
         var v = scanIntWithoutLetter(aSpan.textContent);
         if ( isIntValid(v) )
         {
            if ( tri === 5 )
            {
               cc = v;
            }
            else
            {
               res[tri-1] = v;
            }
         }
      }
      else if ( hasClass(aSpan, "clocks") )
      {
         ts = toSeconds(aSpan.textContent);
      }
   }

   for ( ri = 0; ri < 4; ++ri )
   {
      if ( res[ri] === undefined )
      {
         res = null; 
         break;
      }
   }

   if ( res )
   {
      // try to find build time for newer versions of Travian
      if ( res && ts === undefined )
      {
         aSpan = $xf("ancestor::*[@id='contract']/following-sibling::*//span[" + $xClass("clocks") + "]", 'f', costNode);
         if ( aSpan )
         {
            ts = toSeconds(aSpan.textContent);
         }
      }

      __ASSERT__(ts,"Can't parse time span for contract")
   }

   return res ? { costNode:costNode, cost:res, cc:cc, ts:ts } : null;
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
// return [building name,building level] gathered from html page
function scanBuildingNameLevel(aDoc)
{
   var name, level;
   var aHeader = __TEST__($xf("//div[@id='" + ID_CONTENT + "']//h1",'f', aDoc, aDoc));
   if ( aHeader )
   {
      name = trimWhitespaces(aHeader.firstChild.textContent);
      level = scanIntAny(aHeader.textContent);
   }

   return ( name !== '' && isIntValid(level) )  ? [name, level] : null;
}

//////////////////////////////////////////////////////////////////////
function searchQueueTable(aDoc)
{
   return $xf("//div[@id='" + ID_CONTENT + "']//table[" + $xClass('under_progress') + "]", 'f', aDoc, aDoc);
}

