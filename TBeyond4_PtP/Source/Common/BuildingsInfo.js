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
BuildingsInfo.prototype.exportB = function(bGetNewLevel)
{
   var arrB = [];
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
   }

   return arrB;
};

