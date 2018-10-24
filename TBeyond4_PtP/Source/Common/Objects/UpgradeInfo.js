//////////////////////////////////////////////////////////////////////
function UpgradingEvent(aName, dEnd, tix, txtLvl, lvl)
{
   this.name = trimBlanks(aName);
   this.ttEnd = toTimeStamp(dEnd);
   this.tix  = tix;  
   this.txtLvl = txtLvl;
   this.lvl = lvl;
}

/////////////////////////////////////////////////////////////////////
// information about one upgrade building
function UpgradeInfo()
{
   this.evA = [];          // array of UpgradingEvent
   this.uul = fillArray(new Array(TG_ORDINARY_UNITS_COUNT),0); // upgrade level for units
   this.ttUpd = undefined; // server timestamp when upgrade building last visited
   return this;
}

