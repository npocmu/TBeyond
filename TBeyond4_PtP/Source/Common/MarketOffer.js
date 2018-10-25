//////////////////////////////////////////////////////////////////////
function processMarketOffer()
{
   __ENTER__
   // get merchants count
   processMarketOffer.moC = searchMarketOfferMerchantsCountContainer();
   parseMerchantsCount(processMarketOffer.moC);

   __DUMP__(TB3O.ActiveVillageInfo.mCap)
   __EXIT__
}


//////////////////////////////////////////////////////////////////////
function uiModifyMarketOffer()
{
   __ENTER__
   var formItems = searchMarketOfferFormItems();
   var mCap = TB3O.ActiveVillageInfo.mCap;
   var mAvail = TB3O.MerchantsInfo.mAvail;

   var rxI1 = formItems.m1;
   var rxI2 = formItems.m2;
   var rxType1 = formItems.rid1;
   var rxType2 = formItems.rid2;

   var uiOptions;

   //-----------------------------------------------------------------
   function loadUIOptions()
   {
      uiOptions = loadPersistentUserObject("market_offer") || {};

      if ( !uiOptions.ratios || !(uiOptions.ratios instanceof Array) )
      {
         uiOptions.ratios = [];
      }

      var ri;
      for ( ri = 0; ri < 4*4; ri++ )
      {
         if ( typeof(uiOptions.ratios[ri]) !== "number" ) { uiOptions.ratios[ri] = 1.0; }
      }

      if ( typeof(uiOptions.use_maxtime) !== "boolean" ) { uiOptions.use_maxtime = false; }
      if ( typeof(uiOptions.ally) !== "boolean" ) { uiOptions.ally = false; }
      if ( typeof(uiOptions.use_ratio) !== "boolean" ) { uiOptions.use_ratio = false; }

   }

   //-----------------------------------------------------------------
   function saveUIOptions()
   {
      savePersistentUserObject("market_offer", uiOptions);
   }

   //-------------------------------------------------------------
   function $stringify(arr)
   {
      var i;
      var str = "";

      for ( i = 0; i < arr.length; i++ )
      {
         if ( arr[i] !== "" )
         {
            if ( i ) { str += '$'; }
            str += arr[i];
         }
         else 
         {
            str = "";
            break;
         }
      }   
      return str;
   }

   //-------------------------------------------------------------
   function $$stringify(arr)
   {
      var i;
      var str = "";

      for ( i = 0; i < arr.length; i++ )
      {
         var s = $stringify(arr[i]);
         if ( s !== "" )
         {
            if ( i ) { str += '$$'; }
            str += s;
         }
      }   
      return str;
   }

   //-------------------------------------------------------------
   function saveOffers(offers)
   {
      savePersistentUserValue("ventas", $$stringify(offers));
   }

   //-------------------------------------------------------------
   function loadOffers()
   {
      var ventas = [];

      var strOffers = loadPersistentUserValue("ventas", "");
      if ( typeof(strOffers) !== "string")
      {
         saveOffers([]);
         strOffers = '';
      }

      if ( strOffers !== '' )
      {
         var offers = strOffers.split("$$");
         var i = 0;
         for ( i = 0; i < offers.length; i++ )
         {
            ventas[i] = offers[i].split("$");
         }
      }
      __DUMP__(ventas)

      return ventas;
   }

   //-------------------------------------------------------------
   function saveOffer(offer)
   {
      __DUMP__(offer)

      var offers = loadOffers();
      offers.push(offer);
      saveOffers(offers);
   }

   //-------------------------------------------------------------
   function uiApplyOffer(offer)
   {
      //----------------------------------------------------------
      function setValue(name, v)
      {
         var aElem = formItems[name];
         if ( aElem ) { aElem.value = v; }
      }
      //----------------------------------------------------------
      function setCheck(name, v)
      {
         var aElem = formItems[name];
         if ( aElem ) { aElem.checked = (v === '1'); }
      }

      __DUMP__(offer)

      setValue("m1",  offer[0]);
      setValue("m2",  offer[1]); 
      setValue("rid1",offer[2]); 
      setValue("rid2",offer[3]); 
      setValue("d2",  offer[4]); 
      setCheck("d1",  offer[5]);
      setCheck("ally",offer[6]);
      formItems.m2.disabled = false; // need to POST the field
      formItems.form.submit();
   }

   //-------------------------------------------------------------
   function uiCreateSavedOffersTable()
   {
      //----------------------------------------------------------
      function onClickAdd(indexNo)
      {
         uiApplyOffer(TB3O.SavedOffers[indexNo]);
      }

      //----------------------------------------------------------
      function onClickDel(rowIndex, indexNo)
      {
         if (confirm(T('DEL') + ". " + T('QSURE')))
         {
            TB3O.SavedOffers.splice(indexNo, 1);
            saveOffers(TB3O.SavedOffers);

            var aTb = __TEST__($g("tb_offers"));
            aTb.tBodies[0].deleteRow(rowIndex);
            if ( aTb.tBodies[0].rows.length === 0 )
            {
               removeElement(aTb.parentNode);
            }
         }
      }

      //----------------------------------------------------------
      function uiCreateRatioCell(ratio)
      {
         var rC = $td([["class", ratio < 1.00 ? "ratio_l": ratio > 1.00 ? "ratio_g" : "ratio_e"]], ratio.toFixed(2));
         return rC;
      }


      //----------------------------------------------------------
      __ENTER__
      var aTb = null;

      // display saved offers
      if ( TB3O.SavedOffers.length > 0 )
      {
         var i, j = 0;
         var aR, aBody;
         var arH = [T('OFREZCO'), I("ratio"), T('BUSCO'), IIF_TB4(T('MERCHANTS'),I('merchant')), T('8'), T('MAXTIME'), T('SELL'), T('DEL')];
         var arCl= [            , "tbRatio"];


         aTb = $t(["id", "tb_offers"],[
            $e("thead",null,[
               $r($th([['class','cbgx'], ['colspan',arH.length]], T('VENTAS'))),
               aR = $r()]),
            aBody = $e("tbody")]
         );

         for ( i = 0; i < arH.length; i++ ) { aR.appendChild($td(['class', arCl[i]], arH[i])); }

         var attrVal = ['class', 'tbVal'];
         var attrOther = ['class', 'soffc'];
         for ( i = 0; i < TB3O.SavedOffers.length; i++ )
         {
            var offer = TB3O.SavedOffers[i];
            var strVillageId = offer[7];
            if ( strVillageId == TB3O.ActiveVillageId || strVillageId === undefined )
            {
               var bR = $r();

               if ( strVillageId === undefined )
               {
                  bR.className = "tbOfferG";
               }

               bR.appendChild($td(attrVal,  [I("r" + (offer[2])), ' ' + offer[0]]));
               bR.appendChild(uiCreateRatioCell(offer[1]/offer[0]));
               bR.appendChild($td(attrVal,  [I("r" + (offer[3])), ' ' + offer[1]]));
               bR.appendChild($td(attrOther,Math.ceil(offer[0] / TB3O.ActiveVillageInfo.mCap)));
               bR.appendChild($td(attrOther,offer[6] === '1' ? T('YES') : T('NO')));
               bR.appendChild($td(attrOther,offer[5] === '1' ? offer[4] : T('NO')));
               bR.appendChild($td(['class','tbSave'], uiCreateTool("bOK",T('SELL'),bind(onClickAdd,[i]) )));
               bR.appendChild($td(attrOther, uiCreateTool("del",null,bind(onClickDel,[j,i]) )));
               aBody.appendChild(bR);
               ++j;
            }
         }
      }
      __EXIT__

      return ( aTb && aTb.tBodies[0].rows.length > 0 ) ? aTb : null;
   }

   //-------------------------------------------------------------
   function mhRowUpdate3()
   {
      var aR1 = parseInt10(rxI1.value);
      var aR2 = parseInt10(rxI2.value);
      var totTransport = isIntValid(aR1) ? aR1 : 0;
      var totMerchants = Math.ceil(totTransport / mCap);

      //MarioCheng & DMaster wasted/exceeding resources
      var crtWaste = mCap - (totTransport - (totMerchants - 1) * mCap);
      var crtExceed = totTransport - (mAvail * mCap);
      var mhColor;
      var mhText = "<b>" ;

      if ( totMerchants > mAvail )
         mhText += "*";

      mhText += T("MERCHANTS") + ": " + totMerchants + "/" + mAvail + "<br>" + 
                T('MAX') + ": " + mAvail * mCap + "<br>";

      if ( totMerchants > mAvail )
      {
         mhColor = "red";
         mhText += T('MTX') + ": " + crtExceed;
      }
      else
      {
         mhColor = "darkgreen";
         mhText += T('MTW') + ": " + crtWaste;
      }

      mhText += "<br>";
      mhText += T('MTC') + ": " + totTransport;

      if ( totTransport > 0 && aR2 > 0 )
      {
         mhText += "<br>";

         var ratio = aR2/totTransport;
         var sratio = ratio.toFixed(2);
         if ( /*ratio < 0.50 ||*/ ratio > 2.00)
         {
            mhColor = "red";
            mhText += "*";
         }
         mhText += T('MTR') + ": " + sratio;
         /*if ( ratio < 0.50 )
         {
            mhText += " " + T('MTRMIN',"0.50");
         }*/
         if ( ratio > 2.00 )
         {
            mhText += " " + T('MTRMAX',"2.00");
         }
      }

      mhText += "</b>";
      setMerchantsCell(mhText, mhColor);
      return;
   }

   //-------------------------------------------------------------
   function onOfferOrRatioChanged()
   {
      if ( uiOptions.use_ratio )
      {
         var ratio = parseFloat($g("tb_ratio").value);
         if ( isFinite(ratio) && ratio > 0 )
         {
            var aR1 = parseInt10(rxI1.value);
            if ( isIntValid(aR1) )
            {
               rxI2.value = Math.round(aR1 * ratio);
               __DUMP__(aR1,ratio,rxI2.value)
            }
         }
      }

      mhRowUpdate3();
   }

   //-------------------------------------------------------------
   function validateRatio(ratio)
   {
      if ( ratio < 0.1 ) { ratio = 0.1; }
      else if ( ratio > 2.0 ) { ratio = 2.0; }
      else if ( !isFinite(ratio) ) { ratio = 1.0; }
      return ratio;
   }

   //-------------------------------------------------------------
   function getRatioIndex()
   {
      var aType1 = parseInt10(rxType1.value) - 1;
      var aType2 = parseInt10(rxType2.value) - 1;
      return aType1*4 + aType2;
   }

   //-------------------------------------------------------------
   function setRatio(ratio)
   {
      $g("tb_ratio").value = ratio.toFixed(2);
   }

   //-------------------------------------------------------------
   function setDefaultRatio()
   {
      replaceChildren($g("tb_ratio_r1"), I("r" + rxType1.value));
      replaceChildren($g("tb_ratio_r2"), I("r" + rxType2.value));
      setRatio(validateRatio(uiOptions.ratios[getRatioIndex()]));
   }

   //-------------------------------------------------------------
   // add option to save the offer
   // add option to save the offer as global (Zippo)
   // add option 'use ratio'
   function uiAddMarketOfferOptions()
   {
      __ENTER__

      //----------------------------------------------------------
      function onRatioChanges(e)
      {
         var ratio = parseFloat(e.target.value);
         var valid_ratio = validateRatio(ratio);
         if ( valid_ratio !== ratio ) { setRatio(valid_ratio); }
         
         uiOptions.ratios[getRatioIndex()] = valid_ratio;
         saveUIOptions();
         onOfferOrRatioChanged();
      }

      //----------------------------------------------------------
      function onClickUseRatio(e)
      {
         uiOptions.use_ratio = e.target.checked;
         saveUIOptions();
         formItems.m2.disabled = uiOptions.use_ratio;
         if ( uiOptions.use_ratio ) { onOfferOrRatioChanged(); }
      }

      //----------------------------------------------------------
      function onClickG(e)
      {
         var soff = $g("tb_save_offer");
         if ( soff && !soff.checked ) { soff.click(); }
      }

      //----------------------------------------------------------
      if ( formItems.optable )
      {
         var cols = (TB3O.M35 === 2) ? '3' : '4';
         formItems.optable.appendChild($r(null,[
            $td([['id', 'tb_merc_summary'],['colspan', cols],['rowspan', '4']]),
            $td(['class', 'tbOption'], [
               $i([['id','tb_use_ratio'], ['type','checkbox'], ['value','1'], ['change', onClickUseRatio, false]]), 
               T('USEMTR') + " ",
               $span(['id','tb_ratio_r1']),
               " \u00D7 ",
               $i([['id','tb_ratio'], ['type','text'], ['class','text'], ['maxlength','4'], ['value','1'],
                   ['change', onRatioChanges, false], ['keyup', onRatioChanges, false]]), 
               " = ",
               $span(['id','tb_ratio_r2'])
               ])
         ]));

         addChildren(formItems.optable,[
            $r($td(['class', 'tbOption tbOfferG'], [
                  $i([['id','tb_save_offer_g'], ['type','checkbox'], ['value','1'], ['change', onClickG, false]]), 
                  T('SVGL')])),
            $r($td(['class', 'tbOption'], [
                  $i([['id','tb_save_offer'], ['type','checkbox'], ['value','1']]), T('SAVE')])),
            $r($td())
         ]);

         uiAddBuiltinUpDownControl($g("tb_ratio"), 0.1);
      }
      __EXIT__
   }

   //-------------------------------------------------------------
   function uiModifyMarketOfferControls()
   {
      __ENTER__

      //----------------------------------------------------------
      function onOfferChanges()
      {
         var resourcesInfo = getActualResourcesInfoNow(TB3O.ActiveVillageInfo.r, true);
         var aType1 = parseInt10(rxType1.value) - 1;
         var aR1 = parseInt10(rxI1.value);

         if ( aR1 > resourcesInfo.Res[aType1] )
         {
            rxI1.value = resourcesInfo.Res[aType1];
         }
         else if ( aR1 < 0 )
         {
            rxI1.value = 0;
         }

         onOfferOrRatioChanged();
      }

      //----------------------------------------------------------
      function onResType1Change()
      {
         setDefaultRatio();
         onOfferChanges();
      }

      //----------------------------------------------------------
      function onResType2Change()
      {
         setDefaultRatio();
         onOfferOrRatioChanged();
      }

      //----------------------------------------------------------
      function onOtherChange()
      {
         if ( formItems.d1 )   { uiOptions.use_maxtime = formItems.d1.checked;  }
         if ( formItems.d2 )   { uiOptions.maxtime = formItems.d2.value; }
         if ( formItems.ally ) { uiOptions.ally = formItems.ally.checked; }
         saveUIOptions();
      }

      //----------------------------------------------------------
      uiAddBuiltinUpDownControl(rxI1, mCap);
      if ( formItems.d1 ) { formItems.d1.addEventListener('change', onOtherChange, false); }
      if ( formItems.d2 ) 
      { 
         formItems.d2.addEventListener('change', onOtherChange, false);
         uiAddBuiltinUpDownControl(formItems.d2); 
      }
      if ( formItems.ally ) { formItems.ally.addEventListener('change', onOtherChange, false); }

      rxI1.addEventListener('keyup', onOfferChanges, false);
      rxI1.addEventListener('change', onOfferChanges, false);
      rxI2.addEventListener('keyup', mhRowUpdate3, false);
      rxI2.addEventListener('change', mhRowUpdate3, false);
      rxType1.addEventListener('change', onResType1Change, false);
      rxType2.addEventListener('change', onResType2Change, false);

      __EXIT__
   }

   //-------------------------------------------------------------
   // function uiSetDefaultOffer automatically selects as offering the resource 
   // from which you have the most units and searching the resource with the minimum units for the current village
   function uiSetDefaultOffer()
   {
      __ENTER__
      __DUMP__(rxI1.value,rxType1.value,rxI2.value,rxType2.value)

      // find max/min resource 
      var resourcesInfo = TB3O.ActiveVillageInfo.r;
      var maxRes = resourcesInfo.Res[0];
      var minRes = maxRes;
      var idMax = 0;
      var idMin = 0;
      var ri;

      for ( ri = 0; ri < 4; ri++)
      {
         if ( maxRes <= resourcesInfo.Res[ri] )
         {
            maxRes = resourcesInfo.Res[ri];
            idMax = ri;
         }

         if ( minRes >= resourcesInfo.Res[ri] )
         {
            minRes = resourcesInfo.Res[ri];
            idMin = ri;
         }
      }

      if ( !(parseInt10(rxI1.value) > 0 && parseInt10(rxI2.value) > 0) ) // already has offer?
      {
         rxType1.value = (idMax + 1).toString();
         rxType2.value = (idMin + 1).toString();

         if ( mCap <= resourcesInfo.Res[idMax] )
         {
            rxI1.value = mCap;
            rxI2.value = mCap;
         }
         __DUMP__(rxI1.value,rxType1.value,rxI2.value,rxType2.value)
      }

      // set default values for other options
      if ( formItems.d1 )   { formItems.d1.checked = uiOptions.use_maxtime; }
      if ( formItems.d2 && uiOptions.maxtime )   { formItems.d2.value = uiOptions.maxtime; }
      if ( formItems.ally ) { formItems.ally.checked = uiOptions.ally; }
      $g("tb_use_ratio").checked = uiOptions.use_ratio;
      formItems.m2.disabled = uiOptions.use_ratio;
      setDefaultRatio();
      onOfferOrRatioChanged();

      __EXIT__
   }

   //-------------------------------------------------------------
   function onClickSell()
   {
      __ENTER__
      var soff = $g("tb_save_offer");
      var soffG = $g("tb_save_offer_g");
      var bSOf = ( soff && soff.checked );
      var bSOfG = ( soffG && soffG.checked );
      formItems.m2.disabled = false; // need to POST the field

      if ( bSOf )
      {
         var i, aElem;
         var param = ["m1", "m2", "rid1", "rid2", "d2"];
         var checks = ["d1", "ally"];
         var values = [];

         for ( i = 0; i < param.length; i++) 
         {
            aElem = formItems[param[i]];
            if ( aElem ) { values[i] = aElem.value; }
         }

         for ( i = 0; i < checks.length; i++)
         {
            var b = false;
            aElem = formItems[checks[i]];
            if ( aElem ) { b = aElem.checked; }
            values[i + param.length] =  ( b ) ? '1' : '0';
         }

         if ( !bSOfG ) { values[7] = TB3O.ActiveVillageId; }

         saveOffer(values);
      }
      __EXIT__
   }

   //-----------------------------------------------------------------
   function uiModifyMerchantsCountBar(moC)
   {
      addChildren(moC, [" (" + TB3O.ActiveVillageInfo.mCap + " / ", I("merchant"), ")"]);
   }

   //-------------------------------------------------------------
   if ( formItems.form && rxI1 && rxI2 && rxType1 && rxType2 ) 
   {
      loadUIOptions();
      uiAddMarketOfferOptions();
      uiModifyMarketOfferControls();
      uiSetDefaultOffer();

      if ( processMarketOffer.moC )
      {
         //add information about capacity of the merchants and make transport functions available to this page, too
         uiModifyMerchantsCountBar(processMarketOffer.moC);
      }

      if ( formItems.button )
      {
         formItems.button.addEventListener("click", onClickSell, false);
      }

      TB3O.SavedOffers = loadOffers();
      var tbSavedOffers = uiCreateSavedOffersTable();
      if ( tbSavedOffers )
      {
         formItems.form.appendChild($e("p", attrInject$, tbSavedOffers));
      }

      uiModifyMarketOfferOverview();
   }

   __EXIT__
}




