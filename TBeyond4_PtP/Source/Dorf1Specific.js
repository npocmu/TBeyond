//////////////////////////////////////////////////////////////////////
function uiSetCenterNumberState(aLvlNode, nState, bAlreadyBuilt)
{
   var stateClasses = ["tbNoRes","tbUpg","tbNPCUpg","tbNoCap","tbMax","tbUpgNow"];
   var sClass = stateClasses[nState];
   delClass(aLvlNode,stateClasses);

   if ( bAlreadyBuilt ) 
   { 
      if ( !TB3O.ServerInfo.features.hasOwnProperty("show_under_construction") )
      {
         // try to detect feature
         TB3O.ServerInfo.features.show_under_construction = (aLvlNode.parentNode.getElementsByClassName("underConstruction").length > 0);
      }
   
      if ( !TB3O.ServerInfo.features.show_under_construction ) 
      {
         sClass += " tbUpgNow"; 
      }
   }

   aLvlNode.className += " " + sClass;
}

//////////////////////////////////////////////////////////////////////
//create the DIV for the coloured level numbers
function uiCreateDorf1CenterNumbers(arrBA)
{
   __ENTER__

   if ( TBO_SHOW_COLOR_RES_LEVELS === "1" )
   {
      var villageMap = $g("village_map");
      if ( villageMap )
      {
         var i, id;
         var lvlNodesList = villageMap.getElementsByClassName("level");

         for ( i = 0, id = 0; i < lvlNodesList.length; ++i )
         {
            var crtLevel = parseInt10(lvlNodesList.item(i).textContent);
            if ( !isFinite(crtLevel) ) { crtLevel = 0; }
            do { ++id; } while ( crtLevel != TB3O.ActiveVillageInfo.csi.b[id][1] && id < 18 );

            uiSetCenterNumberState(lvlNodesList.item(i), arrBA[id][0], false);
         }
      }
   }
   __EXIT__
}


//////////////////////////////////////////////////////////////////////
function uiCreateDorf1AttDefInfoSign()
{
   var aContainer = null;
   var tTable = __TEST__($g("troops"));
   if ( tTable )
   {
      aContainer = tTable.firstElementChild.firstElementChild.firstElementChild;
   }

   uiAddAttDefInfoSign(tTable, aContainer, true);
}


