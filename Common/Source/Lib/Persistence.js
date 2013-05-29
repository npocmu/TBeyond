//////////////////////////////////////////////////////////////////////
function Persistence(serializer, storage)
{
   __ASSERT__(typeof(storage.getItem) === "function" && typeof(storage.setItem) === "function" && typeof(storage.removeItem) === "function",
              "Invalid storage interface")
   __ASSERT__(typeof(serializer.serialize) === "function" && typeof(serializer.deserialize) === "function",
              "Invalid serializer interface")

   this.serializer = serializer;
   this.storage = storage;
}

//////////////////////////////////////////////////////////////////////
Persistence.prototype.__composePersistentName = function (NS, aName) 
{
   return (( NS === undefined || NS === null ) ? "" : NS) + '_' + aName;
};

//////////////////////////////////////////////////////////////////////
// load any possible JS type
Persistence.prototype.loadValue = function (NS, aName, defValue) 
{
   var key = this.__composePersistentName(NS, aName); 
   var item = this.storage.getItem(key);
   var val = defValue;
   if ( item !== null )
   {
      try
      {
         val = this.serializer.deserialize(item);
      }
      catch(e) { __DUMP__(key,item) }
   }
   return val;
};

//////////////////////////////////////////////////////////////////////
// always return object
Persistence.prototype.loadObject = function (NS, aName, defValue) 
{
   if ( defValue === undefined )
   {
      defValue = {};
   }
   var v = this.loadValue(NS, aName, defValue);
   if ( !v || typeof(v) !== "object" ) 
   {
      v = defValue;
   }
   return v;
};


//////////////////////////////////////////////////////////////////////
Persistence.prototype.saveValue = function (NS, aName, aValue)
{
   var key = this.__composePersistentName(NS, aName);
   this.storage.setItem(key, this.serializer.serialize(aValue));
};


//////////////////////////////////////////////////////////////////////
// Usage:
//  1)
//    saveObject(aName, collection) 
//     - store entire collection
//  2)
//    saveObject(aName, object, key) 
//     - replace object by key
Persistence.prototype.saveObject = function (NS, aName, aValue, aKey)
{
   if ( aKey === undefined || aKey === null ) 
   {
      this.saveValue(NS, aName, aValue);
   }
   else if ( aKey )
   {
      var cV = this.loadObject(NS, aName);

      if ( aValue === undefined || aValue === null ) 
      {
         delete cV[aKey];
      }
      else
      {
         cV[aKey] = aValue;
      }

      this.saveValue(NS, aName, cV);
   }
};


//////////////////////////////////////////////////////////////////////
Persistence.prototype.drop = function (NS, aName) 
{
   var key = this.__composePersistentName(NS, aName);
   this.storage.removeItem(key);
};

