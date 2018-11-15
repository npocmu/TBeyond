/*
cellInfo properties
   x,y          (integers) - coordinates of cell
   lnk          (string)   - url for map position details
   is_oasis     (boolean)  - true if cell is oasis, false - regular cell
   type         (integer)  - type of cell
   title        (string)   - title for cell
   playerName   (string, optional)
   allianceName (string, optional)
   villageName  (string, optional)
   pop          (integer, optional)
   rx           (integer, optional) - race index
*/

//////////////////////////////////////////////////////////////////////
// Map cache
function MapInfo()
{
   var cells = {}; // collection of cellInfo, accessed by map id
   var cellsCount = 0;
   this.left = 0;
   this.bottom = 0;
   this.sizeX = 7;
   this.sizeY = 7;

   // TODO: remove only cells too far
   function cleanup(x, y)
   {
      cells = {};
      cellsCount = 0;
   }

   this.setMapWindow = function (left, bottom, sizeX, sizeY)
   {
      this.left = left;
      this.bottom = bottom;
      this.sizeX = sizeX;
      this.sizeY = sizeY;
      __DUMP__(left, bottom, sizeX, sizeY)
   }

   this.getCell = function (mapId)
   {
      var cellInfo = cells[mapId];
      return cellInfo;
   }

   this.getCellXY = function (x,y)
   {
      return this.getCell(xy2id(x, y));
   }

   this.getCelldXdY = function (dx,dy)
   {
      return this.getCellXY(this.left + dx, this.bottom + dy);
   }

   this.addCell = function (mapId, newInfo)
   {
      var cellInfo = cells[mapId];
      if ( cellInfo === undefined )
      {
         var XY = id2xy(mapId);
         if ( cellsCount === 1000 ) { cleanup(XY[0], XY[1]); }
         cellInfo = cells[mapId] = newInfo;
         ++cellsCount;
      }
      else
      {
         cloneUndefinedProperties(newInfo, cellInfo);
      }

      return cellInfo;
   }
}

