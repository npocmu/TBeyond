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

