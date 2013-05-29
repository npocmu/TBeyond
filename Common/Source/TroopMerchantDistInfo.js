//////////////////////////////////////////////////////////////////////
function getTroopsDetails(qDist, xRace, evTS)
{
   // distance without TS; distance with TS; TS speed factor; troop image ZERO index; multiplier for speed servers
   var arX = [qDist, 0, 1, getTroopIndexFromRace(xRace), TB3O.nTroopSpeedFactor[TB3O.nServerType]];

   if ( evTS ) //get the tournament square level
   {
      if ( TB3O.d2spB[6] !== 0 )
      {
         var tDist = IIF_TB4(20,30);
         arX[2] = 1 + parseInt10(TB3O.d2spB[6]) / 10; // tournament square speed factor
         if ( qDist > tDist )
         {
            arX[0] = tDist;
            arX[1] = qDist - tDist;
         }
      }
   } 
   return arX;
}

//////////////////////////////////////////////////////////////////////
// Create distance and time table
// was: addCoords, addMTime, addTTime, bAR, bDist
// now:
// options{
//    show_title
//    show_coords
//    show_arrival_time  - (bool) - show arrival time 
//    start_time  - (date/timestamp) - if absent show dynamic arrival time relative to current time
//                                     if present show static arrival time depending on start_time
//    show_merchant      - (bool) - show info about mercants
//    merchant_repeat    - (number) - if given then set number of routes for mercants
//    show_merchant_return-(bool)  - if given then show additional row when merchant went home
//    show_troops
//    show_all_races
//    race
// }
function uiCreateTroopsMerchantsDistTable(tableId, srcMapId, destMapId, options)
{
   //-------------------------------------------------------------
   function uiAddUnitTimeCells(aRow, cls, imgName, imgTxt, ttime, bSep)
   {
      var aClock = null;
      var aHourglass = null;
      if ( !options.show_troops )
      {
         aClock = I("clock");
         aHourglass = I("hourglass");
      }

      var aArrival = null;
      if ( options.show_arrival_time ) 
      {
         var aSpan = ( options.start_time )  ?
            $span(formatDateTimeRelativeToBase(options.start_time, ttime, 1)) :
            $span([['class','timereln'],['#ss',ttime],['#format',1]],formatDateTimeRelativeToNow(ttime, 1));

         aArrival = $td(['class', 'tbArrivalT' + cls], 
                        [aClock,aSpan]);
      }

      addChildren(aRow,[
         $td(['class', 'tbIco' + cls],     [imgTxt, I(imgName)]),
         $td(['class', 'tbTravelT' + cls], [aHourglass, $span(formatTimeSpan(ttime, 0) + " h")]),
         aArrival,
         bSep ? $td(['class', 'tbEmpty']) : null
      ]);
   }

   //-------------------------------------------------------------
   function uiAddMerchantTimeCells(aRow, x, dist, race, bSep)
   {
      uiAddUnitTimeCells(aRow, ( x > 0 ) ? ' tbMerc' : ' tbMercRet', ( x > 0 ) ? "merchant" : getBuildingIconName(), 
                        ( options.merchant_repeat && x > 0 ) ? x + "x " : null, 
                        getMerchantTime(dist, race), bSep);
   }

   //-------------------------------------------------------------
   function uiCreateMerchantsRow(x, xDist, arrRaces)
   {
      var aRow = $r(['class','tbInfo']);
      uiAddMerchantTimeCells(aRow, x, xDist, arrRaces[0], options.show_all_races);
      if ( options.show_all_races )
      {
         uiAddMerchantTimeCells(aRow, x, xDist, arrRaces[1], true);
         uiAddMerchantTimeCells(aRow, x, xDist, arrRaces[2], false);
      }
      return aRow;
   }


   //-------------------------------------------------------------
   function uiAddTroopTimeCells(aRow, troopDet, race, unitNo, bSep)
   {
      uiAddUnitTimeCells(aRow, '', "u" + (unitNo + troopDet[3]), null, getTroopTime(unitNo, troopDet), bSep);
   }

   //-------------------------------------------------------------
   function uiCreateCoords(XY)
   {
      return uiCreateIntMapLinkXY2(XY[0],XY[1]);
   }

   //-------------------------------------------------------------
   var aTb = null;
   var aRow, aCell;
   var srcXY;
   var destXY = id2xy(destMapId);
   var race = ( options.race === undefined ) ? TBU_RACE : options.race;
   var races = ( options.show_all_races ) ? 3: 1;
   var i;

   if ( srcMapId )
   {
      srcXY = id2xy(srcMapId);
   }
   else
   {
      srcXY = [TB3O.ActiveVillageInfo.x,TB3O.ActiveVillageInfo.y];
   }

   var qDist = getDistance(destXY[0], destXY[1], srcXY[0], srcXY[1]);

   if ( qDist !== 0 )
   {
      aTb = $t([['class','tbDistInfo'],['id',tableId]]);

      var columns = ( options.show_coords | options.show_arrival_time) ? 3 : 2;
      if ( options.show_all_races ) { columns = (( options.show_arrival_time ) ? 3 : 2) * 3 + 2; }

      //add destination coords
      if ( options.show_title )
      {
         aTb.appendChild($r($td([['class','tbCenter tbTitle'], ['colspan',columns]],uiCreateCoords(destXY))));
      }

      //add the distance row
      aRow = $r(null,[
                $td([['class', 'tbIco']], I("dist" + docDir[0].substr(0, 1))),
                $td([['class', 'tbDist']], qDist.toFixed(2)) ]);

      var coords_columns = columns - 2;
      if ( coords_columns )
      {
         aRow.appendChild(aCell = $td([['class', 'tbDist'],['colspan',columns-2]]));

         if ( options.show_coords )
         {
            addChildren(aCell,[
               uiCreateCoords(srcXY), " ",
               I("dist" + docDir[0].substr(0, 1)),
               " ", uiCreateCoords(destXY)
            ]);
         }
      }
      aTb.appendChild(aRow);


      if ( race !== '')
      {
         var arrRaces;
         switch ( race )
         {
            case avRace[0]:
               arrRaces = [race, avRace[1], avRace[2]];
               break;
            case avRace[1]:
               arrRaces = [race, avRace[0], avRace[2]];
               break;
            case avRace[2]:
               arrRaces = [race, avRace[0], avRace[1]];
               break;
         }

         if ( options.show_troops )
         {
            aTb.appendChild(aRow = $r());

            //add the clock/hourglass header row
            for ( i = 0; i < races; ++i )
            {
               aRow.appendChild($td(['class','tbEmpty']));
               aRow.appendChild($td(['class','tbCenter'],I("hourglass")));
               if (options.show_arrival_time) { aRow.appendChild($td(['class','tbCenter'],I("clock"))); }
               if ( i < (races - 1)) { aRow.appendChild($td()); }
            }
         }

         // add the merchant row
         if ( options.show_merchant )
         {
            var repCount = ( options.merchant_repeat ) ? options.merchant_repeat : 1;
            var xDist;
            for ( i = 0; i < repCount; ++i )
            {
               xDist = qDist * ( i*2 + 1 );
               aTb.appendChild(uiCreateMerchantsRow(repCount-i, xDist, arrRaces));
            }
            if ( options.show_merchant_return )
            {
               xDist = qDist * ( repCount*2 );
               aTb.appendChild(uiCreateMerchantsRow(-1, xDist, arrRaces));
            }
         }

         //add the troop rows
         if ( options.show_troops )
         {
            var iTT;
            var arX = getTroopsDetails(qDist, race, true);
            var arY = getTroopsDetails(qDist, arrRaces[1], false);
            var arZ = getTroopsDetails(qDist, arrRaces[2], false);

            for ( iTT = 0; iTT < 10; iTT++ )
            {
               aRow = $r(['class','tbInfo']);
               uiAddTroopTimeCells(aRow, arX, race, iTT, options.show_all_races);
               if ( options.show_all_races )
               {
                  uiAddTroopTimeCells(aRow, arY, arrRaces[1], iTT, true);
                  uiAddTroopTimeCells(aRow, arZ, arrRaces[2], iTT, false);
               }
               aTb.appendChild(aRow);
            }
         }
      }
   }
   return aTb;
}


//////////////////////////////////////////////////////////////////////
function uiAddTooltipForIntMapLink(aLink,mapId)
{
   function uiCreateTipForIntMapLink(mapId)
   {
      return uiCreateTroopsMerchantsDistTable("tb_distTT", null, mapId,
                                             { show_title:true, show_arrival_time:true,
                                               show_merchant:true, show_troops:true });
   }

   return uiAddTooltip(aLink,bind(uiCreateTipForIntMapLink,[mapId]));
}

//////////////////////////////////////////////////////////////////////
// append the distance and time for the case the user opened a cell from the map
function uiAddUnitsTimesTable(container)
{
   if ( container && isXYValid(TB3O.xCrt, TB3O.yCrt) )
   {
      var aTb = uiCreateTroopsMerchantsDistTable("tb_unitstime", null, xy2id(TB3O.xCrt, TB3O.yCrt),
                                                 {show_merchant:true, show_troops:true, show_all_races:true, 
                                                  show_coords:true});
      if ( aTb )
      {
         container.appendChild(aTb);
      }
   }
}


