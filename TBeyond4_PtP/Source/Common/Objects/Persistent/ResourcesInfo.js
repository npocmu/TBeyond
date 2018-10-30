/////////////////////////////////////////////////////////////////////
// resources information
function ResourcesInfo()
{
   this.PpH  = [  0,  0,  0,  0]; // raw production per hour
   this.EPpH = [  0,  0,  0,  0]; // effective production per hour
   this.Res  = [  0,  0,  0,  0]; // resources available
   this.Cap  = [  0,  0,  0,  0]; // resource storage capacity

   // TODO: replace with ttUpd
   this.dUpd = undefined; // date of information update 

   return this;
}

