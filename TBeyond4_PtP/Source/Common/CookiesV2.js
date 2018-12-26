//////////////////////////////////////////////////////////////////////
// FireFox+GM specific
/*
var persistence = new Persistence(
   {   
      serialize: uneval, 
      deserialize: function (str) { return eval(str);} 
   },
   {
      getItem: function(key) { var val = GM_getValue(key); return (val===undefined) ? null : val;},
      setItem: GM_setValue,
      removeItem: GM_deleteValue
   }
);

//////////////////////////////////////////////////////////////////////
persistence.getUserSpecificNS = function()
{
   return TB3O.gServer + '_' + TB3O.UserID;
};
*/


//////////////////////////////////////////////////////////////////////
// standard way
// current problem: date deserialization
var persistence = new Persistence({serialize: JSON.stringify, deserialize: JSON.parse },
   {
      common_prefix: "userscripts.VES_NAME.",
      getItem: function(key) { return localStorage.getItem(this.common_prefix + key); },
      setItem: function(key,val) { return localStorage.setItem(this.common_prefix + key,val); },
      removeItem: function(key) { return localStorage.removeItem(this.common_prefix + key); }
   }
);

//////////////////////////////////////////////////////////////////////
persistence.getUserSpecificNS = function()
{
   return TB3O.UserID;
};


//////////////////////////////////////////////////////////////////////
persistence.getVillageSpecificNS = function(villageId /*opt*/)
{
   return this.getUserSpecificNS() + "_" + ((villageId === undefined) ? TB3O.ActiveVillageId : villageId);
};

//////////////////////////////////////////////////////////////////////
function loadPersistentUserValue(aName, defValue /*opt*/) 
{
   return persistence.loadValue(persistence.getUserSpecificNS(), aName, defValue);
}

//////////////////////////////////////////////////////////////////////
function savePersistentUserValue(aName, aValue)
{
   return persistence.saveValue(persistence.getUserSpecificNS(), aName, aValue)
}

//////////////////////////////////////////////////////////////////////
function loadPersistentUserObject(aName, defValue /*opt*/) 
{
   return persistence.loadObject(persistence.getUserSpecificNS(), aName, defValue);
}

//////////////////////////////////////////////////////////////////////
function savePersistentUserObject(aName, aValue, aKey /*opt*/)
{
   return persistence.saveObject(persistence.getUserSpecificNS(), aName, aValue, aKey)
}

//////////////////////////////////////////////////////////////////////
function loadPersistentVillageObject(aName, defValue /*opt*/, villageId /*opt*/) 
{
   return persistence.loadObject(persistence.getVillageSpecificNS(villageId), aName, defValue);
}

//////////////////////////////////////////////////////////////////////
function savePersistentVillageObject(aName, aValue, aKey /*opt*/, villageId /*opt*/)
{
   return persistence.saveObject(persistence.getVillageSpecificNS(villageId), aName, aValue, aKey)
}

/////////////////////////////////////////////////////////////////////
function PersistentVillageCache(aName)
{
   this.n = aName;
   this.o = Object.create(null);
}

/////////////////////////////////////////////////////////////////////
// Return information about village @villageId (or about current village if @villageId is absent)
// from cache. If no info in cache then load it from persistent storage, save it in cache and return. 
// If no info in persistent storage founded then return an empty object.
PersistentVillageCache.prototype.load = function (villageId /*opt*/)
{
   var info;

   if ( villageId === undefined ) 
   {
      villageId = TB3O.ActiveVillageId;
   }

   if ( hasOwnProperty(this.o, villageId) )
   {
      info = this.o[villageId]; 
   }
   else
   {
      __LOG__(8,"Cache miss an object tagged '" + this.n + "' for village " + villageId + " ('" + TB3O.VillagesInfo[villageId].name + "')")
      info = loadPersistentVillageObject(this.n, {}, villageId);
      this.o[villageId] = info;
   }
   return info;
}

/////////////////////////////////////////////////////////////////////
// Put information @info about village @villageId (or about current village if @villageId is absent)
// into the cache. Note that `set` not save it in persistent storage automatically, you need to call `flush` later.
PersistentVillageCache.prototype.set = function (info, villageId /*opt*/)
{
   if ( villageId === undefined ) 
   {
      villageId = TB3O.ActiveVillageId;
   }

   this.o[villageId] = info;

   return info;
}

/////////////////////////////////////////////////////////////////////
// Flush cache content about village @villageId (or about current village if @villageId is absent)
// to persistent storage. If cache miss data about village then function do nothing
PersistentVillageCache.prototype.flush = function (villageId /*opt*/)
{
   if ( villageId === undefined ) 
   {
      villageId = TB3O.ActiveVillageId;
   }

   if ( hasOwnProperty(this.o, villageId) )
   {
      var info = this.o[villageId]; 

      savePersistentVillageObject(this.n, info, null, villageId);
   }
}


//////////////////////////////////////////////////////////////////////
// OBSOLETE
function getGMcookieV2(aName, defValue) 
{
   if ( defValue === undefined )
   {
      defValue = {};
   }
   return persistence.loadValue(persistence.getUserSpecificNS(), aName, defValue);
}

//////////////////////////////////////////////////////////////////////
// OBSOLETE
function setGMcookieV2(aName, aValue, aKey /*opt*/)
{
   return savePersistentUserObject(aName, aValue, aKey)
}
