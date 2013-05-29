/////////////////////////////////////////////////////////////////////
// return [index of troop, title] from valid image
// index of troop is NaN if can't be determined
function getTroopIndexTitleFromImg(tImg)
{
   var tix = Number.NaN;

   IF_TB3({{
   if ( tImg.src.match(/img\/un\/u\/(\d+)\.gif/) ) 
   {
      tix = parseInt10(RegExp.$1);
   }
   else}})
   {
      var imgCN = tImg.className;
      if ( imgCN && imgCN.indexOf("unit") !== -1 && imgCN.search(/u(\d+)/) !== -1 )
      {
         tix = parseInt10(RegExp.$1);
      }
   }

   return [tix, tImg.title];
}

//////////////////////////////////////////////////////////////////////
function getTroopImage(tix)
{
   return ( isIntValid(tix) ) ?  I("u" + tix) :  I("uhero");
}

//////////////////////////////////////////////////////////////////////
function getUnitImage(uix)
{
   var img = null;

   if ( TBU_RACE !== '' )
   {
      img = getTroopImage(uix + TBU_RACE_DELTA);
   }
   return img;
}

/////////////////////////////////////////////////////////////////////
function getRaceIndexFromTroopIndex(tix)
{
   return Math.floor(tix/10);
}

/////////////////////////////////////////////////////////////////////
function getRaceFromTroopIndex(tix)
{
   return avRace[getRaceIndexFromTroopIndex(tix)];
}

/////////////////////////////////////////////////////////////////////
function getScoutTroopIndex(race)
{
   return ifEqual(race, 'Romans',4, 'Teutons',14, 'Gauls',23, 0);
}

//////////////////////////////////////////////////////////////////////
function getTroopIndexFromRace(race) 
{
   return ifEqual(race, 'Teutons',11, 'Gauls',21, 1);
}

//////////////////////////////////////////////////////////////////////
function getTroopNoByIndex(troopsInfo, tix)
{
   var troopNo;
   for ( troopNo = 0; troopNo < troopsInfo.length; ++troopNo )
   {
      if ( troopsInfo[troopNo][0] === tix )
      {
         return troopNo;
      }
   }

   return undefined;
}


//////////////////////////////////////////////////////////////////////
// troops statistics
function calcTroopsTotals(troopsInfo)
{
   var tNinfo = [0,0,0,0,0,0,0,0,Infinity,0];
   var i,j;
   for ( i = 0; i < troopsInfo.length; i++ )
   {
      var tix = troopsInfo[i][0];
      var count = troopsInfo[i][1];
      if ( count > 0 )
      {
         if ( isIntValid(tix) )
         {
            for ( j = 0; j <= 9; ++j ) 
            {
               if ( j === UCI_SPEED ) // speed
               {
                  var speed = uc[tix][UCI_SPEED] * TB3O.nTroopSpeedFactor[TB3O.nServerType];
                  tNinfo[UCI_SPEED] = Math.min(tNinfo[UCI_SPEED],speed); 
               }
               else
               {
                  tNinfo[j] += count * uc[tix][j];
               }
            }
         }
         else 
         {
            tNinfo[UCI_CC] += count * 6; //heroes
         }
      }

   }

   return tNinfo;
}

//////////////////////////////////////////////////////////////////////
function getUnitsCountInfoTotals()
{
   var villageId;
   var sumTT = fillArray(new Array(TG_UNITS_COUNT),0);

   for ( villageId in TB3O.VillagesInfo )
   {
      var unitsCountInfo = TB3O.VillagesInfo[villageId].uci;
      if ( unitsCountInfo.ttUpd )
      {
         accumulateArray(sumTT, unitsCountInfo.ut);
      }
   }

   return sumTT;
}

//////////////////////////////////////////////////////////////////////
function getTroopInfoFromUnitCount(race, uix, unitCount)
{
   return [getTroopIndexFromRace(race) + uix, unitCount];
}

//////////////////////////////////////////////////////////////////////
function getTroopsInfoFromUnitsCount(race, arrUnits)
{
   var troopsInfo = [];
   var i, tix = getTroopIndexFromRace(race);

   for ( i = 0; i < TG_UNITS_COUNT; ++i )
   {
      if ( arrUnits[i] > 0 )
      {
         troopsInfo.push([tix+i,arrUnits[i]]);
      }
   }
   return troopsInfo;
}

