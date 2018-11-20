//////////////////////////////////////////////////////////////////////
Overview.prototype.getMerchantsInfo  = function(tabNo)
{
   var i;
   var vRows,vCells,vCount,villageId;

   var merchantsInfo = {};

   if ( this.origT )
   {
      var mi = this.getMerchantCol(tabNo);
      if ( mi )
      {
         //get the merchant array
         vRows = this.origT.tBodies[0].rows;
         vCount = vRows.length;
         for ( i = 0; i < vCount; ++i )
         {
            vCells = vRows[i].cells;
            villageId = getNewdidFromChild(vCells[0]);
            if ( villageId )
            {
               var vmInfo = {};
               vmInfo.link = vCells[mi].innerHTML;

               var merchants = vCells[mi].textContent.split("/");
               vmInfo.mAvail = parseSeparatedInt10(merchants[0]);
               vmInfo.mTotal = parseSeparatedInt10(merchants[1]);
               merchantsInfo[villageId] = vmInfo;
            }
         }
         __DUMP__(merchantsInfo)
      }
   }
   return merchantsInfo;
};

//////////////////////////////////////////////////////////////////////
function processDorf3_Tab1(origT)
{
   __ENTER__
   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function processDorf3_Tab2(origT)
{
   __ENTER__

   var vRows,vCells,vCount;
   var i, j, villageId, resourcesInfo;
   var v;

   vRows = origT.tBodies[0].rows;
   vCount = vRows.length;
   for ( i = 0; i < vCount; ++i )
   {
      vCells = vRows[i].cells;
      villageId = getNewdidFromChild(vCells[0]);
      if ( villageId )
      {
         resourcesInfo = TB3O.VillagesInfo[villageId].r;

         for ( j = 0; j < 4; ++j )
         {
            v = parseSeparatedInt10(vCells[j+1].textContent);
            resourcesInfo.Res[j] = v;
            if ( v > resourcesInfo.Cap[j] )
            {
               resourcesInfo.Cap[j] = v;
            }
         }
         resourcesInfo.dUpd = new Date(TB3O.serverTime.getTime());
      }
   }

   __EXIT__
}


//////////////////////////////////////////////////////////////////////
function processDorf3_Tab3(origT)
{
   __ENTER__

   var vRows,vCells,vCount,el;
   var i, yi, j, villageId, resourcesInfo;
   var v, r;
   var ttFillG,ttFillGest,EPpH;

   vRows = origT.tBodies[0].rows;
   vCount = vRows.length;
   for ( i = 0; i < vCount; ++i )
   {
      vCells = vRows[i].cells;
      villageId = getNewdidFromChild(vCells[0]);
      if ( villageId )
      {
         resourcesInfo = TB3O.VillagesInfo[villageId].r;

         for ( yi = 1; yi <= 5; ++yi )
         {
            if ( yi === 4 ) { continue; }
            j = yi - 1;
            if ( j === 4 ) { j = 3; }

            v = vCells[yi].getAttribute("title");
            if ( v )
            {
               r = v.split("/");

               if ( r.length === 2 )
               {
                  resourcesInfo.Res[j] = parseSeparatedInt10(r[0]);
                  resourcesInfo.Cap[j] = parseSeparatedInt10(r[1]);
                  resourcesInfo.dUpd = new Date(TB3O.serverTime.getTime());
               }
            }
         }

         // try to determine EPpH for crop 
         ttFillG = toSeconds(vCells[6].textContent);

         if (  isNaN(ttFillG) )
         {
            resourcesInfo.EPpH[3] = 0;
         }
         else
         {
            ttFillGest = getSecondsToFill(resourcesInfo,3);

            if ( Math.abs(ttFillGest - ttFillG) > 1 )
            {
               el = vCells[6].firstChild;
               if ( hasClass(el,"crit") )
               {
                  EPpH = -Math.floor((resourcesInfo.Res[3]/ttFillG) * 3600);
               }
               else
               {
                  EPpH = Math.floor(((resourcesInfo.Cap[3] - resourcesInfo.Res[3]) / ttFillG) * 3600);
               }
               resourcesInfo.EPpH[3] = EPpH;

            }
         }
      }
   }
   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function processDorf3_Tab4(origT)
{
   __ENTER__

   var vRows,vCells,vCount;
   var i, villageId, cpInfo;
   var cp;
   var ttServer = toTimeStamp(TB3O.serverTime);

   vRows = origT.tBodies[0].rows;
   vCount = vRows.length;
   for ( i = 0; i < vCount; ++i )
   {
      vCells = vRows[i].cells;
      villageId = getNewdidFromChild(vCells[0]);
      if ( villageId )
      {
         cp = parseInt10(vCells[1].textContent);
         if ( isIntValid(cp) )
         {
            cpInfo = TB3O.VillagesInfo[villageId].cpi;
            cpInfo.cp = cp;
            cpInfo.ttUpd = ttServer;
         }
      }
   }
   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function processDorf3_Tab5(origT)
{
   __ENTER__

   var vRows,vCells,vCount;
   var i, j, villageId, unitCountInfo, unitsTotal;
   var ttServer = toTimeStamp(TB3O.serverTime);

   vRows = origT.tBodies[0].rows;
   vCount = vRows.length;
   for ( i = 0; i < vCount; ++i )
   {
      vCells = vRows[i].cells;
      villageId = getNewdidFromChild(vCells[0]);
      if ( villageId )
      {
         unitsTotal = fillArray(new Array(TG_UNITS_COUNT),0);
         unitCountInfo = TB3O.VillagesInfo[villageId].uci;

         for ( j = 1; j < vCells.length; ++j )
         {
            v = parseInt10(vCells[j].textContent);
            if ( isIntValid(v) ) { unitsTotal[j-1] = v; }
         }

         unitCountInfo.ut = unitsTotal;
         unitCountInfo.ttUpd = ttServer;
      }
   }
   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function getDefaultDorf3Tab()
{
   var defaultTab = TBO_DORF3_DEFAULT_TAB;

   if ( defaultTab > 6 ) { defaultTab = 1; }

   return defaultTab;
}

//////////////////////////////////////////////////////////////////////
function getDorf3Url(url, tabNo)
{
   if ( tabNo > 1 ) 
   {
      url = url + "?s=" + tabNo;
   }
   else if ( tabNo === 1 && TB3O.ServerInfo.features.new_link_style )
   {
      url = url + "?s=0";
   }

   return url;
}

//////////////////////////////////////////////////////////////////////
function modifyDorf3Url(url)
{
   return getDorf3Url(url, getDefaultDorf3Tab());
}

//////////////////////////////////////////////////////////////////////
// scan page if need
function processDorf3()
{
   __ENTER__

   TB3O.Overview = new Overview(document);
__DUMP__(TB3O.Overview)

   var tabNo = 1;

   TB3O.pageSelector = "dorf3";

   if ( crtUrl.queryKey.s )
   {
      tabNo = parseInt10(crtUrl.queryKey.s,1);
      if ( tabNo === 0 ) { tabNo = 1; } // Overview page now have s==0 
   }
   else
   {
      tabNo = TB3O.Overview.menu.active + 1;
   }

   TBO_DORF3_DEFAULT_TAB = tabNo;
   saveTBOptions();

   if ( TB3O.Overview.origT )
   {
      if ( tabNo <= 2 )
      {
         TB3O.MerchantsInfo = TB3O.Overview.getMerchantsInfo(tabNo);
      }

      if ( TB3O.Overview.plAc && tabNo <= 5 )
      {
         [processDorf3_Tab1,processDorf3_Tab2,processDorf3_Tab3,processDorf3_Tab4,processDorf3_Tab5][tabNo-1](TB3O.Overview.origT);
      }
      else if ( tabNo > 2 )  // without Plus merchant info present on all tabs
      {
         TB3O.MerchantsInfo = TB3O.Overview.getMerchantsInfo(tabNo);
      }
   }

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
// Top level function for dorf3 modification
function uiModifyDorf3()
{
   __ENTER__

   var origT = TB3O.Overview.origT;
   var tabNo = getDefaultDorf3Tab();

   uiModifyDorf3_TabsHeader(tabNo);

   if ( origT )
   {
      prefferTB = !TB3O.Overview.plAc || tabNo === 2 || tabNo === 3 || tabNo === 5;

      M4_IIF_DEBUG(
      {{
         // show both tables in debug mode
         uiCreateDorf3Tab(origT.parentNode,origT,tabNo);

         if ( TB3O.Overview.plAc )
         {
            uiModifyVillagesOverview(origT);
         }
      }},
      {{
         if ( prefferTB )
         {
            origT.style.display = "none";
            uiCreateDorf3Tab(origT.parentNode,origT,tabNo);
         }
         else
         {
            uiModifyVillagesOverview(origT);
         }
      }})
   }
   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiCreateDorf3Tab(parent,nextSibling,tabNo) 
{
   var createFunc = [createD3Tb_Tab1, createD3Tb_Tab2,createD3Tb_Tab3,createD3Tb_Tab4,createD3Tb_Tab5];
   var fillFunc =   [  fillD3Tb_Tab1,   fillD3Tb_Tab2,  fillD3Tb_Tab3,  fillD3Tb_Tab4,  fillD3Tb_Tab5];
   var aNewTb =  null;

   if ( tabNo >= 1 && tabNo <= 5 )
   {
      aNewTb = createFunc[tabNo-1]();
      if ( aNewTb )
      {
         parent.insertBefore(aNewTb,nextSibling);
         fillFunc[tabNo-1]();
      }
   }

   return aNewTb;
}


//////////////////////////////////////////////////////////////////////
function uiSwitchDorf3Tab(tabNo) 
{
   var parent,next;
   var aNewTb;
   var aOldTb = $g("dorf3table");

   if ( aOldTb ) 
   {
      TBO_DORF3_DEFAULT_TAB = tabNo;
      saveTBOptions();

      parent = aOldTb.parentNode;
      next = aOldTb.nextSibling;
      parent.removeChild(aOldTb);

      aNewTb = uiCreateDorf3Tab(parent,next,tabNo);
      if ( tabNo === 5 ) { uiAddTroopInfoTooltips(aNewTb); }
      TB3O.Overview.setActiveTab(tabNo);
   }
}


//////////////////////////////////////////////////////////////////////
function uiSwapTableRows(tbl,i,j,mapId2Index,mapIndex2Id) 
{
   var rowI = tbl.rows[i];
   var rowJ = tbl.rows[j];
   var IdI = mapIndex2Id[i];
   var IdJ = mapIndex2Id[j];
   var tmpPos;

   var rowTmp = rowI.parentNode.replaceChild(rowJ.cloneNode(true),rowI);
   rowJ.parentNode.replaceChild(rowTmp,rowJ);

   tmpPos = mapId2Index[IdJ];
   mapId2Index[IdJ] = mapId2Index[IdI];
   mapId2Index[IdI] = tmpPos;

   mapIndex2Id[j] = IdI;
   mapIndex2Id[i] = IdJ;
}


//////////////////////////////////////////////////////////////////////
function uiModifyVillagesOverview(t)
{
   var tbody,tr;
   var bAllowCustomization = (TBO_CUSTOMIZE_VLIST === "1") && TB3O.VillagesList;
   var reqOrderIds,curOrderIds,mapId2Index = {};
   var i,pos,len;

   if ( hasClass(t,"vil_troops") ) return; // not supported yet

   if ( bAllowCustomization )
   {
      reqOrderIds = getVillagesOrder(TB3O.VillagesInfo);
      curOrderIds = getVillagesOrder(TB3O.VillagesInfo,"original");
      len = curOrderIds.length;
      tbody = t.tBodies[0];

      for (var villageId in TB3O.VillagesInfo )
      {
         mapId2Index[villageId] = TB3O.VillagesInfo[villageId].posInListOrg;
      }

      // restore villages order
      for ( pos = 0; pos < len; ++pos )
      {
          if ( reqOrderIds[pos] !== curOrderIds[pos] )
          {
             uiSwapTableRows(tbody, pos, mapId2Index[reqOrderIds[pos]], mapId2Index, curOrderIds);
          }
      }

      for ( i = 0; i < TB3O.VillagesCount; i++ )
      {
         // restore separator
         if ( TB3O.VillagesList.getSeparatorState(i) )
         {
            tr = tbody.rows[i];
            addClass(tr,"tb3sep");
         }
      }
   }
}

//////////////////////////////////////////////////////////////////////
function uiCreateMerchantsTooltip(villageId)
{
   function uiCreateUniResCell(v)
   {
      return $td(['class', 'tbTotal'],[I("r0",[['class', '+tbPrefix']]),v.toString()])

   }
   __ENTER__

   var vmInfo = TB3O.MerchantsInfo[villageId];
   var mCap = TB3O.VillagesInfo[villageId].mCap;
   var aTb =
   $t(['id', 'tb_MITT'],[
      $r(
         $td([['class','tbTitle'],['colspan','2']],[I("merchant",[['class', '+tbPrefix']]),"" + vmInfo.mAvail + "/" + vmInfo.mTotal])
      ),
      $r(null,[
         $td(null,["1\u00D7",I("merchant")]),
         uiCreateUniResCell(mCap)
      ])
   ]);
   if ( vmInfo.mAvail > 1 )
   {
      aTb.appendChild(       
         $r(null,[
            $td(null,[vmInfo.mAvail.toString()+"\u00D7",I("merchant")]),
            uiCreateUniResCell(vmInfo.mAvail*mCap)
         ])
      );
   }
   if ( vmInfo.mTotal > 1 && vmInfo.mTotal !== vmInfo.mAvail )
   {
      aTb.appendChild(       
         $r(null,[
            $td(null,[vmInfo.mTotal.toString()+"\u00D7",I("merchant")]),
            uiCreateUniResCell(vmInfo.mTotal*mCap)
         ])
      );
   }

   __EXIT__
   return $div(['class', 'tbTip'], aTb);
}

//////////////////////////////////////////////////////////////////////
function uiCreateTotalMerchantsTooltip()
{
   __ENTER__
   var mCap;
   var caps = [];
   var stat = {};

   var i,villageId;
   for ( villageId in TB3O.MerchantsInfo )
   {
      var vmInfo = TB3O.MerchantsInfo[villageId];
      mCap = TB3O.VillagesInfo[villageId].mCap;
      if ( !stat[mCap] )
      {
         caps.push(mCap);
         stat[mCap] = { villages:0, mAvail:0, mTotal:0 };
      }
      stat[mCap].villages += 1;
      stat[mCap].mAvail += vmInfo.mAvail;
      stat[mCap].mTotal += vmInfo.mTotal;
   }
   caps.sort(compareNumbers);

   var aTb =
   $t(['id', 'tb_MITT'],
      $r(null,[
         $td(['class', 'tbTitle'],["1\u00D7",I("merchant")]),
         $td(['class', 'tbTitle'],I("vmkls")),
         $td(['class', 'tbTitle'],I("merchant"))
      ])
   );

   for ( i = 0; i < caps.length; ++i )
   {
      mCap = caps[i];
      aTb.appendChild(       
         $r(null,[
            $td(null,[I("r0",[['class', '+tbPrefix']]),String(mCap)]),
            $td(['class', 'tbTotal'],String(stat[mCap].villages)),
            $td(['class', 'tbTotal'],"" + stat[mCap].mAvail + "/" + stat[mCap].mTotal)
         ])
      );
   }

   __EXIT__
   return $div(['class', 'tbTip'], aTb);
}

//////////////////////////////////////////////////////////////////////
function uiCreateUnitInfoTooltip(uix, unitCount)
{
   var tip = null;
   if ( unitCount )
   {
      tip = uiCreateTroopInfoTooltip(getTroopInfoFromUnitCount(TBU_RACE, uix, unitCount),T("STAT"));
   }

   return tip;
}

//////////////////////////////////////////////////////////////////////
function uiCreateUnitsTooltip(villageId,uix)
{
   __ENTER__

   var tip = null;
   var unitsCountInfo = TB3O.VillagesInfo[villageId].uci;
   var unitCount = unitsCountInfo.ut[uix];
   if ( unitsCountInfo.ttUpd && unitCount )
   {
      tip = uiCreateUnitInfoTooltip(uix, unitCount);
   }
   __EXIT__

   return tip;
}

//////////////////////////////////////////////////////////////////////
function uiCreateTotalUnitsTooltip(uix)
{
   __ENTER__

   //Available troops
   var sumTT = getUnitsCountInfoTotals();
   var tip = uiCreateUnitInfoTooltip(uix, sumTT[uix]);
   __EXIT__

   return tip;
}

//////////////////////////////////////////////////////////////////////
// villageId === null if tooltip for totals
function uiCreateDorf3Tooltip(tabNo,villageId,col)
{
   var content = null;
   if ( villageId )
   {
      __DUMP__(tabNo,villageId,col)
      if ( (tabNo === 2 && col >= 1 && col <= 5) || 
           (tabNo === 3 && isSomeOf(col,1,2,3,5) ) )
      {
         content = uiCreateResourceTooltip(villageId);
      }
      else if ( tabNo === 1 && col === 1 )
      {
         content = uiCreateTMTable(villageId);
      }
      else if ( tabNo === 1 && col === 2 )
      {
         content = uiCreateBiPTable(villageId);
      }
      else if ( tabNo === 1 && col === 3 )
      {
         content = uiCreateTriPTable(villageId);
      }
      else if ( (tabNo === 1 && col === 4) || (tabNo === 2 && col === 6) )
      {
         content = uiCreateMerchantsTooltip(villageId);
      }
      else if ( tabNo === 5 && ( col >= 1 && col < TG_UNITS_COUNT) )
      {
         content = uiCreateUnitsTooltip(villageId,col-1);
      }
   }
   else
   {
      if ( (tabNo === 2 && col === 6) )
      {
         content = uiCreateTotalMerchantsTooltip();
      }
      else if ( tabNo === 5 && ( col >= 1 && col < TG_UNITS_COUNT) )
      {
         content = uiCreateTotalUnitsTooltip(col-1);
      }
   }
   return content;
}

//////////////////////////////////////////////////////////////////////
function uiAddD3TbToolbar(parent, tabNo, bSepBefore) 
{
   if ( bSepBefore ) { parent.appendChild($span("&nbsp;&nbsp;")); }

   parent.appendChild(uiCreateTool("reload",
                                   T( TB3O.Overview.plAc ? 'REFRESHP' : 'UPDALLV'), 
                                   bind(onRefreshAllVillages,[tabNo])));

   if ( !bSepBefore ) { parent.appendChild($span("&nbsp;&nbsp;")); }
}

//////////////////////////////////////////////////////////////////////
function uiCreateD3TbVillageHeader(tabNo) 
{
   aCell = $td();
   if ( !TB3O.Overview.getTableTitle(tabNo) )
   {
      uiAddD3TbToolbar(aCell, tabNo, false);
   }
   aCell.appendChild($txt(TB3O.Overview.secRowText[0]));

   return aCell;
}

//////////////////////////////////////////////////////////////////////
function createD3TbSkeleton(tabNo, columns) 
{
   var aTb, aHead, aTh, aTr;
   var title = TB3O.Overview.getTableTitle(tabNo);

   aTb = $t([['id', 'dorf3table'],['class','tb3d3_' + tabNo]]);
   aHead = $e("thead");
   aTb.appendChild(aHead);

   if ( title )
   {
      aTr = $r();
      aHead.appendChild(aTr);

      aTh = $th([['colspan', columns]]);
      aTr.appendChild(aTh);

      aTh.appendChild($span(title));

      uiAddD3TbToolbar(aTh, tabNo, true);
   }

   aTb.appendChild($e("tbody"));
   return aTb;
}

//////////////////////////////////////////////////////////////////////
function createD3TbRows(aTb, maxTD, tabNo)
{
   var tr,td,td1,nobr,aLink;

   var i,yi;
   var mapPos2Id = getVillagesOrder(TB3O.VillagesInfo);
   var villageId,villageInfo;
   var tbody = aTb.tBodies[0];

   var bAllowCustomization = (TBO_CUSTOMIZE_VLIST === "1") && TB3O.VillagesList;

   for ( i = 0; i < mapPos2Id.length; i++ )
   {
      villageId = mapPos2Id[i];
      villageInfo = TB3O.VillagesInfo[villageId];

      tr = $r();
      // active village?
      if ( villageId == TB3O.ActiveVillageId )
      {
         tr.className = "hl";
      }
      else
      {
         IF_TB4(tr.className = "hover";)
      }

      // draw separator
      if ( bAllowCustomization )
      {
         if ( TB3O.VillagesList.getSeparatorState(i) )
         {
            tr.className += " tb3sep";
         }
      }


      //first cell
      td1 = $td();
      td1.className = 'tb3name';

      nobr = $e("NOBR");

      M4_NDEBUG({{if ( !TB3O.Overview.plAc )}})
      {
         aLink = $action(null, I("b5",[
                                 ['title',  T('ACTUALIZAR') + " " + villageInfo.name],
                                 ['id',     "aldea" + villageId + "_boton"],
                                 ['style', 'margin:0px;']
                               ]), 
                         bind(refreshVillageV2,[villageId, tabNo]));

         nobr.appendChild(aLink);
         nobr.appendChild($span("&nbsp;"));
      }

      aLink = $lnk([['href', 'dorf1.php?newdid=' + villageId]], villageInfo.name);

      nobr.appendChild($span(aLink));
      td1.appendChild(nobr);
      tr.appendChild(td1);

      //second cell and the other ones
      for ( yi = 0; yi < maxTD; yi++ )
      {
         td = $td("-");
         td.id = "aldea" + villageId + "_" + tabNo + "_" + (yi + 2);
         if ( yi === (maxTD - 1) && (tabNo === 1 || tabNo === 2)) 
         { 
            td.innerHTML = TB3O.MerchantsInfo[villageId].link; 
            td.className = 'tbMerc';
         }
         else
         {
            td.className = 'tb3cnb';
         }
         uiAddTooltip(td,bind(uiCreateDorf3Tooltip,[tabNo,villageId,yi+1]));

         tr.appendChild(td);
      }
      tbody.appendChild(tr);
   }
}


//////////////////////////////////////////////////////////////////////
// Separator row
function createD3TbSeparator(aTb, maxTD)
{
   var trSeparator = $r(['class', 'tb3r'],$td([['class', 'tb3rnb tbEmpty'], ['colspan', maxTD + 1]]));
   aTb.appendChild(trSeparator);
}

//////////////////////////////////////////////////////////////////////
function createD3TbTotals(aTb, maxTD, tabNo)
{
   var trSeparator,trSum,ts,ts1;
   var villageId;
   var totalMerchants = [0, 0];
   var yi,posX;

   //Separator row
   createD3TbSeparator(aTb, maxTD);

   //sum row
   trSum = $r([['class', 'tb3r tbTotal']]);

   //first sum cell
   ts1 = $td([['class', 'tbTitle']], T('TOTAL'));
   trSum.appendChild(ts1);

   if ( tabNo === 1 || tabNo === 2 )
   {
      for ( villageId in TB3O.MerchantsInfo )
      {
         totalMerchants[0] += TB3O.MerchantsInfo[villageId].mAvail;
         totalMerchants[1] += TB3O.MerchantsInfo[villageId].mTotal;
      }
   }

   for ( yi = 0; yi < maxTD; yi++ )
   {
      ts = null;

      if ( ( tabNo === 1 || tabNo === 2 ) && yi === maxTD - 1 )
      {
         ts = $td([['class', 'tbMerc']], "" + totalMerchants[0] + "/" + totalMerchants[1]);
      }
      else if ( tabNo === 4 && yi === 1 )
      {
         ts = $td([['class', 'tb3cnb']]);
      }
      else
      {
         ts = $td([['class', 'tb3cnb']], "-");
      }

      if ( ts )
      {
         ts.id = "aldea_s_" + tabNo + "_" + (yi + 2);
         uiAddTooltip(ts,bind(uiCreateDorf3Tooltip,[tabNo,null,yi+1]));
         trSum.appendChild(ts);
      }
   }
   aTb.appendChild(trSum);
}	

//////////////////////////////////////////////////////////////////////
function onDorf3CheckOption(opt)
{
   TB3O.O[opt] = this.checked ? "1" : "0";
   saveTBOptions();
}

//////////////////////////////////////////////////////////////////////
function uiCreateDorf3Checkbox(opt)
{
   var aCB;

   aCB = $i([['type', 'checkbox'],['value', '1']]);

   aCB.checked = (TB3O.O[opt] === "1");
   aCB.addEventListener('click', bind(onDorf3CheckOption,[opt]), false);
   return aCB;
}

//////////////////////////////////////////////////////////////////////
function createD3Tb_Tab1()
{
   var aTb,trTop2,tdTop2,aCB,xi;

   aTb = createD3TbSkeleton(1,5);

   trTop2 = $r();
   trTop2.appendChild(uiCreateD3TbVillageHeader(1));
   for (xi = 1; xi < TB3O.Overview.secRowText.length; xi++)
   {
      tdTop2 = $td(TB3O.Overview.secRowText[xi]);
      if (xi === 3)
      {
         tdTop2.appendChild(uiCreateDorf3Checkbox(OID_DORF3_REFRESH_TROOPS_TRAINING));
      }
      trTop2.appendChild(tdTop2);
   }
   aTb.firstChild.appendChild(trTop2);
   createD3TbRows(aTb, 4, 1);
   return aTb;
}

//////////////////////////////////////////////////////////////////////
function createD3Tb_Tab2()
{
   var aTb,trTop2,tdTop2,xi;

   TB3O.Tab2 = {}; 
   aTb = createD3TbSkeleton(2,7);
   trTop2 = $r(uiCreateD3TbVillageHeader(2));
   for (xi = 1; xi < 7; xi++)
   {
      switch (xi)
      {
         case 1:
         case 2:
         case 3:
         case 4:
            tdTop2 = $td(I("r" + xi));
            break;
         case 5:
            tdTop2 = $td(null,[I("r4"),"/",I("clock")]);
            break;
         case 6:
            tdTop2 = $td(I("merchant",[['title',TB3O.Overview.secRowText[TB3O.Overview.getMerchantCol(2)]]]));
            break;
      }
      trTop2.appendChild(tdTop2);
   }
   aTb.firstChild.appendChild(trTop2);
   createD3TbRows(aTb, 6, 2);
   createD3TbTotals(aTb, 6, 2);
   return aTb;
}

//////////////////////////////////////////////////////////////////////
function createD3Tb_Tab3()
{
   var aTb,trTop2,tdTop2,img,xi;

   aTb = createD3TbSkeleton(3,7);
   trTop2 = $r();
   trTop2.appendChild(uiCreateD3TbVillageHeader(3));
   for (xi = 1; xi < 7; xi++)
   {
      img = null;
      switch (xi)
      {
         case 1:
         case 2:
         case 3:
            img = I("r" + xi);
            break;
         case 5:
            img = I("r4");
            break;
         case 4:
         case 6:
            img = I("clock");
            break;
      }
      tdTop2 = $td(img);
      trTop2.appendChild(tdTop2);
   }
   aTb.firstChild.appendChild(trTop2);
   createD3TbRows(aTb, 6, 3);
   return aTb;
}

//////////////////////////////////////////////////////////////////////
function createD3Tb_Tab4()
{
   var aTb,trTop2,tdTop2,title,xi;

   TB3O.Tab4 = { cpCol: {}, celebrationsCol: {}, troopsCol: {}, slotsCol: {}}; 
   aTb = createD3TbSkeleton(4,5);
   trTop2 = $r();
   trTop2.appendChild(uiCreateD3TbVillageHeader(4));
   for (xi = 1; xi < 5; xi++)
   {
      title = '';
      switch (xi)
      {
         case 1:
            title = T('CPPERDAY');
            break;
         case 2:
            title = T('PARTY');
            break;
         case 3:
            title = T('TROPAS');
            break;
         case 4:
            title = T('SLOT');
            break;
      }
      tdTop2 = $td(title);
      if ( xi > 0 )
      {
         tdTop2.appendChild(uiCreateDorf3Checkbox(OID_DORF3_REFRESH_TROOPS_TRAINING + xi));
      }
      trTop2.appendChild(tdTop2);
   }
   aTb.firstChild.appendChild(trTop2);
   createD3TbRows(aTb, 4, 4);
   createD3TbTotals(aTb, 4, 4);
   return aTb;
}

//////////////////////////////////////////////////////////////////////
function createD3Tb_Tab5()
{
   var aTb,trTop2,tdTop2,img,xi;
   aTb = createD3TbSkeleton(5,TG_UNITS_COUNT + 1);

   trTop2 = $r(uiCreateD3TbVillageHeader(5));

   for ( xi = 0; xi < TG_UNITS_COUNT-1; xi++ )
   {
      img = getUnitImage(xi);
      if ( img )
      {
         tdTop2 = $td(img);
      }
      else
      {
         tdTop2 = $td(["class", "c"],"-");
      }
      trTop2.appendChild(tdTop2);
   }
   trTop2.appendChild($td(I("hero")));
   aTb.firstChild.appendChild(trTop2);
   createD3TbRows(aTb, TG_UNITS_COUNT, 5);
   createD3TbTotals(aTb, TG_UNITS_COUNT, 5);

   /*
   createD3TbSeparator(aTb, TG_UNITS_COUNT);
   //stat row
   var trStat = $r(['class', 'tb3r tbTotal'],[
                   $td(['class', 'tbTitle'], T('STAT')),
                   $td([['id','aldea_s_5'],['colspan', TG_UNITS_COUNT]], "zzz"),
                   ]);
   aTb.appendChild(trStat);
   */

   return aTb;
}


//////////////////////////////////////////////////////////////////////
function fillD3TbRow_Tab1(villageId)
{
   var ttEnd,aCell;
   var xi,j;
   var villageInfo = TB3O.VillagesInfo[villageId];
   var ttCurrent = toTimeStamp(getServerTimeNow());
   var arrBiP = villageInfo.BiP;
   var arrTM  = villageInfo.TM;

   //-----------------------------------------------------
   aCell = $g("aldea" + villageId + "_1_2");
   removeChildren(aCell);

   xi = 0;
   for ( j = 0; j < arrTM.length; j++ )
   {
      var TMInfo = arrTM[j];
      ttEnd = TMInfo.fT;

      if ( ttCurrent < ttEnd || ttEnd === null )
      {
         if ( xi > 0 )
         {
            aCell.appendChild($txt(" "));
         }
         aCell.appendChild($lnk([['href',URL_RP_OVERVIEW(villageId)], 
                                 ['alt',TMInfo.no + ' - ' + formatTimeSpan((ttEnd === null) ? null : (ttEnd - ttCurrent) / 1000, 0)]], I(TMInfo.type)));
         ++xi;
      }
   }
   if ( xi === 0 )
   {
      aCell.appendChild($txt("-"));
   }

   //-----------------------------------------------------
   aCell = $g("aldea" + villageId + "_1_3");
   removeChildren(aCell);

   xi = 0;
   for ( j = 0; j < arrBiP.length; j++ )
   {
      var BiPInfo = arrBiP[j];
      ttEnd = BiPInfo.endTime;
      if ( ttCurrent < ttEnd || ttEnd === null  )
      {
         if ( xi > 0 )
         {
            aCell.appendChild($txt(" "));
         }
         aCell.appendChild(I("bau",[['alt',BiPInfo.name + " " + BiPInfo.txtLvl + " - " + formatTimeSpan((ttEnd - ttCurrent) / 1000, 0)]]));
         ++xi;
      }
   }
   if ( xi === 0 )
   {
      aCell.appendChild($txt("-"));
   }
}

//////////////////////////////////////////////////////////////////////
function fillD3TbRow_Tab1_Col4(villageId)
{
   var i, j, k;
   var ttCurrent = toTimeStamp(getServerTimeNow());
   var stats = getTrainingInfoCollStats(TB3O.VillagesTrInfo.load(villageId), ttCurrent);
   var arrBuildingsUsage = stats.buildingsUsage; // [ [ttEvent, gid, [[[tix,count], name]] ] ]
   var arrTriP = []; // convert arrBuildingsUsage to format [[[tix,count], name, gid]]

   //-----------------------------------------------------
   for ( i = 0; i < arrBuildingsUsage.length; ++i )
   {
      var buildingUsage = arrBuildingsUsage[i];
      var gid = buildingUsage[1];
      for ( j = 0; j < buildingUsage[2].length; ++j )
      {
         var troopInfo = buildingUsage[2][j][0];
         for ( k = 0; k < arrTriP.length; ++k )
         {
            if ( arrTriP[k][0][0] === troopInfo[0] ) 
            {
               arrTriP[k][0][1] += troopInfo[1];
               if ( gid < arrTriP[k][2] ) 
               {
                  arrTriP[k][2] = gid;
               }
               break;
            }
         }
         if ( k === arrTriP.length ) // item not found
         {
            arrTriP.push([troopInfo, buildingUsage[2][j][1], gid]);
         }
      }
   }
   arrTriP.sort(function(item1, item2) // sort by tix
                {
                   return compare(item1[0][0],item2[0][0]);
                });

   //-----------------------------------------------------
   var aCell = $g("aldea" + villageId + "_1_4");
   removeChildren(aCell);

   for ( j = 0; j < arrTriP.length; ++j )
   {
      var TriPInfo = arrTriP[j];
      if ( j > 0 )
      {
         aCell.appendChild($txt(" "));
      }
      aCell.appendChild($lnk([['href',"build.php?newdid=" + villageId + "&gid=" + TriPInfo[2]],
                              ['alt', TriPInfo[0][1] + "\u00D7" + TriPInfo[1]]],
                             getTroopImage(TriPInfo[0][0])));
   }

   if ( arrTriP.length === 0 )
   {
      aCell.appendChild($txt("-"));
   }
}

//////////////////////////////////////////////////////////////////////
function fillD3TbRow_Tab2(villageId)
{
   var resourcesInfo = getActualResourcesInfoNow(TB3O.VillagesInfo[villageId].r,true);
   var villageResKnown = ( resourcesInfo.dUpd !== undefined );
   var aCell;
   var ri;
   if ( villageResKnown )
   {
      TB3O.Tab2[villageId] = [];
   }

   for ( ri = 0; ri < 4; ri++ )
   {
      aCell = $g("aldea" + villageId + "_2_" + (ri + 2));
      if ( villageResKnown )
      {
         var val = resourcesInfo.Res[ri];
         TB3O.Tab2[villageId][ri] = val;
         aCell.textContent = $ls(val);
         var fillPercent = getFillPercent(resourcesInfo, ri);
         aCell.style.backgroundColor = getBackColorForResourceBar(fillPercent, resourcesInfo.EPpH[ri]);
         aCell.style.color = getForeColorForResourceBar(fillPercent, resourcesInfo.EPpH[ri]);
      }
      else
      {
         aCell.textContent = "?";
      }
   }

   aCell = $g("aldea" + villageId + "_2_6");
   if ( villageResKnown )
   {
      TB3O.Tab2[villageId][4] = resourcesInfo.EPpH[3];
      uiSetEffectiveCropPpH(aCell,resourcesInfo.EPpH[3],true);
   }
   else
   {
      aCell.textContent = "?";
   }
}

//////////////////////////////////////////////////////////////////////
function fillD3TbTotals_Tab2()
{
   var i, val, aCell, resTotal = [0,0,0,0,0];

   for ( villageId in TB3O.Tab2 )
   {
      for ( i = 0; i < 5; i++ )
      {
         resTotal[i] += TB3O.Tab2[villageId][i];
      }
   }

   for ( i = 0; i < 5; i++ )
   {
      aCell = $g("aldea_s_2_" + (i + 2));
      val = resTotal[i];
      if ( i === 4 )
      {
         uiSetEffectiveCropPpH(aCell,val,true)
      }
      else
      {
         aCell.textContent = $ls(val);
      }

      ifClass(aCell, Math.abs(val) > IIF_TB3(999999,99999999), "tbMany");
   }
}

//////////////////////////////////////////////////////////////////////
// Resources
function fillD3TbRow_Tab3(villageId)
{
   var resourcesInfo;
   var ttFillW,ttTemp;
   var fillPercent;
   var ri,cellNo;
   var aCell;

   //-------------------------
   resourcesInfo = getActualResourcesInfoNow(TB3O.VillagesInfo[villageId].r, false);

   if ( resourcesInfo.dUpd !== undefined )
   {
      ttFillW = Infinity;
      for ( ri = 0; ri < 4; ri++)
      {
         cellNo = ri + 2;
         ttTemp = getSecondsToFill(resourcesInfo,ri);

         if ( ri === 3 )
         {
            cellNo = 6;
         }
         else
         {
            if (ttTemp < ttFillW) { ttFillW = ttTemp; }
         }
         aCell = $g("aldea" + villageId + "_3_" + cellNo);
         uiSetFillPercent(aCell, resourcesInfo, ri)
         /*
         fillPercent = getFillPercent(resourcesInfo, ri);
         aCell.textContent = fillPercent + " %";
         $at(aCell, [['style', 'font-size:10pt; text-align:' + docDir[1] + ';' +
                      ( fillPercent >= 95 ? 'color:red' : '' )
                    ]]);
                    */
      }
      //time to empty/fill the warehouse
      uiSetTimeout($g("aldea" + villageId + "_3_5"),ttFillW,1,{format:1});

      //time to empty/fill granary
      uiSetTimeToFill($g("aldea" + villageId + "_3_7"),resourcesInfo,3,{format:1});
   }
}

//////////////////////////////////////////////////////////////////////
// CP tab / CP per day
function fillD3TbRow_Tab4_Col2(villageId)
{
   var aCell = $g("aldea" + villageId + "_4_2");
   var cp = getActualVillageCP(TB3O.VillagesInfo[villageId]);
   TB3O.Tab4.cpCol[villageId] = cp;
   aCell.textContent = cp;
}

//////////////////////////////////////////////////////////////////////
// celebrations
function uiCreateCelebrationTooltip(villageId, cType)
{
   var villageInfo = TB3O.VillagesInfo[villageId];
   var bIsNPCAvailable = getNPCAvailability(villageId);
   var resourcesInfo = getActualResourcesInfoNow(villageInfo.r, false);
   var av = getAvailability(celCost[cType], resourcesInfo, bIsNPCAvailable);
   
   var title = (cType === 0) ? 'Small celebration' : 'Great celebration';

   var aTb = uiCreateResAndTimeTable(av, resourcesInfo, null, null, null, 
             { top_title: true,
               NPC: bIsNPCAvailable,
               NPCLink: false
             });

   var cp = parseInt10($g("aldea" + (( cType === 0 ) ? villageId  : "_s") + "_4_2").textContent);

   var maxcp = celCost[cType][4][TB3O.nServerType];

   var aDiv = $div(['class', 'tbTip'],[
                    $e("h4",['class', 'tbTitle'], [title + " (" + Math.min(cp,maxcp),I("cp"),")"]),
                    aTb,
                    $e("p",null,[TX('CELHINTS',0),
                       ( av[0] === 1 ) ? [$e("br"),TX('CELHINTS',1)] : null]),
                    ]);
   return aDiv;
} 

//////////////////////////////////////////////////////////////////////
function onClickCelebrationBullet(villageId, cType, e)
{
   var href = "build.php?newdid=" + villageId + "&gid=24";

   if ( e.shiftKey )
   {
      var av = getAvailability(celCost[cType], getActualResourcesInfoNow(TB3O.VillagesInfo[villageId].r, false), false);
      if ( av[0] === 1 )
      {
         var aCell = $g("aldea" + villageId + "_4_3");
         removeChildren(aCell);
         addClass(aCell,'tbWait');
         addChildren(aCell, I("wait") );

         ajaxLoadDocument(href + "&a=" + (cType+1), bind2(generalAjaxRefreshHandler,[villageId,4,refreshD3Tb_Celebrations]), 
                                                    bind(fillD3TbRow_Tab4_Col3,[villageId]));
      }
      e.preventDefault();
   }
   else
   {
      location.href = href;
   }
} 

//////////////////////////////////////////////////////////////////////
// CP tab / celebrations
function fillD3TbRow_Tab4_Col3(villageId)
{
   var aCell = $g("aldea" + villageId + "_4_3");
   var villageInfo = TB3O.VillagesInfo[villageId];
   var resourcesInfo = getActualResourcesInfoNow(villageInfo.r,false);
   var townHallInfo = villageInfo.thi;
   var bIsNPCAvailable = getNPCAvailability(villageId);
   var ttCurrent = toTimeStamp(getServerTimeNow());

   //-----------------------------------------------------------------
   function uiAddCelebrationBullet(cType, title)
   {
      var av = getAvailability(celCost[cType], resourcesInfo, bIsNPCAvailable);
      var sClass = getCNClass(av[0]);
      var aLnk = $lnk([['href', jsVoid], ['click', bind2(onClickCelebrationBullet,[villageId,cType]), false]],
                     $div(['class','tbBullet ' + sClass + ' ' + ['tbSmall','tbGreat'][cType]]));
      uiAddTooltip(aLnk,bind(uiCreateCelebrationTooltip,[villageId,cType]));
      aCell.appendChild(aLnk);
   } 

   //-----------------------------------------------------------------
   delClass(aCell,'tbWait');
   reconcileEvents(townHallInfo.evA, ttCurrent);
   if ( townHallInfo.ttUpd && townHallInfo.evA.length )
   {
      var ev = townHallInfo.evA[0];
      uiSetTimeSpanByDate(aCell, ttCurrent, ev.ttEnd, {format:1});
      if ( ev.name )
      {
         aCell.title = aCell.title + " (" + ev.name + ")";
      }
   }
   else
   {
      aCell.textContent = "-";

      var buildingInfo = getBuildingInfoByGid(villageInfo.csi.b,GID_TOWNHALL);
      if ( buildingInfo )
      {
         if ( buildingInfo.lvl > 0 )
         {
            removeChildren(aCell);
            uiAddCelebrationBullet(0);
         }

         if ( buildingInfo.lvl >= 10 )
         {
            uiAddCelebrationBullet(1);
         }
      }
   }
}

//////////////////////////////////////////////////////////////////////
// CP tab / settlers, senators, chiefs, chieftains
function fillD3TbRow_Tab4_Col4(villageId)
{
   var xi, img;
   var aCell = $g("aldea" + villageId + "_4_4");
   var unitsCountInfo = TB3O.VillagesInfo[villageId].uci;
   var arrUT = unitsCountInfo.ut;

   if ( !unitsCountInfo.ttUpd )
   {
      aCell.textContent = '?';
   }
   else
   {
      var bSep = false;
      removeChildren(aCell)
      img = getUnitImage(TG_UIDX_SENATORS);
      if ( img )
      {
         // senators, chiefs, chieftains
         for (xi = 0; xi < arrUT[TG_UIDX_SENATORS]; ++xi) 
         {
            if ( bSep ) { aCell.appendChild($txt(" ")); }
            aCell.appendChild(img.cloneNode(true));
            bSep = true;
         }
      }

      img = getUnitImage(TG_UIDX_SETTLERS);
      if ( img )
      {
         // senators, chiefs, chieftains
         for (xi = 0; xi < arrUT[TG_UIDX_SETTLERS]; ++xi) 
         {
            if ( bSep ) { aCell.appendChild($txt(" ")); }
            aCell.appendChild(img.cloneNode(true));
            bSep = true;
         }
      }
      if ( !bSep ) { aCell.textContent = '-'; }

   }
}

//////////////////////////////////////////////////////////////////////
// CP tab
function fillD3TbRow_Tab4(villageId)
{
   fillD3TbRow_Tab4_Col2(villageId);
   fillD3TbRow_Tab4_Col3(villageId);
   fillD3TbRow_Tab4_Col4(villageId);
}

//////////////////////////////////////////////////////////////////////
function fillD3TbTotals_Tab4_Col2()
{
   var aCell = $g("aldea_s_4_2");
   var cpTotal = 0;
   var villageId;

   for ( villageId in TB3O.Tab4.cpCol )
   {
      cpTotal += TB3O.Tab4.cpCol[villageId];
   }

   aCell.textContent = cpTotal;
}

//////////////////////////////////////////////////////////////////////
function fillD3TbTotals_Tab4_Col4()
{
   var aCell = $g("aldea_s_4_4");
   var sumUT = getUnitsCountInfoTotals();
   var bSep = false;

   removeChildren(aCell);
   if ( sumUT[TG_UIDX_SENATORS] )
   {
      addChildren(aCell,[getUnitImage(TG_UIDX_SENATORS)," " + sumUT[TG_UIDX_SENATORS] ]);
      bSep = true;
   }

   if ( sumUT[TG_UIDX_SETTLERS] )
   {
      if ( bSep ) { aCell.appendChild($txt(" / ")); }
      addChildren(aCell,[getUnitImage(TG_UIDX_SETTLERS)," " + sumUT[TG_UIDX_SETTLERS] ]);
      bSep = true;
   }
   if ( !bSep ) { aCell.textContent = '-'; }
}

//////////////////////////////////////////////////////////////////////
function fillD3TbTotals_Tab4()
{
   fillD3TbTotals_Tab4_Col2();
   fillD3TbTotals_Tab4_Col4();
}

//////////////////////////////////////////////////////////////////////
// troops trained  (TODO: show hero only in last visited village)
function fillD3TbRow_Tab5(villageId)
{
   var unitsCountInfo = TB3O.VillagesInfo[villageId].uci;
   var arrTT = unitsCountInfo.ut;
   var i, aCell;

   for ( i = 0; i < TG_UNITS_COUNT; ++i )
   {
      aCell = $g("aldea" + villageId + "_5_" + (i + 2));

      if ( unitsCountInfo.ttUpd && arrTT[i] )
      {
         aCell.textContent = arrTT[i];
         delClass(aCell,"tb3none");
         if ( arrTT[i] > 99999 )
         {
            addClass(aCell,"tbMany");
         }
      }
      else
      {
         aCell.textContent = ( unitsCountInfo.ttUpd ) ? '-' : '?';
         addClass(aCell,"tb3none");
      }
   }
}

//////////////////////////////////////////////////////////////////////
// troops trained totals 
function fillD3TbTotals_Tab5()
{
   var i, aCell;

   //Available troops
   var sumTT = getUnitsCountInfoTotals();
   for ( i = 0; i < TG_UNITS_COUNT; ++i )
   {
      aCell = $g("aldea_s_5_" + (i + 2));
      if ( sumTT[i] )
      {
         aCell.textContent = sumTT[i];
         delClass(aCell,"tb3none");
         if ( sumTT[i] > 99999 )
         {
            addClass(aCell,"tbMany");
         }
      }
      else
      {
         aCell.textContent = "-";
         addClass(aCell,"tb3none");
      }
   }

   // Statistics
   /*
   if ( TBU_RACE !== '' )
   {
      aCell = $g("aldea_s_5");
      var pop = getTotalPopulation();
      var troopsInfo = getTroopsInfoFromUnitsCount(TBU_RACE, sumTT);
      var troopsStatInfo = calcTroopsTotals(troopsInfo);
      __DUMP__(pop,troopsStatInfo)
      replaceChildren(aCell,uiCreateTroopsAttDefInfoTable(null, troopsInfo, true));
   }
   */
}

//////////////////////////////////////////////////////////////////////
function fillD3Tb_Tab1()
{
   var villageId;

   for ( villageId in TB3O.VillagesInfo )
   {
      fillD3TbRow_Tab1(villageId);
      fillD3TbRow_Tab1_Col4(villageId);
   }
}


//////////////////////////////////////////////////////////////////////
// Resources
function fillD3Tb_Tab2()
{
   var villageId;

   for ( villageId in TB3O.VillagesInfo )
   {
      fillD3TbRow_Tab2(villageId);
   }

   fillD3TbTotals_Tab2();
}

//////////////////////////////////////////////////////////////////////
// Resources
function fillD3Tb_Tab3()
{
   var villageId;

   for ( villageId in TB3O.VillagesInfo )
   {
      fillD3TbRow_Tab3(villageId);
   }
}

//////////////////////////////////////////////////////////////////////
function fillD3Tb_Tab4()
{
   var villageId;

   for ( villageId in TB3O.VillagesInfo )
   {
      fillD3TbRow_Tab4(villageId);
   }

   fillD3TbTotals_Tab4();
}

//////////////////////////////////////////////////////////////////////
// troops trained
function fillD3Tb_Tab5()
{
   var villageId;

   for ( villageId in TB3O.VillagesInfo )
   {
      fillD3TbRow_Tab5(villageId);
   }

   fillD3TbTotals_Tab5();
}

