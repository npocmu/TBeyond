/////////////////////////////////////////////////////////////////////
// return current date/time in server origin
function getServerTimeNow()
{
   var dtNow = new Date();
   dtNow.setTime(dtNow.getTime() - TB3O.localTimeOffset);
   return dtNow;
}

/////////////////////////////////////////////////////////////////////
// return current date/time in desired origin
function getDesiredTimeNow()
{
   var dtNow = new Date();
   dtNow.setTime(dtNow.getTime() - TB3O.localTimeOffset + TB3O.desiredTimeOffset);
   return dtNow;
}

/////////////////////////////////////////////////////////////////////
// return date/time converted into in desired origin
function getDesiredTime(dt)
{
   return ( dt === null ) ? null : new Date(toTimeStamp(dt) + TB3O.desiredTimeOffset);
}

/////////////////////////////////////////////////////////////////////
function __formatDateTimeRelative(dtNow, dtBase, secs, aFormat)
{
   return formatDateTime(dtNow, (secs === null) ? null : toDate(dtBase).getTime() + (secs * 1000), aFormat);
}

/////////////////////////////////////////////////////////////////////
// format date/time that relative to current time
function formatDateTimeRelativeToNow(secs, aFormat)
{
   var dtNow = getDesiredTimeNow();
   return __formatDateTimeRelative(dtNow, dtNow, secs, aFormat);
}

/////////////////////////////////////////////////////////////////////
// format date/time that relative to base time
function formatDateTimeRelativeToBase(dtBase, secs, aFormat)
{
   return __formatDateTimeRelative(getDesiredTimeNow(), dtBase, secs, aFormat);
}

/////////////////////////////////////////////////////////////////////
// format date/time that relative to time of page generation
function formatDateTimeRelative(secs, aFormat)
{
   return __formatDateTimeRelative(getDesiredTimeNow(), getDesiredTime(TB3O.serverTime), secs, aFormat);
}

//////////////////////////////////////////////////////////////////////
function getBuildingMaxLevel(villageId, gid)
{
   var maxLevel;
   switch ( gid )
   {
      case GID_LUMBER:
      case GID_CLAY:
      case GID_IRON:
      case GID_CROP:
      {
         var bIsCapital = (TBU_CAPITAL_ID == villageId); //is this the capital

         if ( !bIsCapital ) { maxLevel =  10; }
         else               { maxLevel = 100; } // no known restrictions except resources
         break;
      }
      case GID_SAWMILL:
      case GID_BRICKYARD:
      case GID_IRON_FOUNDRY:
      case GID_GRAIN_MILL:
      case GID_BAKERY:
         maxLevel = 5;
         break;
      case GID_CRANNY:
      case GID_BREWERY:
         maxLevel = 10;
         break;
      case GID_WW:
         maxLevel = 100;
         break;
      default:
         maxLevel = 20;
   }
   return maxLevel;
}

//////////////////////////////////////////////////////////////////////
// Calculate availability of something with known cost 
// Return array arr with structure:
// arr[0] - state
//          STA_NORES - can't be built (not enough resources)
//          STA_AVAIL - can be built 
//          STA_NPCAVAIL - can be built with NPC
//          STA_NOSTORE - can't be built (not enough capacity of granary/warehouse)
// arr[1] - time in secs when building can be built (if state STA_NORES or STA_NPCAVAIL)
//          (possible Infinity, if production of resource is negative),
//          0 if state STA_AVAIL and Infinity if state is STA_NOSTORE
// arr[2] - time in secs when building can be built using NPC (if state STA_NORES)
//          (possible Infinity, if production of resource is negative),
//          0 if state STA_AVAIL,STA_NPCAVAIL and Infinity if state is STA_NOSTORE
// arr[3] - array(5) for each resource [res1 need,...,unires need]  (copy of cost)
// arr[4] - array(5) for each resource [[res1 rest,sec to produce],...,[unires rest,sec to produce]]
//          only if state is not STA_AVAIL
function getAvailability(cost, resourcesInfo, bIsNPCAvailable)
{
   var state = STA_AVAIL;
   var nResTot = 0;
   var nEPpHTot = 0;
   var rneed = [0,0,0,0,0];
   var rt = Array(5);
   var maxTimeToProduce = 0;
   var timeToProduceForNPC = 0;
   var rest, ri;

   for ( ri = 0; ri < 4; ++ri )
   {
      rest = cost[ri] - resourcesInfo.Res[ri];
      rneed[ri] = cost[ri];
      rneed[4] += cost[ri];

      if ( rest <= 0 )
      {
         rt[ri] = [0,0];
      }
      else
      {
         var timeToProduce = getSecondsToProduce(rest,resourcesInfo.EPpH[ri]);
         if ( resourcesInfo.Cap[ri] < cost[ri] )
         {
            timeToProduce = maxTimeToProduce = timeToProduceForNPC = Infinity;
            state = STA_NOSTORE;
         }
         else
         {
            if ( state === STA_AVAIL ) { state = STA_NORES; }
            if ( maxTimeToProduce < timeToProduce ) { maxTimeToProduce = timeToProduce; }
         }

         rt[ri] = [Math.ceil(rest),timeToProduce];
      }
      nResTot += Math.floor(resourcesInfo.Res[ri]);
      nEPpHTot += resourcesInfo.EPpH[ri];
   }

   rest = rneed[4] - nResTot;

   if ( state === STA_NORES && rest <= 0 && bIsNPCAvailable ) { state = STA_NPCAVAIL; }

   if ( state === STA_NORES ) 
   { 
      timeToProduceForNPC = ( bIsNPCAvailable ) ? getSecondsToProduce(rest,nEPpHTot) : Infinity; 
   }

   rt[4] = [rest > 0 ? rest : 0, timeToProduceForNPC];

   if ( (state === STA_NORES || state === STA_NPCAVAIL) && resourcesInfo.EPpH[3] < 0 && isFinite(maxTimeToProduce) ) 
   { 
      // need to recalculate if negative production for crop
      ri = 3;
      rest =  cost[ri] - (resourcesInfo.Res[ri] + resourcesInfo.EPpH[ri] / 3600 * maxTimeToProduce);
      if ( rest > 0 )
      {
         //rt[ri] = [Math.ceil(rest),maxTimeToProduce];
         maxTimeToProduce = Infinity;
      }
   }

   return [state,maxTimeToProduce,timeToProduceForNPC,rneed,rt];
}

