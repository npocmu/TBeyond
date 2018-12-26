//////////////////////////////////////////////////////////////////////
// simply accumulate resources
// return resources array that is  res1 += res2
function accumulateResources(res1, res2)
{
   var ri;

   for ( ri = 0; ri < 4; ++ri )
   {
      res1[ri] += res2[ri];
   }

   return res1;
}

//////////////////////////////////////////////////////////////////////
// substract resources
// return resources array that is  res1 - res2
function subResources(res1, res2)
{
   var ri;
   var res3 = new Array(4);

   for ( ri = 0; ri < 4; ++ri )
   {
      res3[ri] = res1[ri] - res2[ri];
   }

   return res3;
}

//////////////////////////////////////////////////////////////////////
// return sum of all resources
function totalResources(res)
{
   var ri;
   var tot = 0;

   for ( ri = 0; ri < 4; ++ri )
   {
      tot += res[ri];
   }

   return tot;
}

//////////////////////////////////////////////////////////////////////
// floor resources
// Do Math.floor(res) for each resource
function floorResources(res)
{
   var ri;

   for ( ri = 0; ri < 4; ++ri )
   {
      res[ri] = Math.floor(res[ri]);
   }

   return res;
}

//////////////////////////////////////////////////////////////////////
// Do res*=count for each resource
function countResources(res, count)
{
   var ri;

   for ( ri = 0; ri < 4; ++ri )
   {
      res[ri] *= count;
   }

   return res;
}

//////////////////////////////////////////////////////////////////////
function __initResourcesSubstate(subst, bNeedTTF) 
{
   subst.ru = [0,0,0,0];
   subst.ro = [0,0,0,0];
   subst.ev = [null,null,null,null];

   if ( bNeedTTF )
   {
      subst.ttf = [Infinity,Infinity,Infinity,Infinity];
   }

   return subst;
}

//////////////////////////////////////////////////////////////////////
// Return:
// {
//    res: array[4] - resources after accumulation
//    If bNeedState is true then calculate and return additional state:
//    A: {
//       ru:  array[4] - underrun resources (always positive)
//       ro:  array[4] - overrun resources (always positive)
//       ev:  array[4] event type: true - overfill storage, false - underrun storage, null - no event
//    }
// }
// Note: ru[i] is a positive number only if ev[i] === false, otherwise it is zero
//       ro[i] is a positive number only if ev[i] === true, otherwise it is zero
function getCumulativeResources(r, addRes, bNeedState) 
{
   var ri;
   var result = {};

   result.res = new Array(4);

   if ( bNeedState )
   {
      result.A = {};
      __initResourcesSubstate(result.A);
   }

   // calculate resources
   for ( ri = 0; ri < 4; ++ri )
   {
      var v = r.Res[ri] + addRes[ri];
      if ( v < 0 )
      {
         if ( bNeedState )
         {
            result.A.ru[ri] = v;
            result.A.ev[ri] = false;
         }
         v = 0;
      }
      else if ( v > r.Cap[ri] )
      {
         if ( bNeedState )
         {
            result.A.ro[ri] = v - r.Cap[ri];
            result.A.ev[ri] = true;
         }
         v = r.Cap[ri];
      }

      result.res[ri] = v;
   }

   return result;
}

//////////////////////////////////////////////////////////////////////
// r - current resourcesInfo (not affected by function)
// returns:
// {
//   res: array[4] of resources that will actual after the given interval in ms 
//   A: see getCumulativeResources  (present only when bNeedState is true)
// }
// ATT!: resources are real numbers, not integers!
function getActualResourcesAfterMs(r, tms, bNeedState) 
{
   var ri;
   var addRes = [0,0,0,0];

   if ( isFinite(tms) && tms > 0 )
   {
      // calculate resources
      for ( ri = 0; ri < 4; ++ri )
      {
         addRes[ri] = r.EPpH[ri] / 3600000 * tms;
      }
   }

   return getCumulativeResources(r, addRes, bNeedState);
}