//////////////////////////////////////////////////////////////////////
function uiCreateCellInfoTooltip(mapId)
{
   //-----------------------------------------------------------------
   function uiAddTroopsInfoTables(container, troopsInfo)
   {
      var aBody;
      var aDiv = $div(['class','tbTip'], $t(aBody = $e("tbody")));

      var i;
      for ( i = 0; i < troopsInfo.length; i++ )
      {
         var tix = troopsInfo[i][0];
         var count = troopsInfo[i][1];
         if ( count > 0 )
         {
            addChildren(aBody, $r(null, [$td(['class','tbIco'], getTroopImage(tix)),
                                         $td(['class','tbVal'], count.toString())]));
         }
      }

      replaceElement(container, [aDiv, uiCreateTroopsAttDefTable4Tip(troopsInfo, false)]);
   }

   //-----------------------------------------------------------------
   function getTroopsAttDefInfoContainer(mapId)
   {
      return $g('tb_tt_' + mapId);
   }

   //-----------------------------------------------------------------
   function onAjaxFailed(mapId)
   {
      removeChildren(getTroopsAttDefInfoContainer(mapId));
      var cellInfo = TB3O.MapInfo.getCell(mapId);
      if ( cellInfo )
      {
         delete cellInfo.oasisInfo;
      }
   }

   //-----------------------------------------------------------------
   function onGetOasisDetails(mapId, aDoc)
   {
      var container = getTroopsAttDefInfoContainer(mapId);
      removeChildren(container);
      var cellInfo = TB3O.MapInfo.getCell(mapId);
      if ( cellInfo && cellInfo.oasisInfo )
      {
         cellInfo.oasisInfo.troops = null;
         var troopsTable = searchTroopsInfoTable(aDoc);
         if ( troopsTable )
         {
            var troopsInfo = getTroopsInfo(troopsTable);
            if ( troopsInfo )
            {
               cellInfo.oasisInfo.troops = troopsInfo;
               if ( container )
               {
                  uiAddTroopsInfoTables(container, troopsInfo);
               }
            }
         }
      }
   }

   //-----------------------------------------------------------------
   var i, info;
   var aDiv, aTbl;
   var aContent = null;
   var aTipDiv = $div(aDiv = $div(['class','tbTip']));
   var cellInfo = TB3O.MapInfo.getCell(mapId);

   if ( cellInfo )
   {
      __DUMP__(cellInfo)

      addChildren(aDiv, $div(['class', 'tbHeading tbCenter'], $span(['class', 'tbCoord'], formatCoords(cellInfo.x, cellInfo.y)))); 

      if ( cellInfo.title ) 
      {
         addChildren(aDiv, [$span(['class','tbTitle'],cellInfo.title), $e("br")]); 
      }

      if ( cellInfo.hasOwnProperty("playerName") ) 
      {
         aTbl = $t();
         aTbl.appendChild($r(null,[$th(T("PLAYER")),
                                   $td(['class', ( cellInfo.playerName === TBU_NAME ) ? 'tb3mtcu' : ''],cellInfo.playerName)]));
         aTbl.appendChild($r(null,[$th(T("8")),$td(['class','tbVal'], cellInfo.allianceName)]));
         if ( cellInfo.hasOwnProperty("pop") ) 
         {
            aTbl.appendChild($r(null,[$th(T("POPULATION")),$td(['class','tbVal'], cellInfo.pop)]));
         }
         if ( cellInfo.hasOwnProperty("rx") ) 
         {
            aTbl.appendChild($r(null,[$th(T("U.2")),$td(['class','tbVal'], TB3O.KnownRaces[cellInfo.rx])]));
         }
         aDiv.appendChild(aTbl);
      }

      if ( !cellInfo.is_oasis ) //a map cell or a village
      {
         if ( cellInfo.type && cellInfo.type < villageTypes.length )
         {
            info = villageTypes[cellInfo.type];
            for ( i = 1; i < 5; i++ )
            {
               addChildren(aDiv, [I("r" + i), " " + info[i - 1] + " "]);
            }
         }
      }
      else // an oasis
      {
         if ( cellInfo.type && cellInfo.type < oasisTypes.length )
         {
            info = oasisTypes[cellInfo.type];
            for ( i = 0; i < 4; i++ )
            {
               if ( info[i] )
               {
                  addChildren(aDiv, [I("r" + (i+1)), " +" + info[i] + "% "]);
               }
            }
         }

         if ( !cellInfo.playerName ) // unoccupied oasis
         {
            var bWait = false;
            var container = $div([['id','tb_tt_' + mapId],['class','tbTitle']]);
            addChildren(aTipDiv, container);

            if ( cellInfo.oasisInfo )
            {
               if ( cellInfo.oasisInfo.troops !== null )
               {
                  uiAddTroopsInfoTables(container, cellInfo.oasisInfo.troops);
               } 
               else if ( cellInfo.oasisInfo.troops === undefined )
               {
                  bWait = true;
               }
            }
            else
            {
               cellInfo.oasisInfo = {};
               bWait = true;
               ajaxLoadDocument(cellInfo.lnk, bind2(onGetOasisDetails,[mapId]), bind(onAjaxFailed,[mapId]));
            }

            if ( bWait )
            {
               addClass(container,'tbWait');
               addChildren(container, I("wait") );
            }
         }
      }

      if ( TBO_SHOW_DIST_TIMES === "1" )
      {
         var distTip = uiCreateTroopsMerchantsDistTable("tb_distTT", null, mapId,
                                             { show_coords:false, show_merchant:true, show_troops:true, tooltip:true });
         if ( distTip ) { addChildren(aTipDiv, distTip); }
      }

      if ( aDiv.hasChildNodes() )
      {
         aContent = aTipDiv;
      }
   }

   return aContent;
}



