//////////////////////////////////////////////////////////////////////
// OBSOLETE, use $lnk instead
function $a(iHTML, att)
{
   return $e("a", att, iHTML);
}

//////////////////////////////////////////////////////////////////////
// OBSOLETE
function getRequiredRes(costNode)
{
   var cost = null;
   var contractInfo = scanCommonContractInfo(costNode);
   if ( contractInfo )
   {
      cost = contractInfo.cost;
   }
   return cost;
}