//////////////////////////////////////////////////////////////////////
// return seconds needed to fill granary/warehouse for given resource type
//       or seconds needed to exhaust granary/warehouse if EPpH is negative
//       or Infinity if EPpH is zero
function getSecondsToFill(resourcesInfo, ri)
{
   var ttFill;

   var EPpS = resourcesInfo.EPpH[ri] / 3600;

   if ( EPpS >= 0 ) 
   {
      ttFill = (resourcesInfo.Cap[ri] - resourcesInfo.Res[ri]) / EPpS;
   }
   else 
   {
      ttFill = -(resourcesInfo.Res[ri] / EPpS);
   }
   return Math.floor(ttFill);
}

//////////////////////////////////////////////////////////////////////
// Need more accurate formula? Time to fill from dorf3 tab2 is different.
// Return seconds needed to produce 'need' resources for given ePpH
//       or Infinity if ePpH is zero
function getSecondsToProduce(need,ePpH)
{
   return (ePpH <= 0) ? Infinity : Math.ceil(need / (ePpH / 3600));
}

//////////////////////////////////////////////////////////////////////
// return copy of r (ResourcesInfo object) with data that will actual for moment ttCurrent
function getActualResourcesInfo(r, doFloor, ttCurrent) 
{
   var tmsElapsed;
   var resourcesInfo = cloneResourcesInfo(r);

   if ( r.ttUpd !== undefined )
   {
      resourcesInfo.ttUpd = ttCurrent;

      tmsElapsed = ttCurrent - r.ttUpd;

      resourcesInfo.Res  = getActualResourcesAfterMs(r,tmsElapsed).res;

      if ( doFloor ) { floorResources(resourcesInfo.Res); }
   }

   return resourcesInfo;
}

//////////////////////////////////////////////////////////////////////
// return copy of r (ResourcesInfo object) with data that will actual for this moment
function getActualResourcesInfoNow(r, doFloor) 
{
   return getActualResourcesInfo(r, doFloor, toTimeStamp(getServerTimeNow())); 
}

