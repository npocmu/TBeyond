//////////////////////////////////////////////////////////////////////
function searchRallyPointSendTroopsTimesContainer()
{
   var container = null;
   var bOK = __TEST__($g("btn_ok"));
   if ( bOK )
   {
      insertAfter(bOK, container = $div(attrInject$));
   }
   return container;
}

//////////////////////////////////////////////////////////////////////
function parseTroopDetails(troopDetailsTb, aDoc, ttServer, oasisMapId, bKeepId)
{
   function getGroupCmd(str)
   {
      var arClasses = ['inSupply', 'inAttack', 'inRaid', 'inReturn', 'outSupply','outAttack', 'outRaid', 'outSpy', 'outHero', 'outSettler'];
      var arCmd     = [ ATC_DEFEND, ATC_ATTACK, ATC_RAID,          ,  ATC_DEFEND, ATC_ATTACK,  ATC_RAID,  ATC_SPY, ATC_ADVENTURE, ATC_SETTLE];
      var j;

      for ( j = 0; j < arClasses.length; j++)
      {
         if ( str.indexOf(arClasses[j]) !== -1 ) { return [j<=3 ? 1:2, arCmd[j]]; }
      }
      return [,];
   }

   var info = null;
   try
   {
      var i;
      var node, url, backhref; 
      var hostMapId, hostVName, targetMapId, targetVName;
      var ttArrival, booty, cc, racex, userName, userId; 
      var units = new Array(TG_UNITS_COUNT);
      var grcmd = getGroupCmd(troopDetailsTb.className);

      // link may absent for reinforcement from nature 
      node = $nth_tag(troopDetailsTb.rows[0].cells[0],"a");
      if ( node )
      {
         url = parseUri(node.href);
         if ( url.queryKey.hasOwnProperty("d") )
         {
            hostMapId = parseInt10(url.queryKey.d);
            hostVName = node.textContent;
         }
      }

      node = $xf(".//a[not(" + $xClass('markAttack') + ")]", 'f', troopDetailsTb.rows[0].cells[1], aDoc);
      if ( node )
      {
         url = parseUri(node.href);
         if ( url.queryKey.hasOwnProperty("d") )
         {
            targetMapId = parseInt10(url.queryKey.d);
            targetVName = node.textContent;
         }
         else if ( url.queryKey.hasOwnProperty("uid") )
         {
            userId = url.queryKey.uid;
            userName = ( userId == TB3O.UserID ) ? TBU_NAME : node.textContent;
         }
      }

      node = $nth_tag(troopDetailsTb.rows[1].cells[1],"img");
      if ( node )
      {
         racex = getRaceIndexFromTroopIndex(getTroopIndexTitleFromImg(node)[0]);
      }

      if ( !isIntValid(racex) ) { throw("race?"); }


      node = $xf(".//div[@class='res']", 'f', troopDetailsTb, aDoc);
      if ( node )
      {
         booty = getResourcesFromString(getTextContent(node));
      }

      var allUnitsCells = troopDetailsTb.rows[2].cells;
      for ( i = 1; i < allUnitsCells.length; i++)
      {
         var unitsCount = parseInt10(allUnitsCells[i].textContent);
         if ( !isIntValid(unitsCount) ) { unitsCount = undefined; }
         units[i-1] = unitsCount;
      }

      node = $xf(".//div[@class='sup']", 'f', troopDetailsTb, aDoc);
      if ( node )
      {
         cc = parseInt10((node.textContent));
      }

      node = $xf(".//div[@class='in']/span", 'f', troopDetailsTb, aDoc);
      if ( node )
      {
         var timeSpan = toSeconds(node.textContent);
         ttArrival = ttServer + (timeSpan * 1000);
      }

      node = $xf(".//div[@class='sback']/a", 'f', troopDetailsTb, aDoc);
      if ( node )
      {
         backhref = node.href;
      }

      if ( grcmd[0] === undefined ) 
      {
         grcmd[0] = ( targetMapId === undefined ) ? 3 : 4;
      }

      if ( (grcmd[0] === 3 || grcmd[0] === 4) && (!backhref || backhref.indexOf("tt=2") === -1) )
      {
         grcmd[1] = ATC_IMPRISON;
      }

      info = new TroopDetailsInfo(hostMapId, hostVName, oasisMapId,
                                  targetMapId, targetVName, grcmd[0], grcmd[1],
                                  userId, userName, ttArrival, racex, units, cc, booty);
      if ( bKeepId ) { info.id = troopDetailsTb.id; }
   }
   catch(e)
   {
      __DUMP__(e)
      info = null;
   } 
   return info;
}

