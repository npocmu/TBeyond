//////////////////////////////////////////////////////////////////////
function CelebrationEvent(aName, dEnd)
{
   this.name = trimBlanks(aName);
   this.ttEnd = toTimeStamp(dEnd);
   return this;
}

/////////////////////////////////////////////////////////////////////
function TownHallInfo()
{
   this.evA = []; 
   this.ttUpd = undefined; // date of information update (server timestamp when town hall last visited)

   return this;
}

