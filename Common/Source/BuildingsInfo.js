//////////////////////////////////////////////////////////////////////
function getBuildingIdByGid(b, gid)
{
   var id; 
   for ( id = 1; id < b.length; ++id )
   {
      if ( b[id] && b[id][0] === gid ) { return id; }
   }
   return null;
}

//////////////////////////////////////////////////////////////////////
function getBuildingsTotalCost(b,costIndex)
{
   var val = 0;
   var id; 
   for ( id = 1; id < b.length; ++id )
   {
      if ( b[id] ) 
      {
         var cost = bCost[b[id][0]];
         var maxlvl = Math.min(b[id][1], cost.length - 1);
         val += cost[maxlvl][costIndex];
      }
   }
   return val;
}

//////////////////////////////////////////////////////////////////////
function getBuildingsCP(b)
{
   return getBuildingsTotalCost(b,4);
}

//////////////////////////////////////////////////////////////////////
function getBuildingsCropConsumption(b)
{
   return getBuildingsTotalCost(b,5);
}

//////////////////////////////////////////////////////////////////////
function getBuildingIconName(gid)
{
   return (gid ? "g" + gid + "Icon " : "") + "gebIcon";
}

//////////////////////////////////////////////////////////////////////
function getBuildingIcon(gid)
{
   return I(getBuildingIconName(gid));
}

//////////////////////////////////////////////////////////////////////
function isBuildingPresent(villageId, gid)
{
   var b = TB3O.VillagesInfo[villageId].b;
   var id = getBuildingIdByGid(b,gid);
   return ( !!id && b[id][1] > 0 );
}

//////////////////////////////////////////////////////////////////////
// fast check that some building can potentially train units
function canBuildingTrainUnits(gid)
{
   return isSomeOf(gid,GID_BARRACKS,GID_STABLE,GID_WORKSHOP,GID_RESIDENCE,GID_PALACE,GID_GREAT_BARRACK,GID_GREAT_STABLE,GID_TRAPPER);
}

//////////////////////////////////////////////////////////////////////
function BuildingInfo(title, name, id, gid, lvl, xy, imgSrc, imgClass)
{
   this.title = title;
   this.name = name;
   this.id = id;
   this.gid = gid;
   this.xy = xy;
   this.lvl = lvl;
   this.uplvl = lvl;
   this.imgSrc = imgSrc;
   this.imgClass = imgClass;
   
   return this;
}

/////////////////////////////////////////////////////////////////////
function BuildingsInfo() 
{
   this._ = [];
}

//////////////////////////////////////////////////////////////////////
BuildingsInfo.prototype.sortByName = function()
{
   this._.sort(function(d1, d2) 
              {
                 var res = compare(d1.name,d2.name);
                 if ( res === 0 ) { res = d1.lvl - d2.lvl; }
                 return res;
              });
};

//////////////////////////////////////////////////////////////////////
BuildingsInfo.prototype.getInfoById = function(id)
{
   var i, info = null;

   for ( i = 0; i < this._.length; ++i )
   {
      if ( this._[i].id  === id ) 
      {
         info = this._[i];
         break;
      }
   }
   return info;
};

//////////////////////////////////////////////////////////////////////
BuildingsInfo.prototype.syncWithBiP = function(arrBiP)
{
   var i;

   for ( i = 0; i < this._.length; ++i )
   {
      var gid = this._[i].gid; 
      var crtLevel = this._[i].lvl;

      if ( gid > 0 && crtLevel >= 0 )
      {
         this._[i].uplvl = getNewUpgradeLevel(arrBiP, this._[i].name, crtLevel);
      }
   }
};

//////////////////////////////////////////////////////////////////////
BuildingsInfo.prototype.exportB = function(arrB, bGetNewLevel)
{
   var i;

   for ( i = 0; i < this._.length; ++i )
   {
      var id = this._[i].id; 
      var gid = this._[i].gid; 
      var crtLevel = this._[i].lvl;

      if ( gid > 0 && crtLevel >= 0 )
      {
         arrB[id] = [gid, bGetNewLevel ? this._[i].uplvl : crtLevel];
      }
      else
      {
         delete arrB[id];
      }
   }
};

//////////////////////////////////////////////////////////////////////
// get common info about bulding
function getCommonBuildingInfo(gid, villageId, aDoc)
{
   var info = scanBuildingNameLevel(aDoc);
   if ( info )
   {
      T.saveLocaleString("BN_GID" + gid,info[0]);
   }
   return true;
}

//////////////////////////////////////////////////////////////////////
// proccess common info about bulding
function processBuilding(gid)
{
   getCommonBuildingInfo(gid, TB3O.ActiveVillageId, document);
}