//////////////////////////////////////////////////////////////////////
/*
   Core function for resources planning.

   @resourcesInfo - the resources production state that was fixed at moment ttUpd
   @ttAccumulate - the time when number of resources @resToAccumulate will be added
                   ttAccumulate >= ttUpd
   @resToAccumulate - [lumber,clay,iron,crop] number of resources to add. 
                    Negative number cause substraction of resource. 

   The function updates @resourcesInfo and set it properties to the moment immediately after @ttAccumulate
   (after resources acummulation).

   Function returns a state object that allows to exactly known what happen with resources 
   at a three time ranges:
   ]ttUpd,ttAccumulate[     - after @resourcesInfo was collected but before ttAccumulate
   [ttAccumulate]           - immediately after @ttAccumulate moment
   ]ttAccumulate,infinity[  - in future after @ttAccumulate moment

   State:
   {
      // substate for time interval ]ttUpd,ttAccumulate[
      BA: {
         ru:  array[4] with number of underrun resources
         ro:  array[4] with number of overrun resources
         ev:  array[4] event type: true - fill storage / false - exhaust storage / null - no event
         ttf: array[4] timestamp for a moment of fill/exhaust granary/warehouse (if it happened)
      }

      // substate for the moment immediately after @ttAccumulate
      A: {ru,ro,ev} accumulation state

      // substate for time interval ]ttAccumulate,infinity[
      AA: {
         ru:  array[4] with number of underrun resources
         ro:  array[4] with number of overrun resources
         ev:  array[4] event type: true - fill storage / false - exhaust storage / null - no event
         ttf: array[4] timestamp for a moment of fill/exhaust granary/warehouse after accumulation
                       (if it will happen)
      }
   }

   Note that state fields BA.ev and AA.ev should be interpreted slightly different than 
   ev after getCumulativeResources.
   They indicates not overrun/underrun event but fill/exhaust event. So ru(or ro)[i] can be zero
   but ev[i] not null and ttf[i] not infinity.

   If an empty object is given as last argument cumState, then cumulative state will be 
   collected and stored in this object. To collect cumulative state after several resource events
   you need to pass the same object in each call of getCumulativeResourcesInfo.
    
   State:
   {
      BA: {
         ru:  array[4] of cumulative underrun resources before accumulation
         ro:  array[4] of cumulative overrun resources before accumulation
         ttf: array[4] milliseconds needed to fill/exhaust granary/warehouse before accumulation
         ev:  array[4] event type: true - fill storage/ false - exhaust storage, null - no event
      }
      AA: {
         ru:  array[4] of cumulative underrun resources after accumulation
         ro:  array[4] of cumulative overrun resources after accumulation
         ttf: array[4] milliseconds needed to fill/exhaust granary/warehouse after accumulation
         ev:  array[4] event type: true - fill storage/ false - exhaust storage, null - no event
      }
   }
*/
function getCumulativeResourcesInfo(resourcesInfo, ttAccumulate, resToAccumulate, cumState /*opt*/)
{
   // fill @st fields ttf and ev bases on estimate production of resources from @r in
   // the time interval [r.ttUpd,ttMax]
   function fillStateTTF(r, st, ttMax)
   {
      var ttStart = r.ttUpd;
      var ri;
      for ( ri = 0; ri < 4; ++ri )
      {
         var ttToFill = ttStart + getSecondsToFill(r, ri) * 1000;
         if ( ttToFill <= ttMax )
         {
            st.ttf[ri] = ttToFill;

            if ( r.EPpH[ri] > 0 )
            {
               st.ev[ri] = true;
            }
            else if ( r.EPpH[ri] < 0 )
            {
               st.ev[ri] = false;
            }
         }
      }
   }

   //-----------------------------------------------------------------
   // fill @st fields ttf and ev bases on estimate production of resources from @r in
   // time range [r.ttUpd,ttMax]
   function fillCumulativeStateTTF(r, st, ttMax, stA)
   {
      var ttStart = r.ttUpd;
      var ri;
      for ( ri = 0; ri < 4; ++ri )
      {
         if ( ttStart < st.ttf[ri] ) // do not affect old events
         {
            if ( stA && stA.ev[ri] !== null )
            {
               st.ttf[ri] = ttStart; 
               st.ev[ri] = stA.ev[ri];
            }
            else
            {
               var ttToFill = ttStart + getSecondsToFill(r, ri) * 1000;
               //__DUMP__(ri,toDate(ttStart),toDate(ttToFill),ttMax)
               if ( ttToFill <= ttMax )
               {
                  st.ttf[ri] = ttToFill;

                  if ( r.EPpH[ri] > 0 )
                  {
                     st.ev[ri] = true;
                  }
                  else if ( r.EPpH[ri] < 0 )
                  {
                     st.ev[ri] = false;
                  }

               /*
                  if ( r.EPpH[ri] > 0 )
                  {
                     if ( ttToFill < st.ttf[ri] ) 
                     { 
                        st.ttf[ri] = ttToFill; 
                        st.ev[ri] = true;
                     }
                  }
                  else if ( r.EPpH[ri] < 0 )
                  {
                     if ( ttToFill > st.ttf[ri] || !isFinite(st.ttf[ri]) ) 
                     { 
                        st.ttf[ri] = ttToFill; 
                        st.ev[ri] = false;
                     }
                  }
                  */
               }
            }
         }
      }
   }

   //-----------------------------------------------------------------
   function fillCumulativeStateRUO(st, ar)
   {
      var ri;
      for ( ri = 0; ri < 4; ++ri )
      {
         st.ru[ri] += ar.A.ru[ri];
         st.ro[ri] += ar.A.ro[ri];
      }
   }

   var ar;
   var tms = ttAccumulate - resourcesInfo.ttUpd;
   var state = { BA:{}, AA:{} };
   var bNeedCumState = false;

   if ( isObjValid(cumState) )
   {
      cumState.BA = {};
      bNeedCumState = true;
      if ( cumState.AA )
      {
         cumState.BA.ru = cumState.AA.ru;
         cumState.BA.ro = cumState.AA.ro;
         cumState.BA.ttf= cumState.AA.ttf;
         cumState.BA.ev = cumState.AA.ev;
      }
      else
      {
         __initResourcesSubstate(cumState.BA, true);
      }
   }

   if ( tms > 0 )
   {
      ar = getActualResourcesAfterMs(resourcesInfo, tms, true);
      state.BA = ar.A;
      state.BA.ttf = [Infinity,Infinity,Infinity,Infinity];
      fillStateTTF(resourcesInfo, state.BA, ttAccumulate);

      if ( bNeedCumState )
      {
         fillCumulativeStateTTF(resourcesInfo, cumState.BA, ttAccumulate);
         fillCumulativeStateRUO(cumState.BA, ar);
      }
      resourcesInfo.Res  = ar.res;
   }
   else
   {
      __initResourcesSubstate(state.BA, true);
   }

   // do accumulation
   ar = getCumulativeResources(resourcesInfo, resToAccumulate, true);
   resourcesInfo.ttUpd = ttAccumulate;
   resourcesInfo.Res  = ar.res;
   state.A = ar.A;
   __initResourcesSubstate(state.AA, true);
   fillStateTTF(resourcesInfo, state.AA, Infinity);

   if ( bNeedCumState )
   {
      cumState.AA = {};
      cumState.AA.ru = cloneArray(cumState.BA.ru);
      cumState.AA.ro = cloneArray(cumState.BA.ro);
      cumState.AA.ttf= cloneArray(cumState.BA.ttf);
      cumState.AA.ev = cloneArray(cumState.BA.ev);
      fillCumulativeStateTTF(resourcesInfo, cumState.AA, Infinity, state.A);
      fillCumulativeStateRUO(cumState.AA, ar);
   }

   return state;
}

