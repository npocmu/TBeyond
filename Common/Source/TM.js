//////////////////////////////////////////////////////////////////////
//a troop movement (from dorf1.php)
function xTrMov(iT, no, fT) 
{
   this.type = iT;
   this.no = no;
   this.fT = fT;  // null, if event jam detected
   return this;
}


//////////////////////////////////////////////////////////////////////
//get the troop movements from the "dorf1.php" page
function getTroopMovements(aDoc, ttServer)
{
   var arrTM = [];
   var i,intNo = 0;
   var aRow, arrSpans, aImg, imgType;
   var ttFirst;
   var aTM = $xf("//table[@id='movements']/tbody/tr", 'l', aDoc, aDoc);

   for ( i = 0; i < aTM.snapshotLength; i++ )
   {
      aRow = aTM.snapshotItem(i);
      if ( aRow.cells.length > 1 )
      {
         aImg = $nth_tag(aRow.cells[0],"IMG");
         if ( aImg )
         {
            imgType = aImg.className;

            arrSpans = aRow.cells[1].getElementsByTagName("SPAN");
            if ( arrSpans.length > 0 )
            {
               intNo = parseInt10(arrSpans[0].textContent);
            }

            if ( arrSpans.length === 2 )
            {
               ttFirst = getEventTimeStamp(ttServer, arrSpans[1].textContent);
            }
            else // event jam?
            {
               ttFirst = null;
            }
            
            arrTM[arrTM.length] = new xTrMov(imgType, intNo, ttFirst);
         }
      }
   }

   return arrTM;
}

/////////////////////////////////////////////////////////////////////
function setTroopMovements(villageId, aDoc, ttServer)
{
   var arrTM = getTroopMovements(aDoc, ttServer);
   if ( arrTM )
   {
      initVillageTM(TB3O.VillagesInfo[villageId],arrTM);
   }
   
   __ASSERT__(arrTM,"Can't get troops movements for village id=" + villageId)

   return !!arrTM;
}

//////////////////////////////////////////////////////////////////////
function uiFillTMTable(aTb, arrTM)
{
   //create the troop movements table for this village
   var i, bS, TMInfo, ttEnd;
   var ttCurrent = toTimeStamp(getServerTimeNow());
   var dtNow = getDesiredTime(ttCurrent);

   for ( i = 0, bS = false; i < arrTM.length; ++i )
   {
      TMInfo = arrTM[i];
      ttEnd = TMInfo.fT;
      if ( ttCurrent < ttEnd || ttEnd === null )
      {
         if ( !bS )
         {
            aTb.appendChild(uiCreateVillageInfoTipHead(I("att_all")));
            bS = true;
         }
         aTb.appendChild(uiCreateVillageInfoTipRow(I(TMInfo.type), TMInfo.no, dtNow, ttEnd));
      }
   }
}

//////////////////////////////////////////////////////////////////////
// create the TM table for village
function uiCreateTMTable(villageId)
{
   return uiCreateVillageInfoTipTable(villageId,"TM",uiFillTMTable);
}