//////////////////////////////////////////////////////////////////////
function sortTable(sTableID, iCol, sDataType)
{
   //-----------------------------------------------------------------
   function convert(aE, sDataType)
   {
      switch (sDataType)
      {
         case "int":
            return ((aE === null) || !aE.nodeValue.match(/\d+/)) ? 0 : parseInt10(aE.nodeValue);
         case "float":
            return ((aE === null) || !aE.nodeValue.match(/\d+/)) ? 0 : parseFloat(aE.nodeValue);
         default:
            return (aE === null) ? '' : aE.textContent.toLowerCase();
      }
   }

   //-----------------------------------------------------------------
   function compareTRs(oTR1, oTR2)
   {
      var v1 = convert(oTR1.cells[iCol].firstChild, sDataType);
      var v2 = convert(oTR2.cells[iCol].firstChild, sDataType);
      return compare(v1, v2);
   }

   //-----------------------------------------------------------------
   var oTb = $g(sTableID);
   var oB = oTb.tBodies[0];
   var arR = oB.rows;
   var aTRs = [];
   var oFrg = document.createDocumentFragment();
   var i;

   for ( i = 0; i < arR.length; i++ ) { aTRs[i] = arR[i]; }
   if ( getTBAttribute(oTb,"sortCol") == iCol ) 
   { 
      aTRs.reverse(); 
   }
   else 
   {
      aTRs.sort(compareTRs);
   }
   for ( i = 0; i < aTRs.length; i++ ) { oFrg.appendChild(aTRs[i]); }
   oB.appendChild(oFrg);
   setTBAttribute(oTb, 'sortCol', iCol);
}

//////////////////////////////////////////////////////////////////////
//generate the table on the "karte.php" page
function uiCreateNeighborhoodTable(tableId)
{
   var tbody, aRow, aCell;
   var aTb = $t(['id', tableId],
                [ 
                   $e("thead", null, aRow = $r()), 
                   tbody = $e("tbody")
                ]);

   var cL = [['PLAYER','string'], ['8','string'], ['ALDEAS','string'], ['POPULATION','int'], ['COORDS','xy'], ['MAPTBACTS',null]];
   var i;
   for ( i = 0; i < cL.length; i++ )
   {
      aCell = $td(T(cL[i][0]));
      var sortType = cL[i][1];

      if ( sortType ) // sortable?
      {
         addChildren(aCell,[" (",I("arrow_down8"),I("arrow_up8"),")"]);
         $at(aCell, [['title', T('CKSORT')], ['class', 'tb3mthcp'],
                     ['click', bind(sortTable,[tableId, i, sortType]), false]]);
      }
      aRow.appendChild(aCell);
   }

   var dx, dy;

   for ( dx = 0; dx < TB3O.MapInfo.sizeX; dx++ )
   {
      for ( dy = 0; dy < TB3O.MapInfo.sizeY; dy++ )
      {
         var cellInfo = TB3O.MapInfo.getCelldXdY(dx,dy);
         if ( cellInfo && cellInfo.playerName )
         {
            var mapId = xy2id(cellInfo.x, cellInfo.y);
            tbody.appendChild($r(null,
            [
               $td([['class', ( cellInfo.playerName === TBU_NAME ) ? 'tb3mtcu' : '']], cellInfo.playerName),
               $td(cellInfo.allianceName),
               aCell = $td($lnk(['href', cellInfo.lnk],  cellInfo.villageName || cellInfo.title )),
               $td([['class', 'tb3mtcp']], cellInfo.pop),
               $td(uiCreateIntMapLinkXY2(cellInfo.x, cellInfo.y)),
               $td(null, [uiCreateSendAttDefTool(mapId), uiCreateSendResTool(mapId)]) 
            ]));
            uiAddTooltip(aCell, bind(uiCreateCellInfoTooltip,[mapId]));
         }
      }
   }
   return ( tbody.rows.length > 0 ) ? aTb : null;
}

//////////////////////////////////////////////////////////////////////
function uiCreateNeighborhoodWidget()
{
   __ENTER__

   if ( TBO_SHOW_NEIGHBORHOODTABLE === '1')
   {
      var oldtb = $g('mapTable');
      removeElement(oldtb);
      if ( oldtb )
      {
         uiFloatWindow_Remove('mapTableTT');
      }

      var tb = uiCreateNeighborhoodTable('mapTable');

      if ( tb )
      {
         var dxy = TBO_NEIGHBORHOODTABLE_XY.split("|");
         $df(682, dxy[0], dxy[1], " ", 'mapTable', "mapTableTT", false, tb);
      }
   }

   __EXIT__
}

