/////////////////////////////////////////////////////////////////////
// get current resource units, capacity of warehouse/granary, 
function getResourcesResCap(resourcesInfo, aDoc, ttServer)
{
   var ri, aNode, resIppH, validCount = 0;

   for ( ri = 0; ri < 4; ++ri )
   {
      aNode = __TEST__({{$g('l' + (ri + 1),aDoc)}});
      if ( aNode )
      {
         resIppH = aNode.textContent.split("/");

         //available resource units
         resourcesInfo.Res[ri] = parseInt10(resIppH[0]);
         //capacity of warehouse/granary
         if ( resIppH.length > 1 ) // T4.0?
         {
            resourcesInfo.Cap[ri] = parseInt10(resIppH[1]);
         }
         ++validCount;
      }
   }

   if ( TB3O.ServerInfo.version > 4.0 )
   {
      aNode = __TEST__({{$g("stockBarWarehouse",aDoc)}});
      resourcesInfo.Cap[0] = resourcesInfo.Cap[1] = resourcesInfo.Cap[2] = parseSeparatedInt10(aNode.textContent);
      aNode = __TEST__({{$g("stockBarGranary",aDoc)}});
      resourcesInfo.Cap[3] = parseSeparatedInt10(aNode.textContent);
   }

   if ( validCount === 4 ) { resourcesInfo.dUpd = new Date(ttServer); }
   return resourcesInfo;
}



/////////////////////////////////////////////////////////////////////
// get current resource units, capacity of warehouse/granary, 
// production per hour from the html document
// return ResourcesInfo object
function getResourcesInfo2(villageId, aDoc, ttServer)
{
   function getResourcesInfo40(resourcesInfo, aDoc, ttServer)
   {
      var ri,aNode,resIppH;
      var reEPpH = /: *([+-]?\d+)/;

      var res = __TEST__($g("res",aDoc));
      if ( res )
      {
         for (aNode = res.firstChild, ri = 0; aNode; aNode = aNode.nextSibling)
         {
            if ( TAG(aNode) === "LI" )
            {
               if ( reEPpH.exec(aNode.title) && ri <= 3 )
               {
                  //production/h for this resource
                  resourcesInfo.EPpH[ri] = parseInt10(RegExp.$1);
                  resourcesInfo.PpH[ri] = (resourcesInfo.EPpH[ri] > 0) ? resourcesInfo.EPpH[ri] : 0;
               }
               ++ri;
            }
         }

         aNode = __TEST__({{$g('l5',aDoc)}});
         if ( aNode )
         {
            resIppH = aNode.textContent.split("/");
            if ( resIppH.length > 1 )
            {
               //real crop production of this village
               resourcesInfo.PpH[3] = parseInt10(resIppH[1]);
            }
         }
      }
   }

   function getResourcesInfo42(resourcesInfo, aDoc, ttServer)
   {
      var ri,xi,aNode;
      var rawData = []
      var reEPpH = /: *([+-]?\d+)/;

      var nodeList = $xf("//ul[@id='stockBar']//a", 'l', aDoc, aDoc);
      if ( nodeList.snapshotLength < 5 )
      {
         resourcesInfo.dUpd = undefined;
      }
      else
      {
         for ( xi = 0; xi < nodeList.snapshotLength; ++xi )
         {
            aNode = nodeList.snapshotItem(xi);
            if ( reEPpH.exec(decodeHTMLEntities(aNode.title)) )
            {
               rawData.push(parseInt10(RegExp.$1));
            }
         }

         for ( ri = 0; ri < 3; ++ri )
         {
             resourcesInfo.EPpH[ri] = resourcesInfo.PpH[ri] = rawData[ri];
         }

         resourcesInfo.EPpH[3] = rawData[4];
         resourcesInfo.PpH[3] = rawData[3] + getActualVillagePopulation(TB3O.VillagesInfo[villageId]);
         resourcesInfo.PpH[3] = Math.max( resourcesInfo.PpH[3], resourcesInfo.EPpH[3] );
      }
   }

/*
   function getResourcesInfo42(resourcesInfo, aDoc, ttServer)
   {
      var ri, resTr, validCount = 0;

      if ( window.wrappedJSObject && window.wrappedJSObject.resources )
      {
         resTr = window.wrappedJSObject.resources;

         for ( ri = 0; ri < 4; ++ri )
         {
            var l = 'l' + (ri+1);
            resourcesInfo.EPpH[ri] = resTr.production[l];
            resourcesInfo.PpH[ri] = (resourcesInfo.EPpH[ri] > 0) ? resourcesInfo.EPpH[ri] : 0;
            resourcesInfo.Res[ri] = resTr.storage[l];
            resourcesInfo.Cap[ri] = resTr.maxStorage[l];

            if ( isIntValid(resourcesInfo.EPpH[ri]) && isIntValid(resourcesInfo.Res[ri]) && isIntValid(resourcesInfo.Cap[ri]) )
            {
               ++validCount;
            }
         }
      }
      if ( validCount === 4 ) { resourcesInfo.dUpd = new Date(ttServer); }
   }
*/

   var resourcesInfo = new ResourcesInfo();
   getResourcesResCap(resourcesInfo, aDoc, ttServer);
   if ( TB3O.ServerInfo.version > 4.0 ) 
   {
      getResourcesInfo42(resourcesInfo, aDoc, ttServer);
   }
   else
   {
      getResourcesInfo40(resourcesInfo, aDoc, ttServer);
   }

   __DUMP__(resourcesInfo)
   return resourcesInfo;
}


/////////////////////////////////////////////////////////////////////
function getResourcesTitles()
{
   function getResourceTitle(i,id)
   {
      var aNode = $g(id);
      if ( aNode )
      {
         //resource title
         var resImg = aNode.previousElementSibling;
         if ( resImg )
         {
            t['RES' + i] = resImg.alt;
         }
      }
   }

   var i;
   for (i = 1; i <= 5; ++i)
   {
      getResourceTitle(i,'l' + i);
   }
   if ( TB3O.ServerInfo.version > 4.0 ) { getResourceTitle(5,'stockBarFreeCrop'); }

   __ASSERT__( isStrValid(t['RES1']) && isStrValid(t['RES2']) && isStrValid(t['RES3']) && isStrValid(t['RES4']) && isStrValid(t['RES5']),
              "Can't load titles for resources" )
}

