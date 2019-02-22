/////////////////////////////////////////////////////////////////////
/*
MerchantUnderwayInfo
{
   Res:       array[4]  - resources carrying
   ttArrival: number    - server timestamp for merchant arrival

   s_id:      number    - id of map source cell
   d_id:      number    - id of map destination cell

   xn:        number    - number of scheduled routes

   own_id:    number    - user ID for merchant owner
   rec_id:    number    - user ID for merchant recepient

   own_n:     string    - user name for merchant owner
   rec_n:     string    - user name for merchant recepient
}
*/
function MerchantUnderwayInfo(ownerId, ownerName, recepientId, recepientName,
                              srcMapId, destMapId, ttArrival, res, xn)
{
   this.Res  = res; 
   this.ttArrival = ttArrival;

   this.s_id = srcMapId;  
   this.d_id = destMapId; 

   this.xn = xn;       

   this.own_id = ownerId; 
   this.rec_id = recepientId; 

   this.own_n = ownerName; 
   this.rec_n = recepientName; 

   return this;
}

/////////////////////////////////////////////////////////////////////
/*
  Persistable information about all merchant movements from marketplace 
*/
function MerchantsUnderwayInfo()
{
   this.i = []; // incoming merchants in order of ttArrival increase

   this.o = []; // outgoing merchants in order of ttArrival increase
                // this merchants always belonging to the village for which MerchantsUnderwayInfo collected

   this.r = []; // returning merchants in order of ttArrival increase
                // this merchants always belonging to the village for which MerchantsUnderwayInfo collected

   this.ttUpd = undefined; // date of information update (server timestamp when marketplace last visited)

   return this;
}

/////////////////////////////////////////////////////////////////////
// Convert scheduled trade routes to events
function _getTradeRoutesEventsQueue(villageId, resourcesEventsQueue)
{
   var srcVillageId;
   var marketRoutesInfo;
   var ttServer = toTimeStamp(TB3O.serverTime);
   var dtMidnight = new Date(TB3O.serverTime.getYear(),TB3O.serverTime.getMonth(),TB3O.serverTime.getDay());
   var ttMidnight = toTimeStamp(dtMidnight);

   //var destXY = id2xy(merchantUnderwayInfo.d_id);

   for ( srcVillageId in TB3O.VillagesInfo )
   {
      if ( srcVillageId != villageId )
      {
         marketRoutesInfo = TB3O.VillagesMRInfo.load(srcVillageId);
         if ( marketRoutesInfo.routes && marketRoutesInfo.ttUpd !== undefined )
         {
            for ( var i = 0; i < marketRoutesInfo.routes.length; ++i )
            {
               var marketRouteInfo = marketRoutesInfo.routes[i];
               if ( marketRouteInfo.d_vid == villageId && marketRouteInfo.enabled )
               {
                  var ttStart = ttMidnight + marketRouteInfo.tsStart*1000;
                  if ( ttStart > ttServer )
                  {
                      
                     __DUMP__(marketRouteInfo)
                     /*
                     var qDist = getDistance(destXY[0], destXY[1], srcXY[0], srcXY[1]);
                     var ttEnd = ttStart + getMerchantTime(xDist, race) * 1000;
                     var resourcesEvent = new ResourcesEvent(marketRouteInfo.Res, bIncoming, false, ttEnd, marketRouteInfo);
                     resourcesEventsQueue.push(resourcesEvent);
                     *
                  }
               }
            }
         }
      }
   }
}

/////////////////////////////////////////////////////////////////////
// Convert merchantsUnderwayInfo to ResourcesEventsQueue
// Return: ResourcesEventsQueue (UNSORTED!)
function getVillageResourcesEventsQueue(villageId)
{
   var resourcesEventsQueue = [];
   var ttServer = toTimeStamp(TB3O.serverTime);
   var merchantsUnderwayInfo = TB3O.VillagesMUInfo.load(villageId);
   var mapIdDict = getVillagesMapIdDict(TB3O.VillagesInfo);

   function resolveRoutes(merchantUnderwayInfo, bIncoming, halfRoutesDone)
   {
      if ( merchantUnderwayInfo.xn > 1 )
      {
         var villageInfo = TB3O.VillagesInfo[mapIdDict[merchantUnderwayInfo.s_id]];
         var race = getVillageRace(villageInfo);
         var srcXY = id2xy(merchantUnderwayInfo.s_id);
         var destXY = id2xy(merchantUnderwayInfo.d_id);
         var qDist = getDistance(destXY[0], destXY[1], srcXY[0], srcXY[1]);

         for (var remain_route = 1; remain_route < merchantUnderwayInfo.xn; ++remain_route )
         {
            var xDist = qDist * (remain_route*2 - halfRoutesDone);
            var ttEnd = merchantUnderwayInfo.ttArrival + getMerchantTime(xDist, race) * 1000;
            if ( ttEnd > ttServer )
            {
               var resourcesEvent = new ResourcesEvent(merchantUnderwayInfo.Res, bIncoming, false, ttEnd, merchantUnderwayInfo);
               resourcesEventsQueue.push(resourcesEvent);
            }
         }
      }
   }

   var k, merchantUnderwayInfo, resourcesEvent;

   if ( merchantsUnderwayInfo.ttUpd !== undefined )
   {
      // copy incoming merchants to events and resolve scheduled routes only for own merchants
      // (its hard to detect race for other merchants and accurate calculate timestamps for events)
      for ( k = 0; k < merchantsUnderwayInfo.i.length; ++k )
      {
         merchantUnderwayInfo = merchantsUnderwayInfo.i[k];

         if ( merchantUnderwayInfo.ttArrival > ttServer )
         {
            resourcesEvent = new ResourcesEvent(merchantUnderwayInfo.Res, true, true, merchantUnderwayInfo.ttArrival, merchantUnderwayInfo);
            resourcesEventsQueue.push(resourcesEvent);
         }

         if ( merchantUnderwayInfo.own_id == TB3O.UserID )
         {
            resolveRoutes(merchantUnderwayInfo, true, 0);
         }
      }

      // copy outgoing merchants to events only if they has scheduled routes
      for ( k = 0; k < merchantsUnderwayInfo.o.length; ++k )
      {
         merchantUnderwayInfo = merchantsUnderwayInfo.o[k];
         resolveRoutes(merchantUnderwayInfo, false, 1);
      }

      // copy returning merchants to events if they has scheduled routes
      for ( k = 0; k < merchantsUnderwayInfo.r.length; ++k )
      {
         merchantUnderwayInfo = merchantsUnderwayInfo.r[k];
         resolveRoutes(merchantUnderwayInfo, false, 2);
      }
   }

   _getTradeRoutesEventsQueue(villageId, resourcesEventsQueue);

   return resourcesEventsQueue;
}
