/////////////////////////////////////////////////////////////////////
/*
MarketRouteInfo
{
   Res:       array[4]  - resources carrying
   tsStart:   number    - seconds from midnight when route sheduled

   villageId: number    - id of destination village 

   xn:        number    - number of sheduled routes
}
*/
function MarketRouteInfo(villageId, tsStart, res, xn)
{
   this.d_vid = villageId; 

   this.Res  = res; 
   this.tsStart = tsStart;

   this.xn = xn;       

   return this;
}

/////////////////////////////////////////////////////////////////////
/*
  Persistable information about all sheduled routes movements from marketplace 
*/
function MarketRoutesInfo()
{
   this.routes = []; // array of MarketRouteInfo
   this.ttUpd = undefined; // date of information update (server timestamp when marketplace last visited)

   return this;
}

