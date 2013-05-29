//////////////////////////////////////////////////////////////////////
function getInnerBuilding(id, aImgNode)
{
   var gid = -1;
   var classes = aImgNode.className.split(" ");
   if ( classes.length > 1) 
   { 
      if ( classes[classes.length - 1].search(/g(\d+)/) !== -1  ) 
      { 
         gid = parseInt10(RegExp.$1); 
      }
   }

   //current level and name of the building
   var titleParts;
   var title = aImgNode.alt;
   if ( title.indexOf("||") !== -1 ) // alt attribute may contain HTML 
   {
      // get first line without markup
      titleParts = title.split("||");
      var dummy = $d(titleParts[0]);
      title = dummy.textContent;
   }
   var bName = title;
   titleParts = title.split(" ");
   var crtLevel = -1;
   if ( titleParts.length > 1 )
   {
      crtLevel = parseInt10(titleParts[titleParts.length - 1]);
      if ( isNaN(crtLevel) ) { crtLevel = -1; }
      titleParts.pop();
      titleParts.pop();
      bName = titleParts.join(" ");
   }

   var imgSrc = aImgNode.src;
   var imgClass = aImgNode.className;

   //Switch image for the roman wall/pallisade/earth wall/ww
   switch ( gid )
   {
      case GID_CITYWALL:
         imgSrc = image["cw"];
         break;
      case GID_EARTHWALL:
         imgSrc = image["ew"];
         break;
      case GID_PALISADE:
         imgSrc = image["pa"];
         break;
      case GID_WW:
         imgSrc = image["ww"];
         break;
   }
   if ( imgSrc !== aImgNode.src ) { imgClass = ""; }

   return new BuildingInfo(title, bName, id, gid, crtLevel, "", imgSrc, imgClass);
}


//////////////////////////////////////////////////////////////////////
function getInnerBuildings(aDoc, buildingsInfo)
{
   var villageMap = $g("village_map",aDoc);
   if ( villageMap )
   {
      var imgNodesList = villageMap.getElementsByClassName("building");
      var areaNodesList = villageMap.getElementsByTagName("area");

      for ( var i = 0; i < imgNodesList.length; ++i )
      {
         var aImgNode = imgNodesList.item(i);
         //var id = i + 19;
         var id = parseInt10(parseUri(areaNodesList.item(i).href).queryKey.id);
         buildingsInfo._[i] = getInnerBuilding(id, aImgNode);
      }

      imgNodesList = villageMap.getElementsByClassName("wall");
      if ( imgNodesList.length ) 
      {
         buildingsInfo._.push(getInnerBuilding(40, imgNodesList.item(0)));
      }
   }
}
