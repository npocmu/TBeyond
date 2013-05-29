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
function getRace()
{
   var clsName;
   // try get race from quest master image (only T4.0)
   var imgQM = $g("qgei");
   if ( imgQM )
   {
      clsName = imgQM.className;
      if ( clsName )
      {
         if ( clsName.indexOf("nation1") !== -1 )
         {
            setRace(1);
         }
         else if ( clsName.indexOf("nation2") !== -1 )
         {
            setRace(11);
         }
         else if ( clsName.indexOf("nation3") !== -1 )
         {
            setRace(21);
         }
      }
   } 
   else 
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
         var racex = scanIntWithPrefix(prefix, imgBig.className);
         if ( isIntValid(racex) )
         {
            setRace([1,11,21][racex-1]);
         }
      }
   }

   __ASSERT__(TBU_RACE !== '', "Can't detect race for player from this page")
}


//////////////////////////////////////////////////////////////////////
function scanCommonContractInfo(costNode)
{
   var i,ri;
   var res = Array(4);
   var cc,ts;
   var Spans = costNode.getElementsByTagName("span");
   for ( i = 0; i < Spans.length; ++i )
   {
      var aSpan = Spans[i];
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

   return { costNode:costNode, cost:res, cc:cc, ts:ts };
}

//////////////////////////////////////////////////////////////////////
function getRequiredRes(costNode)
{
   return scanCommonContractInfo(costNode).cost;
}

//////////////////////////////////////////////////////////////////////
function searchNavigationLinks(aDoc)
{
   var navLinks = $xf("//div[@id='" + ID_CONTENT + "']//a[contains(@href, 'page=')]", 'l', aDoc, aDoc);
   return navLinks;
}

//////////////////////////////////////////////////////////////////////
function getCulturePoints(aDoc)
{
   var cpArray = [];
   var lastNode;

   var menu = searchAndParseTabMenu(aDoc);
   if ( !menu )
   {
      menu = searchAndParseSubMenu(aDoc); // new style
   }

   if ( menu )
   {
      var content = __TEST__($g(ID_CONTENT, aDoc));
      var aX = $xf("./following::b", 'l', menu.container, aDoc);
      if ( aX.snapshotLength >= 4 ) 
      { 
         forEach(aX, function (node) 
                     { 
                        if ( hasAncestor(node,content) ) 
                        { 
                           cpArray.push(scanIntWithoutLetter(node.textContent)); 
                           lastNode = node;
                        } 
                     } );
      }
   } 
   
   __ASSERT__( cpArray.length >= 4, "Can't parse culture points" )

   return ( cpArray.length >= 4 ) ? {cp:cpArray, container: lastNode.parentNode.parentNode} : null;
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

//////////////////////////////////////////////////////////////////////
function scanUpgradeInfo(aDoc, ttServer)
{
   var upgradeInfo =  new UpgradeInfo(); upgradeInfo.ttUpd = ttServer;

   //-----------------------------------------------------------------
   function parseTroopLevel(elem)
   {
      var aImg = __TEST__($nth_tag(elem,"img"));
      if ( aImg )
      {
         var tInfo = getTroopIndexTitleFromImg(aImg);
         var aSpan = __TEST__($nth_tag(elem,"span"));
         if ( aSpan )
         {
            var txtLvl = trimBlanks(aSpan.textContent);
            tInfo.push(txtLvl);
            return tInfo;
         }
      }
      return null;
   }

   //-----------------------------------------------------------------
   function scanUpgradingQueue()
   {
      var queueTb = searchQueueTable(aDoc);
      if ( queueTb )
      {
         var rows = queueTb.rows;

         var xi;
         for (xi = 1; xi < rows.length; ++xi)
         {
            var cells = rows[xi].cells;
            if ( cells.length === 3 )
            {
               var tInfo = parseTroopLevel(cells[0]);
               if ( tInfo )
               {
                  var lvl = scanIntAny(tInfo[2]);
                  if ( isIntValid(lvl) )
                  {
                     var ttEnd = getEventTimeStamp(ttServer, cells[1].textContent);
                     upgradeInfo.evA.push(new UpgradingEvent(tInfo[1], ttEnd, tInfo[0], tInfo[2], lvl));
                  }
               }
            }
         }
         return ( upgradeInfo.evA.length === (queueTb.rows.length - 1) );
      }
      return true;
   }

   //-----------------------------------------------------------------
   function scanUpgradeLevels()
   {
      var unitsData = [];
      var unitsList = $xf("//div[@id='" + ID_CONTENT + "']//div[" + $xClass('information') + "]/div["+ $xClass('title') + "]", 'l', aDoc, aDoc);
      var i, count = 0;
      for ( i = 0; i < unitsList.snapshotLength; ++i )
      {
         var tInfo = parseTroopLevel(unitsList.snapshotItem(i));

         if ( tInfo )
         {
            var lvl = scanIntAny(tInfo[2]);
            if ( isIntValid(lvl) )
            {
               var uix = tInfo[0] - TBU_RACE_DELTA;
               upgradeInfo.uul[uix] = lvl;
               ++count;
            }
         }
      }
      return (count === unitsList.snapshotLength);
   }

   var result = scanUpgradingQueue() && scanUpgradeLevels();

   __DUMP__(upgradeInfo);

   return result ? upgradeInfo : null;
}