//////////////////////////////////////////////////////////////////////
function getAvailabilityRefreshTimeout(av,idx)
{
   var refreshTimeout = Infinity;

   function getTimeout(n)
   {
      if ( idx === n || idx === undefined )
      {
         var timeout = av[n];
         if ( timeout > 0 && timeout < refreshTimeout ) { refreshTimeout = timeout; }
      }
   }

   getTimeout(1);
   getTimeout(2);

   return refreshTimeout;
}


//////////////////////////////////////////////////////////////////////
// Calculate availability of building with given gid and level for desired village
// See getAvailability() for details.
// Add new state:
//          STA_MAX - can't be built (max level already reached)
function getBuildingAvailability(villageId, resourcesInfo, gid, crtLvl, bIsNPCAvailable)
{
   var retArr;
   var bData = bCost[gid];
   var cost;

   if ( bData )
   {
      cost = bData[crtLvl];
   }

   if ( crtLvl > getBuildingMaxLevel(villageId,gid) || !cost ) 
   {
      retArr = [STA_MAX,0,0,[],[]];
   }
   else
   {
      retArr = getAvailability(cost, resourcesInfo, bIsNPCAvailable);
   }
   return retArr;
}

//////////////////////////////////////////////////////////////////////
function getNPCAvailability(villageId)
{
   return TB3O.bIsNPCAvailable && isBuildingPresent(villageId,GID_MARKETPLACE);
}

//////////////////////////////////////////////////////////////////////
function getBuildingsAvailability(arrBA, idMin, idMax, villageId, arrB, resourcesInfo)
{
   var refreshTimeout = Infinity;
   var timeout;

   var id, refreshId = 0;
   var bIsNPCAvailable = getNPCAvailability(villageId);

   // collect build info
   for ( id = idMin; id <= idMax; ++id )
   {
      if ( arrB[id] )
      {
         var gid = arrB[id][0];
         var crtLevel = arrB[id][1];

         //select resource color
         arrBA[id] = getBuildingAvailability(villageId, resourcesInfo, gid, crtLevel + 1, bIsNPCAvailable);

         timeout = arrBA[id][1];
         if ( timeout > 0 && timeout < refreshTimeout ) { refreshTimeout = timeout; refreshId = id;}
         timeout = arrBA[id][2];
         if ( timeout > 0 && timeout < refreshTimeout ) { refreshTimeout = timeout; refreshId = id;}
      }
   }

   __DUMP__(arrB)
   __DUMP__(bIsNPCAvailable,refreshTimeout)
   __DUMP__(refreshId,arrBA[refreshId])

   return refreshTimeout;
}

//////////////////////////////////////////////////////////////////////
function formatCoords(x,y) { return "(" + x + "|" + y + ")"; }

//////////////////////////////////////////////////////////////////////
function normalizeCoords(x, y)
{
   if ( x < TB3O.WorldSize.minX ) { x += TB3O.WorldSize.sizeX; }
   else if ( x > TB3O.WorldSize.maxX ) { x -= TB3O.WorldSize.sizeX; }

   if ( y < TB3O.WorldSize.minY ) { y += TB3O.WorldSize.sizeY; }
   else if ( y > TB3O.WorldSize.maxY ) { y -= TB3O.WorldSize.sizeY; }

   return [x,y];
}

