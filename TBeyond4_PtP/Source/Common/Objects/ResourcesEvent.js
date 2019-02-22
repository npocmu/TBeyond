//////////////////////////////////////////////////////////////////////
// Generic event for resources incoming/consumption
/*
ResourcesEvent
{
   Res:       array[4]  - resources added/substracted with event

   bIncoming: boolean   - type of event
                          true: resources added to storage
                          false: resources substracted from storage

   bExact: boolean      - accuracy of event
                          true: event occured in any case
                          false: this event sheduled but may have
                          other number of resources (less than sheduled)

   ttEnd:     number    - server timestamp when event will occurs

   details:   object    - optional info about event details
                          If present it can be one of following:
                             MerchantUnderwayInfo
}
*/

function ResourcesEvent(Res, bIncoming, bExact, ttEnd, details)
{
   this.Res = Res;              
   this.bIncoming = !!bIncoming;
   this.bExact = !!bExact;
   this.ttEnd = ttEnd;

   if ( details )
   {
      this.details = details;
   }

   return this;
}

/////////////////////////////////////////////////////////////////////
/*
   ResourcesEventsQueue just an array of ResourcesEvent.
   ResourcesEventsQueue should be sorted in order of ttEnd increase
*/

/////////////////////////////////////////////////////////////////////
function sortEventsQueueByTime(evQueue)
{
   evQueue.sort(function(ev1, ev2) { return ev1.ttEnd - ev2.ttEnd; })

   return evQueue;
}

M4_DEBUG({{
/////////////////////////////////////////////////////////////////////
// Debug!!!
function getResourcesEventView(resourcesEvent, ri) 
{
   var str = "\n";

   str += "Event [" + toDate(resourcesEvent.ttEnd) + "]: ";
   str +=  ( resourcesEvent.bExact ) ? "" : "possible ";
   str +=  ( resourcesEvent.bIncoming ) ? "income +" : "outcome -";
   str += resourcesEvent.Res[ri];

   return str;
}
}})
