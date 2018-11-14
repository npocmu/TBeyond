//////////////////////////////////////////////////////////////////////
function __expand(s, args, base)
{
   if ( s !== undefined ) 
   {
      // try to expand arguments substitution $1,...,$n
      if ( args.length > base ) 
      {
         s = s.replace(/[$](\d+)/g, 
                       function(str,no)
                       { 
                          return (no-1 < args.length-base) ? args[no-1+base] : str; 
                       });   
      }
   }

   return s;
}

//////////////////////////////////////////////////////////////////////
// translated t item if available
function T(name /* arg1, ... argN */)
{
   var s = __expand(t[name], arguments, 1);

   if ( s === undefined ) 
   {
      s = M4_IIF_DEBUG(name,'---');
   }

   return s;
}

//////////////////////////////////////////////////////////////////////
// translated t item if available, where item is element in indexed array
function TX(name, index /* arg1, ... argN */)
{
   var s = t[name];

   if ( s !== undefined ) 
   {
      s = __expand(s.split("|", index + 1)[index], arguments, 2);
   }

   if ( s === undefined ) 
   {
      s = M4_IIF_DEBUG(name + '[' + index + ']','---');
   }

   return s;
}
 
//////////////////////////////////////////////////////////////////////
T.saveLocaleString = function(name,str)
{
   if ( t[name] === undefined )
   {
      t[name] = str;
   }
   persistence.saveObject(TB3O.lng, "i18n", str, name);
};

//////////////////////////////////////////////////////////////////////
T.loadLocalization = function()
{
   function applyCollection(colLoc)
   {
      var name;
      for ( name in colLoc ) 
      {
         if ( colLoc.hasOwnProperty(name) && !t.hasOwnProperty(name) ) 
         {
            t[name] = colLoc[name];
         }
      }
   }

   applyCollection(persistence.loadObject(arAvLang[TBO_SCRIPT_LANG], "i18n"));

   if ( arAvLang[TBO_SCRIPT_LANG] !== TB3O.lng )
   {
      // fallback to server language
      applyCollection(persistence.loadObject(TB3O.lng, "i18n"));
   }
};

//////////////////////////////////////////////////////////////////////
// Core function for create the images from the 'resource name'.
// Can optionally add array of attributes 'attr' to the created image element.
function I(name, attr /*opt*/)
{
   var pre_att;
   var imgNode = null;
   
   if ( I.images_attributes ) { pre_att = I.images_attributes[name]; }

   if ( !pre_att ) 
   {
      // TEMP, use gIc 
      var imgHTML = gIc[name];
      if ( imgHTML )
      {
         var div = $e("div",imgHTML);
         imgNode = div.removeChild(div.firstChild);
         $at(imgNode,attr);
      }
      else
      {
         var src = image[name]; // TBeyond image?
         if ( src )
         {
            pre_att = [['src',src]];
         }
         else // assume standard Travian image
         {
            //__ASSERT__(pre_att,"Can't found library image with name '" + name + "'!")
            pre_att = [['class',name], ['src',xGIF]];
         }
      }
   }

   return imgNode ? imgNode : $img(mergeAttributes(pre_att,attr));
}

/////////////////////////////////////////////////////////////////////
function setTBAttribute(node, name, value)
{
   return node.setAttributeNS("TB_USO_URL_HOME", name, value);
}

/////////////////////////////////////////////////////////////////////
// always return null if node does not has such attribute
function getTBAttribute(node, name)
{
   return ( node.hasAttributeNS("TB_USO_URL_HOME", name) ) ?
              node.getAttributeNS("TB_USO_URL_HOME", name) : null;
}


//////////////////////////////////////////////////////////////////////
function loadSeparators()
{
   var aPositions = getGMcookieV2("VillagesSep"),
       aSeparators = [],
       i;

   if ( !aPositions.length )
   {
      aPositions = [];
   }

   for ( i = 0; i < aPositions.length; ++i )
   {
      if ( aPositions[i] )
      {
         aSeparators[aPositions[i]] = 1;
      }
   }

   return aSeparators;
}


//////////////////////////////////////////////////////////////////////
function saveSeparators(aSeparators)
{
   var aPositions = [], 
       i;

   for ( i = 0; i < aSeparators.length; ++i )
   {
      if ( aSeparators[i] )
      {
         aPositions[aPositions.length] = i;
      }
   }

   setGMcookieV2("VillagesSep", aPositions); 
}

