//////////////////////////////////////////////////////////////////////
function getInnerBuilding(id, aImgNode)
{
   var gid = -1;

   if ( hasClass(aImgNode,/g(\d+)/) )
   { 
      gid = parseInt10(RegExp.$1); 
   }

   //current level and name of the building
   var titleParts;
   var title = aImgNode.alt;

   if ( title === '' )
   {
      var aNode = __TEST__($qf("[title]",'f',aImgNode.parentNode));
      if ( aNode )
      {
         title = aNode.getAttribute("title");
      }
   }

   if ( title.indexOf("||") !== -1 ) // alt attribute may contain HTML 
   {
      // get first line without markup
      titleParts = title.split("||");
      var dummy = $div(null,titleParts[0]);
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
      case GID_STONEWALL:
         imgSrc = image["sw"];
         break;
   }
   if ( imgSrc !== aImgNode.src ) { imgClass = ""; }

   var buildingInfo = new BuildingInfo(title, bName, id, gid, crtLevel, "", imgSrc, imgClass);
   __DUMP__(buildingInfo);

   return buildingInfo;
}


//////////////////////////////////////////////////////////////////////
function scanInnerBuildings(aDoc)
{
   var buildingsInfo = new BuildingsInfo();

   var villageMap = __TEST__({{$g("village_map",aDoc)}});
   if ( villageMap )
   {
      var imgNodesList = villageMap.getElementsByClassName("building");

      for ( var i = 0; i < imgNodesList.length; ++i )
      {
         var aImgNode = imgNodesList.item(i);
         var aParentNode = aImgNode.parentNode;
         if ( hasClass(aParentNode,/aid(\d+)/) )
         { 
            var id = parseInt10(RegExp.$1); 
            buildingsInfo._[i] = getInnerBuilding(id, aImgNode);
         }
      }

      imgNodesList = villageMap.getElementsByClassName("wall");
      if ( imgNodesList.length ) 
      {
         buildingsInfo._.push(getInnerBuilding(40, imgNodesList.item(0)));
      }
   }

   return buildingsInfo;
}
