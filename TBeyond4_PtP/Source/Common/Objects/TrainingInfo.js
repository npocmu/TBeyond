//////////////////////////////////////////////////////////////////////
function TrainingEvent(aName, dEnd, troopInfo, dFirst)
{
   this.name = trimBlanks(aName);
   this.tri  = troopInfo;  // troopInfo (array: [tix,count])
   this.ttEnd = toTimeStamp(dEnd);
   if ( dFirst )
   {
      this.ttFirst = toTimeStamp(dFirst);
   }

   return this;
}

/////////////////////////////////////////////////////////////////////
// information about one training building
function TrainingInfo()
{
   this.evA = [];          // array of TrainingEvent
   this.ttUpd = undefined; // date of information update (server timestamp when training building last visited)
   return this;
}

//  TrainingInfoColl is a collection that contain info about all training buildings in a village
// { gid1: trainingInfo1, ..., gidN: trainingInfoN }

//////////////////////////////////////////////////////////////////////
function getSecondsToTrainUnit(ttStart, trainingEvent)
{
   var secs;
   var count = trainingEvent.tri[1];
   if ( trainingEvent.ttFirst && count > 1 )
   {
      secs = (trainingEvent.ttEnd - trainingEvent.ttFirst)/(count-1)/1000;
   } 
   else
   {
      secs = (trainingEvent.ttEnd - ttStart)/count/1000;
   }

   return secs;
}


//////////////////////////////////////////////////////////////////////
// returns the miscellaneous info about training queues on time ttCurrent
// {
//    troopsNext:     [ [ttEvent, tix, name, gid] ]
//       ordered by <ttEvent>, <tix> is unique
//       Show time <ttEvent> and building <gid> where will be trained next
//       troop <tix>
//    troopsTotal:    [ [ttEvent, dur, avg, [tix,count], name] ]
//       ordered by <ttEvent>, <tix> is unique
//       Show time <ttEvent> when will be trained last troop <tix>, overall training duration in seconds,
//       average training duration in seconds  and overall count of units
//    buildingsUsage: [ [ttEvent, gid, [[[tix,count], name]] ] ]
//       ordered by <ttEvent>, <gid> is unique
//       Show time <ttEvent> when all troops will be trained in bulding <gid>
//       and queue wil be enhausted. Also show overall troops stat for this bulding.
// }    
function getTrainingInfoCollStats(trainingInfoColl, ttCurrent)
{
   function compareByEventTime(item1, item2) 
   {
      return compare(item1[0], item2[0]);
   }

   __ENTER__

   var i, j, gid; 
   var arrTroopsNext = [];     // [ [ttEvent, tix, name, gid] ]
   var arrTroopsTotal = [];    // [ [ttEvent, dur, avg, [tix,count], name] ]
   var arrBuildingsUsage = []; // [ [ttEvent, gid, [[tix,count], name] ] ]

   for ( gid in trainingInfoColl )
   {
      var buldingTroopsTotal = []; // [ [[tix,count], name] ]
      var trainingInfo = trainingInfoColl[gid];
      var ttStart = trainingInfo.ttUpd;
      var ttEnd;

      gid = parseInt10(gid);
      for ( i = 0; i < trainingInfo.evA.length; ++i )
      {
         var trainingEvent = trainingInfo.evA[i];
         var secs = getSecondsToTrainUnit(ttStart, trainingEvent);
         var msecs = secs * 1000;
         var ttFirst = trainingEvent.ttFirst;
         var tix = trainingEvent.tri[0];
         var count = trainingEvent.tri[1];
         var countForAvg = count;
         var durForAvg;
         var name = trainingEvent.name;
         var ttNextUnitTrained = 0;
         var remainsCount = 0;

         ttEnd = trainingEvent.ttEnd;
         var dur = (ttEnd - ttStart)/1000;

         if ( !ttFirst )
         {
            ttFirst = ttStart + msecs;
            durForAvg = dur;
         }
         else
         {
            countForAvg -= 1;  // don't count first unit in average time
            durForAvg = (ttEnd - ttFirst)/1000;
         }

         if ( ttCurrent < ttFirst )
         {
            ttNextUnitTrained = ttFirst;
            remainsCount = count;
         }
         else if ( ttCurrent < ttEnd )
         {
            ttNextUnitTrained = ttFirst + Math.ceil((ttCurrent - ttFirst) / msecs) * msecs;
            remainsCount = Math.round((ttEnd - ttNextUnitTrained) / msecs) + 1;
         }
         
         if ( ttNextUnitTrained )
         {
            for ( j = 0; j < arrTroopsNext.length; ++j )
            {
               if ( arrTroopsNext[j][1] === tix ) 
               {
                  if ( ttNextUnitTrained < arrTroopsNext[j][0] )
                  {
                     arrTroopsNext[j][0] = ttNextUnitTrained;
                     arrTroopsNext[j][2] = name;
                     arrTroopsNext[j][3] = gid;
                  }
                  break;
               }
            }
            if ( j === arrTroopsNext.length ) // arrTroopsNext item not found
            {
               arrTroopsNext.push([ttNextUnitTrained, tix, name, gid]);
            }
         }

         if ( remainsCount )
         {
            for ( j = 0; j < buldingTroopsTotal.length; ++j )
            {
               if ( buldingTroopsTotal[j][0][0] === tix ) 
               {
                  buldingTroopsTotal[j][0][1] += remainsCount;
                  break;
               }
            }
            if ( j === buldingTroopsTotal.length ) // item not found
            {
               buldingTroopsTotal.push([[tix,remainsCount], name]);
            }

            for ( j = 0; j < arrTroopsTotal.length; ++j )
            {
               if ( arrTroopsTotal[j][3][0] === tix ) 
               {
                  if ( ttEnd >  arrTroopsTotal[j][0] )
                  {
                     arrTroopsTotal[j][0] = ttEnd;
                  }
                  arrTroopsTotal[j][1] += dur;
                  if ( countForAvg )
                  {
                     arrTroopsTotal[j][2][0] += durForAvg;
                     arrTroopsTotal[j][2][1] += countForAvg;
                  }
                  arrTroopsTotal[j][3][1] += remainsCount;
                  break;
               }
            }
            if ( j === arrTroopsTotal.length ) // item not found
            {
               arrTroopsTotal.push([ttEnd, dur, ( countForAvg ) ? [durForAvg,countForAvg] : [0,0], 
                                   [tix,remainsCount], name]);
            }
         }
         ttStart = ttEnd;
      }

      if ( buldingTroopsTotal.length > 0 )
      {
         arrBuildingsUsage.push([ttEnd, gid, buldingTroopsTotal]);
      }
   }

   // calculate average duration
   for ( j = 0; j < arrTroopsTotal.length; ++j )
   {
      arrTroopsTotal[j][2] = ( arrTroopsTotal[j][2][1] === 0 ) ? 
                                null : 
                                arrTroopsTotal[j][2][0]/arrTroopsTotal[j][2][1];
   }


   arrTroopsNext.sort(compareByEventTime);
   arrTroopsTotal.sort(compareByEventTime);
   arrBuildingsUsage.sort(compareByEventTime);

   var result = { troopsNext: arrTroopsNext, troopsTotal: arrTroopsTotal, buildingsUsage: arrBuildingsUsage};

   __DUMP__(result)
   __EXIT__

   return result;
}

