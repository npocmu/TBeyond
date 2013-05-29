//////////////////////////////////////////////////////////////////////
// Used for updates info from refresh callbacks
function getTownHallInfo(villageId, aDoc, ttServer)
{
   __ENTER__

   var cRow = __TEST__($xf("//table[" + $xClass('under_progress') + "]/tbody/tr[1]", 'f', aDoc, aDoc));
   var villageInfo = TB3O.VillagesInfo[villageId];

   if ( cRow && cRow.cells.length === 3 )
   {
      var ttEnd = getEventTimeStamp(ttServer, cRow.cells[1].textContent);
      villageInfo.thi.evA = [new CelebrationEvent(cRow.cells[0].textContent, ttEnd)];
   }
   else
   {
      villageInfo.thi.evA = [];
   }
   villageInfo.thi.ttUpd = ttServer;

   __EXIT__

   return true;
}

//////////////////////////////////////////////////////////////////////
function processTownHall()
{
   __ENTER__

   TB3O.pageSelector = "town_hall";
   getTownHallInfo(TB3O.ActiveVillageId, document, toTimeStamp(TB3O.serverTime));

   __EXIT__
}

