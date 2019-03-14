//////////////////////////////////////////////////////////////////////
function uiFillVillagesListCells(vRow, nStartColumn, villageInfo, layout_options, refresh_options)
{
   //-----------------------------------------------------------------
   //show Buildings in Progress and Troop Movements in a tooltip
   function uiCreateBiPTMTooltip(villageId, e)
   {
      var tI = uiCreateBiPTMTable(villageId);

      if ( !tI )
      {
         __LOG__(5,"remove BiPTM info icon")
         removeChildren(e.target.parentNode);
      }
      return tI;
   }

   //-----------------------------------------------------------------
   var cells = vRow.cells;
   var k = nStartColumn + 3;
   var aCell, aIco;
   var resourcesInfo = villageInfo.r;
   var villageResKnown = ( resourcesInfo.ttUpd !== undefined );

   // show village race
   if ( layout_options.show_race )
   {
      k += 1;
   }

   // show population
   if ( layout_options.show_pop )
   {
      if ( refresh_options.show_pop )
      {
         replaceChildren(cells[k+1], getActualVillagePopulation(villageInfo));
      }
      k += 2;
   }

   // show CP/day
   if ( layout_options.show_cp )
   {
      if ( refresh_options.show_cp )
      {
         replaceChildren(cells[k+1], getActualVillageCP(villageInfo));
      }
      k += 2;
   }

   // show res prod/h
   if ( layout_options.show_pph )
   {
      for (var xi = 1; xi < 4; xi++ )
      {
         if ( refresh_options.show_pph )
         {
            replaceChildren(cells[k+1], villageResKnown ? resourcesInfo.EPpH[xi-1] : "?");
         }
         k += 2;
      }
   }

   // effective crop prod/h
   if ( layout_options.show_crop_epph )
   {
      if ( refresh_options.show_crop_epph )
      {
         aCell = cells[k+1];
         if ( villageResKnown )
         {
            uiSetEffectiveCropPpH(aCell, resourcesInfo.EPpH[3])
         }
         else
         {
            replaceChildren(aCell, "?");
         }
      }
      k += 2;
   }

   k += layout_options.show_in_out_icons*2 + layout_options.show_center_map_icon*1;

   // infotip
   if ( layout_options.show_bip_att )
   {
      if ( refresh_options.show_bip_att )
      {
         aCell = cells[k];
         if ( villageInfo.BiP.length || villageInfo.TM.length || villageInfo.upi.evA.length 
             IF_TB3(|| villageInfo.upai.evA.length)) 
         {
            replaceChildren(aCell, aIco = I("tbiInfo"));
            uiAddTooltip(aIco,bind2(uiCreateBiPTMTooltip,[villageInfo.id]));
         }
         else
         {
            removeChildren(aCell);
         }
      }
      k += 1;
   }

   k += layout_options.show_send_troops_resources*2;

   if ( layout_options.show_distance )
   {
      if ( refresh_options.show_distance )
      {
         if ( isXYValid(TB3O.xCrt, TB3O.yCrt) )
         {
            var lDist = getDistance(villageInfo.x, villageInfo.y, TB3O.xCrt, TB3O.yCrt);
            cells[k].style.display = "";
            replaceChildren(cells[k+1], lDist.toFixed(2));
         }
         else
         {
            cells[k].style.display = "none";
            removeChildren(cells[k+1]);
         }
      }
   }
}

//////////////////////////////////////////////////////////////////////
function uiAddVillagesListCells(vRow, villageInfo, bActive, bSep, layout_options)
{
   var xi, aCell, aLink, strImg;
   var villageId = villageInfo.id;
   var mapId = xy2id(villageInfo.x,villageInfo.y);
   var fCreateResourceTooltip = bind(uiCreateResourceTooltip,[villageId]);
   var attrTool = ['class','tbTool'];
   var attrIco = ['class','tbIco'];
   var attrVal = ['class','tbVal'];

   function uiAddCell(vRow, aCell)
   {
      if ( bActive ) { addClass(aCell,"tbActive"); }
      if ( bSep ) { addClass(aCell,"tb3sep"); }
      vRow.appendChild(aCell);
   }

   // show population
   if ( layout_options.show_pop )
   {
      uiAddCell(vRow, $td(attrIco,I("tbiPop")));
      uiAddCell(vRow, $td(attrVal));
   }

   // show CP/day
   if ( layout_options.show_cp )
   {
      uiAddCell(vRow, $td(attrIco,I("cp")));
      uiAddCell(vRow, $td(attrVal));
   }

   // show res prod/h, effective crop prod/h
   if ( layout_options.show_pph || layout_options.show_crop_epph )
   {
      for ( xi = 1; xi <= 4; xi++ )
      {
         if ( (layout_options.show_pph && xi <= 4) || (layout_options.show_crop_epph && xi === 4) )
         {
            uiAddCell(vRow, $td(attrIco,I("r" + xi)));
            aCell = $td(attrVal);
            uiAddTooltip(aCell,fCreateResourceTooltip);
            uiAddCell(vRow, aCell);
         }
      }
   }

   // dorf1 & dorf2
   if ( layout_options.show_in_out_icons )
   {
      for ( xi = 1; xi < 3; xi++ )
      {
         strImg = (xi === 1) ? "tbiOV" : "tbiIV";
         aCell = $td(attrTool,
                    $lnk(['href', 'dorf' + xi + '.php?newdid=' + villageId],
                       I(strImg, [['title', villageInfo.name + " (dorf" + xi + ".php)"]])));
         uiAddCell(vRow, aCell);
      }
   }

   // center on map
   if ( layout_options.show_center_map_icon )
   {
      aCell = $td(attrTool, uiCreateIntMapLink(mapId, I("centermap", [['title', T('CENTERMAP') + " (" + villageInfo.name + ")"]]), {disable_tip:true}));
      uiAddCell(vRow, aCell);
   }

   // infotip
   if ( layout_options.show_bip_att )
   {
      uiAddCell(vRow, $td());
   }

   // show send icons
   if ( layout_options.show_send_troops_resources )
   {
      aCell = $td(attrTool,uiCreateSendAttDefTool(mapId, 0));
      uiAddCell(vRow, aCell);

      aCell = $td(attrTool,uiCreateSendResTool(mapId));
      uiAddCell(vRow, aCell);
   }

   if ( layout_options.show_distance )
   {
      uiAddCell(vRow,$td(attrIco, I("dist" + docDir[0].substr(0, 1))));
      uiAddCell(vRow,$td(['class','tbDist']));
   }
}

