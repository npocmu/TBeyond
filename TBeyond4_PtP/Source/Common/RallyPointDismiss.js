//////////////////////////////////////////////////////////////////////
function searchRallyPointDismissElems()
{
   var dismissTable = __TEST__($xf("//table[@class='troop_details']"));
   var dismissContainer = null;
   if ( dismissTable )
   {
      dismissContainer = dismissTable.parentNode;
   }
   __ASSERT__(dismissContainer,"Can't find dismiss table container")

   return ( dismissContainer ) ? [dismissContainer,dismissTable] : null;
}

//////////////////////////////////////////////////////////////////////
// for accurate work need to parse RP first
function uiModifyRallyPointDismiss()
{
   var availableTroops, dismissTroops, remainsTroops;
   var statDismissTable, statRemainsTable;

   //-------------------------------------------------------------
   function getDismissTroopsInfo(dismissTable)
   {
      var troopsInfo = [];

      var iCells = dismissTable.rows[1].cells;
      var qCells = dismissTable.rows[2].cells;
      var len = iCells.length;

      var i;
      for ( i = 1; i < len; ++i )
      {
         var unitImg = $nth_tag(iCells[i],"img",0);
         var aInput = $nth_tag(qCells[i],"input",0);
         if ( unitImg && aInput )
         {
            var index = getTroopIndexTitleFromImg(unitImg)[0];
            var count = parseInt10(aInput.value);
            troopsInfo.push([index,count]);
         }
         else
         {
            troopsInfo.push([null,0]);
         }
      }
      return troopsInfo;
   }

   //-------------------------------------------------------------
   function uiRefreshStats()
   {
      if ( statRemainsTable )
      {
         uiFillTroopsAttDefInfoTable2(statRemainsTable, remainsTroops);
      }
      if ( statDismissTable )
      {
         uiFillTroopsAttDefInfoTable2(statDismissTable, dismissTroops);
      }
   }

   //-------------------------------------------------------------
   function searchTroopsInput(troopNo)
   {
      return __TEST__($xf("//input[@name='t[" + (troopNo+1) + "]']"));
   }

   //-------------------------------------------------------------
   function updateTroop(troopNo, units)
   {
      dismissTroops[troopNo][1] = units; 
      remainsTroops[troopNo][1] = availableTroops[troopNo][1] - units;
   }

   //-------------------------------------------------------------
   function foreachTroop(f)
   {
      var troopNo;
      for ( troopNo = 0; troopNo < availableTroops.length; ++troopNo )
      {
         var count = availableTroops[troopNo][1];
         if ( count > 0 )
         {
            f(troopNo);
         }
      }
   }

   //-------------------------------------------------------------
   function uiSetTroop(troopNo, units)
   {
      var aInput = searchTroopsInput(troopNo);
      if ( aInput )
      {
         aInput.value = ( units ) ? units : "";
         updateTroop(troopNo, units);
      }
   }

   //-------------------------------------------------------------
   function _uiSetMaxTroop(troopNo)
   {
      uiSetTroop(troopNo, availableTroops[troopNo][1]);
   }

   //-------------------------------------------------------------
   function uiSetMaxTroop(troopNo)
   {
      _uiSetMaxTroop(troopNo);
      uiRefreshStats();
   }

   //-------------------------------------------------------------
   function uiSetMaxAllTroops()
   {
      foreachTroop(_uiSetMaxTroop);
      uiRefreshStats();
   }

   //-------------------------------------------------------------
   function _uiSetZeroTroop(troopNo)
   {
      uiSetTroop(troopNo, 0);
   }

   //-------------------------------------------------------------
   function uiSetZeroTroop(troopNo)
   {
      _uiSetZeroTroop(troopNo);
      uiRefreshStats();
   }

   //-------------------------------------------------------------
   function uiSetZeroAllTroops()
   {
      foreachTroop(_uiSetZeroTroop);
      uiRefreshStats();
   }

   //-------------------------------------------------------------
   function onChangeUnitsCount(troopNo)
   {
      var units = validateInputInt(this,0,availableTroops[troopNo][1]);
      updateTroop(troopNo, units);
      uiRefreshStats();
   }

   //-------------------------------------------------------------
   function uiModifyDismissTable(dismissTable)
   {
      var iCells = dismissTable.rows[1].cells;
      var qCells = dismissTable.rows[2].cells;
      var len = iCells.length;

      iCells[0].textContent = "";
      iCells[0].appendChild(uiCreateTool("del", T('MTCL'), uiSetZeroAllTroops));
      iCells[0].style.textAlign="center";

      var aRow = $r(attrInject$,
                    $td(
                       $action(null, "(" + T('ALL') + ")", uiSetMaxAllTroops)));

      var i;
      for ( i = 1; i < len; ++i )
      {
         var aInput = $nth_tag(qCells[i],"input",0);
         var aCell = $td();
         if ( aInput )
         {
            aInput.addEventListener('keyup',  bind(onChangeUnitsCount,[i-1]), false);
            aInput.addEventListener('change', bind(onChangeUnitsCount,[i-1]), false);

            aCell.appendChild($action([['class',( aInput.value > 9999 ) ? "tbMany" : ""]], 
                                       "(" + aInput.value + ")", 
                                       bind(uiSetMaxTroop,[i-1])));

            var unitImg = $nth_tag(iCells[i],"img",0);
            unitImg.addEventListener('click', bind(uiSetZeroTroop,[i-1]), false);
            unitImg.style.cursor = "pointer";

            iCells[i].appendChild(uiCreateUpDownControl(aInput));
         }
         aRow.appendChild(aCell);
      }
      insertAfter(dismissTable.rows[2],aRow);
   }

   //-------------------------------------------------------------
   function uiAddDistanceInfo(dismissContainer, dismissTable)
   {
      __ENTER__
      var aLink = __TEST__($nth_tag(dismissTable.rows[0].cells[0],"a",0));
      if ( aLink )
      {
         var mapId = __TEST__(parseUri(aLink.href).queryKey.d);
         if ( mapId )
         {
            var tRace = TBU_RACE;
            var tImg = __TEST__($nth_tag(dismissTable.rows[1].cells[1],"img",0));
            if ( tImg )
            {
               tRace = getRaceFromTroopIndex(getTroopIndexTitleFromImg(tImg)[0]);
            }

            var aTb = uiCreateTroopsMerchantsDistTable("tb_dismisstroopsdist", null, mapId,
                                                   { show_arrival_time:true, race:tRace,
                                                     show_coords:true, show_troops:true });
            if ( aTb ) 
            {
               dismissContainer.appendChild(aTb);
            }
         }
      }
      __EXIT__
   }

   //-------------------------------------------------------------
   __ENTER__

   var elems = searchRallyPointDismissElems();
   if ( elems )
   {
      var dismissContainer = elems[0];
      var dismissTable = elems[1];

      availableTroops = getDismissTroopsInfo(dismissTable);
      dismissTroops = cloneObject(availableTroops);
      remainsTroops = cloneObject(availableTroops);
      var i;
      for ( i = 0; i < remainsTroops.length; ++i )
      {
         remainsTroops[i][1] = 0;
      }

      uiModifyDismissTable(dismissTable);

      statRemainsTable = uiCreateTroopsAttDefInfoTable2(null, remainsTroops, T("STAT_REMAINS"), true);
      if ( statRemainsTable )
      {
         insertAfter(dismissTable, statRemainsTable);
      }

      statDismissTable = uiCreateTroopsAttDefInfoTable2(null, dismissTroops, T("STAT_DISMISS"), true);
      if ( statDismissTable )
      {
         insertAfter(dismissTable, statDismissTable);
      }

      if ( crtUrl.queryKey.newdid === undefined ) 
      {
         uiAddDistanceInfo(dismissContainer, dismissTable);
      }
   }
   __EXIT__
} 


