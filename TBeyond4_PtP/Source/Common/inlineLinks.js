/////////////////////////////////////////////////////////////////////
function createStatLink(strType, aX, textURL)
{
   var aLnk = null;
   var wsIndex = parseInt10(TBO_WS_ANALYSER_INDEX);
   if ( !(wsIndex >= 0 || wsIndex < wsAnalysers.length) ) { wsIndex = 0; }

   var ahws = wsAnalysers[wsIndex][2](wsAnalysers[wsIndex][1],strType,aX);
   if ( ahws !== "" ) 
   {
      if ( textURL ) 
      {
         aLnk = $lnk([['target', '_blank'], ['href', ahws], ['class','tbInject tbExtStat']],$txt(textURL));
      }
      else 
      {
         var aImg = I("globe", [['title', T( (strType === "user") ? 'WSP' : 'WSA') + ", " + T('27.TT') + ": " + wsAnalysers[wsIndex][0]]]);
         aLnk = $lnk([['target', '_blank'], ['href', ahws], ['class','tbInject tbExtStat']], aImg);
      }
   }
   return aLnk;
}

/////////////////////////////////////////////////////////////////////
function createMapLink(strType, aX, strName)
{
   var aLnk = null;
   var mapIndex = parseInt10(TBO_MAP_ANALYSER_INDEX);
   if ( !(mapIndex >= 0 && mapIndex < mapAnalysers.length) ) { mapIndex = 0; }

   var hrefMapPage = mapAnalysers[mapIndex][2](mapAnalysers[mapIndex][1],strType,aX);
   if ( hrefMapPage !== "" )
   {
      var aImg = I("smap", [['title', T('29.TT') + ": " + mapAnalysers[mapIndex][0]]]);
      aLnk = $lnk([['href', hrefMapPage], ['target', '_blank'], ['class','tbInject tbExtMap']], aImg);
   }
   return aLnk;
}

/////////////////////////////////////////////////////////////////////
function insertTradeBalanceLink(aNode, uid)
{
   var linkNode = $lnk([['href', 'manual.php?typ=7&s=' + uid], ['target', '_blank'], ['class','tbInject tbTradeBal']],
                      I("capacity",[['title', T('TRADEBAL.TT')]]));
   insertAfter(aNode,linkNode);
}	


/////////////////////////////////////////////////////////////////////
// Create and insert link for send message to player uid
function insertIGMLink(aNode, uid)
{
   var linkNode = $lnk([['href', 'messages.php?t=1&id=' + uid],['class','tbInject tbMail']],
                      I("igm",[['title', T('SENDIGM')]]));
   insertAfter(aNode,linkNode);
}	

/////////////////////////////////////////////////////////////////////
//insert Travian World Analyser link
function insertWALink(aNode, strType, uid) 
{
   var linkNode = createStatLink(strType, uid);
   if ( linkNode )
   {
      insertAfter(aNode,linkNode);
   }
}

/////////////////////////////////////////////////////////////////////
// insert Travian map link
function insertMapLink(aNode, strType, uid, strName)
{
   var linkNode = createMapLink(strType, uid, strName);
   if ( linkNode )
   {
      insertAfter(aNode,linkNode);
   }
} 


/////////////////////////////////////////////////////////////////////
function insertAllyLinks(aNode, aid, strName)
{
   if ( TBO_SHOW_MAP_ALLY_LINKS === "1" ) { insertMapLink(aNode, "ally", aid, strName); }
   if ( TBO_SHOW_STAT_LINKS === "1" ) { insertWALink(aNode, "ally", aid); }
}

/////////////////////////////////////////////////////////////////////
function insertUserLinks(aNode, uid, strName)
{
   if ( uid > 0 && TB3O.UserID != uid &&
        TBO_SHOW_TRADE_BALANCE_LINKS === "1" ) { insertTradeBalanceLink(aNode, uid); }
   if ( uid > 0 && TBO_SHOW_MAP_USER_LINKS === "1" ) { insertMapLink(aNode, "user", uid, strName); }
   if ( uid > 0 && TBO_SHOW_STAT_LINKS === "1" ) { insertWALink(aNode, "user", uid); }
   if ( uid !== 1 && 
        ( TB3O.UserID != uid || 
         (TB3O.UserID == uid && TBO_SHOW_IGM_LINK_FOR_ME !== "0"))) { insertIGMLink(aNode, uid); }
}

/////////////////////////////////////////////////////////////////////
function insertAttSendResLinks(strType, aNode, mapId)
{
   if ( strType === "res" || strType === "all" )
   {
      insertAfter(aNode, uiCreateSendResTool(mapId));
   }

   if ( strType === "att" || strType === "all" )
   {
      insertAfter(aNode, uiCreateSendAttDefTool(mapId));
   }
}

