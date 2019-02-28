//////////////////////////////////////////////////////////////////////
var oasisTypes = 
[
[],
[25, 0, 0, 0],
[25, 0, 0, 0],
[25, 0, 0,25],
[ 0,25, 0, 0],
[ 0,25, 0, 0],
[ 0,25, 0,25],
[ 0, 0,25, 0],
[ 0, 0,25, 0],
[ 0, 0,25,25],
[ 0, 0, 0,25],
[ 0, 0, 0,25],
[ 0, 0, 0,50],
[50, 0, 0, 0],
[ 0,50, 0, 0],
[ 0, 0,50, 0]
];


//////////////////////////////////////////////////////////////////////
// Get oasis type using percents of production increase
// Returns type (index in oasisTypes) or 0 (unknown type)
function getOasisType(percents)
{
   for (var oasisType = 1; oasisType < oasisTypes.length; oasisType++ )
   {
      var bMatch = true;
      for (var ri = 0; ri < 4; ri++ )
      {
         if ( oasisTypes[oasisType][ri] !== percents[ri] )
         {
            bMatch = false;
            break;
         }
      }

      if ( bMatch ) 
      {
         return oasisType;
      }
   }

   return 0;
}

//////////////////////////////////////////////////////////////////////
function getOasisTypeFromNode(typeNode)
{
   if ( typeNode )
   {
      var percentNodes = $qf(".resources", 'a', typeNode);
      if ( percentNodes )
      {
         var percents = [0,0,0,0];
         for (var j = 0; j < percentNodes.length; ++j)
         {
            var percentNode = percentNodes[j];
            var percent = scanIntAny(percentNode.textContent);
            var type = getResourceTypeFromImage($nth_tag(percentNode,"i"));

            if ( isIntValid(percent) && isIntValid(type) )
            {
               percents[type - 1] = percent; 
            }
         }
         return getOasisType(percents);
      }
   }

   return 0;
}