//////////////////////////////////////////////////////////////////////
function VillagesList2()
{
   this.layout_options = 
   {
      show_race:                  TBO_SHOW_RACE_VL2 === "1",
      show_pop:                   TBO_SHOW_POP_VL2 === "1",
      show_cp:                    TBO_SHOW_CP_VL2 === "1",
      show_pph:                   TBO_SHOW_PPH_VL2 === "1",
      show_crop_epph:             TBO_SHOW_CROP_EPPH_VL2 === "1",
      show_in_out_icons:          TBO_SHOW_IN_OUT_ICONS_VL2 === "1",
      show_center_map_icon:       TBO_SHOW_CENTER_MAP_ICON_VL2 === "1",
      show_bip_att:               TBO_SHOW_BIP_ATT_VL2 === "1",
      show_send_troops_resources: TBO_SHOW_SEND_TROOPS_RESOURCES_VL2 === "1",
      show_distance:              TBO_SHOW_DISTANCE_VL2 === "1" &&
                                  ( isSomeOf(TB3O.pageSelector, "map","position_details","market_send","market_routes_edit","rally_point_send","rally_point_send_foreign") )
   };

   this.maxVCols = parseInt10(TBO_COLUMNS_VL2) + 1;
   if ( !isIntValid(this.maxVCols) ) { this.maxVCols = 1; }

   this.maxRows = Math.ceil(TB3O.VillagesCount / this.maxVCols);
   this.fixedCells = 3 + this.layout_options.show_race*1 + this.layout_options.show_pop*2 + this.layout_options.show_cp*2 + 
                     this.layout_options.show_pph*6 + this.layout_options.show_crop_epph*2 + 
                     this.layout_options.show_in_out_icons*2 + this.layout_options.show_center_map_icon*1 + 
                     this.layout_options.show_bip_att*1 + this.layout_options.show_send_troops_resources*2 + 
                     this.layout_options.show_distance*2;

__DUMP__(this.layout_options,this.maxRows,this.fixedCells)
   // vTable - DOM node for villages list
   this.vTable = $t([['id', 'vl2table']]);
   this.uiCreate();
}

//////////////////////////////////////////////////////////////////////
VillagesList2.prototype.getCellsCountPerVillage = function()
{
   return this.fixedCells;
}

//////////////////////////////////////////////////////////////////////
VillagesList2.prototype.getFirstCellIndex = function(nVColIndex)
{
   return (this.getCellsCountPerVillage()+1) * nVColIndex;
}