/////////////////////////////////////////////////////////////////////
// add player & ally links - IGM, World Analyser, Map Analyser
// modify links in 'parent' node
// options {
//    add_send_troops, 
//    add_send_troops2, 
//    add_send_res, 
//    add_center_map,
//    add_coord_dist_tip
// }
function uiModifyLinks(parent, options)
{
   var aL = [], aLink, i, url;
   var mapId, id;
   var villageInfo = TB3O.ActiveVillageInfo;
   var villageMapId = xy2id(villageInfo.x,villageInfo.y);
   if ( !options ) { options = {}; }
   var bAddAttSendResLinks = (options.add_send_troops === undefined) ?  ( TBO_SHOW_SEND_TROOPS_RESOURCES === '1' ) : !!options.add_send_troops;
   var bAddCoordAndDistTT  = (options.add_coord_dist_tip === undefined) ?  ( TBO_SHOW_DIST_TOOLTIPS === '1' ) : !!options.add_coord_dist_tip;
   var bAddCenterMapLinks  = !!options.add_center_map;
   var bAddAttSendResLinksForCenterMapLink = ( TBO_SHOW_SEND_TROOPS_RESOURCES === '1' ) && !!options.add_send_troops2;
   var bIsRallyPoint = ( TB3O.pageSelector === "rally_point_overview" );

   __ENTER__
   if ( parent )
   {
      __DUMP_NODE__(parent)
      __DUMP__(options)

      var links = parent.getElementsByTagName("a");

      // make local copy to ensure that all links traveled once
      for ( i = 0; i < links.length; i++ )
      {
         aL.push(links[i]);
      }

      for ( i = 0; i < aL.length; i++ )
      {
         aLink = aL[i];

         if ( hasClass(aLink,"tbInject") ) { continue; }
         url = parseUri(aLink.href);

         // a player link
         if ( url.path === "/spieler.php" )
         {
            if ( (TBO_SHOW_USER_LINKS_RP === '1' && bIsRallyPoint) || !bIsRallyPoint ) 
            {
               if ( url.queryKey.uid !== undefined ) 
               {
                  id = parseInt10(url.queryKey.uid);
                  if ( isIntValid(id) )
                  {
                     // avoid bug in travian
                     // When send troops to oasis then user id in link has value = 0
                     if ( !(TB3O.pageSelector === "rally_point_send_confirm" && id === 0) )
                     {
                        insertUserLinks(aLink, id, aLink.textContent);
                     }
                  }
               }
            }
         }
         //an alliance link ( ignore links to internal forum )
         else if ( url.path === "/allianz.php" && !url.queryKey.s && !url.queryKey.action )
         {
            if ( url.queryKey.aid !== undefined ) 
            {
               id = parseInt10(url.queryKey.aid);
               if ( isIntValid(id) && id !== 0 )
               {
                  insertAllyLinks(aLink, id, aLink.textContent);
               }
            }
         }
         // the attack link for karte.php links
         else if ( url.path === "/karte.php" ) 
         {
            if ( url.queryKey.x !== undefined && url.queryKey.y !== undefined )
            {
               // special case - add links only in messages and bookmarks
               addLinksAndTips(aLink, xy2id(url.queryKey.x,url.queryKey.y), bAddAttSendResLinksForCenterMapLink, bAddCoordAndDistTT);
            }
            else
            {
               addLinksAndTips(aLink, url.queryKey.d || url.queryKey.z , bAddAttSendResLinks, bAddCoordAndDistTT);
            }
         }
         IF_TB4({{
         // the attack link for position_details links
         else if ( url.path === "/position_details.php" ) 
         {
            if ( url.queryKey.x !== undefined && url.queryKey.y !== undefined )
            {
               addLinksAndTips(aLink, xy2id(url.queryKey.x,url.queryKey.y), bAddAttSendResLinks, bAddCoordAndDistTT);
            }
         }
         }})
         // the resource link for a2b.php links
         else if ( url.path === "/a2b.php" ) 
         {
            mapId = url.queryKey.z;
            if ( mapId > 0 && mapId != villageMapId )
            {
               if ( bAddAttSendResLinks ) 
               {
                  insertAttSendResLinks("res", aLink, mapId);
               }
               insertCenterMapLinks(aLink, mapId);

               //add a tooltip including distance and troop times
               // TODO: display a2b specific tip
               if ( bAddCoordAndDistTT )
               {
                  uiAddTooltipForIntMapLink(aLink, mapId);
               }
            }
         }
         //a message link (ignore IGM links)
         else if ( (url.path === "/messages.php" && (url.queryKey.t === undefined || url.queryKey.t === "0" || url.queryKey.t === "2") ) || 
                   (url.path === "/berichte.php") ) 
         {
            if ( TBO_SHOW_MES_OPEN_LINKS === "1" && url.queryKey.id !== undefined && 
                                                    url.queryKey.toggleState === undefined )
            {
               if ( aLink.textContent !== '' ) // avoid aditional link for icons
               {
                  insertMsgRptPopupLink(aLink);
               }
            }
         }
      }
   }
   __EXIT__

   function insertCenterMapLinks(aNode, mapId)
   {
      if ( bAddCenterMapLinks )
      {
         insertAfter(aNode,$lnk([['href', 'karte.php?z=' + mapId],['class','tbInject tbMap']],
                               ["\u00A0", I("centermap",[['title', T('CENTERMAP')]])]));
      }
   }

   function addLinksAndTips(aLink, mapId, bAddAttSendResLinks, bAddCoordAndDistTT)
   {
      if ( mapId > 0 && mapId != villageMapId )
      {
         if ( bAddAttSendResLinks ) 
         {
            insertAttSendResLinks("all", aLink, mapId);
         }

         insertCenterMapLinks(aLink, mapId);

         //add a tooltip including distance and troop times
         if ( bAddCoordAndDistTT )
         {
            uiAddTooltipForIntMapLink(aLink, mapId);
         }
      }
   }
}
