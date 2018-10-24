//////////////////////////////////////////////////////////////////////
//a building being upgraded
function xBiP(aName, txtLvl, lvl, ttEnd)
{
   this.name = trimWhitespaces(aName);
   this.txtLvl = trimBlanks(txtLvl);
   this.lvl = parseInt10(lvl);
   this.endTime = ttEnd;
   return this;
}

M4_DEBUG({{
/////////////////////////////////////////////////////////////////////
// Debug!!!
function getBiPView(arrBiP) 
{
   var str = "", i;

   if ( arrBiP && arrBiP.length )
   {
      for ( i = 0; i < arrBiP.length; ++i)
      {
         str += "[" + i + "] " + arrBiP[i].name + "(" + arrBiP[i].txtLvl + "), lvl=" + arrBiP[i].lvl + 
               ", endTime: " + arrBiP[i].endTime.toLocaleString() + "\n";
      }
   }
   else
   {
      str = JSON.stringify(arrBiP) + "\n";
   }
   return str;
}
}})

/////////////////////////////////////////////////////////////////////
function getNewUpgradeLevel(arrBiP, bName, lvl)
{
   for (var xi = 0; xi < arrBiP.length; xi++)
   {
      if ( arrBiP[xi].name === bName )
      {
         if ( arrBiP[xi].lvl === (lvl + 1) )
         {
            lvl += 1;
         }
      }
   }
   return lvl;
}

/////////////////////////////////////////////////////////////////////
function setBiP(villageId, aDoc, ttServer)
{
   var arrBiP = getBiP(aDoc, ttServer);
   if ( arrBiP )
   {
      initVillageBiP(TB3O.VillagesInfo[villageId],arrBiP);
   }
   __ASSERT__(arrBiP,"Can't get buildings in progress for village id=" + villageId)

   return !!arrBiP;
}

//////////////////////////////////////////////////////////////////////
function uiCreateVillageInfoTipTable(villageId,tag,fillf)
{
   var aTb = $t();

   aTb.id = 'tb_BiPTM';
   fillf(aTb,TB3O.VillagesInfo[villageId][tag]);

   return ( aTb.hasChildNodes() ) ? aTb : null;
}

//////////////////////////////////////////////////////////////////////
function uiCreateVillageInfoTipHead(content)
{
   var tr = $r(['class', 'tb3r'],
               $td([['class', 'tbTitle'],['colspan','4']], content));
   return tr;
}

//////////////////////////////////////////////////////////////////////
function uiCreateVillageInfoTipRow(col1, col2, dtNow, ttEnd)
{
   var tr = $r(null,[
                $td(null, col1),
                $td(null, col2),
                $td(null, [I("hourglass"),uiSetTimeSpanByDate($span(), dtNow, getDesiredTime(ttEnd), {format:1})]),
                $td(null, [I("clock"),$span(formatDateTime(dtNow,getDesiredTime(ttEnd),1))])
              ]);
   return tr;
}

//////////////////////////////////////////////////////////////////////
// Fill BiP table
function uiFillBiPTable(aTb, arrBiP)
{
   var i, bS, BiPInfo, ttEnd;
   var ttCurrent = toTimeStamp(getServerTimeNow());
   var dtNow = getDesiredTime(ttCurrent);

   for ( i = 0, bS = false; i < arrBiP.length; ++i )
   {
      BiPInfo = arrBiP[i];
      ttEnd = BiPInfo.endTime;
      if ( ttCurrent < ttEnd || ttEnd === null )
      {
         if ( !bS )
         {
            aTb.appendChild(uiCreateVillageInfoTipHead(I("bau")));
            bS = true;
         }
         aTb.appendChild(uiCreateVillageInfoTipRow(BiPInfo.name, BiPInfo.txtLvl, dtNow, ttEnd));
      }
   }
}

//////////////////////////////////////////////////////////////////////
// create the BiP table for village
function uiCreateBiPTable(villageId)
{
   return uiCreateVillageInfoTipTable(villageId,"BiP",uiFillBiPTable);
}

//////////////////////////////////////////////////////////////////////
function uiCreateBiPTMTable(villageId)
{
   var aTb = $t();
   var villageInfo = TB3O.VillagesInfo[villageId];

   aTb.id = 'tb_BiPTM';

   uiFillBiPTable(aTb, villageInfo.BiP);
   uiFillTMTable(aTb, villageInfo.TM);
   IF_TB3(uiFillUpaiPTable(aTb, villageInfo.upai);)
   uiFillUpiPTable(aTb, villageInfo.upi);
   uiFillTriPTable(aTb, TB3O.VillagesTrInfo.load(villageId));

   return ( aTb.hasChildNodes() ) ? aTb : null;
}
