//////////////////////////////////////////////////////////////////////
// FireFox+GM specific
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


/*
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
*/

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
function PersistentVillageCashe(aName)
{
   this.n = aName;
   this.o = {};
}

/////////////////////////////////////////////////////////////////////
PersistentVillageCashe.prototype.load = function (villageId)
{
   var info = this.o[villageId]; 
   if ( !info )
   {
      __LOG__(8,"Cashe missing object tagged '" + this.n + "' for village " + villageId + " ('" + TB3O.VillagesInfo[villageId].name + "')")
      info = loadPersistentVillageObject(this.n, {}, villageId);
      this.o[villageId] = info;
   }
   return info;
}

/////////////////////////////////////////////////////////////////////
PersistentVillageCashe.prototype.flush = function (villageId)
{
   savePersistentVillageObject(this.n, this.o[villageId], null, villageId);
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
