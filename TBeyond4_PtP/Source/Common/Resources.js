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


M4_DEBUG({{
/////////////////////////////////////////////////////////////////////
// Debug!!!
function getResourcesInfoView(resourcesInfo) 
{
   var str = "";
   str += "PpH  = " + resourcesInfo.PpH + "\n";
   str += "EPpH = " + resourcesInfo.EPpH + "\n";
   str += "Res  = " + resourcesInfo.Res + "\n";
   str += "Cap  = " + resourcesInfo.Cap + "\n";
   str += "dUpd = " + resourcesInfo.dUpd + "\n";

   return str;
}
}})

/////////////////////////////////////////////////////////////////////
function getResourceImage(ri)
{
   return I("r" + (ri === 4 ? 0 : ri + 1));
}

//////////////////////////////////////////////////////////////////////
// return clone of r (ResourcesInfo object)
function cloneResourcesInfo(r) 
{
   var resourcesInfo = new ResourcesInfo();

   if ( r.dUpd !== undefined )
   {
      resourcesInfo.dUpd = new Date(r.dUpd.getTime());
   }
   resourcesInfo.Res  = cloneArray(r.Res);
   resourcesInfo.PpH  = cloneArray(r.PpH);
   resourcesInfo.EPpH = cloneArray(r.EPpH);
   resourcesInfo.Cap  = cloneArray(r.Cap); 

   return resourcesInfo;
}


//////////////////////////////////////////////////////////////////////
// Return:
// {
//    res: array[4] - resources after accumulation
//    A: {
//       ru:  array[4] - underrun resources
//       ro:  array[4] - overrun resources
//       ev:  array[4] event type: true - fill storage, false - exhaust storage, null - no event
//    }
// }
function getCumulativeResources(r, addRes) 
{
   var ri;
   var res = new Array(4);
   var ru = [0,0,0,0];
   var ro = [0,0,0,0];
   var ev = [null,null,null,null];

   // calculate resources
   for ( ri = 0; ri < 4; ++ri )
   {
      var v = r.Res[ri] + addRes[ri];
      if ( v < 0 )
      {
         ru[ri] = v;
         ev[ri] = false;
         v = 0;
      }
      else if ( v > r.Cap[ri] )
      {
         ro[ri] = v - r.Cap[ri];
         ev[ri] = true;
         v = r.Cap[ri];
      }

      res[ri] = v;
   }

   return {res:res, A:{ru:ru, ro:ro, ev:ev}};
}

//////////////////////////////////////////////////////////////////////
// r - current resourcesInfo
// returns:
// {
//   res: array[4] of resources that will actual after the given ms interval
//   A: see getCumulativeResources
// }
// ATT!: resources are real numbers, not int!
function getActualResourcesAfterMs(r, tms) 
{
   var ri;
   var addRes = new Array(4);

   // calculate resources
   for ( ri = 0; ri < 4; ++ri )
   {
      addRes[ri] = ( isFinite(tms) && tms > 0 ) ? r.EPpH[ri] / 3600000 * tms : 0;
   }

   return getCumulativeResources(r, addRes);
}

//////////////////////////////////////////////////////////////////////
// return seconds needed to fill granary/warehouse for given resource type
//       or seconds needed to exhaust granary/warehouse if EPpH is negative
//       or Infinity if EPpH is zero
function getSecondsToFill(resourcesInfo,ri)
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
// need more accurate formula? Time to fill from dorf3 tab2 is different
// return seconds needed to produce 'need' resources for given ePpH
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
   var resourcesInfo = new ResourcesInfo();

   if ( r.dUpd !== undefined )
   {
      resourcesInfo.dUpd = toDate(ttCurrent);

      tmsElapsed = ttCurrent - r.dUpd.getTime();

      resourcesInfo.Res  = getActualResourcesAfterMs(r,tmsElapsed).res;
      resourcesInfo.PpH  = cloneArray(r.PpH);
      resourcesInfo.EPpH = cloneArray(r.EPpH);
      resourcesInfo.Cap  = cloneArray(r.Cap); 

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
// State:
// {
//    BA: {
//       ru:  array[4] of cumulative underrun resources before accumulation
//       ro:  array[4] of cumulative overrun resources before accumulation
//       ttf: array[4] milliseconds needed to fill/exhaust granary/warehouse before accumulation
//       ev:  array[4] event type: true - fill storage/ false - exhaust storage, null - no event
//    }
//    A: {ru,ro,ev} accumulation state
//    AA: {
//       ru:  array[4] of cumulative underrun resources after accumulation
//       ro:  array[4] of cumulative overrun resources after accumulation
//       ttf: array[4] milliseconds needed to fill/exhaust granary/warehouse after accumulation
//       ev:  array[4] event type: true - fill storage/ false - exhaust storage, null - no event
//    }
// }
function getCumulativeResourcesInfo(resourcesInfo, ttAccumulate, resToAccumulate, prevState /*opt*/)
{
   // fill @st fields ttf and ev bases on estimate production of resources fro @r in
   // time range [r.dUpd,ttMax]
   function fillStateTTF(r, st, ttMax, stA)
   {
      var ttStart = r.dUpd.getTime();
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
               if ( ttToFill <= ttMax )
               {
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
               }
            }
         }
      }
   }

   function fillStateRUO(r, st, ar)
   {
      var ri;
      for ( ri = 0; ri < 4; ++ri )
      {
         r.Res[ri] = ar.res[ri];
         st.ru[ri] += ar.A.ru[ri];
         st.ro[ri] += ar.A.ro[ri];
      }
   }

   var ar;
   var tms = ttAccumulate - resourcesInfo.dUpd.getTime();
   var state = { BA:{}, AA:{} };

   if ( prevState )
   {
      state.BA.ru = cloneArray(prevState.AA.ru);
      state.BA.ro = cloneArray(prevState.AA.ro);
      state.BA.ttf= cloneArray(prevState.AA.ttf);
      state.BA.ev = cloneArray(prevState.AA.ev);
   }
   else
   {
      state.BA.ru = [0,0,0,0];
      state.BA.ro = [0,0,0,0];
      state.BA.ttf= [Infinity,Infinity,Infinity,Infinity];
      state.BA.ev = [null,null,null,null];
   }

   if ( tms > 0 )
   {
      ar = getActualResourcesAfterMs(resourcesInfo, tms);
      __DUMP__(ar)
      fillStateTTF(resourcesInfo, state.BA, ttAccumulate);
      fillStateRUO(resourcesInfo, state.BA, ar);
   }

   state.AA.ru = cloneArray(state.BA.ru);
   state.AA.ro = cloneArray(state.BA.ro);
   state.AA.ttf= cloneArray(state.BA.ttf);
   state.AA.ev = cloneArray(state.BA.ev);

   // do accumulation
   resourcesInfo.dUpd.setTime(ttAccumulate);
   ar = getCumulativeResources(resourcesInfo, resToAccumulate);
   state.A = ar.A;
   fillStateRUO(resourcesInfo, state.AA, ar);
   fillStateTTF(resourcesInfo, state.AA, Infinity, state.A);

   return state;
}

M4_DEBUG({{
/////////////////////////////////////////////////////////////////////
// Debug!!!
function getCumulativeResourcesStateView(state, ri) 
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

   return str;
}
}})

//////////////////////////////////////////////////////////////////////
function getCumulativeResourcesInfoAfterEvent(resourcesInfo, resourcesEvent, prevState /*opt*/)
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

   return getCumulativeResourcesInfo(resourcesInfo, resourcesEvent.ttEnd, resToAccumulate, prevState);
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
      if ( resourcesInfo.dUpd !== undefined )
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

