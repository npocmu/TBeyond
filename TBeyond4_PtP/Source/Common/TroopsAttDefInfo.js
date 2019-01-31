//////////////////////////////////////////////////////////////////////
function getTroopsInfo(tNTroops)
{
   var troopsInfo = [];

   if ( tNTroops && tNTroops.tBodies ) 
   {
      var i;

      var aRows = tNTroops.tBodies[0].rows;

      for ( i = 0; i < aRows.length; i++ )
      {
         var aRow = aRows[i];
         if ( aRow.cells.length >= 2 )
         {
            var image = $nth_tag(aRow.cells[0],"img");

            if ( image )
            {
               var tix = getTroopIndexTitleFromImg(image)[0];
               var count = parseInt10(aRow.cells[1].textContent);
               troopsInfo.push([tix,count]);
            }
         }
      }
   }
   return troopsInfo.length > 0 ? troopsInfo : null;
}

//////////////////////////////////////////////////////////////////////
function getMinMark(bMin)
{
   return ( bMin ) ? $e("sup","*") : null;
}

//////////////////////////////////////////////////////////////////////
// troops statistics in one column table (for tooltips)
function uiCreateTroopsAttDefInfoTable(id, troopsInfo, bMin)
{
   var troopsStats = calcTroopsTotals(troopsInfo);
   var footnote = null;
   if ( bMin )
   {
      footnote = $e("tfoot",$r($td([['colspan','2']],"* = " + T('MIN'))));
   }

   var attrsIco = ['class','tbIco'];
   var attrsVal = ['class','tbVal'];

   var aTb = $t([['id',id], ['class','tbAttDefInfo']],
   [
      $e("thead",$r($th([['colspan','2']],T('STAT')))),
      footnote,
      $e("tbody",null,[
         $r(null, [$td(attrsIco,[I("att_all"),getMinMark(bMin)]),$td(attrsVal,$ls(troopsStats.base.off))]),
         $r(null, [$td(attrsIco,[I("def_i"),getMinMark(bMin)]),  $td(attrsVal,$ls(troopsStats.base.def_i))]),
         $r(null, [$td(attrsIco,[I("def_c"),getMinMark(bMin)]),  $td(attrsVal,$ls(troopsStats.base.def_c))]),
         $r(null, [$td(attrsIco,I("r5")),                        $td(attrsVal,$ls(troopsStats.cc))])
      ])
   ]);

   return aTb;
}

//////////////////////////////////////////////////////////////////////
function uiCreateTroopsAttDefTable4Tip(troopsInfo, bMin)
{
   var aTbl = uiCreateTroopsAttDefInfoTable(null, troopsInfo, bMin);
   return ( aTbl ) ? $div(['class', 'tbTip'], aTbl) : null;
}


//////////////////////////////////////////////////////////////////////
// fill troops statistics in wide table
function uiFillTroopsAttDefInfoTable2(aTb, troopsInfo)
{
   var troopsStats = calcTroopsTotals(troopsInfo);
   aTb.rows[1].cells[0].childNodes[1].textContent = $ls(troopsStats.base.off); // attack power
   aTb.rows[1].cells[1].childNodes[1].textContent = $ls(troopsStats.base.def_i); // def power infantry
   aTb.rows[1].cells[2].childNodes[1].textContent = $ls(troopsStats.base.def_c); // def power cavalry
   aTb.rows[2].cells[0].childNodes[1].textContent = ( isFinite(troopsStats.speed) ) ? $ls(troopsStats.speed) : "?"; // min speed
   aTb.rows[2].cells[1].childNodes[1].textContent = $ls(troopsStats.cap); // load capacity
   aTb.rows[2].cells[2].childNodes[1].textContent = $ls(troopsStats.cc); // crop consumption
}

//////////////////////////////////////////////////////////////////////
// troops statistics in wide table
function uiCreateTroopsAttDefInfoTable2(id, troopsInfo, title, bMin)
{
   var attrsVal = ['class','tbVal'];
   var aTb = $t([['id',id], ['class', 'tb3tb tbAttDefInfo2']],
   [
      $e("thead", $r( $th([['colspan', '3']], [title, (bMin ? " (* = " + T('MIN').toLowerCase() + ")":"")]))),
      $r(null,
      [
         $td([['style', 'width:33%;']], [I("att_all"),$span(attrsVal),getMinMark(bMin)]),
         $td([['style', 'width:33%;']], [I("def_i"),  $span(attrsVal),getMinMark(bMin)]),
         $td([['style', 'width:34%;']], [I("def_c"),  $span(attrsVal),getMinMark(bMin)])
      ]),
      $r(null,
      [
         $td(null, [I("speed" + docDir[0].substring(0,1)),$span(attrsVal)]),
         $td(null, [I("capacity"),$span(attrsVal)]),
         $td(null, [I("r5"),$span(attrsVal)])
      ])
   ]);

   uiFillTroopsAttDefInfoTable2(aTb, troopsInfo);

   return aTb;
}

//////////////////////////////////////////////////////////////////////
function uiAddAttDefInfoSign(tTable, aContainer, bMin)
{
   __ENTER__

   if ( tTable && aContainer )
   {
      var troopsInfo = getTroopsInfo(tTable);

      if ( troopsInfo )
      {
         addChildren(aContainer,[" ",I("tbiInfo")]);
         uiAddTooltip(aContainer,bind(uiCreateTroopsAttDefTable4Tip,[troopsInfo,bMin]));
      }
   }

   __EXIT__
}
