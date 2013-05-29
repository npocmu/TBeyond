//////////////////////////////////////////////////////////////////////
function getBiP(aDoc, ttServer)
{
   function getBiP40(arrBiP, aDoc, ttServer)
   {
      var ttEnd, tdD, tdDS, BiPtb, aRows, txtLvl;
      var xi;

      BiPtb = __TEST__({{$g("building_contract",aDoc)}});
      if ( BiPtb )
      {
         aRows = BiPtb.tBodies[0].rows;

         for ( xi = 0; xi < aRows.length; xi++ )
         {
            if ( aRows[xi].cells.length > 2 )
            {
               tdD = aRows[xi].cells[2];
               tdDS = $nth_tag(tdD,"span");
               if ( tdDS )
               {
                  ttEnd = getEventTimeStamp(ttServer, tdDS.textContent);

                  tdD = aRows[xi].cells[1];
                  tdDS = $nth_tag(tdD,"span");
                  if ( tdDS  )
                  {
                     txtLvl = tdDS.textContent;
                  }
                  arrBiP[arrBiP.length] = new xBiP(tdD.firstChild.textContent, 
                                                   txtLvl, txtLvl.split(/ +/)[1], ttEnd);
               }
            }
         }
      }
   }

   function getBiP42(arrBiP, aDoc, ttServer)
   {
      var ttEnd, tdD, tdDS, txtLvl;
      var xi;

      var nodeList = $xf("//div[@id='" + ID_CONTENT + "']//div[contains(@class,'buildingList')]//li",'l',aDoc,aDoc);
      for ( xi = 0; xi < nodeList.snapshotLength; ++xi )
      {
         var node = nodeList.snapshotItem(xi);
         
         tdDS = __TEST__(node.querySelector(".buildDuration span"));
         if ( tdDS )
         {
            ttEnd = getEventTimeStamp(ttServer, tdDS.textContent);
            tdD = __TEST__(node.querySelector(".name"));
            if ( tdD )
            {
               tdDS = $nth_tag(tdD,"span");
               if ( tdDS  )
               {
                  txtLvl = tdDS.textContent;
               }
               arrBiP[arrBiP.length] = new xBiP(tdD.firstChild.textContent, 
                                                txtLvl, txtLvl.split(/ +/)[1], ttEnd);
            }
         }
      }
   }


   var arrBiP = [];
   if ( TB3O.ServerInfo.version > 4.0 ) 
   {
      getBiP42(arrBiP, aDoc, ttServer);
   }
   else
   {
      getBiP40(arrBiP, aDoc, ttServer);
   }
   __DUMP__(arrBiP)

   return arrBiP;
}

