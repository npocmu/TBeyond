//////////////////////////////////////////////////////////////////////
function searchTroopsInfoTable(aDoc)
{
   return __TEST__($g("troop_info", aDoc));
}

//////////////////////////////////////////////////////////////////////
function processPositionDetails()
{
   TB3O.pageSelector = "position_details";

   var headerCoords = $xf("//h1//span[" + $xClass('coordinatesWrapper') + "]");
   if ( headerCoords )
   {
      var xy = parseCoords(headerCoords.innerHTML);
      TB3O.xCrt = xy[0];
      TB3O.yCrt = xy[1];
   }
}

//////////////////////////////////////////////////////////////////////
function uiModifyPositionDetails()
{
   __ENTER__

   var aContainer = null;
   var tTable = searchTroopsInfoTable();
   if ( tTable && !hasClass(tTable,"rep") )
   {
      aContainer = tTable.previousElementSibling;
   }

   uiAddAttDefInfoSign(tTable, aContainer, false);

   if ( TBO_SHOW_DIST_TIMES === "1")
   {
      var hook = __TEST__($g("tileDetails"));
      if ( hook )
      {
         insertAfter(hook,aContainer = $div(attrInject$));
         uiAddUnitsTimesTable(aContainer);
      }
   }

   __EXIT__
}

