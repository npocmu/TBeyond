//////////////////////////////////////////////////////////////////////
// get merchants count
function parseMerchantsCount(container)
{
   if ( container )
   {
      if ( removeInvisibleChars(container.textContent).search(/\s*([^:]+):?\s+(\d+)\s*\/\s*(\d+)/) !== -1 )
      {
         T.saveLocaleString("MERCHANTS",RegExp.$1);
         TB3O.MerchantsInfo.mAvail = parseInt10(RegExp.$2);
         TB3O.MerchantsInfo.mTotal = parseInt10(RegExp.$3);
         __DUMP__(TB3O.MerchantsInfo.mAvail,TB3O.MerchantsInfo.mTotal)
      }
   }
   __ASSERT__(T("MERCHANTS"),"Can't parse merchant's locale name")
   __ASSERT__(!isNaN(TB3O.MerchantsInfo.mAvail),"Can't parse merchant's available count")
   __ASSERT__(!isNaN(TB3O.MerchantsInfo.mTotal),"Can't parse merchant's total count")

   if ( !isIntValid(TB3O.MerchantsInfo.mAvail) )  { TB3O.MerchantsInfo.mAvail = 0; }
}

//////////////////////////////////////////////////////////////////////
function setMerchantsCell(tM, colM)
{
   var cM = __TEST__($g("tb_merc_summary"));

   if ( cM )
   {
      cM.innerHTML = tM;
      $at(cM, [['style', 'font-size:11px; color:' + colM + ';line-height:16px;']]);
   }
}


//////////////////////////////////////////////////////////////////////
function __getMerchantRepeatCount(iRep)
{
   var repCount = null;
   if ( iRep )
   {
      if ( iRep.checked !== undefined  )
      {
         repCount = ( iRep.checked ) ? iRep.value : 1;
      }
      else
      {
         repCount = iRep.value;
      }
   }

   return repCount;
}

//////////////////////////////////////////////////////////////////////
function getMerchantRepeatCount()
{
   return __getMerchantRepeatCount(searchMerchantsRepeatCount());
}

//////////////////////////////////////////////////////////////////////
IIF_TB3({{
function processMarketSendConfirm()
{
   __ENTER__

   var tbDest = __TEST__($xf("//table[@id='target_validate']"));
   if ( tbDest )
   {
      if ( TBO_REMEMBER_SEND_COUNT === "1" ) 
      { 
         var repCount = getMerchantRepeatCount();
         if ( repCount )
         {
            TBO_MARKET_SEND_COUNT = repCount;
            saveTBOptions();
         }
      }
      var mkls = ['0', '0', '0', '0', -1000, -1000];
      var strDest = tbDest.rows[0].cells[0].textContent;
      var aDest = strDest.match(/\((-?\d+)\s*[\|\,\s\/]\s*(-?\d+)\)/g);
      var xyDest = aDest[0].replace("(", "").replace(")", "").split("|");
      var rtS = __TEST__($xf("//input[starts-with(@name, 'r')]", 'l'));
      if ( rtS.snapshotLength > 0 )
      {
         for (var xi = 0; xi < 4; xi++)
         {
            if (rtS.snapshotItem(xi).value == '') mkls[xi] = '0';
            else mkls[xi] = rtS.snapshotItem(xi).value;
         }
         mkls[4] = xyDest[0];
         mkls[5] = xyDest[1];
         setGMcookieV2("mkls", mkls, actV.vID);
      }
   }

   __EXIT__
}	
}})

//////////////////////////////////////////////////////////////////////
function uiCreateLastMarketSendTable()
{
   var cmkls = getGMcookieV2('mkls');
   if ( cmkls && cmkls[actV.vID] )
   {
      var mkls = cmkls[actV.vID];
      var bsh = false;
      for (var xi = 0; xi < 4; xi++)
      {
         if (mkls[xi] != 0) { bsh = true; }
      }

      if ( bsh )
      {
         //create the last send table for this village
         var aTb = $t([['id', 'mkls']]);
         var aRow = $r();
         aRow.appendChild($td([['class', 'mklshh']],I("vmkls")));
         for (var xi = 1; xi < 5; xi++)
         {
            aRow.appendChild($td([['class', 'mklshh']],I("r" + xi)));
         }
         aRow.appendChild($td([['class', 'mklshh']], T('RESEND')));
         aRow.appendChild($td([['class', 'mklshh']], T('DEL') ));

         var bRow = $r();
         bRow.appendChild($td([['class', 'mklsc']], "(" + mkls[4] + "|" + mkls[5] + ")"));
         for (var xi = 0; xi < 4; xi++)
         {
            bRow.appendChild($td(null, mkls[xi]));
         }
         bRow.appendChild($td([['class', 'mklsc']], '<a href=' + jsVoid + ' onClick = "' + (mkls[0] != 0 ? 'snd.r1.value=' + mkls[0] : '') + (mkls[1] != 0 ? '; snd.r2.value=' + mkls[1] : '') + (mkls[2] != 0 ? '; snd.r3.value=' + mkls[2] : '') + (mkls[3] != 0 ? '; snd.r4.value=' + mkls[3] : '') + '; snd.x.value=' + mkls[4] + '; snd.y.value=' + mkls[5] + ';"><img src="' + image["bOK"] + '" title="' + T('YES') + '" alt="' + T('YES') + '"></a>'));

         aLink = $a(gIc["del"], [['href', jsVoid]]);
         aLink.addEventListener("click", hideLastMarketSend(mkls), false);
         dC = $td([['class', 'mklsc']]);
         dC.appendChild(aLink);
         bRow.appendChild(dC);

         aTb.appendChild(aRow);
         aTb.appendChild(bRow);
         var ln = __TEST__($xf("//form//p[2] | //form/following-sibling::p[2]"));
         insertAfter(ln, aTb);
      }
   }

   function hideLastMarketSend(mkls)
   {
      return function ()
      {
         for (var xi = 0; xi < 4; xi++)
         {
            mkls[xi] = 0;
         }
         setGMcookieV2("mkls", mkls, actV.vID);
         $g('mkls').style.display = 'none';
      }
   }
}

