//////////////////////////////////////////////////////////////////////
function MarketSendUIOptions()
{
   this._ = this.load();
}

//--------------------------------------------------------------------
MarketSendUIOptions.prototype.load = function()
{
   var uiOptions = loadPersistentUserObject("market_send")[TB3O.ActiveVillageId] || {};

   if ( !uiOptions.usethemres || !(uiOptions.usethemres instanceof Array) )
   {
      uiOptions.usethemres = [true,true,true,true];
   }
   if ( !uiOptions.showprogress || !(uiOptions.showprogress instanceof Array) )
   {
      uiOptions.showprogress = [false,false,false,false];
   }

   var ri;
   for ( ri = 0; ri < 4; ri++ )
   {
      if ( typeof(uiOptions.usethemres[ri]) !== "boolean" ) { uiOptions.usethemres[ri] = true; }
      if ( typeof(uiOptions.showprogress[ri]) !== "boolean" ) { uiOptions.showprogress[ri] = false; }
   }
   return uiOptions;
}

//--------------------------------------------------------------------
MarketSendUIOptions.prototype.save = function()
{
   savePersistentUserObject("market_send", this._, TB3O.ActiveVillageId);
}



//////////////////////////////////////////////////////////////////////
function SendResTable(resTb, uiOptions)
{
   this.resTb = resTb;
   this.mCap = TB3O.ActiveVillageInfo.mCap;
   this.mAvail = 0; // available merchants
   this.mUse = 0;   // merchants to use
   this.maxTr = 0;  // maximum resources to transportation
   this.rxI = [];
   this.uiOptions = uiOptions;
   this.aUTR = uiOptions._.usethemres;
   this.refreshTimer = new Timer;

   var ri;
   for ( ri = 0; ri < 4; ri++ )
   {
      this.rxI[ri] = __TEST__($xf(".//input[@name='r" + (ri + 1) + "']"), 'f', this.resTb);
   }
}

//--------------------------------------------------------------------
SendResTable.prototype.getCurrentTransports = function()
{
   var ri;
   var rxVal = [0,0,0,0];

   for ( ri = 0; ri < 4; ++ri )
   {
      rxVal[ri] = parseInt10(this.rxI[ri].value,0);
   }

   return rxVal;
};

//--------------------------------------------------------------------
SendResTable.prototype.getTotalTransportsAvailable = function(rxVal)
{
   var totTr = 0;
   var ri;

   for ( ri = 0; ri < 4; ++ri )
   {
      if ( !this.aUTR[ri] ) { totTr += rxVal[ri]; }
   }

   return this.maxTr - totTr;
};

//--------------------------------------------------------------------
SendResTable.prototype.getTotals = function()
{
   var totTransport = totalResources(this.getCurrentTransports());
   var totMerchants = Math.ceil(totTransport / this.mCap);
   var crtWaste = this.mCap - (totTransport - (totMerchants - 1) * this.mCap);
   var crtExceed = totTransport - (this.mAvail * this.mCap);

   return { total: totTransport, waste: crtWaste, exceed: crtExceed, mNeed: totMerchants};
};


//--------------------------------------------------------------------
SendResTable.prototype.uiModifyState = function()
{
   var totals = this.getTotals();
   var totTransport = totals.total;
   var totMerchants = totals.mNeed;
   var crtWaste = totals.waste;
   var crtExceed = totals.exceed;

   var mhText = gIc["merchant"] + "<b>" + " (" + T("MERCHANTS") + "): " + 
                totMerchants + "/" + this.mUse;  

   if ( this.mUse !== this.mAvail ) { mhText +=  " (" + this.mAvail + ")"; }
   mhText += "<br>" + T('MAX') + ": " + this.mUse * this.mCap;
   if ( this.mUse !== this.mAvail ) { mhText +=  " (" + (this.mAvail * this.mCap) + ")"; }
   mhText += "<br>";

   var mhColor;
   if ( totMerchants > this.mAvail )
   {
      mhColor = "red";
      mhText += T('MTX') + ": " + crtExceed;
   }
   else 
   {
      mhColor = ( totTransport > this.maxTr || totMerchants > this.mUse ) ? "orange" : "darkgreen";
      mhText += T('MTW') + ": " + crtWaste;
   }

   mhText += "<br>" + T('MTC') + ": " + totTransport + "</b>";
   setMerchantsCell(mhText, mhColor);
}

//--------------------------------------------------------------------
SendResTable.prototype.uiRefreshState = function()
{
   var self = this;
   var timer = this.refreshTimer;

   function doRefreshState()
   {
      timer.cancel();
      self.uiModifyState();
   }

   if ( !timer.isActive() )
   {
      if ( self.initialized )
      {
         timer.set(doRefreshState, TB3O.Timeouts.refresh_delay);
      }
      else
      {
         self.uiModifyState();
      }
   }
   self.initialized = true;
};

