/////////////////////////////////////////////////////////////////////
/*
MerchantUnderwayInfo
{
   Res:       array[4]  - resources carrying
   ttArrival: number    - server timestamp for merchant arrival

   s_id:      number    - id of map source cell
   d_id:      number    - id of map destination cell

   xn:        number    - number of sheduled routes

   own_id:    number    - user ID for merchant owner
   rec_id:    number    - user ID for merchant recepient

   own_n:     string    - user name for merchant owner
   rec_n:     string    - user name for merchant recepient

   type:      char      - 'i' - incoming merchant
                          'o' - outgoing merchant
                          'r' - returning merchant
}
*/
function MerchantUnderwayInfo(ownerId, ownerName, recepientId, recepientName,
                              srcMapId, destMapId, ttArrival, res, xn, type)
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

   this.type = type;

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
// Convert merchantsUnderwayInfo to ResourcesEventsQueue
// Return: ResourcesEventsQueue (UNSORTED!)
function getMerchantsUnderwayResourcesEventsQueue(merchantsUnderwayInfo)
{
   var resourcesEventsQueue = [];
   var k, merchantUnderwayInfo, resourcesEvent;

   function resolveRoutes(merchantUnderwayInfo, bIncoming, halfRoutesDone)
   {
      if ( merchantUnderwayInfo.xn > 1 )
      {
         var race = TBU_RACE; // INACCURATE!
         var srcXY = id2xy(merchantUnderwayInfo.s_id);
         var destXY = id2xy(merchantUnderwayInfo.d_id);
         var qDist = getDistance(destXY[0], destXY[1], srcXY[0], srcXY[1]);

         for (var remain_route = 1; remain_route < merchantUnderwayInfo.xn; ++remain_route )
         {
            var xDist = qDist * (remain_route*2 - halfRoutesDone);
            var ttEnd = merchantUnderwayInfo.ttArrival + getMerchantTime(xDist, race) * 1000;
            resourcesEvent = new ResourcesEvent(merchantUnderwayInfo.Res, bIncoming, ttEnd, merchantUnderwayInfo);
            resourcesEventsQueue.push(resourcesEvent);
         }
      }
   }

   // copy incoming merchants to events and resolve sheduled routes only for own merchants
   // (its hard to detect race for other merchants and accurate calculate timestamps for events)
   for ( k = 0; k < merchantsUnderwayInfo.i.length; ++k )
   {
      merchantUnderwayInfo = merchantsUnderwayInfo.i[k];
      resourcesEvent = new ResourcesEvent(merchantUnderwayInfo.Res, true, merchantUnderwayInfo.ttArrival, merchantUnderwayInfo);
      resourcesEventsQueue.push(resourcesEvent);
      if ( merchantUnderwayInfo.own_id == TB3O.UserID )
      {
         resolveRoutes(merchantUnderwayInfo, true, 0);
      }
   }

   // copy outgoing merchants to events only if they has sheduled routes
   for ( k = 0; k < merchantsUnderwayInfo.o.length; ++k )
   {
      merchantUnderwayInfo = merchantsUnderwayInfo.o[k];
      resolveRoutes(merchantUnderwayInfo, false, 1);
   }


   // copy returning merchants to events if they has sheduled routes
   for ( k = 0; k < merchantsUnderwayInfo.r.length; ++k )
   {
      merchantUnderwayInfo = merchantsUnderwayInfo.r[k];
      resolveRoutes(merchantUnderwayInfo, false, 2);
   }

   return resourcesEventsQueue;
}


/////////////////////////////////////////////////////////////////////
// Merge together two arrays muArr1 and muArr2 with MerchantUnderwayInfo object
// Return: merged array. Returned array will be sorted in order of ttArrival increase
function mergeMerchantsUnderwayArrays(muArr1, muArr2)
{
   var i1 = 0, i2 = 0;
   var len1 = muArr1.length, len2 = muArr2.length;
   var ttArrival1,ttArrival2;
   var muMergedArr = [];

   do
   {
      ttArrival1 = (i1 < len1) ? muArr1[i1].ttArrival : Infinity;
      ttArrival2 = (i2 < len2) ? muArr2[i2].ttArrival : Infinity;
      // console.log(i1,ttArrival1,i2,ttArrival2);

      if ( ttArrival1 < ttArrival2 )
      {
         muMergedArr.push(muArr1[i1++]);
      }
      else if ( ttArrival2 !== Infinity )
      {
         muMergedArr.push(muArr2[i2++]);
      }

   } while ( ttArrival1 !== Infinity || ttArrival2 !== Infinity )

   return muMergedArr;
}

/*

var a1 = []
a1.push({ttArrival:100})

var a2 = []
a2.push({ttArrival:200})

var a3 = []
a3.push({ttArrival:100})
a3.push({ttArrival:200})
a3.push({ttArrival:300})

console.log(mergeMerchantsUnderwayArrays([],[]))
console.log(mergeMerchantsUnderwayArrays(a1,[]))
console.log(mergeMerchantsUnderwayArrays([],a2))
console.log(mergeMerchantsUnderwayArrays(a1,a2))
console.log(mergeMerchantsUnderwayArrays(a2,a1))
console.log('--------');
console.log(mergeMerchantsUnderwayArrays(a3,a1))
console.log(mergeMerchantsUnderwayArrays(a3,a2))
*/