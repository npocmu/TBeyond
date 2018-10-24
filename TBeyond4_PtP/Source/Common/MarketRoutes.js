//////////////////////////////////////////////////////////////////////
function getMerchantsState()
{
   var container = $qf(".whereAreMyMerchants");
   if ( container )
   {
      if ( container.textContent.search(/(\d+)[^\d]*\/[^\d]*(\d+)/) !== -1 )
      {
         TB3O.MerchantsInfo.mAvail = parseInt10(RegExp.$1);
         TB3O.MerchantsInfo.mTotal = parseInt10(RegExp.$2);
         __DUMP__(TB3O.MerchantsInfo)
      }
   }
   __ASSERT__(!isNaN(TB3O.MerchantsInfo.mAvail),"Can't parse merchant's available count")
   __ASSERT__(!isNaN(TB3O.MerchantsInfo.mTotal),"Can't parse merchant's total count")

   if ( !isIntValid(TB3O.MerchantsInfo.mTotal) )  { TB3O.MerchantsInfo.mTotal = 0; }
}

//////////////////////////////////////////////////////////////////////
function processMarketRoutes()
{
   __ENTER__
   getMerchantsState();
   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiModifyMarketRoutes()
{
}


//////////////////////////////////////////////////////////////////////
function processMarketRoutesEdit()
{
   __ENTER__
   getMerchantsState();
   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiModifyMarketRoutesEdit()
{
   //-------------------------------------------------------------
   function onSwitchUI(e)
   {
      TBO_SHOW_EDIT_ROUTES_UI = ( e.opened ) ? "1" : "0";
      saveTBOptions();
      ( e.opened ) ? uiEnableMarketRoutesInterface() : uiRemoveMarketRoutesInterface();
   }

   __ENTER__
   var h = __TEST__($xf("(//h4)[last()]"));
   if ( h )
   {
      var bNewUI = (TBO_SHOW_EDIT_ROUTES_UI === "1");
      var richUISelector = uiCreateRollDownControl(bNewUI, [T("120"),T("EDITROUTES_TT")], onSwitchUI);
      h.appendChild(richUISelector);
      if ( bNewUI ) { uiEnableMarketRoutesInterface(); }
   }

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiEnableMarketRoutesInterface()
{
   __ENTER__

   var ttShedule;
   var destVillageInfo;
   var repCount;

   //-------------------------------------------------------------
   function uiCreateMercDistTable()
   {
      var oD = $g("tb_unitsdest");
      if ( oD )
      {
         removeChildren(oD);
         if ( destVillageInfo )
         {

            var aTb = uiCreateTroopsMerchantsDistTable(null, null, xy2id(destVillageInfo.x,destVillageInfo.y),
                                             {show_merchant:true, show_coords:true, show_arrival_time:true,
                                              start_time:ttShedule, show_merchant_return:true,
                                              merchant_repeat:repCount});
            if ( aTb )
            {
               oD.appendChild(aTb);
            }
         }
      }
   }

   //-----------------------------------------------------------------
   function uiRefresh()
   {
      uiCreateMercDistTable()
   }

   //-----------------------------------------------------------------
   function getNextShedule(hour)
   {
      var ih = parseInt10(hour);
      var dtServer = getServerTimeNow();
      var dtShedule = new Date(dtServer);
      dtShedule.setHours(ih,0,0,0);
      if ( dtServer.getHours() >= ih )
      {
         dtShedule.setDate(dtShedule.getDate() + 1); 
      }
      return dtShedule.getTime();
   }

   //-----------------------------------------------------------------
   function getDestChanges(villageId)
   {
      destVillageInfo = TB3O.VillagesInfo[villageId];
      if ( destVillageInfo )
      {
         uiRefreshVL_Distance(destVillageInfo.x,destVillageInfo.y);
      }
   }

   //-----------------------------------------------------------------
   function onHourChange()
   {
      ttShedule = getNextShedule(this.value);
      uiRefresh();
   }

   //-----------------------------------------------------------------
   function onDestChange()
   {
      getDestChanges(this.value);
      uiRefresh();
   }

   //-----------------------------------------------------------------
   function onRepCountChange()
   {
      repCount = parseInt10(this.value);
      uiRefresh();
   }

   //-----------------------------------------------------------------
   var editTbl = __TEST__($g("trading_edit"));
   if ( editTbl )
   {
      try
      {
         // hook existing UI
         var ctrl = $n("hour") || $n("userHour");
         ctrl.addEventListener('change', onHourChange, false);
         ttShedule = getNextShedule(ctrl.value);

         ctrl = $n("did_dest");
         ctrl.addEventListener('change', onDestChange, false);
         getDestChanges(ctrl.value);
 
         ctrl = $n("repeat");
         ctrl.addEventListener('change', onRepCountChange, false);
         repCount = parseInt10(ctrl.value);

         __DUMP__(ttShedule,destVillageInfo,repCount)

         // prepare resources to be as on 'send' page
         var resCell = $qf('.res','f',editTbl);
         var resRowIdx = getCellIndicesInTable(editTbl,resCell)[0];
         var resElems = convertToArray(resCell.children);
         var attrIco = ['class','ico'];
         var attrVal = ['class','val'];
         replaceChildren(resCell,
            $t([attrInject$,["cellspacing","1"],["cellpadding","1"]],[
               $r(null, [$td(attrIco,resElems[0]),$td(attrVal,resElems[1])]),
               $r(null, [$td(attrIco,resElems[2]),$td(attrVal,resElems[3])]),
               $r(null, [$td(attrIco,resElems[4]),$td(attrVal,resElems[5])]),
               $r(null, [$td(attrIco,resElems[6]),$td(attrVal,resElems[7])]),
         ]));

         var uiOptions = new MarketSendUIOptions();
         uiOptions.save = null; //disable optons saving
         var sendResTable = new SendResTable(resCell.firstChild, uiOptions);

         // tune getResourcesState method
         sendResTable.getResourcesState = function()
         {
            var resourcesInfo = getActualResourcesInfo(TB3O.ActiveVillageInfo.r, true, ttShedule);
            return {Res:resourcesInfo.Cap, Rest:resourcesInfo.Res, EPpH:resourcesInfo.EPpH};
         }

         var mNeed = sendResTable.getTotals().mNeed;
         mNeed = Math.min(mNeed,TB3O.MerchantsInfo.mTotal);

         // add merchants to use
         insertBefore(editTbl.rows[resRowIdx], 
            $r(attrInject$,[ $th(T('USE')+":"),
                             $td(null,uiCreateUseTraders(sendResTable,mNeed))]));

         insertAfter(editTbl,$div([['id','tb_unitsdest'],attrInject$]));

         // modify resources at same manner as at 'send' page
         sendResTable.uiModify();
         sendResTable.setMerchantsToUse(mNeed, TB3O.MerchantsInfo.mTotal);

         uiRefresh();
      }
      catch(e)
      {
         __DUMP__(e)
      } 
   }

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiRemoveMarketRoutesInterface()
{
   __ENTER__

   var editTbl = __TEST__($g("trading_edit"));
   if ( editTbl )
   {
      var i;
      var injectedNodes = $xf("./following-sibling::*["+$xClass('tbInject')+"] | .//*["+$xClass('tbInject')+"]", 'r', editTbl);
      for ( i = 0; i < injectedNodes.snapshotLength; ++i )
      {
         var node = injectedNodes.snapshotItem(i);

         if ( hasClass(node,"tbSendRes") )
         {
            // revert table back to origin
            function c(ri,ci)
            { 
               return node.rows[ri].cells[ci].firstChild;
            }
            replaceChildren(node.parentNode,[c(0,0),c(0,1),c(1,0),c(1,1),c(2,0),c(2,1),c(3,0),c(3,1)]);
         }
         else
         {
            removeElement(node);
         }
      }
   }

   __EXIT__
}
