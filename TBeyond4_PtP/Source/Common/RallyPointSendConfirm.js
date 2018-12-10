//////////////////////////////////////////////////////////////////////
function uiModifyRallyPointSendConfirm()
{
   __ENTER__

   var sendTroops;
   var statSendTable;
   var ttServer, ttReturn, secToTravel, returnNode;
   var timerObserver = new MutationObserver(onTimerTick);

   function onTimerTick(mutationList, mutationObserver)
   {
      returnNode.textContent = formatDateTimeRelativeToNow(secToTravel, 1); 
   }

   //-------------------------------------------------------------
   var elems = searchRallyPointSendConfirmElems();
   if ( elems )
   {
      var sendTable = elems.details;

      ttServer = toTimeStamp(TB3O.serverTime);
      var troopDetailsInfo = parseTroopDetails(sendTable, document, ttServer, null, false);

      if ( troopDetailsInfo.cmd !== ATC_DEFEND )
      {
         // add "returns" row to table
         secToTravel = 2 * (troopDetailsInfo.ttArrival - ttServer) / 1000;
         ttReturn = ttServer + secToTravel * 1000;

         var lastRow = sendTable.rows[sendTable.rows.length-1];
         var timerCell = __TEST__($qf(".timer",'f',lastRow));
         var cols = lastRow.cells[1].getAttribute("colspan");
         var newRow = $r(attrInject$,[
                         $th(T("RET")),
                         $td(['colspan',cols],[
                             $div(['class','in'],formatTimeSpan(secToTravel,0)),
                             $div(['class','at'],
                                returnNode = $span(formatDateTime(ttServer, ttReturn, 1))
                             )])]);

         insertAfter(lastRow, newRow);

         // we should not use the TBeyond timer because it out of sync with the Travian timer
         if ( timerCell )
         {
            timerObserver.observe(timerCell, {childList: true});
         }
      }

      // add stat table
      sendTroops = getTroopsInfoFromUnitsCount(TB3O.KnownRaces[troopDetailsInfo.rx], troopDetailsInfo.u);

      statSendTable = uiCreateTroopsAttDefInfoTable2("tb_sendtroopstat", sendTroops, T("STAT"), true);
      if ( statSendTable )
      {
         insertAfter(sendTable, statSendTable);
      }
   }

   __EXIT__
}
