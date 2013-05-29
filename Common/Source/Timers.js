//////////////////////////////////////////////////////////////////////
//time and resource counters
// Known problems: for accurate countdown unires (ri=4) need to 
// restart timers when one of resources reach max capacity
function setTimers()
{
   __ENTER__

   function tmUpdateResource(ri, quantum)
   {
      var i;
      var resNodesList = document.getElementsByClassName("timeout" + ri);

      for ( i = 0; i < resNodesList.length; ++i )
      {
         var aResNode = resNodesList.item(i);
         var cap = parseInt10(getTBAttribute(aResNode,"cap"));
         var bCapReached = false;
         var quantity = parseInt10(aResNode.textContent);
         var new_quantity = quantity - quantum;

         if ( !isNaN(cap) && cap > 0 )
         {
            if ( ( quantum < 0 && new_quantity >= cap ) ||
                 ( quantum > 0 && new_quantity <= cap ) ) 
            { 
               new_quantity = cap; 
               if ( quantity !== cap )
               {
                  bCapReached = true;
               }
            }
         }

         if ( new_quantity >= 0 ) 
         {
            aResNode.textContent = new_quantity;
         }

         if ( new_quantity === 0 ) { eventResZeroCountdown(aResNode); }
         else if ( bCapReached )   { eventResCapReached(aResNode); }

         if ( (quantity <  100000 && new_quantity >= 100000 ) ||
              (quantity >= 100000 && new_quantity <  100000 ) ) { eventResThresholdCrossing(aResNode); }

      }
   }

   //-------------------------------------------------------------
   // decrease time
   function tmProcessTime()
   {
      function doTimeouts(aTimeout)
      {
         var xTime = toSeconds(aTimeout.textContent);
         if ( !isNaN(xTime) )  
         { 
            if ( --xTime >= 0 ) 
            {
               aTimeout.textContent = formatTimeSpan(xTime, 0); 
            }
         }
      }	

      function doTimes(aTime)
      {
         var secs = parseInt10(getTBAttribute(aTime,"ss"));
         var format = parseInt10(getTBAttribute(aTime,"format"));
         if ( !isIntValid(format) ) { format = 2; }
         if ( secs > 0 )  
         { 
            aTime.textContent = formatDateTimeRelativeToNow(secs, format); 
         }
      }	

      forEach(document.getElementsByClassName("timeouta"),doTimeouts);
      forEach(document.getElementsByClassName("timereln"),doTimes);

   }	

   //-------------------------------------------------------------
   function setResourceUpdateInterval(ri, nEPpH)
   {
      var minFrequency = TB3O.Timeouts.min_res_freq; // prevent the too frequent updates 
      var frequency, quantum;

      // milliseconds needed to produce/loose one resource item
      frequency = 3600000 / Math.abs(nEPpH);

      if ( isFinite(frequency) ) 
      {
         quantum = 1;

         if ( frequency < minFrequency )
         {
            quantum = Math.round(minFrequency / frequency);
            frequency *= quantum;
         }

         if ( nEPpH < 0 )
         {
            quantum = -quantum;
         }

         frequency = Math.floor(frequency);
         setInterval(bind(tmUpdateResource,[ri,quantum]), frequency);
      }
   }	

   //-------------------------------------------------------------
   var resourcesInfo = TB3O.ActiveVillageInfo.r;
   var nEPpHTot = 0;
   var ri;

   for ( ri = 0; ri < 4; ri++ )
   {
      var nEPpH = resourcesInfo.EPpH[ri];
      if ( !(nEPpH > 0 && resourcesInfo.Cap[ri] === resourcesInfo.Res[ri]) )
      {
         nEPpHTot += nEPpH;
      }
      setResourceUpdateInterval(ri, nEPpH);
   }
   setResourceUpdateInterval(4, nEPpHTot);

   setInterval(tmProcessTime, TB3O.Timeouts.ttf_update);

   __EXIT__
}