//--------------------------------------------------------------------
SendResTable.prototype.setMerchantsToUse = function(mUse, mAvail)
{
   if ( mAvail !== undefined )
   {
      this.mAvail = mAvail;
   }
   this.mUse = ( mUse ) ?  mUse : this.mAvail;
   this.maxTr = this.mUse * this.mCap;
   this.uiRefreshState();
};

//--------------------------------------------------------------------
SendResTable.prototype.setMaxTransport = function()
{
   var resToUseCtrl = $g("tb_useunires");
   var resToUseValue = resToUseCtrl ? resToUseCtrl.value : "";
   var resToUse = Number(resToUseValue);

   if ( resToUseValue === "" || isNaN(resToUse) ||  this.mUse * this.mCap < resToUse )
   {
      this.maxTr = this.mUse * this.mCap;
   }
   else if ( !isNaN(resToUse) )
   {
      this.maxTr = resToUse;
   }

   this.uiRefreshState();
};

//--------------------------------------------------------------------
SendResTable.prototype.setTransportRes = function(ri,val)
{
   if ( !this.rxI[ri].readOnly ) 
   { 
      this.rxI[ri].value = val; 
      fireChangeEvent(this.rxI[ri]);
   } 
};

//--------------------------------------------------------------------
SendResTable.prototype.setTransports = function(rxVal)
{
   var ri;

   for ( ri = 0; ri < 4; ++ri )
   {
      if ( this.aUTR[ri] ) { this.setTransportRes(ri, rxVal[ri]); }
   }
}

//--------------------------------------------------------------------
SendResTable.prototype.setNewTransport = function(ri, q, resAvail, rxVal)
{
   var resOrg = rxVal[ri];
   var resNew = rxVal[ri];

   if ( q === undefined )
   {
      resNew = resAvail[ri];
   }
   else
   {
      resNew += q;
   }

   if ( resNew > resAvail[ri] ) { resNew = resAvail[ri]; }
   rxVal[ri] = resNew;
   var resTot = totalResources(rxVal);

   if ( resTot > this.maxTr ) 
   { 
      resNew -= resTot - this.maxTr;
      if ( resNew < resOrg ) { resNew = resOrg; }
   }

   rxVal[ri] = resNew;
   this.setTransportRes(ri, resNew);
};

//--------------------------------------------------------------------
// return 3 arrays[4]
// { Res,  - resources available for distribute
//   Rest, - rest of resources on warehouse/grannary
//   EPpH  - resource production rate
// }
SendResTable.prototype.getResourcesState = function()
{
   var resourcesInfo = getActualResourcesInfoNow(TB3O.ActiveVillageInfo.r, true);
   return {Res:resourcesInfo.Res, Rest:resourcesInfo.Res, EPpH:resourcesInfo.EPpH};
};

//--------------------------------------------------------------------
// ensure that we maximize our merchants
SendResTable.prototype.distributeTransportsRemains = function(remains, rxVal, resAvail)
{
   var ri;
   var usedResCount = 0;
   for ( ri = 0; ri < 4; ++ri )
   {
      if ( this.aUTR[ri] ) { ++usedResCount; }
   }

   __DUMP__(remains, resAvail, usedResCount)

   if ( usedResCount )
   {
      while ( remains > 0 )
      {
         var remainsOld = remains;
         var quantum = (remains > 12) ? Math.floor(remains/usedResCount) : 1;
         __DUMP__(remains, quantum, rxVal, usedResCount)

         usedResCount = 0;
         for ( ri = 0; ri < 4; ++ri )
         {
            if ( this.aUTR[ri] && rxVal[ri] < resAvail[ri] )
            {
               var resNew = rxVal[ri] + quantum;
               if ( resNew > resAvail[ri] ) { resNew = resAvail[ri]; }
               else { ++usedResCount; }
               remains -= (resNew - rxVal[ri]);
               rxVal[ri] = resNew;
               if ( remains <= 0 ) { break; }
            }
         }
         if ( remainsOld === remains ) { break; }
      }
      __DUMP__(remains, rxVal)
   }

   return remains;
};

//--------------------------------------------------------------------
// ensure that we maximise our merchants
SendResTable.prototype.maximizeTransports = function(rxVal, resAvail)
{
   var waste = this.maxTr - totalResources(rxVal);
   this.distributeTransportsRemains(waste, rxVal, resAvail);
};

