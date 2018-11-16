

//////////////////////////////////////////////////////////////////////
function uiModifyRallyPointSendConfirm()
{
   __ENTER__

   var sendTroops;
   var statSendTable;

   //-------------------------------------------------------------
   var elems = searchRallyPointSendConfirmElems();
   if ( elems )
   {
      var sendTable = elems.details;

      var ttServer = toTimeStamp(TB3O.serverTime);
      var troopDetailsInfo = parseTroopDetails(sendTable, document, ttServer, null, false);

      __DUMP__(troopDetailsInfo)
      __DUMP__(getTroopDetailsInfoView(troopDetailsInfo))

      // add "returns" row to table
      var secToTravel = 2 * (troopDetailsInfo.ttArrival - ttServer) / 1000;
      var ttReturn = ttServer + secToTravel * 1000;

      __DUMP__(toDate(ttReturn))

      var lastRow = sendTable.rows[sendTable.rows.length-1];
      var cols = lastRow.cells[1].getAttribute("colspan");
      var newRow = $r(null,[
                      $th("returns"),
                      $td(['colspan',cols],[
                          $div(['class','in'],formatTimeSpan(secToTravel,0)),
                          $div(['class','at'],
                               $span([['class','timer'],['value',ttReturn/1000],['counting','up']],"00:00:00")
//                             $span([['class','timereln'],['#ss',secToTravel],['#format',1]], formatDateTime(ttServer, ttReturn, 1))
                          )])]);

      insertAfter(lastRow, newRow);

      sendTroops = getTroopsInfoFromUnitsCount(TB3O.KnownRaces[troopDetailsInfo.rx], troopDetailsInfo.u);

      statSendTable = uiCreateTroopsAttDefInfoTable2("tb_sendtroopstat", sendTroops, T("STAT"), true);
      if ( statSendTable )
      {
         insertAfter(sendTable, statSendTable);
      }
   }

   __EXIT__
}