//////////////////////////////////////////////////////////////////////
function MerchantsUnderwayIterator(aDoc, aGroupHeader)
{
   var aTb = aGroupHeader;

   this.next = function ()
   {
      while ( aTb )
      {
         aTb = aTb.nextSibling;

         if ( aTb && aTb.nodeType === 1 )
         {
            if ( TAG(aTb) !== "TABLE" && !hasClass(aTb,"traders") )
            {
               aTb = null; // end of group
            }
            break;
         }
      }
      return aTb;
   };
}

//////////////////////////////////////////////////////////////////////
function getMerchantsUnderwayGroup(MUInfo, villageInfo, aDoc, aGroupHeader, bIncoming, ttServer, bReadOnly)
{
   var muIterator = new MerchantsUnderwayIterator(aDoc, aGroupHeader);
   var villageMapId = xy2id(villageInfo.x,villageInfo.y);
   var aTb;
   while ( (aTb = muIterator.next()) )
   {
      var aRows = aTb.rows;
      if ( aRows.length >= 3 )
      {
         //this is a table for incoming/outgoing/returning merchants
         var userLink = $nth_tag(aRows[0].cells[0],"a");
         var userName = userLink.textContent;
         var userId = parseUri(userLink.getAttribute("href")).queryKey.uid;

         var pointLink = $nth_tag(aRows[0].cells[1],"a");
         var point = parseUri(pointLink.getAttribute("href")).queryKey.d;

         var timerNode = $nth_tag(aRows[1].cells[1],"span");
         var timeSpan = toSeconds(timerNode.textContent);

         var ttArrival = ttServer + (timeSpan * 1000);

         var xn = 1;
         var repeatNode = $qf(".repeat", 'f', aRows[2].cells[1]);
         if ( repeatNode ) 
         {
            xn = scanIntAny(repeatNode.textContent);
            if ( isNaN(xn) ) 
            { 
               xn = 1; 
               __ERROR__("can't parse merchant repeat count")
            }
         }
         var tdRes = $qf(".value", 'a', aRows[2].cells[1]);
         var Res = getResourcesFromNodes(tdRes);

         if ( userId && point && timeSpan && Res )
         {
            var srcMapId, destMapId;
            var ownerName, recipientName;
            var ownerId, recipientId;

            var bReturning = false;
            var type;

            if ( !bIncoming )
            {
               var resNodes = aRows[2].cells[1].getElementsByTagName("span");
               if ( resNodes.length >= 1 )
               {
                  bReturning = hasClass(resNodes[0],"none");
               }
            }

            if ( bIncoming || bReturning )
            {
               srcMapId  = point;
               destMapId = villageMapId;
            }
            else
            {
               srcMapId  = villageMapId;
               destMapId = point;
            }

            if ( !bIncoming || bReturning )
            {
               ownerName = TBU_NAME;
               IF_TB4(recipientName = userName;)
               ownerId = TB3O.UserID; 
               IF_TB4(recipientId = userId;)
            }
            else // incoming merchants
            {
               ownerName = userName;
               recipientName = TBU_NAME;
               ownerId = userId; 
               recipientId = TB3O.UserID;
            }

            if ( bIncoming )
            {
               type = 'i';
            }
            else if ( bReturning )
            {
               type = 'r';
            }
            else 
            {
               type = 'o';
            }

            var mui = new MerchantUnderwayInfo(ownerId, ownerName, recipientId, recipientName,
                                               srcMapId, destMapId, ttArrival, Res, xn);
            MUInfo[type].push(mui);

            if ( !bReadOnly ) 
            { 
               if ( !aTb.hasAttribute("id") ) { aTb.id = MerchantsUnderwayDOMInfo.generateId(); }
               var muDOMInfo = new MerchantUnderwayDOMInfo(aTb.id);
               MerchantsUnderwayDOMInfo.associate(mui,muDOMInfo);
            }

         }
         __ASSERT__( ownerId && point && timeSpan && Res, "Can't parse merchant underway data")
      }
   }
}

