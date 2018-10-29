/////////////////////////////////////////////////////////////////////
function setDefaultStatisticsMenu()
{
   var statMenu = 
   { 
      1: ["Players",""],
      2: ["Villages",""],
      4: ["Alliances",""],
   };

   setGMcookieV2('statistics', statMenu); 
}

/////////////////////////////////////////////////////////////////////
function uiCreateSearchBarWidget()
{
   __ENTER__

   if ( TBO_SHOW_SEARCHBAR === "1" )
   {
      var sbc = getGMcookieV2('statistics');
      if ( sbc && sbc[1] )
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
               $df(300, xy[0], xy[1], "?", "searchbar", "searchbarTT", true, aForm);
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
   var aSF = $e("form", [['id', 'searchform'], 
                         ['action', 'statistiken.php?id=' + TBO_SEARCHBAR_TYPE], 
                         ['method', 'POST']]);
   var i1 = $e("input", [['id', 'searchopt'], ['type', 'hidden'], ['value', TBO_SEARCHBAR_TYPE]]);
   var i2 = $e("input", [['type', 'text'], ['maxlength', '20'], ['size', '10'], ['value', '']]);
   var i3 = $e("input", [['type', 'submit'], ['name', 'submit'], ['value', '?']]);

   i2.name = 'name';
   i2.className = 'text name';

   var s1 = $e("select", [['id', 'searchtype']]);
   addOption(s1,sbc,1);
   addOption(s1,sbc,2);
   addOption(s1,sbc,4);
   addOption(s1,sbc,31);
   addOption(s1,sbc,32);
   IF_TB3({{ if ( TB3O.T35 ) }}) { addOption(s1,sbc,8); } 
   s1.addEventListener('change', setSearchBarOption, false);
   aSF.appendChild(i1);
   aSF.appendChild(i2);
   aSF.appendChild(s1);
   aSF.appendChild(i3);
   return aSF;

   function addOption(sel,sbc,id)
   {
      if ( sbc[id] )
      {
         sel.add(new Option(sbc[id][0], id, false, (id === parseInt10(TBO_SEARCHBAR_TYPE))),null);
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
}