//--------------------------------------------------------------------
SendResTable.prototype.distributeTransportsProportional = function(resAvail, distValues)
{
   var totDistValue = 0;
   var ri;

   for ( ri = 0; ri < 4; ++ri )
   {
      if ( this.aUTR[ri] ) 
      { 
         if ( distValues[ri] > 0 ) { totDistValue += distValues[ri]; }
      }
   }

   var dmx = 0;
   var rxVal = this.getCurrentTransports();
   if ( totDistValue > 0 )
   {
      dmx = this.getTotalTransportsAvailable(rxVal) / totDistValue;
   }

   for ( ri = 0; ri < 4; ++ri )
   {
      if ( this.aUTR[ri] )
      {
         var aRes = Math.floor(distValues[ri] * dmx);

         if ( aRes < 0 ) { aRes = 0; }
         else if ( aRes > resAvail[ri] ) { aRes = resAvail[ri]; }

         rxVal[ri] = aRes;
      }
   }
   this.maximizeTransports(rxVal,resAvail);
   this.setTransports(rxVal);
};

//--------------------------------------------------------------------
SendResTable.prototype.distributeTransportsEqual = function(resAvail)
{
   var totResAvail = 0;
   var usedResCount = 0;
   var ri;

   for ( ri = 0; ri < 4; ++ri )
   {
      if ( this.aUTR[ri] ) 
      { 
         totResAvail += resAvail[ri]; 
         usedResCount += 1;
      }
   }

   var rxVal = this.getCurrentTransports();
   var minA = Math.floor(this.getTotalTransportsAvailable(rxVal) / usedResCount);
   var minB = Math.floor(totResAvail / usedResCount);
   var minX = Math.min(minA, minB);

   for ( ri = 0; ri < 4; ++ri )
   {
      if ( this.aUTR[ri] ) 
      {
         var aRes = minX;
         if ( aRes < 0 ) { aRes = 0; }
         else if ( aRes > resAvail[ri] ) { aRes = resAvail[ri]; }
         rxVal[ri] = aRes;
      }
   }
   this.maximizeTransports(rxVal,resAvail);
   this.setTransports(rxVal);
}

