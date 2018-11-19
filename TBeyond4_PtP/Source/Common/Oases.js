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
   for ( oasisType = 1; oasisType < oasisTypes.length; oasisType++ )
   {
      var bMatch = true;
      for ( ri = 0; ri < 4; ri++ )
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
      var spans = $qf("span", 'l', typeNode);
      if ( spans )
      {
         var percents = [0,0,0,0];
         for (var j = 0; j < spans.length; ++j)
         {
            var aSpan = spans[j];
            var percent = scanIntAny(aSpan.textContent);
            var type = getResourceTypeFromImage($nth_tag(aSpan,"img"));

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

