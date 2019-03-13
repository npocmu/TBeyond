//////////////////////////////////////////////////////////////////////
// Generate DOM nodes to represent troopInfo as:
//  count x icon
//
// options{
//    show_tip          - (bool,true) - tooltip will shown when user hover mouse on generated nodes
//    show_count_always - (bool,true) - if falsy then count will displayed only if it > 1.
// }
function uiCreateTroopInfoCounter(troopInfo, options)
{
   var tix = troopInfo[0];
   var count = troopInfo[1];
   
   options = options || {};
   var bShowTip = ( options.show_tip === undefined ) ? true : !!options.show_tip;
   var bShowCountAlways = ( options.show_count_always === undefined ) ? true : !!options.show_count_always;

   var aCountNode = $span(['class', 'tbCount']);

   if ( count > 1 || bShowCountAlways ) 
   {
      addChildren(aCountNode, [$span(['class', 'tbVal'], $ls(count)), "\u00A0\u00D7\u00A0"]);
   }
   addChildren(aCountNode, getTroopImage(tix));

   if ( bShowTip )
   {
      var tipTroopInfo = [tix, (count > 0) ? count : 1];
      uiAddTooltip(aCountNode,bind(uiCreateTroopInfoTooltip,[tipTroopInfo,""]));
   }

   return aCountNode;
}

//////////////////////////////////////////////////////////////////////
// create Troop Info table 
// troopInfo = [tix,count]
function uiCreateTroopInfoTooltip(troopInfo, title/*opt*/, villageId/*opt*/)
{
   var troopsStats = calcTroopsTotals([troopInfo], villageId);

   var aTb = $t(['id',"tb_TITT"],
   [
      $e("thead",
         $r(
            $th(['colspan', '6'],
                [uiCreateTroopInfoCounter(troopInfo, {show_tip:false, show_count_always:false}), 
                 ( isStrValid(title) ) ? " - " + title : null]))),
      $e("tbody",null,
      [
         $r(null,
         [
            //attack power row
            $td(['class', 'tbIco tb3r1'], I("att_all")),
            $td(['class', 'tb3r1 tb3c1'], $ls(troopsStats.base.off)),
            //def power infantry row
            $td(['class', 'tbIco tb3r1'], I("def_i")),
            $td(['class', 'tb3r1 tb3c2'], $ls(troopsStats.base.def_i)),
            //def power cavalry row
            $td(['class', 'tbIco tb3r1'], I("def_c")),
            $td(['class', 'tb3r1 tb3c3'], $ls(troopsStats.base.def_c))
         ]),
         $r(null,
         [
            //speed
            $td(['class', 'tbIco tb3r2'], I("speed" + docDir[0].substring(0,1))),
            $td(['class', 'tb3r2 tb3c1'], ( troopsStats.speed > 0 ) ? $ls(troopsStats.speed) : "?" ),
            //can carry
            $td(['class', 'tbIco tb3r2'], I("capacity")),
            $td(['class', 'tb3r2 tb3c2'], $ls(troopsStats.cap)),
            //crop consumption
            $td(['class', 'tbIco tb3r2'], I("r5")),
            $td(['class', 'tb3r2 tb3c3'], $ls(troopsStats.cc))
         ])
      ])   
   ]);

   // Training cost table
   var aTbRes = null;
   var totRes = totalResources(troopsStats.cost);
   if ( totRes )
   {
      var aBody;
      var ri;

      aTbRes = $t(['class', 'tbCost'],
      [
         $e("thead",
            $r(
               $th(['colspan', '2'],T("TCOST")))),
         aBody = $e("tbody")
      ]);

      for ( ri = 0; ri < 4; ++ri )
      {
         aBody.appendChild(
            $r(null,
            [
               $td(['class', 'tbIco'], getResourceImage(ri)),
               $td(['class', 'tbVal'], $ls(troopsStats.cost[ri]))
            ])
         );
      }
      aBody.appendChild(
         $r(['class', 'tbTotal'],
         [
            $td(['class', 'tbIco'], I("r0")),
            $td(['class', 'tbVal'], $ls(totRes))
         ])
      );
   }

   return $div(['class', 'tbTip'], [aTb, (aTbRes) ? $e("hr") : null, aTbRes]);
}

//////////////////////////////////////////////////////////////////////
// Same as uiCreateTroopInfoTooltip
// differ only in arguments tInfo = [tix, title]
function uiCreateTroopInfoTooltip2(tInfo, count, villageId/*opt*/)
{
   return uiCreateTroopInfoTooltip([tInfo[0],count],tInfo[1], villageId);
}

//////////////////////////////////////////////////////////////////////
// add tooltips for show troop info
function uiAddTroopInfoTooltips(parent)
{
   __ENTER__

   var arImg = parent.getElementsByTagName("IMG");
   var i, tImg, tInfo, xR, tCell;

   for ( i = 0; i < arImg.length; ++i )
   {
      tImg = arImg[i];
      tInfo = getTroopIndexTitleFromImg(tImg);
      if (tInfo[0] > 0 && tInfo[0] <= TB3O.nMaxTroopIndex)
      {
         if ( tInfo[1] === '' && TB3O.pageSelector === "dorf1" )
         {
            //for the dorf1.php page there is no title attribute to the image
            xR = tImg.parentNode;
            if ( xR )
            {
               if ( xR.getAttribute("href") )
               {
                  xR = xR.parentNode;
                  if ( xR ) { xR = xR.parentNode; }
               }
               else
               { 
                  xR = xR.parentNode;
               }

               if ( xR )
               {
                  try
                  {
                     tCell = xR.cells[2];
                     if (tCell) { tInfo[1] = tCell.textContent; }
                  }
                  __CATCH__
               }
            }
         }
         tImg.removeAttribute('title');
         uiAddTooltip(tImg,bind(uiCreateTroopInfoTooltip2,[tInfo,1]));
      }
   }

   __EXIT__
}