//--------------------------------------------------------------------
SendResTable.prototype.uiModify = function()
{
   var self = this;

   //-----------------------------------------------------------------
   function mhRowUpdate()
   {
      self.uiRefreshState();
   }

   //-----------------------------------------------------------------
   function onClickUseThemResOption(ri)
   {
      self.aUTR[ri] = Boolean(this.checked);
      if ( typeof(self.uiOptions.save) === "function" )
      {
         self.uiOptions.save();
      }
   }

   //-----------------------------------------------------------------
   function onClearTransportRes(ri)
   {
      self.setTransportRes(ri,'');
   }

   //-----------------------------------------------------------------
   function onClearAllTransports(considerUseThem)
   {
      var ri;
      for ( ri = 0; ri < 4; ri++ )
      {
         if ( !considerUseThem || (considerUseThem && self.aUTR[ri]) )
         {
            self.setTransportRes(ri,'');
         }
      }
   }

   //-----------------------------------------------------------------
   function onClickUseThemAllPr()
   {
      var resourcesState = self.getResourcesState();
      self.distributeTransportsProportional(resourcesState.Res, resourcesState.Rest);
   }

   //-----------------------------------------------------------------
   function onClickUseThemAll1H()
   {
      var resourcesState = self.getResourcesState();
      self.distributeTransportsProportional(resourcesState.Res, resourcesState.EPpH);
   }

   //-----------------------------------------------------------------
   function onClickUseThemAllEq()
   {
      self.distributeTransportsEqual(self.getResourcesState().Res);
   }

   //-----------------------------------------------------------------
   function onQCarry(ri, q)
   {
      var rxVal = self.getCurrentTransports();
      var resAvail = self.getResourcesState().Res;

      if ( ri < 4 )
      {
         self.setNewTransport(ri, q, resAvail, rxVal);
      }
      else
      {
         for ( ri = 0; ri < 4; ++ri )
         {
            if ( self.aUTR[ri] )
            {
               self.setNewTransport(ri, q, resAvail, rxVal);
            }
         }
      }
   }

   //--------------------------------------------------------------
   function getQcarryArray(capacity)
   {
      var bAdjMc = true;
      var aQcarry = [100, 250, 500, 1000]; // Array of new quantities
      var i;
      for ( i = 0; i < aQcarry.length; i++ )
      {
         if ( capacity === aQcarry[i] )
         {
            bAdjMc = false;
            break;
         }
      }

      if ( bAdjMc ) 
      { 
         aQcarry = [100, 500, 1000, capacity]; 
         aQcarry.sort(compareNumbers);
      }

      return aQcarry;
   }

   //--------------------------------------------------------------
   // For each new quantity and resource create a new link with the associated request
   function uiAddQCarryCells(aRow, ri, aQcarry)
   {
      var j, aLink;
      for ( j = 0; j < aQcarry.length; j++)
      {
         aLink = $action(['class','tbQCarry' + (aQcarry[j] === self.mCap ? " tbMCap":"")],
                        '&nbsp;' + aQcarry[j], bind(onQCarry,[ri, aQcarry[j]]));
         aRow.appendChild($td(attrInject$,aLink));
      }

      //add the ALL option to the list of links
      aLink = $action(['class','tbQCarry'], '&nbsp;' + T('ALL'), bind(onQCarry,[ri]));
      aRow.appendChild($td(attrInject$,aLink));
   }

   //--------------------------------------------------------------
   var aQcarry = getQcarryArray(this.mCap);
   var ri;
   var aCell, aRow;
   var aCheck, aTool;

   addClass(this.resTb,"tbSendRes");

   for ( ri = 0; ri < 4; ri++ )
   {
      aRow = this.resTb.rows[ri];
      hide(aRow.cells[3]); //Remove original options

      aRow.cells[0].addEventListener("click", mhRowUpdate, false);

      aCell = $td([['class','tbInject tbUseThem']]);
      aCheck = $i([['type', 'checkbox'], ['title', T('USERES_TT',T('RES'+(ri+1)))]]);
      aCheck.checked = this.aUTR[ri];
      aCheck.addEventListener('click', bind(onClickUseThemResOption,[ri]), false);
      aCell.appendChild(aCheck);
      aRow.appendChild(aCell);

      aRow.appendChild($td(attrInject$,uiCreateTool("del", null, bind(onClearTransportRes,[ri]))));

      uiAddQCarryCells(aRow, ri, aQcarry);

      aTool = null;
      if ( ri === 0 )
      {
         aTool = uiCreateTool("usethempr", T('USETHEMPR'), onClickUseThemAllPr);
      }
      else if ( ri === 1 )
      {
         aTool = uiCreateTool("usethemeq", T('USETHEMEQ'), onClickUseThemAllEq);
      }
      else if ( ri === 2 )
      {
         aTool = uiCreateTool("usethem1h", T('USETHEM1H'), onClickUseThemAll1H);
      }
      aRow.appendChild($td([['class','tbInject tbTool']],aTool));

      this.rxI[ri].addEventListener('keyup', mhRowUpdate, false);
      this.rxI[ri].addEventListener('change', mhRowUpdate, false);
   }

   //add all resource type images and the clear all button
   var clAllRow = $r(attrInject$,
                  [
                     $td(attrInject$, I("r0") ),
                     // 10 for Routes, 12 for Send
                     (aRow.cells.length === 12) ? $td(attrInject$) : null,
                     $td(attrInject$,
                         uiCreateTool("bDel", T('MTCL'), bind(onClearAllTransports,[false]))),
                     $td(attrInject$),
                     $td(attrInject$,
                         uiCreateTool("del", null, bind(onClearAllTransports,[true])))
                  ]);
   uiAddQCarryCells(clAllRow, 4, aQcarry);
   clAllRow.appendChild($td(attrInject$));
   this.resTb.appendChild(clAllRow);
   this.resTb.appendChild($r(attrInject$,$td([['id', 'tb_merc_summary'], ['colspan', clAllRow.cells.length]])));
}

//////////////////////////////////////////////////////////////////////
function uiCreateUseTraders(sendResTable, defValue)
{
   //----------------------------------------------------------
   function onChangeUseTraders()
   {
      sendResTable.setMerchantsToUse(validateInputInt(this, 1, sendResTable.mAvail));
      sendResTable.setMaxTransport();
   }

   //----------------------------------------------------------
   function onClearTraders()
   {
      $g("tb_usetraders").value = "";
      sendResTable.setMerchantsToUse();
      sendResTable.setMaxTransport();
   }

   var useTraders;
   var control =
      $span(['class','tbUseTradersCtrl'],[
         uiCreateTool("merchant", T("DEL"), onClearTraders),
         ":\u00A0",
         useTraders = $i([['id','tb_usetraders'],['type', 'text'], 
             ['class','text'], ['accesskey','t'], ['maxlength','2'],['title', T('USETRADERS_TT')],
             ['keyup',  onChangeUseTraders, false],
             ['change', onChangeUseTraders, false]
             ])]);

   uiAddBuiltinUpDownControl(useTraders);

   if ( defValue )
   {
      useTraders.value = defValue;
   }

   return control;
}
