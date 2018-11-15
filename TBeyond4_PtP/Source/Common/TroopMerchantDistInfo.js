//////////////////////////////////////////////////////////////////////
function getTroopsDetails(qDist, xRace, evTS)
{
   // distance without TS; distance with TS; TS speed factor; troop image ZERO index; multiplier for speed servers
   var arX = [qDist, 0, 1, getTroopIndexFromRace(xRace), TB3O.nTroopSpeedFactor[TB3O.nServerType]];


   if ( evTS ) 
   {
      //get the tournament square level
      var tournamentSquareInfo = getBuildingInfoByGid(TB3O.ActiveVillageInfo.csi.b, GID_TOURNAMENT_SQUARE);

      if ( tournamentSquareInfo )
      {
         var tDist = IIF_TB4(20,30);
         arX[2] = 1 + tournamentSquareInfo.lvl / 10; // tournament square speed factor
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
// options{
//    tooltip            - (bool) - generate content for tooltip (avoid links and nested tips)
//    show_title         - (bool) - show title bar with destination coordinates
//    show_coords        - (bool) - show source and destination coordinates after distance
//    show_arrival_time  - (bool) - show arrival time 
//    start_time  - (date/timestamp) - if absent then show dynamic arrival time relative to current time
//                                     if present then show static arrival time depending on start_time
//    show_merchant      - (bool)  - show info about merchants
//    merchant_repeat    - (number) - if given then set number of routes for merchants
//    show_merchant_return-(bool)  - if given then show the additional row when the merchant comes home
//    show_troops          (bool)  - show info about troops
//    show_all_races       (bool)  - show info about all available races
//    race                 (string) - show info about troops and merchant for this race (by default - for player race)
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

      for (var i = 0; i < arrRaces.length; ++i )
      {
         uiAddMerchantTimeCells(aRow, x, xDist, arrRaces[i], i < (arrRaces.length - 1));
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
      var aNode;
      if ( options.tooltip )
      {
         aNode = $span(['class', 'tbCoord'], formatCoords(XY[0],XY[1]));
      }
      else
      {
         aNode = uiCreateIntMapLinkXY2(XY[0],XY[1]);
      }
      return aNode;
   }

   //-------------------------------------------------------------
   var aContent = null;
   var aRow, aCell;
   var srcXY;
   var destXY = id2xy(destMapId);
   var race = ( options.race === undefined ) ? TBU_RACE : options.race;
   var races = ( options.show_all_races ) ? TB3O.AvailableRaces.length : 1;
   var i;

   if ( srcMapId )
   {
      srcXY = id2xy(srcMapId);
   }
   else
   {
      srcXY = [TB3O.ActiveVillageInfo.x,TB3O.ActiveVillageInfo.y];
   }

   //__DUMP__(srcXY, destXY, options, race, races)

   var qDist = getDistance(destXY[0], destXY[1], srcXY[0], srcXY[1]);

   if ( qDist !== 0 )
   {
      var aTb = $t([['class','tbDistInfo'],['id',tableId]]);
      if ( options.tooltip )
      {
         aContent = $div(['class','tbTip']);

         //add destination coords
         if ( options.show_title )
         {
            aContent.appendChild($div(['class', 'tbHeading tbCenter'], uiCreateCoords(destXY)));
         }

         aContent.appendChild(aTb);
      }
      else
      {
         aContent = aTb;
      }

      var columns = ( (options.show_coords | options.show_arrival_time) ? 3 : 2 ) * races + races-1;

      //add the distance row
      aRow = $r(null,[
                $td([['class', 'tbIco']], I("tbiDist")),
                $td([['class', 'tbDist']], qDist.toFixed(2))]);

      var coords_columns = columns - 2;
      if ( coords_columns )
      {
         aRow.appendChild(aCell = $td([['class', 'tbDist'],['colspan',columns-2]]));

         if ( options.show_coords )
         {
            addChildren(aCell,[
               uiCreateCoords(srcXY), " ",
               I("tbiCoords"),
               " ", uiCreateCoords(destXY)
            ]);
         }
      }
      aTb.appendChild(aRow);


      if ( race !== '' )
      {
         var arrRaces = [race];

         if ( options.show_all_races )
         {
            for ( i = 0; i < TB3O.AvailableRaces.length; ++i )
            {
               var otherRace = TB3O.AvailableRaces[i];
               if ( arrRaces.indexOf(otherRace) === -1 )
               {
                  arrRaces.push(otherRace);
               }
            }
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
            var arX = [];
            for ( i = 0; i < races; ++i )
            {
               arX[i] = getTroopsDetails(qDist, arrRaces[i], i===0 );
            }

            for ( iTT = 0; iTT < 10; iTT++ )
            {
               aRow = $r(['class','tbInfo']);
               for ( i = 0; i < races; ++i )
               {
                  uiAddTroopTimeCells(aRow, arX[i], arrRaces[i], iTT, i < (races - 1));
               }
               aTb.appendChild(aRow);
            }
         }
      }
   }
   return aContent;
}


//////////////////////////////////////////////////////////////////////
function uiAddTooltipForIntMapLink(aLink, mapId)
{
   function uiCreateTipForIntMapLink(mapId)
   {
      return uiCreateTroopsMerchantsDistTable("tb_distTT", null, mapId,
                                             { show_title:true, show_arrival_time:true,
                                               show_merchant:true, show_troops:true, tooltip:true });
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


