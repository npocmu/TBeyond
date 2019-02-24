//////////////////////////////////////////////////////////////////////
// Generic event for resources incoming/consumption
/*
ResourcesEvent
{
   Res:       array[4]  - resources added/substracted with event

   bIncoming: boolean   - type of event
                          true: resources added to storage
                          false: resources substracted from storage

   bQueued:   boolean   - true: event occured in any case
                          false: possible event

   bExact:    boolean   - accuracy of event resources
                          true: Res show exact number of resources
                          false: this event sheduled but may have
                          other number of resources (less than sheduled)
                          When bQueued false then bExact ia also false

   ttEnd:     number    - server timestamp when event will occurs

   details:   object    - optional info about event details
                          If present it may have be one of following tags:
                           - merchantUnderwayInfo,
                           - marketRouteInfo
}
*/

function ResourcesEvent(Res, bIncoming, bQueued, bExact, ttEnd, details)
{
   this.Res = Res;              
   this.bIncoming = !!bIncoming;
   this.bQueued = !!bQueued;
   this.bExact = ( this.bQueued ) ? !!bExact : false;
   this.ttEnd = ttEnd;
   this.details = {};

   if ( isObjValid(details) )
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
function getResourcesEventView(resourcesEvent, ri/*opt*/) 
{
   var str = "\n";

   str +=  ( ( resourcesEvent.bQueued ) ? "Possible event" : "Event" ) + " [" + toDate(resourcesEvent.ttEnd) + "]: ";
   str +=  ( resourcesEvent.bExact ) ? "" : "possible ";
   str +=  ( resourcesEvent.bIncoming ) ? "income +" : "outcome -";
   str +=  ( ri === undefined ) ? JSON.stringify(resourcesEvent.Res) : resourcesEvent.Res[ri];

   return str;
}
}})
