//////////////////////////////////////////////////////////////////////
function getRPActionImageName(action)
{
   return ifEqual(action, 1,'att_all_1', 2,'att_all_2', 'def1_1');
}

//////////////////////////////////////////////////////////////////////
function getSendResHref(mapId, newdid/*opt*/, hashKey/*opt*/)
{
   var url = "";

   if ( TB3O.pageSelector === "market_send" && (newdid === undefined || newdid == TB3O.ActiveVillageId ) )
   {
      var xy = id2xy(mapId);
      hashKey = hashKey || {};
      hashKey.x = xy[0];
      hashKey.y = xy[1];
      url = combineUri({hashKey : hashKey});
   }
   else
   {
      url = "build.php?";
      if ( newdid && newdid !== TB3O.ActiveVillageId )
      {
         url += "&newdid=" + newdid + "&";
      }
      url += "z=" + mapId + "&gid=17" + (TB3O.ServerInfo.features.new_link_style ? "&t=5" : "");
      if ( hashKey ) { url += combineUri({hashKey : hashKey}); }
   }

   return url;
}

//////////////////////////////////////////////////////////////////////
function uiCreateSendResTool(mapId)
{
   var aLink = null;
   if ( mapId !== TB3O.ActiveVillageMapId )
   {
      aLink = $lnk([['class','tbInject tbRes'], ['href',getSendResHref(mapId)]], [" ", I("r41")]);
   }

   return aLink;
}

//////////////////////////////////////////////////////////////////////
function uiCreateSendAttDefTool(mapId, action /*opt*/)
{
   var aLink = null;
   if ( mapId !== TB3O.ActiveVillageMapId )
   {
      if ( action === undefined ) { action = parseInt10(TBO_RP_DEFAULT_ACTION); }
      aLink = $lnk([['class', 'tbInject tbAttDef'], 
                    ['href', (TB3O.ServerInfo.features.new_link_style ? 'build.php?id=39&tt=2&z=' : 'a2b.php?z=') + mapId]], 
                    [" ", I(getRPActionImageName(action))]);
   }
   return aLink;
}


//////////////////////////////////////////////////////////////////////
// options{
//    disable_tip
//    disable_expansion
// }
function uiCreateIntMapLink(mapId, content, options /*opt*/)
{
   if ( !options ) { options = {}; }

   var cls = "";
   if ( options.disable_expansion )
   {
      cls = "tbInject";
   }

   var xy = id2xy(mapId);
   var aLink = $lnk([['class',cls],['href','karte.php?x=' + xy[0] + '&y=' + xy[1]]], content);

   if ( !options.disable_tip )
   {
      uiAddTooltipForIntMapLink(aLink,mapId);
   }

   return aLink;
}

//////////////////////////////////////////////////////////////////////
function uiCreateIntMapLinkXY(x,y, txt, options /*opt*/)
{
   return uiCreateIntMapLink(xy2id(x,y), txt, options);
}

//////////////////////////////////////////////////////////////////////
function uiCreateIntMapLinkXY2(x,y)
{
   return uiCreateIntMapLinkXY(x, y, formatCoords(x,y), {disable_expansion:true});
}

