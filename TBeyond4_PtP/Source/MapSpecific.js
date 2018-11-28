//////////////////////////////////////////////////////////////////////
// Map functions
function uiModifyMap()
{
   var reCoordsSpan = /<span *class *= *"[^"]* *coordinates *[^"]*" *>(.+)<\/span>/;
   var rePlayerName = /\{k\.spieler\} *([^<]+)/;
   var reAllianceName = /\{k\.allianz\} *([^<]+)/;
   var reVillageName = /\{k\.dt\} *(.+)/;
   var rePop = /\{k\.einwohner\} *(\d+)/;
   var reRaceIndex = /\{k\.volk\} *\{a.v(\d+)\}/;
   var reOasisTyp = /\{a\.r(\d+)\} *(\d+)%/g;
   var reTitleTyp = / *\{k\.f(\d+)\} */;
   var reTitleOasis = /\{k\.(fo)|(bt)\}/;
   var translateDict = null;

   //-----------------------------------------------------------------
   function getAreaDetails(area)
   {
      var details = null;

      try
      {
         if ( area.wrappedJSObject )
         {
            var attrName = "_extendedTipContent";
            var areaInfo = area.wrappedJSObject[attrName];

            if ( !areaInfo )
            {
               attrName = "_travianTooltip";
               areaInfo = area.wrappedJSObject[attrName];
            }

            if ( areaInfo && areaInfo.hasOwnProperty('title') && areaInfo.hasOwnProperty('text') )
            {
               // retrive cell info from standard tip
               var xy, type, is_oasis, playerName, allianceName, villageName, pop, racex;
               var title = areaInfo.title;

               if ( areaInfo.text.match(reCoordsSpan) )
               {
                  xy = parseCoords(RegExp.$1);
               }

               if ( areaInfo.text.match(rePlayerName) )
               {
                  playerName = RegExp.$1;
               }

               if ( areaInfo.text.match(reAllianceName) )
               {
                  allianceName = RegExp.$1;
               }

               if ( areaInfo.title.match(reVillageName) )
               {
                  villageName = RegExp.$1;
               }

               if ( areaInfo.text.match(rePop) )
               {
                  pop = parseInt10(RegExp.$1);
               }

               if ( areaInfo.text.match(reRaceIndex) )
               {
                  racex = parseInt10(RegExp.$1) - 1;
               }

               is_oasis = (title.search(reTitleOasis) !== -1);

               if ( is_oasis )
               {
                  var oasisType, ri, percent;
                  var percents = [0,0,0,0];

                  reOasisTyp.lastIndex = 0;
                  while ( reOasisTyp.exec(areaInfo.text) )
                  {
                     ri = parseInt10(RegExp.$1) - 1; 
                     percent = parseInt10(RegExp.$2);
                     percents[ri] = percent;
                  }

                  type = getOasisType(percents);
               }
               else if ( title.match(reTitleTyp) )
               {
                  type = parseInt10(RegExp.$1);
                  title = title.replace(reTitleTyp,"");
               }

               if ( translateDict )
               {
                  title = translateDict.translate(title);
               }
               else
               {
                  title = title.replace(/{([a-z.]+)}/g,"");
               }

               if ( xy )
               {
                  var mapId = xy2id(xy[0], xy[1]);

                  var cellInfo = 
                  {
                     M4_DEBUG({{areaInfo: cloneObject(areaInfo),}})
                     x: xy[0],
                     y: xy[1],
                     lnk: "position_details.php?x=" + xy[0] + "&y=" + xy[1],
                     is_oasis: is_oasis,
                     type: type,
                     title: title  
                  };

                  if ( isStrValid(playerName) )   { cellInfo.playerName = playerName; }
                  if ( isStrValid(allianceName) ) { cellInfo.allianceName = allianceName; }
                  if ( isStrValid(villageName) )  { cellInfo.villageName = villageName; }
                  if ( isIntValid(pop) )          { cellInfo.pop = pop; }
                  if ( isIntValid(racex) )        { cellInfo.rx = racex; }

                  details = { id: mapId, cellInfo: cellInfo };

                  if ( TBO_SHOW_MAP_TOOLTIPS === "1" )
                  {
                     // remove standard tip
                     delete area.wrappedJSObject[attrName].title;
                     delete area.wrappedJSObject[attrName].text;
                  }
               }
            }
         }
      }
      catch (e)
      {
         __DUMP__(e)
      }
      return details;
   }

   //-----------------------------------------------------------------
   function setMapWindow(left, bottom, sizeX, sizeY)
   {                       
      TB3O.MapInfo.setMapWindow(left, bottom, sizeX, sizeY);

      var xy = normalizeCoords(left + Math.floor(sizeX/2), bottom + Math.floor(sizeY/2));
      var cx = xy[0], cy = xy[1];

      var h = $xf("//h1");
      if ( h )
      {
         h.textContent = uiModifyMap.mapHeader + " " + formatCoords(cx,cy);
      }
      uiRefreshVL_Distance(cx,cy);
      uiModifyBrowserTitle();
   }

   //-----------------------------------------------------------------
   function uiModifyCell(dx, dy, mapCell, cellInfo)
   {
      var id  = "tb_map_info_" + dx + "_" + dy;
      removeElement($g(id));
      if ( !cellInfo.is_oasis ) 
      {
         if ( mapCell )
         {
            var info = null;
            switch ( cellInfo.type )
            {
               case 1  /*3-3-3-9*/  : info = I("mr4");  break;
               case 2  /*3-4-5-6*/  : info = I("mr3");  break;
               case 4  /*4-5-3-6*/  : info = I("mr2");  break;
               case 5  /*5-3-4-6*/  : info = I("mr1");  break;
               case 6  /*1-1-1-15*/ : info = [I("mr4",[['class','+tbMo12']]),I("mr4",[['class','+tbMo22']])];  break;
               case 7  /*4-4-3-7*/  : info = [I("mr1",[['class','+tbMo13']]),I("mr2",[['class','+tbMo23']]),I("mr4",[['class','+tbMo33']])];  break;
               case 8  /*3-4-4-7*/  : info = [I("mr2",[['class','+tbMo13']]),I("mr3",[['class','+tbMo23']]),I("mr4",[['class','+tbMo33']])];  break;
               case 9  /*4-3-4-7*/  : info = [I("mr1",[['class','+tbMo13']]),I("mr3",[['class','+tbMo23']]),I("mr4",[['class','+tbMo33']])];  break;
               case 10 /*3-5-4-6*/  : info = I("mr2"); break;
               case 11 /*4-3-5-6*/  : info = I("mr3"); break;
               case 12 /*5-4-3-6*/  : info = I("mr1"); break;
            }
            if ( info )
            {
               mapCell.appendChild($div(['id', id], info));
            }
         }
      }
   }

   //-----------------------------------------------------------------
   function uiRefreshMap()
   {
      __ENTER__

      var mapContainer = __TEST__($g("mapContainer"));
      if ( mapContainer )
      {
         var i;
         var mapRowsCount = $xf("count(.//div[" + $xClass('tileRow')+ "])", 'n', mapContainer);
         var mapTiles = $xf(".//div[" + $xClass('tile')+ "]", 'l', mapContainer);
         var mapTilesCount = mapTiles.snapshotLength;
         var bMapValid = true;

         __ASSERT__(mapRowsCount > 0 && mapTilesCount > 0,"Can't find map data")

         var x1, y1, x2, y2;
         for ( i = 0; i < mapTilesCount; ++i )
         {
            var tile = mapTiles.snapshotItem(i);
            var details = getAreaDetails(tile);
            if ( !details )
            {
               bMapValid = false;
               break;
            }

            TB3O.MapInfo.addCell(details.id, details.cellInfo);

            if ( i === 0 )
            {
               x1 = details.cellInfo.x;
               y1 = details.cellInfo.y;
            }

            if ( i === (mapTilesCount-1) )
            {
               x2 = details.cellInfo.x;
               y2 = details.cellInfo.y;
            }
         }

         if ( bMapValid && mapRowsCount > 0 && mapTilesCount > 0 )
         {
            var d = getCoordsDelta(x1, y1, x2, y2);
            var sizeX = Math.floor(mapTilesCount/mapRowsCount);
            var sizeY = mapRowsCount;

            if ( sizeX*sizeY === mapTilesCount && sizeX === d[0]+1 && sizeY === d[1]+1 )
            {
               //var x = Math.min(x1+TB3O.WorldSize.sizeX, x2+TB3O.WorldSize.sizeX);
               //var y = Math.min(y1+TB3O.WorldSize.sizeY, y2+TB3O.WorldSize.sizeY);
               //__DUMP__(x,y)

               //var xy = normalizeCoords(x, y);
               //setMapWindow(xy[0], xy[1], sizeX, sizeY);
               setMapWindow(x1, y2, sizeX, sizeY);
            }
            else
            {
               bMapValid = false;
               __ERROR__("Unknown map size")
               __DUMP__(mapTilesCount, sizeX, sizeY, d);
            }
         }


         if ( bMapValid )
         {
            if ( TBO_SHOW_CELL_TYPE === '1' ) 
            {
               var dx, dy;
               for ( dx = 0; dx < TB3O.MapInfo.sizeX; dx++ )
               {
                  for ( dy = 0; dy < TB3O.MapInfo.sizeY; dy++ )
                  {
                     var cellInfo = TB3O.MapInfo.getCelldXdY(dx,dy)
                     if ( cellInfo )
                     {
                        uiModifyCell(dx, dy, mapTiles.snapshotItem((TB3O.MapInfo.sizeY - dy - 1)*TB3O.MapInfo.sizeX + dx), cellInfo);
                     }
                  }
               }
            }

            uiCreateNeighborhoodWidget();
         }

         mapContainer.addEventListener("DOMSubtreeModified", onSubtreeModified, false);
      }
      __EXIT__
   }

   //-----------------------------------------------------------------
   function uiRefreshMapProxy()
   {
      __ENTER__
      if ( uiRefreshMapProxy.timer ) 
      {
         clearTimeout(uiRefreshMapProxy.timer);
      }
      uiRefreshMapProxy.timer = setTimeout(function () 
                                           {
                                              uiRefreshMapProxy.timer = null;
                                              uiRefreshMap();
                                           },
                                           TB3O.Timeouts.map_refresh);
      __EXIT__
   }

   //-----------------------------------------------------------------
   function onSubtreeModified(e)
   {
      if ( hasClass(e.target,"tile") )
      {
         e.currentTarget.removeEventListener("DOMSubtreeModified", onSubtreeModified, false);
         uiRefreshMapProxy();
      }
   }
   
   //-----------------------------------------------------------------
   function uiCreateMapTip(e)
   {
      var content = null;
      if ( e.target.className.match(/x{([+-]?\d+)} +y{([+-]?\d+)}/) )
      {
         var x = RegExp.$1;
         var y = RegExp.$2;
         content = uiCreateCellInfoTooltip(xy2id(x, y));
      }
      return content;
   }

   __ENTER__

   TB3O.MapInfo = new MapInfo();

   var h = $xf("//h1");
   if ( h )
   {
      uiModifyMap.mapHeader = h.textContent;
   } 

   if ( TBO_SHOW_MAP_TOOLTIPS === "1" )
   {
      var maparea = $g("mapContainer");
      if ( maparea )
      {
         uiAddTooltip(maparea, uiCreateMapTip);
      }
   }

   if ( window.wrappedJSObject && window.wrappedJSObject.Travian )
   {
      var translation = window.wrappedJSObject.Travian.Translation;
      if ( translation && isFunction(translation.translate) )
      {
         translateDict = translation;
      }
   }

   uiRefreshMapProxy();

   __EXIT__
}
