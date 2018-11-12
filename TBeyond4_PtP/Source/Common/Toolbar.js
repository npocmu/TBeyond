//////////////////////////////////////////////////////////////////////
function uiCreateTool(imgTag, tooltip/*opt*/, onClick/*opt*/)
{
   var tool = $lnk([['class','tbTool'],['href', jsVoid]]);
   var attr = null;
   if ( tooltip ) { attr = [['title', tooltip]]; }
   tool.appendChild(I(imgTag, attr));
   if ( onClick )
   {
      tool.addEventListener("click", onClick, false);
   }

   return tool;
}

//////////////////////////////////////////////////////////////////////
function uiCreateTool_Close(onClose)
{
   return uiCreateTool("bClose", T('CLOSE'), onClose)
}

//////////////////////////////////////////////////////////////////////
function uiToolbar_AddTools(toolbar,tools,bWithoutSep)
{
   var tool;
   for ( tool in tools ) 
   {
      if ( tools[tool] )
      {
         if ( toolbar.hasChildNodes() && !bWithoutSep) 
         {
            var toolsep = $e("SPAN"," | ");
            toolsep.className ="tbToolSep";
            toolbar.appendChild(toolsep);
         }
         toolbar.appendChild(tools[tool]);
      }
   }
   return toolbar;
}

//////////////////////////////////////////////////////////////////////
function uiToolbar_Create(id,tools,bWithoutSep)
{
   var toolbar = $div();
   toolbar.className ="tbToolbar";

   if ( id )
   {
      toolbar.id = id;
   }

   return uiToolbar_AddTools(toolbar,tools,bWithoutSep);
}

