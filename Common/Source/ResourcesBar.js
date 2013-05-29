//////////////////////////////////////////////////////////////////////
function uiUpdateResBarWidget()
{
   updateResBarTable('tb_resbar',TB3O.ActiveVillageId);
}

//////////////////////////////////////////////////////////////////////
function uiCreateResBarWidget()
{
   __ENTER__

   var rbT,prbT;
   var xy;

   if ( TBO_SHOW_RESBARTABLE === "1" )
   {
      rbT = uiCreateResBarTable('tb_resbar', TB3O.ActiveVillageId, true);

      if ( rbT )
      {
         IIF_TB3({{
         if ( TBO_FLOAT_RESBARTABLE !== "1" )
         {
            prbT = $e("p");
            prbT.appendChild(rbT);
            TB3O.nTARbT.appendChild(prbT);
         }
         else }})
         {
            // floating window
            xy = TBO_RESBARTABLE_XY.split("|");
            TB3O.nTARbT = $df(200, xy[0], xy[1], T('RBTT'), "resbar", "resbarTT", true, rbT);
            if ( TBO_RESBARTABLE_STATE !== "1" ) { rbT.style.display = 'none'; }
         }

         setInterval(uiUpdateResBarWidget, TB3O.Timeouts.resbar_update);
      }
   }

   __EXIT__
}


//////////////////////////////////////////////////////////////////////
//show resources in a tooltip
function uiCreateResourceTooltip(villageId)
{
   return uiCreateResBarTable('tb_resbarTT',villageId,false);
}

//////////////////////////////////////////////////////////////////////
function uiCreateFillBar()
{
   return $t([['class', 'rbrtb']],$r([['class', 'rbrtbr']],[$td(),$td()]));
}

//////////////////////////////////////////////////////////////////////
function uiSetFillBar(bar, resourcesInfo, ri)
{
   var bCells = bar.rows[0].cells;
   var title = "" + Math.floor(resourcesInfo.Res[ri]) + "/" + resourcesInfo.Cap[ri];
   var fillPercent = getFillPercent(resourcesInfo, ri);
   var prC = getBackColorForResourceBar(fillPercent,resourcesInfo.EPpH[ri]);
   $at(bCells[0], [['style', 'width:' + fillPercent + '%; background-color:' + prC + ';'], ['title', title]]);
   $at(bCells[1], [['style', 'width:' + (100 - fillPercent) + '%; background-color:transparent;'], ['title', title]]);

   return bar;
}