//////////////////////////////////////////////////////////////////////
function getCoordsDelta(x1, y1, x2, y2)
{
   var dX = Math.abs(x2 - x1);
   var dY = Math.abs(y2 - y1);

   dX = Math.min(dX, Math.abs(TB3O.WorldSize.sizeX - dX));
   dY = Math.min(dY, Math.abs(TB3O.WorldSize.sizeY - dY));

   return [dX,dY];
}

//////////////////////////////////////////////////////////////////////
// Get the mapID of the cell having the x,y coordinates
// mapID is sequental counter of map cells starting from top left corner of map.
// Numbering starting from 1 and increased by 1 when x coordinate grow and 
// y coordinate the same.
function xy2id(x, y)
{
   var arrXY = normalizeCoords(parseInt10(x),parseInt10(y));
   x = arrXY[0];
   y = arrXY[1];

   return (1 + (x - TB3O.WorldSize.minX) + 
          (TB3O.WorldSize.sizeX * Math.abs(y - TB3O.WorldSize.maxY)));
}

//////////////////////////////////////////////////////////////////////
//Inverse function for xy2id(x,y) => id2xy(vid) - fr3nchlover 
function id2xy(vid)
{
   var n = parseInt10(vid) - 1;
   var rst = n % TB3O.WorldSize.sizeX;
   var x = rst + TB3O.WorldSize.minX;
   var y = TB3O.WorldSize.maxY - ((n - rst) / TB3O.WorldSize.sizeX);
   return [x,y];
} 

//////////////////////////////////////////////////////////////////////
function isXYValid(x, y)
{
   if ( x !== '' && y !== '' ) 
   {
      return ( isIntValid(x) && x >= TB3O.WorldSize.minX && x <= TB3O.WorldSize.maxX && 
               isIntValid(y) && y >= TB3O.WorldSize.minY && y <= TB3O.WorldSize.maxY );
   }
   return false;
}

//////////////////////////////////////////////////////////////////////
function getDistance(sx1, sy1, sx2, sy2)
{
   var x1 = parseInt10(sx1);
   var y1 = parseInt10(sy1);
   var x2 = parseInt10(sx2);
   var y2 = parseInt10(sy2);

   var d = getCoordsDelta(x1, y1, x2, y2);

   var dist = Math.sqrt(Math.pow(d[0], 2) + Math.pow(d[1], 2));
   return dist;
}

//////////////////////////////////////////////////////////////////////
function getTroopTime(uix, arX)
{
   var unitSpeed = uc[arX[3] + uix][UCI_SPEED];
   return Math.round(arX[0] * 3600 / unitSpeed / arX[4] + 
                     arX[1] * 3600 / unitSpeed / arX[4] / arX[2]);
}

//////////////////////////////////////////////////////////////////////
// return time in seconds to travel qDist squares for xRace merchant 
function getMerchantTime(qDist, xRace)
{
   return Math.round(qDist * 3600 / TB3O.MerchantsSpeed[xRace] / TB3O.nMerchantSpeedFactor[TB3O.nServerType]);
}

//////////////////////////////////////////////////////////////////////
function getEventTimeStamp(ttServer, str)
{
   return (str.search(/(\d+:\d\d:\d\d)/) !== -1 ) ?
           ttServer + toSeconds(RegExp.$1) * 1000 : null;
}

//////////////////////////////////////////////////////////////////////
function getNewdidFromLink(aLink) 
{
   aLink.search(/\?newdid=(\d+)/);
   return RegExp.$1;
}

//////////////////////////////////////////////////////////////////////
function getNewdidFromChild(aParent) 
{
   var vNewdid = 0;
   var vLinkNodes = aParent.getElementsByTagName("a");

   if ( vLinkNodes.length )
   {
      vNewdid = getNewdidFromLink(vLinkNodes[0].getAttribute("href"));
   }
   return vNewdid;
}


/////////////////////////////////////////////////////////////////////
function setVillageRes(villageId, aDoc, ttServer)
{
   var resourcesInfo = getResourcesInfo2(villageId, aDoc, ttServer);
   if ( resourcesInfo.ttUpd )
   {
      TB3O.VillagesInfo[villageId].r = resourcesInfo;
   }
   __ASSERT__(resourcesInfo.ttUpd,"Can't get resources for village id=" + villageId)

   return !!resourcesInfo.ttUpd;
}

/////////////////////////////////////////////////////////////////////
function getArrowChar()
{
   //return (docDir[0] == 'right' ? '\u2190' : '\u2192');
   return (docDir[0] == 'right' ? '\u21D0' : '\u21D2')
}
