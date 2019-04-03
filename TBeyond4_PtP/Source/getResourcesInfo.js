/////////////////////////////////////////////////////////////////////
// get current resource units, capacity of warehouse/granary, 
function getResourcesResCap(resourcesInfo, aDoc, ttServer)
{
   var ri, aNode, resIppH, resCap, validCount = 0;

   //available resource units
   for ( ri = 0; ri < 4; ++ri )
   {
      aNode = __TEST__({{$g('l' + (ri + 1),aDoc)}});
      if ( aNode )
      {
         resIppH = parseSeparatedInt10(aNode.textContent);
         if ( isIntValid(resIppH) )
         {
            ++validCount;
            resourcesInfo.Res[ri] = resIppH;
         }
         else
         {
            __ERROR__("Can't get available resource (" + ri + ") from string: '" + aNode.textContent + "'")
         }
      }
   }

   aNode = __TEST__({{$g("stockBarWarehouse",aDoc)}});
   if ( aNode )
   {
      resCap = parseSeparatedInt10(aNode.textContent);
      if ( isIntValid(resCap) )
      {
         resourcesInfo.Cap[0] = resourcesInfo.Cap[1] = resourcesInfo.Cap[2] = resCap;
      }
      else
      {
         __ERROR__("Can't get warehouse capacity from string: '" + aNode.textContent + "'")
      }
   }

   aNode = __TEST__({{$g("stockBarGranary",aDoc)}});
   if ( aNode )
   {
      resCap = parseSeparatedInt10(aNode.textContent);
      if ( isIntValid(resCap) )
      {
         resourcesInfo.Cap[3] = resCap;
      }
      else
      {
         __ERROR__("Can't get granary capacity from string: '" + aNode.textContent + "'")
      }
   }
   
   if ( validCount === 4 ) { resourcesInfo.ttUpd = ttServer; }

   return resourcesInfo;
}



/////////////////////////////////////////////////////////////////////
// get current resource units, capacity of warehouse/granary, 
// production per hour from the html document
// return ResourcesInfo object
function getResourcesInfo2(villageId, aDoc, ttServer)
{
   function getResourcesInfo42(resourcesInfo, aDoc, ttServer)
   {
      var ri,xi,aNode;
      var rawData = []
      var reEPpH = /: *([+-]?\d+)/;

      var nodeList = $xf("//ul[@id='stockBar']//a", 'l', aDoc, aDoc);
      if ( nodeList.snapshotLength < 5 )
      {
         resourcesInfo.ttUpd = undefined;
         __ERROR__("Can't retreive resources production")
      }
      else
      {
         for ( xi = 0; xi < nodeList.snapshotLength; ++xi )
         {
            var pph;
            aNode = nodeList.snapshotItem(xi);
            if ( reEPpH.exec(decodeHTMLEntities(aNode.title)) )
            {
               pph = parseInt10(RegExp.$1);
               if ( !isIntValid(pph) )
               {
                  __ERROR__("Invalid resource (" + xi + ") production")
               }
            }
            else
            {
              __ERROR__("Can't parse resource (" + xi + ") production from string: '" + aNode.title + "'")
            }
            rawData.push(pph);
         }

         for ( ri = 0; ri < 3; ++ri )
         {
            if ( isIntValid(rawData[ri]) )
            {
               resourcesInfo.EPpH[ri] = resourcesInfo.PpH[ri] = rawData[ri];
            }
         }

         if ( isIntValid(rawData[3]) && isIntValid(rawData[4]) )
         {
            resourcesInfo.EPpH[3] = rawData[4];
            resourcesInfo.PpH[3] = rawData[3] + getActualVillagePopulation(TB3O.VillagesInfo[villageId]);
            resourcesInfo.PpH[3] = Math.max( resourcesInfo.PpH[3], resourcesInfo.EPpH[3] );
         }
      }
   }


   var resourcesInfo = new ResourcesInfo();

   // for current document it to possible to get info from ingame structures
   var bSuccess = false;
   if ( aDoc === document && unsafeWindow.resources )
   {
      var info = unsafeWindow.resources;
      try
      {
         for (var ri = 0; ri < 4; ++ri )
         {
            var propName = 'l' + (ri+1);
            resourcesInfo.Res[ri] = info.storage[propName];
            resourcesInfo.Cap[ri] = info.maxStorage[propName];
            resourcesInfo.PpH[ri] = info.production[propName];
            resourcesInfo.EPpH[ri] = info.production[propName];
         }

         resourcesInfo.ttUpd = ttServer;
         bSuccess = true;
      }
      __CATCH__
   }

   if ( !bSuccess )
   {
      getResourcesResCap(resourcesInfo, aDoc, ttServer);
   }

   getResourcesInfo42(resourcesInfo, aDoc, ttServer);

   __DUMP__(resourcesInfo)
   return resourcesInfo;
}
