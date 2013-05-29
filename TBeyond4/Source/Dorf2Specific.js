//////////////////////////////////////////////////////////////////////
//create the DIV for the coloured level numbers
function uiCreateDorf2CenterNumbers(arrBA)
{
   __ENTER__

   if ( TBO_SHOW_CENTER_NUMBERS === "1" && TBO_SHOW_COLOR_BLD_LEVELS === "1" )
   {
      var aLevelsContainer = $g("levels");
      if ( aLevelsContainer )
      {
         addClass(aLevelsContainer,"on");

         if ( TBO_SHOW_COLOR_BLD_LEVELS === "1" )
         {
            var lvlNodesList = aLevelsContainer.getElementsByTagName("div");
            var reId = /aid(\d+)/;
            for (var i = 0; i < lvlNodesList.length; ++i )
            {
               var aLvlNode = lvlNodesList.item(i);
               var id;

               if ( reId.exec(aLvlNode.className) )
               {
                  id = parseInt10(RegExp.$1);
               }
               else if ( hasClass(aLvlNode,"ww") )
               {
                  id = 26;
               }

               if ( isIntValid(id) )
               {
                  var bInfo = TB3O.BuildingsInfo.getInfoById(id);
                  if ( arrBA[id] )
                  {
                     uiSetCenterNumberState(aLvlNode, arrBA[id][0], bInfo.uplvl > bInfo.lvl);
                  }
               }
            }
         }
      }

   }
   __EXIT__
}