//////////////////////////////////////////////////////////////////////
function scanRallyPointInfo(rallyPointInfo, groupNo, villageId, aDoc, ttServer, bReadOnly)
{
   __ENTER__
   var i;
   var nodeList = $xf("//div[@id='" + ID_CONTENT + "']//*["+
                               "(self::table and " + $xClass('troop_details') + ") or " +
                               "(self::p and " + $xClass('info') + ") or " +
                               "self::h4]",'r',aDoc,aDoc);

   if ( nodeList.snapshotLength > 0 )
   {
      var oasisMapId, groupCount;

      for ( i = 0; i < nodeList.snapshotLength; ++i )
      {
         var node = nodeList.snapshotItem(i);

         if ( TAG(node) === "P" )
         {
            node = $nth_tag(node,"a");
            if ( node )
            {
               var url = parseUri(node.href);
               if ( url.queryKey.hasOwnProperty("d") )
               {
                  oasisMapId = parseInt10(url.queryKey.d);
               }
            }
         }
         else if ( TAG(node) === "TABLE" )
         {
            if ( !bReadOnly && !node.hasAttribute("id") ) { node.id = "tb_td_" + i; }

            var troopDetailsInfo = parseTroopDetails(node, aDoc, ttServer, oasisMapId, !bReadOnly);
            __ASSERT__(groupNo===0 || (groupNo!==0 && troopDetailsInfo.gr===groupNo), {{"Incorrect detect group for troop. Need " + groupNo + ", has " + troopDetailsInfo.gr}})
            if ( troopDetailsInfo )
            {
               rallyPointInfo.t.push(troopDetailsInfo);
               rallyPointInfo.grc[troopDetailsInfo.gr-1] = groupCount;
            }
         }
         else // h4
         {
            oasisMapId = undefined;
            groupCount = scanIntRE(node.textContent, /\((\d+)\)/);
         }
      }
   }

   __EXIT__

   return rallyPointInfo;
}

//////////////////////////////////////////////////////////////////////
function getRallyPointInfo(villageId, aDoc, ttServer, bReadOnly)
{
   function getActiveFilter()
   {
      var filter = 0;
      var button = $xf("//div[@id='" + ID_CONTENT + "']//button["+ $xClass('iconFilterActive') + "]",'f',aDoc,aDoc);
      if ( button )
      {
         var v = button.value;
         filter = scanIntWithPrefix('filterCategory',v);
         if ( !isIntValid(filter) ) { filter = 0; }

         __ASSERT__(filter,'unknown filter for rally point overview')
      }
      return filter;
   }

   __ENTER__
   var rallyPointInfo = new RallyPointInfo();
   scanRallyPointInfo(rallyPointInfo,  getActiveFilter(), villageId, aDoc, ttServer, bReadOnly);

   if ( rallyPointInfo.t.length )
   {
      rallyPointInfo.ttUpd = ttServer;
      __DUMP__(getRallyPointInfoView(villageId, rallyPointInfo))

      // if navigation link or 'show more' switch provided then not all information available
      if ( !$xf("//div[@id='" + ID_CONTENT + "']//p[" + $xClass('switch') + "] | //div[@id='" + ID_CONTENT + "']//div[" + $xClass('paginator') + "]", 'f', aDoc, aDoc) ) 
      {
         getVillageUnitsCount(TB3O.VillagesInfo[villageId], rallyPointInfo);
      }
      else
      {
         __ASSERT__(false, {{"navigation links or 'show more' button presents, can't collect all info"}})
      }
   }
   else
   {
      rallyPointInfo = null;
   }

   __EXIT__

   return rallyPointInfo;
}

//////////////////////////////////////////////////////////////////////
//             Part of Dorf3 refresh functions
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
function doneLoadRallyPoint(xhr_doc, villageId, ttServer, bSuccess)
{
   bSuccess = ( bSuccess && setVillageRes(villageId, xhr_doc, ttServer) );

   if ( bSuccess )
   {
      saveVillagesInfoProxy();
      refreshSupplement(villageId);

      fillD3TbRow_Tab5(villageId);
      fillD3TbTotals_Tab5();

      updD3Bullets(villageId, 2);

      //M4_DEBUG({{exportRallyPointInfo(villageId, TB3O.rallyPointInfo)}})
   }
   else
   {
      updD3Bullets(villageId, 4);
   }
}

//////////////////////////////////////////////////////////////////////
function onLoadRallyPoint(villageId, xhr_doc)
{
   var lastDoc = xhr_doc;
   var ttServer = toTimeStamp(getServerTime(xhr_doc));

   function onSuccess(groupNo, page, xhr_doc)
   { 
      lastDoc = xhr_doc;
      ttServer = toTimeStamp(getServerTime(xhr_doc));
      scanRallyPointInfo(TB3O.rallyPointInfo,  groupNo, villageId, xhr_doc, ttServer, true);
      TB3O.rallyPointInfo.ttUpd = Math.max(TB3O.rallyPointInfo.ttUpd, ttServer);
      return true;
   }

   __ENTER__
   var bSuccess = false;
   if ( ttServer )
   {
      TB3O.rallyPointInfo = getRallyPointInfo(villageId, xhr_doc, ttServer, true);
      if ( TB3O.rallyPointInfo )
      {
         var grc = TB3O.rallyPointInfo.grc;
         if ( TB3O.rallyPointInfo.t.length === grc[0]+grc[1]+grc[2]+grc[3] )
         {
            bSuccess = true;
         }
         else
         {
            bSuccess = undefined;

            var ajaxSequencer = new AJAXSequencer({
               onfail: function () { ajaxSequencer.cancel(); },
               oncomplete: 
                  function ( bSuccess )
                  {
                     doneLoadRallyPoint(lastDoc, villageId, ttServer, bSuccess);
                  }
            });

            // detect large groups and load its separately
            var gix;
            for ( gix = 0; gix < 4; ++gix )
            {
               var page;
               for ( page = 2; page <= Math.ceil(grc[gix]/10); ++page )
               {
                  var href = URL_RP_OVERVIEW(villageId) + "&filter=" + (gix+1) + "&page=" + page;
                  __DUMP__(grc[gix],href)
                  ajaxSequencer.load(href, bind2(onSuccess,[gix+1,page]));
               }
            }
         }
      }
   }

   if ( bSuccess !== undefined )
   {
      doneLoadRallyPoint(xhr_doc, villageId, ttServer, bSuccess);
   }
   __EXIT__

}