M4_DEBUG({{
/////////////////////////////////////////////////////////////////////
// Debug!!!
function getCumulativeResourcesStateView(resourcesInfo, state, ri) 
{
   function getStView(st) 
   { 
      var str = "";
      str += "Under: " + st.ru[ri];
      str += ", over: " + st.ro[ri];
      str += ", event: " + ((st.ev[ri] === null) ? "none" : ((st.ev[ri] ) ? "fill storage" : "exhaust storage" ));
      if ( st.ttf )
      {
         str += ", ttf: " + (isFinite(st.ttf[ri]) ? toDate(st.ttf[ri]) : "unknown");
      }
      str += "\n";

      return str; 
   }

   var str = "\n";

   str += "Cumulative state before accumulation:\n"
   str += getStView(state.BA);
   str += "Accumulation state:\n"
   str += getStView(state.A);
   str += "Cumulative state after accumulation:\n"
   str += getStView(state.AA);
   str += "Resources after accumulation:\n"
   str += "[" + $toStr(resourcesInfo.ttUpd) + "]: " + resourcesInfo.Res[ri] + "/" + resourcesInfo.Cap[ri];


   return str;
}
}})

//////////////////////////////////////////////////////////////////////
function getCumulativeResourcesInfoAfterEvent(resourcesInfo, resourcesEvent, cumState /*opt*/)
{
   var ri;
   var resToAccumulate = resourcesEvent.Res;

   if ( !resourcesEvent.bIncoming )
   {
      resToAccumulate = cloneArray(resToAccumulate);

      for ( ri = 0; ri < 4; ++ri )
      {
         resToAccumulate[ri] = -resToAccumulate[ri];
      }
   }

   return getCumulativeResourcesInfo(resourcesInfo, resourcesEvent.ttEnd, resToAccumulate, cumState);
}