//////////////////////////////////////////////////////////////////////
// read data from market, option "Send resources"
function processMarketSend()
{
   __ENTER__

   // get merchant's capacity (class 'carry' introduced in Dinah mod (new market layout))
   var mCapNode = IIF_TB4(__TEST__($xf("//div[@id='build' and contains(@class,'gid17')]/div[contains(@class,'carry')]/b | //form//p/b")),
                          __TEST__($xf("//form//p/b | //form/following-sibling::p/b")));
   var mCap = 0;

   if ( mCapNode )
   {
      mCap = scanIntWithoutLetter(mCapNode.textContent);
      if ( isIntValid(mCap) ) { TB3O.ActiveVillageInfo.mCap = mCap; }
   }
   __ASSERT__(mCap,"Can't parse merchant's capacity")
   __DUMP__(TB3O.ActiveVillageInfo.mCap)

   // get merchants count
   processMarketSend.moC = searchMerchantsCountContainer();
   parseMerchantsCount(processMarketSend.moC);

   var mu = getMerchantsUnderway(TB3O.ActiveVillageId, document, toTimeStamp(TB3O.serverTime), false);
   __ASSERT__(mu,"Can't parse merchants underway info")

   TB3O.VillagesMUInfo.store(mu);

   __EXIT__
}

	
//////////////////////////////////////////////////////////////////////
//we are inside the market, option "Send resources"
function uiModifyMarketSend()
{
   __ENTER__

   var defValues = crtUrl.hashKey;
   var dtNow = getDesiredTimeNow();
   var mCap = TB3O.ActiveVillageInfo.mCap;
   var rxProgress = [];
   var uiOptions = new MarketSendUIOptions();
   var resTb = searchMarketSendResTable();
   var sendResTable = new SendResTable(resTb,uiOptions);
   var formular = __TEST__($g("merchantsOnTheWayFormular")); 
   var formularObserver = new MutationObserver(onMerchantsUnderwayModified);
   var div_button = __TEST__($g("button"));
   var destinationObserver = new MutationObserver(onMerchantsDestinationModified);

   var mu = TB3O.VillagesMUInfo.load();
   var destinationPicker;

   //-------------------------------------------------------------
   function initMerchantsStat()
   {
      sendResTable.setMerchantsToUse(TB3O.MerchantsInfo.mAvail, TB3O.MerchantsInfo.mAvail);
   }

   //-----------------------------------------------------------------
   function initMerchantsDestination()
   {
      addMerchantsRepeatCountPicker();
      destinationPicker = new DestinationPicker(searchMerchantsDestinationContainer,uiCreateMercDistTable);
   }

   //-------------------------------------------------------------
   function setDefaultTransportsFromUrl()
   {
      var rxVal = [0,0,0,0];
      var resAvail = getActualResourcesInfoNow(TB3O.ActiveVillageInfo.r, true).Res;
      var ri;

      for ( ri = 0; ri < 4; ++ri )
      {
         var bUseMerchants = false;
         var defValue = defValues["r" + (ri+1)];
         if ( defValue === undefined )
         {
            defValue = defValues["m" + (ri+1)];
            bUseMerchants = true;
         }

         if ( defValue === "max" ) { defValue = Infinity; }
         else                      
         { 
            defValue = parseInt10(defValue,0); 
            if ( !isIntValid(defValue) ) { defValue = 0; }
            if ( bUseMerchants ) { defValue *= mCap; }
         }
         sendResTable.setNewTransport(ri, defValue, resAvail, rxVal);
      }
   }

   //-------------------------------------------------------------
   function setDestinationFromUrl()
   {
      var x = defValues.x;
      var y = defValues.y;
      if ( x !== undefined && y !== undefined )
      {
         destinationPicker.setXY(x,y);
      }
   }

   //-------------------------------------------------------------
   // set values from url
   function setFieldsFromUrl()
   {
      if ( crtUrl.hashbang )
      {
         defValues = crtUrl.hashKey;

         setDefaultTransportsFromUrl();
         setDestinationFromUrl();
         setNewRepCount(defValues.xn);
      }
   }

   //-------------------------------------------------------------
  // initMerchantsStat();

   if ( TBO_SHOW_LAST_MARKET_SEND === "1" ) 
   {
      IF_TB3(uiCreateLastMarketSendTable();)
   }

   initMerchantsDestination();

   // for merchant routes - no of repeat actions
   var defRepeat = defValues.xn;
   if ( defRepeat === undefined && TBO_REMEMBER_SEND_COUNT === "1" )
   {
      defRepeat = TBO_MARKET_SEND_COUNT;
   }
   setNewRepCount(defRepeat);

   if ( resTb )
   {
      uiModifyMarketSendLayout(resTb,processMarketSend.moC);

      if ( processMarketSend.moC )
      {
         uiModifyMerchantsCountBar(processMarketSend.moC);
      }

      sendResTable.uiModify();
      initMerchantsStat();

      if ( crtUrl.hashbang ) { setDefaultTransportsFromUrl(); setDestinationFromUrl(); }

      TB3O.onHashChange = setFieldsFromUrl;
   }

   uiModifyMerchantsUnderway();

   if ( formular )
   {
      formularObserver.observe(formular, {childList:true});
   }

   if ( div_button )
   {
      destinationObserver.observe(div_button, {childList:true});
   }

   __EXIT__

   //-----------------------------------------------------------------
   function onMerchantsUnderwayModified(mutationList,mutationObserver)
   {
      mutationObserver.disconnect();
      setTimeout(uiRefreshMerchantsUnderway,0);
   }

   //-----------------------------------------------------------------
   function uiRefreshMerchantsUnderway()
   {
      __ENTER__
      var ttServer = toTimeStamp(getServerTimeNow());
      processMarketSend.moC = searchMerchantsCountContainer();
      parseMerchantsCount(processMarketSend.moC);
      initMerchantsStat();
      fireChangeEvent($g("tb_usetraders")); // force recalculation for max transport
      mu = getMerchantsUnderway(TB3O.ActiveVillageId, document, ttServer, false);
      TB3O.VillagesMUInfo.store(mu);
      getResourcesResCap(TB3O.ActiveVillageInfo.r, document, ttServer);
      saveVillagesInfo(TB3O.VillagesInfo);
      TB3O.ResInfoTotals = getResInfoTotals();
      uiModifyMerchantsUnderway();
      uiModifyLinks(formular);
      refreshSupplement(TB3O.ActiveVillageId);

      formularObserver.observe(formular, {childList:true});
      __EXIT__
   }

   //-----------------------------------------------------------------
   function uiRefreshMerchantsDestination()
   {
      __ENTER__
      initMerchantsDestination();
      destinationObserver.observe(div_button, {childList:true});
      __EXIT__
   }

   //-----------------------------------------------------------------
   function onMerchantsDestinationModified(e)
   {
      destinationObserver.disconnect();
      setTimeout(uiRefreshMerchantsDestination,0);
   }

   //-------------------------------------------------------------
   function uiModifyMerchantsUnderway()
   {
      removeElement($g("tb_arrm_progress"));
      removeElement($g("tb_arrm"));

      var resourcesEventsQueue = getVillageResourcesEventsQueue(TB3O.ActiveVillageId);
      sortEventsQueueByTime(resourcesEventsQueue);
      //__DUMP__(resourcesEventsQueue);

      if ( mu && TBO_SHOW_ADDINFO_INCOMING_MERC === '1' )
      {
         uiModifyUnderwayTables(mu.i, false);
         uiModifyUnderwayTables(mu.o, false);
         uiModifyUnderwayTables(mu.r, true);

         uiModifyArrivalsTables(resourcesEventsQueue);
      }

      if ( TBO_SHOW_ARR_TOTALS_TABLE_MP === '1' && resourcesEventsQueue.length > 0 )
      {
         var aTb = uiCreateCumulativeArrivalsTable(resourcesEventsQueue);
         if ( aTb ) 
         {
            var ri = -1;

            insertBefore(formular, aTb);

            for (var i = 0; i < 4; ++i )
            {
               if ( uiOptions._.showprogress[i] )
               {
                  ri = i;
                  break;
               }
            }

            if ( ri >= 0 )
            {
               if ( rxProgress[ri] ) 
               {
                  uiOptions._.showprogress = [false,false,false,false];
                  rxProgress[ri].click();
               }
            }
         }
      }
   }

   //-------------------------------------------------------------
   function uiCreateMercDistTable(x,y)
   {
      var repCount = getMerchantRepeatCount();
      return uiCreateTroopsMerchantsDistTable(null, null, xy2id(x,y),
                                             {show_merchant:true, show_coords:true, show_arrival_time:true,
                                              show_merchant_return:true, merchant_repeat:repCount});
   }

   //-----------------------------------------------------------------
   function uiModifyMerchantsCountBar(moC)
   {
      //----------------------------------------------------------
      function onClickUsePpH()
      {
         var totPpH = totalResources(TB3O.ActiveVillageInfo.r.PpH);
         $g("tb_useunires").value = totPpH;
         sendResTable.setMaxTransport();
      }

      //----------------------------------------------------------
      function onClickUsePpHAll()
      {
         var totPpHAll = totalResources(TB3O.ResInfoTotals.PpH);
         $g("tb_useunires").value = totPpHAll;
         sendResTable.setMaxTransport();
      }

      //--------------------------------------------------------------
      function onChangeUseUniRes()
      {
         if ( this.value !== "" ) 
         {
            var resToUse = Number(this.value);
            if ( isNaN(resToUse) || resToUse <= 0 )
            {
               resToUse = sendResTable.mUse * mCap;
               this.value = resToUse;
            }
         }
         sendResTable.setMaxTransport();
      }

      //----------------------------------------------------------
      function onClearUniRes()
      {
         $g("tb_useunires").value = "";
         sendResTable.setMaxTransport();
      }

      //----------------------------------------------------------
      addChildren(moC,[
         $span("\u00A0|\u00A0\u00A0" + T('USE') + "\u00A0\u00A0"),
         uiCreateUseTraders(sendResTable),
         " \u00A0",
         uiCreateTool("r0",T("DEL"),onClearUniRes),
         ":\u00A0",
         $i([['id','tb_useunires'],['type', 'text'], 
             ['class','text'], ['accesskey','r'], ['maxlength','6'],['size',IIF_TB4('4','5')],['title', T('USEUNIRES_TT')],
             ['keyup',  onChangeUseUniRes, false],
             ['change', onChangeUseUniRes, false]
             ]),
         "\u00A0",
         uiCreateTool("pph", T('USEPPH_TT'), onClickUsePpH)
      ]);
      if ( TB3O.VillagesCount > 1 ) 
      {
         addChildren(moC,[
            "\u00A0",
            uiCreateTool("pphall", T('USEPPHALL_TT'), onClickUsePpHAll)
         ]);
      }
   }

   //-----------------------------------------------------------------
   function setNewRepCount(repCount)
   {
      var iRep = searchMerchantsRepeatCount();
      if ( iRep && __getMerchantRepeatCount(iRep) != repCount ) 
      { 
         if ( iRep.checked !== undefined )
         {
            iRep.checked = (repCount > 1); 
         }
         else
         {
            iRep.value = repCount; 
         }
         fireChangeEvent(iRep);
      }
   }

   //-----------------------------------------------------------------
   function onRepCountChange()
   {
      destinationPicker.uiRefresh();
   }

   //-----------------------------------------------------------------
   function addMerchantsRepeatCountPicker()
   {
      var iRep = searchMerchantsRepeatCount();
      if ( iRep ) 
      { 
         iRep.addEventListener('change', onRepCountChange, false);
      }
      return iRep;
   }

   //-----------------------------------------------------------------
   function getUnderOverrunClass(ruoType)
   {
      return ( ruoType === null ) ? '' : (( ruoType ) ? 'tbOver' : 'tbUnder');
   }

   //-----------------------------------------------------------------
   function uiCreateUnderOverrunRows(st)
   {
      function uiCreateUnderOverrunCell(aRow, ri, ruo)
      {
         if ( ruo !== 0 )
         {
            if ( !aRow ) 
            { 
               aRow = $r();
               var rix;
               for ( rix = 0; rix < ri; ++rix )
               {
                  aRow.appendChild($td());
               }
            }
            aRow.appendChild($td(['class', (ruo > 0 ? 'tbOver':'tbUnder')],(ruo > 0 ? "+":"") + ruo));
            return aRow;
         }
         return null;
      }

      var ri;
      var ruoRows = [null,null];
      var ruoRowIdx;
      for ( ri = 0; ri < 4; ++ri )
      {
         var aRow;
         ruoRowIdx = 0;
         var ru = Math.floor(st.ru[ri]);
         var ro = Math.floor(st.ro[ri]);

         aRow = uiCreateUnderOverrunCell(ruoRows[ruoRowIdx], ri, ru);
         if ( aRow ) { ruoRows[ruoRowIdx++] = aRow; }
         aRow = uiCreateUnderOverrunCell(ruoRows[ruoRowIdx], ri, ro);
         if ( aRow ) { ruoRows[ruoRowIdx++] = aRow; }

         if ( ruoRows[0] && ruoRowIdx === 0 )
         {
            ruoRows[0].appendChild($td());
         }
         if ( ruoRows[1] && ruoRowIdx <= 1 )
         {
            ruoRows[1].appendChild($td());
         }
      }
      if ( ruoRows[0] ) { ruoRows[0].appendChild($td()); }
      if ( ruoRows[1] ) { ruoRows[1].appendChild($td()); }

      return ruoRows;
   }

   //-----------------------------------------------------------------
   // create table for arrival progress about resource
   function uiAddArrivalsProgressTable(rollDownCtrl, id, ri, resourcesEventsQueue)
   {
      var imgIncoming = I("tbiIn");
      var imgOutcoming = I("tbiOut");
      var imgMerchant = I("merchant");
      var rName = "r" + (ri+1);
      var ro_rest = 0, ru_rest = 0;

      function onClose()
      {
         rollDownCtrl.click();
      }

      //--------------------------------------------------------------
      function uiCreateProgressRow(resourcesEvent, resourcesInfo, ri, eventCell, st)
      {
         var ttEvent = resourcesInfo.ttUpd;
         var ruoType = st.ev[ri];
         var totalClass = '';
         var strTotal;

         if ( ruoType !== null )
         {
            var ruo = ( ruoType ) ? (st.ro[ri] + ro_rest) : (st.ru[ri] + ru_rest);
            var ruoInt = Math.floor(ruo);

            // Need to fix rest of overrun/underrun resources and use this rest
            // when calculate following progress rows
            // Otherwise systematic using Math.floor() will produce incorrect total result
            var rest = ruo - ruoInt;
            if ( ruoType ) { ro_rest = rest; } else { ru_rest = rest; }

            totalClass = ' ' + getUnderOverrunClass(ruoType);
            strTotal = (( ruoInt > 0 ) ? "+":"") + $ls(ruoInt);
         }
         else
         {
            var res = Math.floor(resourcesInfo.Res[ri]);
            strTotal = $ls(res);
            if ( isCapReached(res, resourcesInfo.EPpH[ri], resourcesInfo.Cap[ri])  )
            {
               totalClass = ' tbCapReached';
            }
         }

         var dtDesired = getDesiredTime(ttEvent);
         var clsPossible = (( resourcesEvent.bQueued ) ? '' : ' tbPossible');
         var aRow =
            $r(null,[
               $td(['class', 'tbArrivalT' + clsPossible], formatDateTime(dtNow, dtDesired, 1)),
               uiSetTimeSpanByDate($td(['class', 'tbTravelT' + clsPossible]), dtNow, dtDesired),
               eventCell,
               $td(['class', 'tbTotal' + totalClass], strTotal),
               uiSetFillPercent($td(),resourcesInfo,ri),
               $td(['class', 'tbResourceMeter'],uiCreateResourceMeterBar(resourcesInfo, ri))
            ]);
         return aRow;
      }

      //--------------------------------------------------------------
      function uiCreateUnderOverrunProgressRow(resourcesEvent, resourcesInfo, ri, st)
      {
         var aRow = null;
         var ruoType = st.ev[ri];

         // create the Under/Overrun row only if need
         if ( ruoType !== null )
         {
            var eventClass = getUnderOverrunClass(ruoType);
            var eventImg = ( ruoType ) ? [I(rName),I(rName),I(rName)] : I("r5");
            var resourcesInfoEv = cloneResourcesInfo(resourcesInfo); 
            resourcesInfoEv.ttUpd = st.ttf[ri];
            resourcesInfoEv.Res[ri] = ( ruoType ) ? resourcesInfoEv.Cap[ri] : 0;

            var eventCell = $td(['class', 'tbEvent ' + eventClass], eventImg);
            aRow = uiCreateProgressRow(resourcesEvent, resourcesInfoEv, ri, eventCell, st);
         }
         return aRow;
      }

      //--------------------------------------------------------------
      __ENTER__
      var armTable = $g('tb_arrm');
      if ( armTable )
      {
         var aBody;
         var prT = $t([attrInject$, ['id',id], ['cellspacing','1']], 
                      [
                         $e("thead",null,[
                            $r($th([['class', 'tbTitle'],['colspan','6']],[
                                                   T("ARRP", T("RES" + (ri+1)), countIf(resourcesEventsQueue,function(v) { return v.Res[ri] !== 0; })),
                                                   $div(['class', 'closediv'], uiCreateTool_Close(onClose))])),
                            $r(null,[
                               $th(I("clock")),
                               $th(I("hourglass")),
                               $th(T("EVENT")),
                               $th(['colspan','3'], I(rName))
                            ])
                         ]),
                         aBody = $e("tbody")
                      ]);

         var i;
         var resourcesInfo = cloneResourcesInfo(TB3O.ActiveVillageInfo.r);
         var resourcesEvent, state;

         for ( i = 0; i < resourcesEventsQueue.length; ++i )
         {
            if ( resourcesEventsQueue[i].Res[ri] !== 0 )
            {
               resourcesEvent = resourcesEventsQueue[i];
               state = getCumulativeResourcesInfoAfterEvent(resourcesInfo, resourcesEvent);

               //__DUMP__(getResourcesEventView(resourcesEvent, ri))
               //__DUMP__(getCumulativeResourcesStateView(resourcesInfo, state, ri))
               
               addChildren(aBody,uiCreateUnderOverrunProgressRow(resourcesEvent, resourcesInfo, ri, state.BA));
               var eventCell = $td(['class', 'tbEvent' + (( resourcesEvent.bIncoming ) ? ' tbIncoming' : ' tbOutcoming') +
                                                         (( resourcesEvent.bExact ) ? '' : ' tbPossible') ]);
               var strRes = $ls(resourcesEvent.Res[ri]) + (( resourcesEvent.bExact ) ? "" : "?");
               if ( resourcesEvent.bIncoming )
               {
                  addChildren(eventCell,[imgMerchant.cloneNode(true),imgIncoming.cloneNode(true),$span(strRes)]);
               }
               else
               {
                  addChildren(eventCell,[$span(strRes),imgOutcoming.cloneNode(true),imgMerchant.cloneNode(true)]);
               }

               aBody.appendChild(uiCreateProgressRow(resourcesEvent, resourcesInfo, ri, eventCell, state.A));
            }
         }

         // if there is an event for selected type of resource then we get its state after accumulation 
         if ( state )
         {
            aBody.appendChild(uiCreateUnderOverrunProgressRow(resourcesEvent, resourcesInfo, ri, state.AA));
         }

         insertAfter(armTable, prT);
      }
      __EXIT__
   }

   //-----------------------------------------------------------------
   // create the totals table for arrivals and planned dispatches of resources
   // resourcesEventsQueue must have at least one record
   function uiCreateCumulativeArrivalsTable(resourcesEventsQueue)
   {
      var imgIncoming = I("tbiIn");
      var imgOutcoming = I("tbiOut");

      function onClose()
      {
         removeElement($g("tb_arrm_progress"));
         removeElement($g("tb_arrm"));
         TBO_SHOW_ARR_TOTALS_TABLE_MP = '0';
         saveTBOptions();
      }

      //--------------------------------------------------------------
      function onChangeRollDownState(ri,e)
      {
         uiOptions._.showprogress[ri] = e.opened;
         var id = "tb_arrm_progress";
         if ( e.opened )
         {
            var i;
            for ( i = 0; i < 4; ++i )
            {
               if ( i !== ri )
               {
                  if ( uiOptions._.showprogress[i] && rxProgress[i] ) 
                  {
                     rxProgress[i].click(); // close other tables
                     removeElement($g(id));
                  }
               }
            }
            dtNow = getDesiredTimeNow();
            uiAddArrivalsProgressTable(rxProgress[ri], id, ri, resourcesEventsQueue);
         }
         else 
         {
            removeElement($g(id));
         }

         uiOptions.save();
      }

      //--------------------------------------------------------------
      function uiCreateTotalResourceCell(resIn, resOut)
      {
         var qCell = $td(['class', 'tbTotal']);
         if ( resIn > 0 )
         {
            addChildren(qCell,[imgIncoming.cloneNode(true),$span(['class','tbIncoming'],$ls(resIn))]);
            if ( resOut > 0 ) 
            {
               qCell.appendChild($e("br"));
            }
         }

         if ( resOut )
         {
            addChildren(qCell,[$span(['class','tbOutcoming'],$ls(resOut)),imgOutcoming.cloneNode(true)])
         }

         return qCell;
      }

      //--------------------------------------------------------------
      __ENTER__
      var i;
      var totResIncoming = [0, 0, 0, 0], totResOutcoming = [0, 0, 0, 0];
      var resourcesInfo = cloneResourcesInfo(TB3O.ActiveVillageInfo.r);
      var eventsCount = resourcesEventsQueue.length;
      var state = {};

      for ( i = 0; i < eventsCount; ++i )
      {
         var resourcesEvent = resourcesEventsQueue[i];
         accumulateResources( ( resourcesEvent.bIncoming ) ? totResIncoming:totResOutcoming, resourcesEvent.Res);
         getCumulativeResourcesInfoAfterEvent(resourcesInfo, resourcesEvent, state);
      }
      var ttLastArrival = resourcesEventsQueue[eventsCount-1].ttEnd;

      var armTable, armBody;
      armTable = $t([attrInject$, ['id','tb_arrm']],
                       armBody = $e("tbody",
                           $r(
                              $td([['class', 'cbgx'], ['colspan', '6']],[
                                 $div(['class', 'closediv'], uiCreateTool_Close(onClose)),
                                 T('ARRTOT',eventsCount)]))));

      var tsCell = uiSetTimeSpanByDate($td(), dtNow, getDesiredTime(ttLastArrival), {format:1});
      var rRow = $r($th(I("hourglass")));
      var qRow = $r(tsCell);
      var tRow = $r($td());

      var xi;
      for ( xi = 0; xi < 5; xi++ )
      {
         var tCell, rCell, qCell;

         if ( xi < 4 )
         {
            rxProgress[xi] = null;
            if ( totResIncoming[xi] > 0 || totResOutcoming[xi] > 0 ) 
            {
               rxProgress[xi] = uiCreateRollDownControl(false,T("ARRP_TT",T("RES" + (xi+1))));
               rxProgress[xi].addEventListener('change', bind2(onChangeRollDownState,[xi]), false);
            }

            rCell = $th(null, [I("r" + (xi+1)), rxProgress[xi]]);
            qCell = uiCreateTotalResourceCell(totResIncoming[xi], totResOutcoming[xi]);
            var cls = ( state.AA.ttf[xi] <= ttLastArrival ) ? getUnderOverrunClass(state.AA.ev[xi]) : '';
            tCell = uiSetTimeoutByDate($td([['class', cls]]), dtNow, getDesiredTime(state.AA.ttf[xi]), resourcesInfo.EPpH[xi], {format:1});
         }
         else
         {
            rCell = $th(I("r0"));
            qCell = uiCreateTotalResourceCell(totalResources(totResIncoming), totalResources(totResOutcoming));
            tCell = $td();
         }
         rRow.appendChild(rCell);
         qRow.appendChild(qCell);
         tRow.appendChild(tCell);
      }

      armBody.appendChild(rRow);
      armBody.appendChild(qRow);
      var rowSpan = 1;
      var ruoRows = uiCreateUnderOverrunRows(state.AA);
      if ( ruoRows[0] ) { armBody.appendChild(ruoRows[0]); ++rowSpan; }
      if ( ruoRows[1] ) { armBody.appendChild(ruoRows[1]); ++rowSpan; }
      tsCell.rowSpan = rowSpan;
      armBody.appendChild(tRow);

      __EXIT__
      return armTable;
   }

   //-----------------------------------------------------------------
   // add total resources
   // add 'duplicate' button
   function uiModifyUnderwayTables(muiArray, bReturning)
   {
      __ENTER__
      //--------------------------------------------------------------
      function uiAddTotalResources(aTb, merchantUnderwayInfo)
      {
         var resNode = aTb.rows[2].cells[1].lastElementChild;
         var cls = resNode.className;
         if ( cls ) { cls += " "; }
         cls += 'tbInject';
         insertAfter(resNode, 
            $span([['class', cls]],[
               " = ", I("r0"), " ",
               $e("b", $ls(totalResources(merchantUnderwayInfo.Res)))
            ])); 
      }

      //--------------------------------------------------------------
      // we can add duplicate link only for transports from own villages
      function uiAddDuplicateLink(aTb, merchantUnderwayInfo, bReturning)
      {
         if ( merchantUnderwayInfo.own_id == TB3O.UserID )
         {
            var parentNode = aTb.rows[0].cells[1].lastChild;
            var mapIdDict = getVillagesMapIdDict(TB3O.VillagesInfo);
            var srcMapId  = bReturning ? merchantUnderwayInfo.d_id : merchantUnderwayInfo.s_id;
            var destMapId = bReturning ? merchantUnderwayInfo.s_id : merchantUnderwayInfo.d_id;
            var ri, hashKey = { xn: merchantUnderwayInfo.xn };

            for ( ri = 0; ri < 4; ri++ )
            {
               hashKey["r" + (ri+1)] = merchantUnderwayInfo.Res[ri];
            }
            var href = getSendResHref(destMapId, mapIdDict[srcMapId], hashKey);

            insertAfter(parentNode, 
               $lnk([attrInject$, ['title',T("DUP_TRADERS_TT")], ['href',href]], I("dup")));
         }
      }

      //--------------------------------------------------------------
      var i, merchantUnderwayInfo, aTb;
      for ( i = 0; i < muiArray.length; ++i )
      {
         merchantUnderwayInfo = muiArray[i];
         aTb = $g(MerchantsUnderwayDOMInfo.getId(merchantUnderwayInfo));
         if ( aTb )
         {
            uiAddTotalResources(aTb, merchantUnderwayInfo);
            uiAddDuplicateLink(aTb, merchantUnderwayInfo, bReturning);
         }
      }
      __EXIT__
   }

   //-----------------------------------------------------------------
   function uiModifyArrivalsTables(resourcesEventsQueue)
   {
      __ENTER__

      if ( TB3O.ActiveVillageInfo.r.ttUpd !== undefined )
      {
         var resourcesInfo = cloneResourcesInfo(TB3O.ActiveVillageInfo.r);
         var i, cumState = {};

         for ( i = 0; i < resourcesEventsQueue.length; ++i )
         {
            var resourcesEvent = resourcesEventsQueue[i];
            var merchantUnderwayInfo = resourcesEvent.details.merchantUnderwayInfo;
            getCumulativeResourcesInfoAfterEvent(resourcesInfo, resourcesEvent, cumState);

            var aTb = $g(MerchantsUnderwayDOMInfo.getId(merchantUnderwayInfo));

            if ( aTb )
            {
               var resTb, resTbRow;

               addClass(aTb,"tbIncomingMerc");
               aTb.appendChild(
                  $e("tbody",attrInject$,
                     $r(null,[
                        $td([['class', 'tbArrivalT']],[I("clock"),$span(" " + formatDateTime(dtNow,getDesiredTime(resourcesEvent.ttEnd),1))]),
                        $td([['class', 'tbArrivalRes'],['colspan', '2']], 
                           resTb = $t([['rules', 'cols']],
                              resTbRow = $r()))
                     ]))
               );   

               var uthen = floorResources(cloneArray(resourcesInfo.Res)); 
               var ri;
               for ( ri = 0; ri < 4; ++ri )
               {
                  resTbRow.appendChild($td([['class', (resourcesInfo.Res[ri] >= resourcesInfo.Cap[ri] ? 'tbCapReached':null)]],
                                           [I("r"+ (ri + 1)),$span(" " + String(uthen[ri]))]));
               }
               resTbRow.appendChild($td(null,[I("r0"),$span(" " + String(totalResources(uthen)))]));

               var ruoRows = uiCreateUnderOverrunRows(cumState.AA);
               if ( ruoRows[0] ) { resTb.appendChild(ruoRows[0]); }
               if ( ruoRows[1] ) { resTb.appendChild(ruoRows[1]); }
            }
         }
      }
      __EXIT__
   }
}