//////////////////////////////////////////////////////////////////////
function uiCreateResBarTable(tableId, villageId, bShowAllTotals)
{
   var rbT = null, hRow, aRow, bRow, cRow, tRow, hCell1, hCell2, aCell;
   var intpph = 0, intPPH = 0;
   var ri;

   var villageInfo = TB3O.VillagesInfo[villageId];
   var resourcesInfo = villageInfo.r;
   if ( resourcesInfo.dUpd !== undefined )
   {
      for ( ri = 0; ri < 4; ri++ )
      {
         intpph += resourcesInfo.PpH[ri];
         intPPH += TB3O.ResInfoTotals.PpH[ri];
      }

      rbT = $t();
      rbT.id = tableId;
      rbT.className = "tbResBar";
      hRow = $r([['class', 'tb3r']]);
      hCell1 = $c(villageInfo.name, [['class', 'tb3cvn'], ['colspan', '4']]);
      hRow.appendChild(hCell1);

      hCell2 = $c( (bShowAllTotals ? T('TOTAL') + " / ": "") + T('1H'), [['class', 'tb3chtot']]);
      hRow.appendChild(hCell2);

      rbT.appendChild(hRow);


      for (ri = 0; ri < 4; ri++)
      {
         var strType = "";
         if ( TBO_RESBARTABLE_SHOW_VTYPE === "1" && villageInfo.type )
         {
            strType = villageTypes[villageInfo.type][ri] + "\u00D7";
         }

         aRow = $r([['class', 'tb3r']]);

         aCell = $td([['class', 'tb3c']]);
         if ( strType ) { aCell.appendChild($e("span",strType)); }
         aCell.appendChild(I("r" + (ri + 1)));
         aRow.appendChild(aCell);

         aCell = $td([['class', 'lr']],$e("span"));
         aRow.appendChild(aCell);

         aCell = $td([['class', 'tb3cresbar']],uiCreateFillBar());
         aRow.appendChild(aCell);

         aCell = $td([['class', 'tb3ttf']]);
         aRow.appendChild(aCell);

         aCell = $td([['class', 'tb3ctot']],$ls(bShowAllTotals ? TB3O.ResInfoTotals.PpH[ri] : resourcesInfo.PpH[ri]));
         aRow.appendChild(aCell);

         rbT.appendChild(aRow);
      }

      //row for totals per hour
      tRow = $r([['class', 'tb3pph']]);
      tRow.appendChild($c(gIc["r1"] + " + " + gIc["r2"] + " + " + gIc["r3"] + " + " + gIc["r4"] + " / " + T('1H'), 
                       [['class', 'tb3c'], ['colspan', bShowAllTotals ? '3' : '4']]));
      tRow.appendChild($c($ls(intpph), [['class', bShowAllTotals ? 'tb3ctotv' : 'tb3ctot']]));
      if ( bShowAllTotals )
      {
         tRow.appendChild($c($ls(intPPH), [['class', 'tb3ctot']]));
      }
      rbT.appendChild(tRow);

      //row for total crop consumption
      bRow = $r([['class', 'tb3r']]);
      bRow.appendChild($c(gIc["r5"], [['class', 'tb3c'], ['colspan', '2']]));
      bRow.appendChild($c("", [['class', 'tb3c'],['colspan', bShowAllTotals ? '1' : '2']]));
      bRow.appendChild($c($ls(resourcesInfo.PpH[3]-resourcesInfo.EPpH[3]), 
                          [['class', bShowAllTotals ? 'tb3ctotv' : 'tb3ctot']]));
      if ( bShowAllTotals )
      {
         bRow.appendChild($c($ls(TB3O.ResInfoTotals.PpH[3] - TB3O.ResInfoTotals.EPpH[3]), [['class', 'tb3ctot']]));
      }
      rbT.appendChild(bRow);

      //row for effective crop production
      cRow = $r([['class', 'tb3r']]);
      cRow.appendChild($c(gIc["r4"] + " - " + gIc["r5"], [['class', 'tb3c'], ['colspan', '2']]));
      cRow.appendChild($c("", [['class', 'tb3c'],['colspan', bShowAllTotals ? '1' : '2']]));
      cRow.appendChild($c($ls(resourcesInfo.EPpH[3]), 
                          [['class', bShowAllTotals ? 'tb3ctotv' : 'tb3ctot']]));
      if ( bShowAllTotals )
      {
         cRow.appendChild($c($ls(TB3O.ResInfoTotals.EPpH[3]), [['class', 'tb3ctot']]));
      }
      rbT.appendChild(cRow);

      fillResBarTable(rbT, villageId);
   }
   return rbT;
}


//////////////////////////////////////////////////////////////////////
function fillResBarTable(rbT, villageId)
{
   var aRows, aCells;
   var ri;
   var resourcesInfo = getActualResourcesInfoNow(TB3O.VillagesInfo[villageId].r, false);

   aRows = rbT.rows;
   for ( ri = 0; ri < 4; ++ri )
   {
      aCells = aRows[ri+1].cells;

      uiSetFillPercent(aCells[1].firstChild, resourcesInfo, ri);
      uiSetFillBar(aCells[2].firstChild, resourcesInfo, ri);
      uiSetTimeToFill(aCells[3], resourcesInfo, ri);
   }
}

//////////////////////////////////////////////////////////////////////
function updateResBarTable(tableId, villageId)
{
   var rbT = $g(tableId);
   if ( rbT )
   {
      fillResBarTable(rbT, villageId);
   }
}