//////////////////////////////////////////////////////////////////////
function getResInfoTotals()
{
   var tPpH = new ResourcesInfo();
   var villageId,resourcesInfo;
   var ri;

   for ( villageId in TB3O.VillagesInfo )
   {
      resourcesInfo = TB3O.VillagesInfo[villageId].r;
      if ( resourcesInfo.ttUpd !== undefined )
      {
         for ( ri = 0; ri < 4; ++ri )
         {
            tPpH.PpH[ri]  += resourcesInfo.PpH[ri];
            tPpH.EPpH[ri] += resourcesInfo.EPpH[ri];
            tPpH.Res[ri]  += resourcesInfo.Res[ri];
            tPpH.Cap[ri]  += resourcesInfo.Cap[ri];
         }
      }
   }

   return tPpH;
}

/////////////////////////////////////////////////////////////////////
function getResourceImage(ri)
{
   return I("r" + (ri === 4 ? 0 : ri + 1));
}

/////////////////////////////////////////////////////////////////////
// Get resource type from image (or any other nodes) that have class like 'r1'
// Returns null if can't retrieve type of resource
function getResourceTypeFromImage(img)
{
   if ( img )
   {
      var type = scanIntWithPrefix("r", img.className);
      if ( isIntValid(type) )
      {
         return type;
      }
   }
   return null;
}

//////////////////////////////////////////////////////////////////////
// parse string like    r1|r2|r3|r4
function getResourcesFromString(str)
{
   var Res = [0,0,0,0];
   var bResValid = false;

   if ( !getResourcesFromString.re )
   {
      var sResPattern = "(\\d+)";
      var sSepPattern = "[ \u00A0\n\t|]+";
      getResourcesFromString.re = new RegExp(sResPattern + sSepPattern + sResPattern + sSepPattern+ sResPattern + sSepPattern + sResPattern);
   }

   if ( getResourcesFromString.re.exec(str) )
   {
      var inRes = [RegExp.$1,RegExp.$2,RegExp.$3,RegExp.$4];
      var ri;
      bResValid = true;
      for ( ri = 0; ri < 4; ri++ )
      {
         Res[ri] = parseInt10(inRes[ri]);
         if ( !isFinite(Res[ri]) ) { bResValid = false; break; }
      }
   }
   return bResValid ? Res : null;
}

//////////////////////////////////////////////////////////////////////
function getResourcesFromNodes(resNodes)
{
   var ri;
   var Res = [0,0,0,0];
   var bResValid = true;

   for ( ri = 0; ri < 4; ++ri )
   {
      var aNode = resNodes[ri];
      if ( aNode ) 
      {
         var val = parseSeparatedInt10(aNode.textContent);
         if ( isIntValid(val) ) 
         {
            Res[ri] = val;
            continue;
         }
      }
      bResValid = false; 
      break;
   }

   return bResValid ? Res : null;
}

//////////////////////////////////////////////////////////////////////
function isCapReached(res, EPpH, cap)
{
   return ( (EPpH < 0 && res === 0) || (EPpH >= 0 && res === cap) );
}

//////////////////////////////////////////////////////////////////////
function setResClasses(e, secs, EPpH, res/*opt*/, cap/*opt*/)
{
   ifClass(e, (EPpH < 0), 'tbDecrease');
   ifClass(e, (secs > 0 && secs < TB_TTF_THRESHOLD), 'tbSoon');
   if ( res !== undefined && cap !== undefined )
   {
      ifClass(e, isCapReached(res, EPpH, cap), 'tbCapReached');
   }
   else
   {
      ifClass(e, (secs <= 0), 'tbCapReached');
   }

   return e;
}

//////////////////////////////////////////////////////////////////////
function setResTimeClasses(e, secs, EPpH, res/*opt*/, cap/*opt*/)
{
   ifClass(e, (!isFinite(secs)), 'tbInfinity');
   return setResClasses(e, secs, EPpH, res, cap);
}