//////////////////////////////////////////////////////////////////////
VillagesList2.prototype.uiCreate = function()
{
   var self = this;
   var bAllowCustomization = (TBO_CUSTOMIZE_VLIST === "1");
   var mapPos2Id = getVillagesOrder(TB3O.VillagesInfo);
   var i,j,pos;
   var aRow;

   for (i = 0; i < this.maxRows; ++i)
   {
      aRow = $r();
      for (j = 0; j < this.maxVCols; ++j)
      {
         if ( j > 0 )
         {
            aRow.appendChild($td(['class', 'tbEmpty']));
         }

         pos = i + this.maxRows*j;
         if ( pos < mapPos2Id.length )
         {
            uiCreateCells(aRow, j, pos);
         }
         else
         {
            aRow.appendChild($td(['colspan', this.getCellsCountPerVillage()]));
         }
      }

      this.vTable.appendChild(aRow);
   }

   //-----------------------------------------------------------------
   function uiCreateCells(aRow, nVColIndex, pos)
   {
      var villageId = mapPos2Id[pos];
      var villageInfo = TB3O.VillagesInfo[villageId];
      var bSep = bAllowCustomization && TB3O.VillagesList.getSeparatorState(pos);
      var bActive = ( villageId === TB3O.ActiveVillageId );

      function uiAddCell(vRow, aCell)
      {
         if ( bActive ) { addClass(aCell,"tbActive"); }
         if ( bSep ) { addClass(aCell,"tb3sep"); }
         vRow.appendChild(aCell);
      }

      var aCell = $td(['class', 'tbMark' + villageInfo.markt], 
                      villageInfo.markt === 1 ? I("attacks") : villageInfo.mark);
      uiAddCell(aRow, aCell);

      if ( self.layout_options.show_race )
      {
         aCell = $td(['class', 'tbRace'], I("tbiRace" + (villageInfo.rx+1)) );
         uiAddCell(aRow, aCell);
      }

      aCell = $td(['class', 'tbName'], $lnk(['href', TB3O.VillagesList.getLink(villageId)], villageInfo.name));
      uiAddCell(aRow, aCell);

      aCell = $td(['class', 'tbCoord'], 
          IIF_TB4($lnk(['href', 'position_details.php?x=' + villageInfo.x +'&y=' + villageInfo.y], formatCoords(villageInfo.x,villageInfo.y)),
                  formatCoords(villageInfo.x,villageInfo.y)));
      uiAddCell(aRow, aCell);

      uiAddVillagesListCells(aRow, villageInfo, bActive, bSep, self.layout_options);
      uiFillVillagesListCells(aRow, self.getFirstCellIndex(nVColIndex), villageInfo, self.layout_options, self.layout_options);
   }
};

//////////////////////////////////////////////////////////////////////
VillagesList2.prototype.uiRefreshList = function(refresh_options /*opt*/)
{
   var mapPos2Id = getVillagesOrder(TB3O.VillagesInfo);
   var i,j,pos;
   var aRow;
   var opt, bNeedToUpdate = false;

   if ( !refresh_options ) 
   { 
      refresh_options = this.layout_options; 
      bNeedToUpdate = true;
   }
   else
   {
      for ( opt in refresh_options )
      {
         if ( opt in this.layout_options ) 
         {
            bNeedToUpdate = true;
            break;
         }
      }
   }

   if ( bNeedToUpdate )
   {
      for (i = 0; i <= this.maxRows; ++i)
      {
         aRow = this.vTable.rows[i];
         for (j = 0; j < this.maxVCols; ++j)
         {
            pos = i + this.maxRows*j;
            if ( pos < mapPos2Id.length )
            {
               uiFillVillagesListCells(aRow, this.getFirstCellIndex(j), TB3O.VillagesInfo[mapPos2Id[pos]], this.layout_options, refresh_options);
            }
         }
      }
   }
};

//////////////////////////////////////////////////////////////////////
VillagesList2.prototype.uiRefreshVillage = function(villageId, refresh_options /*opt*/)
{
   var bAllowCustomization = (TBO_CUSTOMIZE_VLIST === "1");
   var villageInfo = TB3O.VillagesInfo[villageId];
   var pos = ( bAllowCustomization ) ? villageInfo.posInListCur : villageInfo.posInListOrg;
   var nRowIndex = pos % this.maxRows;
   var nVColIndex = (pos - nRowIndex) / this.maxRows;
   var aRow = this.vTable.rows[nRowIndex];
   uiFillVillagesListCells(aRow, this.getFirstCellIndex(nVColIndex), villageInfo, this.layout_options, refresh_options || this.layout_options);
};


//////////////////////////////////////////////////////////////////////
function uiCreate2ndVillageListWidget()
{
   __ENTER__
   var villagesList2 = null;

   if ( TBO_SHOW_VL2TABLE === "1" ) 
   {
      villagesList2 = new VillagesList2();
      var vL2XY = TBO_VL2TABLE_XY.split("|");
      var strTitle = "<a href='dorf3.php" + modifyDorf3Url("") + "'>" + T('VGL') + " (" + TB3O.VillagesCount + ")</a>";
      $df(250, vL2XY[0], vL2XY[1], strTitle, "vl2table", "vl2tableTT", true, villagesList2.vTable);
      if ( TBO_VL2TABLE_STATE !== "1" ) { villagesList2.vTable.style.display = 'none'; }
   }
   __EXIT__

   return villagesList2;
}

//////////////////////////////////////////////////////////////////////
function uiRefreshVL(refresh_options)
{
   if ( TB3O.VillagesList )  { TB3O.VillagesList.uiRefreshList(refresh_options); }
   if ( TB3O.VillagesList2 ) { TB3O.VillagesList2.uiRefreshList(refresh_options); }
}

//////////////////////////////////////////////////////////////////////
function uiRefreshVL_Distance(x,y)
{
   __ENTER__
   var refresh_options = { show_distance: true };

   TB3O.xCrt = x; 
   TB3O.yCrt = y;

   __DUMP__(TB3O.xCrt,TB3O.yCrt,refresh_options);

   uiRefreshVL(refresh_options);

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiRefreshVL_Pop()
{
   uiRefreshVL({ show_pop: true });
}
