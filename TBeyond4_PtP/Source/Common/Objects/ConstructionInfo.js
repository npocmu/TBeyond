/////////////////////////////////////////////////////////////////////
// information about village buildings
function ConstructionInfo()
{
   // Buildings in village
   // Array `b` have place for one record about each construction site.
   // Index is id of construction site.
   // Currently available 40 construction sites:
   //    Id
   //  1 - 18  is resource fields 
   // 19 - 38  is ordinary construction sites
   //    39    rally point construction site
   //    40    wall construction site
   // Each record if present is array [gid,level] of building data
   this.b = [];   
   this.ttUpd1 = undefined; // server timestamp when dorf1.php last visited ( b[1] - b[18] actualized)
   this.ttUpd2 = undefined; // server timestamp when dorf2.php last visited (b[19] - b[40] actualized)
   return this;
}

/////////////////////////////////////////////////////////////////////
function updateConstructionInfoBuildings(constructionInfo, b, idMin, idMax)
{
   for ( id = idMin; id <= idMax; id++ )
   {
      var data = b[id];
      if ( data )
      {
         constructionInfo.b[id] = data;
      }
      else
      {
         delete constructionInfo.b[id];
      }
   }
}

/////////////////////////////////////////////////////////////////////
function updateOuterConstructionInfo(constructionInfo, b, ttServer)
{
   updateConstructionInfoBuildings(constructionInfo, b, 1, 18);
   constructionInfo.ttUpd1 = ttServer;
}

/////////////////////////////////////////////////////////////////////
function updateInnerConstructionInfo(constructionInfo, b, ttServer)
{
   updateConstructionInfoBuildings(constructionInfo, b, 19, b.length-1);
   constructionInfo.ttUpd2 = ttServer;
}

/////////////////////////////////////////////////////////////////////
// return timestamp when all info was valid
// (min of both ttUpd1 and ttUpd2)
function getConstructionInfoTimestamp(constructionInfo)
{
   var ttUpd = undefined;
   if ( constructionInfo.ttUpd1 && constructionInfo.ttUpd2 )
   {
      ttUpd = Math.min(constructionInfo.ttUpd1,constructionInfo.ttUpd2);
   }
   return ttUpd;
}