//////////////////////////////////////////////////////////////////////
function uiSetTimeSpan(e, secs, options)
{
   if ( !options ) { options = {}; }

   var format = options.format;
   if ( format !== undefined ) 
   {
      if ( options.dtNow && options.dtEvent )
      {
         e.title = formatDateTime(options.dtNow, options.dtEvent, format);
      }
      else
      {
         e.title = formatDateTimeRelative(secs, format);
      }
   }
   e.textContent = formatTimeSpan(secs, 0);
   ifClass(e,(secs !== 0 && isFinite(secs)),'timeouta');

   return e;
}

//////////////////////////////////////////////////////////////////////
function uiSetTimeSpanByDate(e, dtNow, dtEvent, options)
{
   if ( options ) { options.dtNow = dtNow; options.dtEvent = dtEvent; }
   return uiSetTimeSpan(e, getTimeSpan(dtEvent, dtNow), options);
}

//////////////////////////////////////////////////////////////////////
function __uiSetTimeout(e, secs, options)
{
   addClass(e,'tbTimeout');
   return uiSetTimeSpan(e, secs, options);
}

//////////////////////////////////////////////////////////////////////
function uiSetTimeout(e, secs, EPpH, options)
{
   setResTimeClasses(e, secs, EPpH);
   return __uiSetTimeout(e, secs, options);
}

//////////////////////////////////////////////////////////////////////
function uiSetTimeToFill(e, resourcesInfo, ri, options)
{
   var secs = getSecondsToFill(resourcesInfo, ri);
   setResTimeClasses(e, secs, resourcesInfo.EPpH[ri], resourcesInfo.Res[ri], resourcesInfo.Cap[ri]);
   return __uiSetTimeout(e, secs, options);
}

//////////////////////////////////////////////////////////////////////
function uiSetTimeoutByDate(e, dtNow, dtEvent, EPpH, options)
{
   if ( options ) { options.dtNow = dtNow; options.dtEvent = dtEvent; }
   return uiSetTimeout(e, getTimeSpan(dtEvent, dtNow), EPpH, options);
}


//////////////////////////////////////////////////////////////////////
//by Acr111 (adapted by ms99)
function getBackColorForResourceBar(p, EPpH)
{
   if ( EPpH < 0 )
   {
      p = 100 - p;
   }
   return (p < 90 ? "rgb(" + parseInt10(p / 90 * 255) + "," + (100 + p) + ",0)" : 
                    "rgb(255," + parseInt10((100 - p) / (100 - 90) * 170) + ",0)");
} 

//////////////////////////////////////////////////////////////////////
function getForeColorForResourceBar(p, EPpH)
{
   if ( EPpH < 0 )
   {
      p = 100 - p;
   }
   return ((p > 60 && p < 90) ? 'black' : TB3O.DFc[1]);
}

//////////////////////////////////////////////////////////////////////
function getFillPercent(resourcesInfo, ri)
{
   var fillPercent = Math.round(resourcesInfo.Res[ri] / resourcesInfo.Cap[ri] * 100);
   if ( fillPercent > 100 ) { fillPercent = 100; }
   return fillPercent;
} 

//////////////////////////////////////////////////////////////////////
function uiSetFillPercent(e, resourcesInfo, ri)
{
   var fillPercent = getFillPercent(resourcesInfo, ri);
   var EPpH = resourcesInfo.EPpH[ri];

   addClass(e,'tbFillPerc');
   setResClasses(e, getSecondsToFill(resourcesInfo, ri), EPpH, resourcesInfo.Res[ri], resourcesInfo.Cap[ri]);

   e.textContent = fillPercent + "%";
   e.style.color = getBackColorForResourceBar(fillPercent, EPpH);

   return e;
}

//////////////////////////////////////////////////////////////////////
function uiSetEffectiveCropPpH(e, val, bUseLocale)
{
   var cpph = parseInt10(val);
   var strCpph = bUseLocale ? $ls(cpph) : cpph.toString();
   var cpphColor = "black";

   if ( cpph > 0 )
   {
      strCpph = "+" + strCpph;
      cpphColor = "darkgreen";
   }
   else if ( cpph < 0 ) 
   {
      cpphColor = "red";
   }
   e.textContent = strCpph;
   e.style.color = cpphColor;
}

