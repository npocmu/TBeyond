//////////////////////////////////////////////////////////////////////
// Generic event for resources incoming/consumption
/*
ResourcesEvent
{
   Res:       array[4]  - resources added/substracted with event

   bIncoming: boolean   - type of event
                          true: resources added to storage
                          false: resources substracted from storage

   ttEnd:     number    - server timestamp when event will occurs

   details:   object    - optional info about event details
                          If present it can be one of following:
                             MerchantUnderwayInfo
}
*/

function ResourcesEvent(Res, bIncoming, ttEnd, details)
{
   this.Res = Res;              
   this.bIncoming = !!bIncoming;
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

