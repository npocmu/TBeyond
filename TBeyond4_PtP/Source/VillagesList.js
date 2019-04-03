//////////////////////////////////////////////////////////////////////
function VillagesList()
{
   this.links = {};
   this.vCount = 0;
   this.vActiveId = undefined;

   // vTable - DOM node for villages list
   this.vTable = $g("sidebarBoxVillagelist"); //4.2

   //-------------------------------------------------------------
   var aSeparators = loadSeparators();

   //-------------------------------------------------------------
   this.getSeparatorState = function (pos)
   {  
      return aSeparators[pos];
   };
}


//////////////////////////////////////////////////////////////////////
// prep to resize if need
VillagesList.prototype.prepareTableChanges = function()
{
   //this.dSideInfo.style.width = 'auto';
};

//////////////////////////////////////////////////////////////////////
VillagesList.prototype.getLink = function(villageId) 
{
   return this.links[villageId];
};

//////////////////////////////////////////////////////////////////////
VillagesList.prototype.uiRefreshList = function(refresh_options /*opt*/)
{
};

//////////////////////////////////////////////////////////////////////
VillagesList.prototype.uiRefreshVillage = function(villageId, refresh_options /*opt*/)
{
};

//////////////////////////////////////////////////////////////////////
function parseCoords(str)
{
   var x = null, y = null;

   function getCoord(matches)
   {
      if ( matches )
      {
         // replace Unicode MINUS SIGN to HYPHEN-MINUS
         var strCoord = matches[2].replace('−','-');

         if ( matches[1] === 'X' )
         {
            x = parseInt10(strCoord); 
         }
         else if ( matches[1] === 'Y' )
         {
            y = parseInt10(strCoord); 
         }
      }
   }

   if ( !parseCoords.re )
   {
      parseCoords.re =
       /<span *class *= *"[^"]* *coordinate(X|Y) *[^"]*" *>[()]?([+-−]?\d+)[()]?<\/span>/g;
   }

   str = decodeHTMLEntities(str);
   parseCoords.re.lastIndex = 0;
   getCoord(parseCoords.re.exec(str));
   getCoord(parseCoords.re.exec(str));

   __ASSERT__( isIntValid(x) && isIntValid(y), "Can't detect village coords from string '" + str + "'")

   return [x,y];
}


//////////////////////////////////////////////////////////////////////
// Read list of villages:
//    - actualize TB3O.VillagesInfo
//    - fill and return VillagesList
function getVillagesList()
{
   __ENTER__

   var villagesList = new VillagesList();
   var villageId, villageInfo;

   // cleanup position in list 
   for ( villageId in TB3O.VillagesInfo ) 
   {
      TB3O.VillagesInfo[villageId].posInListOrg = null;
   }

   if ( villagesList.vTable ) 
   {
      var vlist = $xf1(".//ul/li", 'a', villagesList.vTable);

      // retrieve villages info
      for (var pos = 0; pos < vlist.length; pos++ )
      {
         var vEntryNode = vlist[pos];
         var vLinkNode = __TEST__($nth_tag(vEntryNode,"a"));
         if ( vLinkNode )
         {
            var vLink = vLinkNode.href;
            var vUrl = parseUri(vLink);
            villageId = vUrl.queryKey.newdid;

            //if ( isSomeOf(crtUrl.path,"/karte.php","/position_details.php") ) // fix TB bug
            {
               //vUrl.hashKey = crtUrl.hashKey;
               cloneUndefinedProperties(crtUrl.queryKey, vUrl.queryKey);
               vLink = combineUri(vUrl);
               if ( crtUrl.hashbang  ) { vLink += "#!" + crtUrl.hashbang; }
            }

            villagesList.links[villageId] = vLink;

            if ( TB3O.VillagesInfo[villageId] )
            {
               villageInfo = TB3O.VillagesInfo[villageId];
            }
            else
            {
               villageInfo = new VillageInfo();
               TB3O.VillagesInfo[villageId] = villageInfo;
            }

            var vNameNode = $qf(".name", 'f', vLinkNode);
            if ( vNameNode )
            {
               villageInfo.name = vNameNode.textContent;
            }
            villageInfo.id = villageId;

            var vCoordsNode = $qf(".coordinates ", 'f', vLinkNode);
            if ( vCoordsNode )
            {
               var xy = parseCoords(vCoordsNode.innerHTML);
               villageInfo.x = xy[0]; 
               villageInfo.y = xy[1]; 
            }

            villageInfo.posInListOrg = pos;

            villageInfo.markt =  ( hasClass(vEntryNode,'attack') ) ? 1 : 0;

            if ( hasClass(vLinkNode,'active') )
            {
                villagesList.vActiveId = villageId;
            }

            ++villagesList.vCount;
         }
      }
   }

   // cleanup orphaned villages
   for ( villageId in TB3O.VillagesInfo ) 
   {
      if ( TB3O.VillagesInfo[villageId].posInListOrg === null )
      {
         delete TB3O.VillagesInfo[villageId];
      }
   }

   __EXIT__

   return villagesList;
}


//////////////////////////////////////////////////////////////////////
// modify list of villages
function uiModifyVillagesList()
{
   var bAllowCustomization = (TBO_CUSTOMIZE_VLIST === "1");

   if ( bAllowCustomization )
   {
      restoreListOrder();
   }

   return;

   //////////////////////////////////////////////////////////////////////
   // customize village list order
   function restoreListOrder()
   {
      // normalize saved positions in list
      // all position must be between 0 and vCount, no duplicates allowed
      var mapPos2Id = getNormalizedCustomVillagesOrder();
      var pos;

      // restore villages order
      for ( pos = 0; pos < TB3O.VillagesCount; ++pos )
      {
          TB3O.VillagesInfo[mapPos2Id[pos]].posInListCur = pos;
      }
   }
}