M4_DEBUG({{
/////////////////////////////////////////////////////////////////////
// Debug!!!
function getTrainingInfoView(trainingInfo) 
{
   function XY2Str(XY) { return formatCoords(XY[0],XY[1]); }

   var i,str;
   var dtNow = new Date();
   var ttStart = trainingInfo.ttUpd;

   str = "ttUpd = " + Date(trainingInfo.ttUpd) + "(" + trainingInfo.ttUpd + ")\n";
   str += "Total records = " + trainingInfo.evA.length + "\n";
   for (i = 0; i < trainingInfo.evA.length; ++i)
   {
      var event = trainingInfo.evA[i];
      str += "["+i+"] " + event.tri[1] + "*" + event.name + "(" + event.tri[0] + ")";
      str += ", start at: " + formatDateTime(dtNow, ttStart, 1);
      if ( event.ttFirst )
      {
         str += ", first unit trained at: " + formatDateTime(dtNow, event.ttFirst, 1);
      }
      str += ", end at: " + formatDateTime(dtNow, event.ttEnd, 1);

      var dur = getSecondsToTrainUnit(ttStart, event);

      str += ", per unit: " + dur.toFixed(2) + " (" + formatTimeSpan(dur, 0) + ")";

      str += "\n";

      ttStart = event.ttEnd;
   }
   return str;
}
}})


/////////////////////////////////////////////////////////////////////
// load (if need) TrainingInfo collection for given villageId, and return it
/*
function casheTrainingInfoColl(villageId)
{
   if ( !TB3O.VillagesTrInfo ) { TB3O.VillagesTrInfo = {}; }

   var trainingInfoColl = TB3O.VillagesTrInfo[villageId]; 
   if ( !trainingInfoColl )
   {
      __LOG__(8,"Cashe missing object 'Training Info' for village " + villageId + " ('" + TB3O.VillagesInfo[villageId].name + "')")
      trainingInfoColl = loadPersistentVillageObject("TrI", {}, villageId);
      TB3O.VillagesTrInfo[villageId] = trainingInfoColl;
   }
   return trainingInfoColl;
}

/////////////////////////////////////////////////////////////////////
function flushTrainingInfoColl(villageId)
{
   savePersistentVillageObject("TrI", TB3O.VillagesTrInfo[villageId], null, villageId);
}
*/
