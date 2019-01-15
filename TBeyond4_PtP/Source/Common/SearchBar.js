/////////////////////////////////////////////////////////////////////
function getDefaultStatisticsMenu()
{
   var statMenu = 
   { 
      0: "Players",
      1: "Alliances",
      2: "Villages",
      3: "Heroes",
   };

   if ( TB3O.ServerInfo.features.path_to_pandora )
   {
      statMenu[7] = 'Regions';
   }

   return statMenu;
}

/////////////////////////////////////////////////////////////////////
function setDefaultStatisticsMenu()
{
   savePersistentUserObject('statistics', getDefaultStatisticsMenu());
}

/////////////////////////////////////////////////////////////////////
function uiCreateSearchBarWidget()
{
   __ENTER__

   if ( TBO_SHOW_SEARCHBAR === "1" )
   {
      var sbc = loadPersistentUserObject('statistics', getDefaultStatisticsMenu());
      
      if ( Object.getOwnPropertyNames(sbc).length > 0 )
      {
         var aForm = uiCreateSearchForm(sbc);
         if ( aForm )
         {
            IIF_TB3({{
            if ( TBO_FLOAT_SEARCHBAR !== "1" )
            {
               var aPar = $e("p");
               aPar.setAttribute('style', 'margin-top:20px;');
               aPar.appendChild(aForm);
               TB3O.nTASb.appendChild(aPar);
            }
            else }})
            {
               var xy = TBO_SEARCHBAR_XY.split("|");
               $df(230, xy[0], xy[1], "?", "searchbar", "searchbarTT", true, aForm);
               if ( TBO_SEARCHBAR_STATE !== "1" ) { aForm.style.display = 'none'; }
            }
         }
      }
   }

   __EXIT__
}

/////////////////////////////////////////////////////////////////////
function uiCreateSearchForm(sbc)
{
   function addOption(sel, sbc, id)
   {
      if ( sbc[id] )
      {
         sel.add(new Option(sbc[id], id, false, (id === parseInt10(TBO_SEARCHBAR_TYPE))), null);
      }
   }

   function setSearchBarOption()
   {
      var searchType = $g("searchtype").value;
      TBO_SEARCHBAR_TYPE = '' + searchType;
      saveTBOptions();
      var i1 = $g("searchopt");
      if (i1) i1.value = searchType;
      var aSF = $g("searchform");
      if ( aSF ) { aSF.action = 'statistiken.php?id=' + searchType; }
   }

   var aSF = $e("form", [['id', 'searchform'], 
                         ['action', 'statistiken.php?id=' + TBO_SEARCHBAR_TYPE], 
                         ['method', 'POST']]);
   var i1 = $e("input", [['id', 'searchopt'], ['type', 'hidden'], ['value', TBO_SEARCHBAR_TYPE]]);
   var i2 = $e("input", [['type', 'text'], ['name', 'name'], ['class','text name'], ['maxlength', '20'], ['size', '10'], ['value', '']]);
   var i3 = $e("input", [['type', 'submit'], ['name', 'submit'], ['value', '?']]);
   var s1 = $e("select", [['id', 'searchtype'], ['change', setSearchBarOption, false]]);

   addOption(s1, sbc, 0);
   addOption(s1, sbc, 1);
   addOption(s1, sbc, 2);
   addOption(s1, sbc, 3);
   addOption(s1, sbc, 7);

   aSF.appendChild(i1);
   aSF.appendChild(i2);
   aSF.appendChild(s1);
   aSF.appendChild(i3);

   return aSF;
}
