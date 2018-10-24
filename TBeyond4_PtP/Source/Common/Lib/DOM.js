//////////////////////////////////////////////////////////////////////
// implementation note: construct like (node instanceof HTMLElement) do not
// work in FF 3.6
function isDOMNode(node) 
{
   return typeof(node) === "object" && typeof(node.nodeType) === "number" && 
          typeof(node.nodeName) === "string" && typeof(node.tagName) === "string";
};

//////////////////////////////////////////////////////////////////////
function __getDOMNode(node)
{
   if ( typeof node === "string" || typeof node === "number" )
   {
      node = document.createTextNode(node);
   }
   return node;
}

//////////////////////////////////////////////////////////////////////
function __isLikeToArray(o)
{
   return ( o instanceof Array || (typeof o === "object" && 'length' in o && !isDOMNode(o)) );
}


//////////////////////////////////////////////////////////////////////
// Add the children element(s) to the node
//   call syntax:
//   1)   addChildren(parent, "data")  - add text node to parent
//   2)   addChildren(parent, node)    - add node to parent
//   3)   addChildren(parent, [node, [node1,node2], "data"])
function addChildren(node, children)
{
   if ( children )
   {
      if ( __isLikeToArray(children) )
      { 
         var i;
         for ( i = 0; i < children.length; i++ )
         { 
            addChildren(node, children[i]);
         }
      }
      else 
      {
         node.appendChild(__getDOMNode(children)); 
      }
   }
}

//////////////////////////////////////////////////////////////////////
//entirely remove the "node" content 
function removeChildren(node)
{
   if ( node )
   {
      node.innerHTML = "";
   }
}

//////////////////////////////////////////////////////////////////////
//replace the "node" element content with new children
function replaceChildren(node, children)
{
   removeChildren(node);
   addChildren(node, children);
}


//////////////////////////////////////////////////////////////////////
//remove the "node" element from the current document
function removeElement(node)
{
   if (node && node.parentNode) 
   {
      node.parentNode.removeChild(node);
   }
}

//////////////////////////////////////////////////////////////////////
//replace the "oldnode" element with "newnode" or with array of nodes
function replaceElement(oldnode, newnode)
{
   if ( oldnode ) 
   {
      var parent = oldnode.parentNode;
      if ( parent )
      {
         if ( __isLikeToArray(newnode) )
         {
            var i;
            var next = oldnode.nextSibling;

            parent.removeChild(oldnode);
            for ( i = 0; i < newnode.length; i++ )
            { 
               parent.insertBefore(__getDOMNode(newnode[i]), next);
            }
         }
         else
         {
            parent.replaceChild(newnode,oldnode);
         }
      }
   }
}


//////////////////////////////////////////////////////////////////////
//move the "node" element from the current parent to the destination "dest" node of the DOM
function moveElement(node, dest)
{
   removeElement(node);
   dest.appendChild(node);
} 

//////////////////////////////////////////////////////////////////////
//insert a referenceNode before a specified node
function insertBefore(node, referenceNode) 
{
   node.parentNode.insertBefore(referenceNode, node);
}

//////////////////////////////////////////////////////////////////////
//insert a 'referenceNode' after a specified 'node'
// 'node' and 'referenceNode' must be valid
function insertAfter(node, referenceNode) 
{
   node.parentNode.insertBefore(referenceNode, node.nextSibling);
}

//////////////////////////////////////////////////////////////////////
//insert a node as the first child node of parent
function insertFirst(parent, node) 
{
   parent.insertBefore(node, parent.firstChild);
}

//////////////////////////////////////////////////////////////////////
//insert a node as the last child node of parent
function insertLast(parent, node) 
{
   parent.insertBefore(node, null);
}

//////////////////////////////////////////////////////////////////////
function hasAncestor(node, ancestor)
{
   return (node.compareDocumentPosition(ancestor) & 0x08 /*Node.DOCUMENT_POSITION_CONTAINS*/ ) !== 0;
}

//////////////////////////////////////////////////////////////////////
// search cell in row of table and return it index. @row should be valid.
// Return null if cell is not found
function getCellIndexInRow(row, cell)
{
   __ASSERT__(row)

   var i;
   var cells = row.cells;

   for ( i = 0; i < cells.length; ++i )
   {
      if ( cell === cells[i] ) 
      { 
         return i;
      }
   }

   return null;
}

//////////////////////////////////////////////////////////////////////
// search cell in table and return it indices in form [row_idx,col_idx]. 
// @table should be valid.
// Return null if cell is not found
function getCellIndicesInTable(table, cell)
{
   __ASSERT__(table)

   var row_idx,col_idx;
   var rows = table.rows;

   for ( row_idx = 0; row_idx < rows.length; ++row_idx )
   {
      col_idx = getCellIndexInRow(rows[row_idx], cell);
      if ( col_idx !== null ) 
      { 
         return [row_idx,col_idx];
      }
   }

   return null;
}

//////////////////////////////////////////////////////////////////////
function getDocument(node)
{
   while (node && node.nodeType !== 9) { node = node.parentNode; }
   return node;
}

//////////////////////////////////////////////////////////////////////
function display(node,bShow) 
{
   if ( node )
   {
      node.style.display = ( bShow ) ? '' : 'none';
   }
}

//////////////////////////////////////////////////////////////////////
function show(node) 
{
   display(node,true);
}

//////////////////////////////////////////////////////////////////////
function hide(node) 
{
   display(node,false);
}

//////////////////////////////////////////////////////////////////////
// returns tagName for a node, always in upper case
function TAG(node) 
{
   var tag = node.tagName;
   return tag ? tag.toUpperCase() : tag;
}

//////////////////////////////////////////////////////////////////////
function getTextContent(node, sep)
{
   var i;
   var str = "";
   var texts = $xf(".//text()", 'l', node);
   if ( sep === undefined ) { sep = " "; }
   for ( i = 0; i < texts.snapshotLength; ++i )
   {
      if ( i > 0 ) { str += sep; }
      str +=  texts.snapshotItem(i).nodeValue;
   }

   return str;
}



//////////////////////////////////////////////////////////////////////
// returns the element with the aID id (wrapper for getElementById)
function $g(aID, aDoc /*opt*/) 
{
   if ( !aDoc ) { aDoc = document; }

   return (aID !== '' ? aDoc.getElementById(aID) : null);
}

//////////////////////////////////////////////////////////////////////
// returns the first element with given 'name' (wrapper for getElementsByName)
// or null if such element not present
function $n(name, aDoc /*opt*/) 
{
   if ( !aDoc ) { aDoc = document; }
   var elems = aDoc.getElementsByName(name);
   return ( elems.length ) ? elems[0] : null;
}

//////////////////////////////////////////////////////////////////////
// returns n-th element with given 'tag' in 'parent' 
// or null if n-th element not present (wrapper for getElementsByTag)
function $nth_tag(parent, tag, n /*opt*/) 
{
   if ( n === undefined ) { n = 0; }
   var elems = parent.getElementsByTagName(tag);
   return ( elems.length > n ) ? elems[n] : null;
}

//////////////////////////////////////////////////////////////////////
// Search nodes using CSS selectors
// If @mode 'f' (by default) - returns single first matching node. If no matching node is found, 
//                             null is returned.
//          'l'              - returns a NodeList containing all matching 
//                             Element nodes within the node's subtree, or an empty NodeList 
//                             if no matches are found.
//          'n'              - returns @nth matching node. If no @nth matching node is found, 
//                             null is returned.
// @nth parameter used only when mode = 'n', otherwise it should be ommited. It have 0 as default.
//    If this argument is negative, it specifies a position in list measured from the end:
//    -1 specifies the last node, -2 specifies the second-to-last node, and so on.
// If @startnode given then search doing within the node's subtree,
// otherwise search doing in whole document.
function $qf(selector, mode/*opt*/, nth/*opt*/, startnode/*opt*/, aDoc/*opt*/) 
{
   if ( mode === undefined ) { mode = 'f'; }

   __ASSERT__( isSomeOf(mode, 'f','l','n'), "Unknown mode: " + mode )

   if ( mode !== 'n' )
   {
      aDoc = startnode;
      startnode = nth;
   }
   else
   {
       nth = nth|0;
       if ( nth === 0 )
       {
          mode = 'f';
       }
   } 

   if ( !aDoc ) 
   { 
      aDoc = getDocument(startnode);
      if ( !aDoc ) { aDoc = document; }
   }
   if ( !startnode ) { startnode = aDoc; }

   if ( mode === 'f' )
   {
      return startnode.querySelector(selector);
   }
   else
   {
      var nodeList = startnode.querySelectorAll(selector);
      if ( mode === 'l' )
      {
         return nodeList;
      }

      // mode 'n'
      var node = null;
      if ( nth < 0 )
      {
         nth = nodeList.length + nth;
      }

      if ( nth >= 0 && nth < nodeList.length )
      {
         node = nodeList.item(nth);
      }

      return node;
   }
}

//////////////////////////////////////////////////////////////////////
// search nodes using xQuery
function $xf(xpath, xpt/*opt*/, startnode/*opt*/, aDoc/*opt*/)
{
   if ( !aDoc ) 
   { 
      aDoc = getDocument(startnode);
      if ( !aDoc ) { aDoc = document; }
   }
   if ( !startnode ) { startnode = aDoc; }
   var xpres = XPathResult.FIRST_ORDERED_NODE_TYPE;
   switch ( xpt )
   {
      case 'i':  xpres = XPathResult.UNORDERED_NODE_ITERATOR_TYPE;   break;
      case 'l':  xpres = XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;   break;
      case 'r':  xpres = XPathResult.ORDERED_NODE_SNAPSHOT_TYPE;     break;
      case 'n':  xpres = XPathResult.NUMBER_TYPE;                    break;
   }
   var result = aDoc.evaluate(xpath, startnode, null, xpres, null);
   var ret = result;
   switch ( result.resultType )
   {
      case XPathResult.FIRST_ORDERED_NODE_TYPE:   ret = result.singleNodeValue;  break;
      case XPathResult.NUMBER_TYPE:               ret = result.numberValue;      break;
   }

   return ret;
}

//////////////////////////////////////////////////////////////////////
function $xClass(cls)
{
   return "contains(concat(' ',@class,' '),' " + cls + " ')";
}

//////////////////////////////////////////////////////////////////////
//   call syntax:
//   1)   $at(node)
//   2)   $at(node, [])
//   3)   $at(node, [name,value])
//   4)   $at(node, [[name1,value1],...,[nameN,valueN]])
// It's also possible add events listeners uses syntax  $at(node, [type, listener, useCapture]) and so on.
//   If name starts with '#' that it is special attribute from private namespace
function $at(aElem, attributes)
{
   function processAttribute(aElem, name, value)
   {
      if ( value !== null && value !== undefined && value !== "" )
      {
         if ( name === 'class' && value.charAt(0) === '+' )
         {
            addClass(aElem, value.slice(1));
         }
         else
         {
            if ( name.toUpperCase() === 'TITLE' ) 
            {
               try
               { 
                  aElem.wrappedJSObject.setTip(value); 
               } 
               catch (e) 
               {
                  aElem.setAttribute(name, value);
                  aElem.setAttribute('alt', value);
               }
            }
            else if ( name.charAt(0) === '#' )
            {
               setTBAttribute(aElem, name.slice(1), value);
            }
            else
            {
               aElem.setAttribute(name, value);
            }
         }
      }
      else
      {
         aElem.removeAttribute(name);
      }
   }

   function processEventListener(aElem, type, listener, useCapture)
   {
      aElem.addEventListener(type, listener, useCapture);
   }

   if ( attributes )
   {
      var xi;
      for ( xi = 0; xi < attributes.length; xi++ )
      {
         var attribute = attributes[xi];
         if ( attribute instanceof Array )
         {
            if ( attribute.length === 2 )
            {
               processAttribute(aElem, attribute[0], attribute[1]);
            }
            else if ( attribute.length === 3 )
            {
               processEventListener(aElem, attribute[0], attribute[1], attribute[2]);
            }
         }
         else if ( xi === 0 ) // called as $at(node, [name,value])
         {
            if ( attributes.length === 2 )
            {
               processAttribute(aElem, attribute, attributes[1]);
            }
            else if ( attribute.length === 3 )
            {
               processEventListener(aElem, attribute, attributes[1], attributes[2]);
            }
            break;
         }
      }
   }
}

//////////////////////////////////////////////////////////////////////
// Create a new element of the DOM
//   call syntax:
//   1)   $e(type)
//   2)   $e(type, innerHTML)
//   3)   $e(type, childNode)
//   4)   $e(type, [attributes/event handlers])
//   5)   $e(type, [attributes/event handlers], innerHTML)
//   6)   $e(type, [attributes/event handlers], childNode)
//   7)   $e(type, [attributes/event handlers], [children])
//   8)   $e(type, null,         one of above)
function $e(aType, attributes, content)
{
   var node = document.createElement(aType); 

   /*
   if ( arguments.length === 2 && 
        ( !(attributes instanceof Array) || typeof attributes === "string" ) )
   {
      content = attributes;
      attributes = null;
   }
   */  
   if ( !(attributes instanceof Array) && !(attributes === null || attributes === undefined) )
   {
      content = attributes;
      attributes = null;
   }

   $at(node, attributes);
   
   if ( content !== null && content !== undefined )
   {
      if ( typeof content === "object" ) 
      {
         addChildren(node,content);
      }
      else if ( content !== "" ) 
      {
         node.innerHTML = content; 
      }
   }
   return node;
}

//////////////////////////////////////////////////////////////////////
// Create a text node of the DOM
function $txt(data)
{
   return document.createTextNode(data);
}

//////////////////////////////////////////////////////////////////////
function $t(att, content) 
{
   return $e("table", att, content);
}

//////////////////////////////////////////////////////////////////////
function $th(att, content) 
{
   return $e("th", att, content);
}

//////////////////////////////////////////////////////////////////////
function $r(att, content) 
{
   return $e("tr", att, content);
}

//////////////////////////////////////////////////////////////////////
// OBSOLETE, use $td instead
function $c(iHTML, att) 
{
   return $e("td", att, iHTML);
}

//////////////////////////////////////////////////////////////////////
function $td(att, content) 
{
   return $e("td", att, content);
}

//////////////////////////////////////////////////////////////////////
function $img(att)
{
   var aImg = document.createElement("img");
   $at(aImg, att);
   return aImg;
}

//////////////////////////////////////////////////////////////////////
// OBSOLETE, use $lnk instead
function $a(iHTML, att)
{
   return $e("a", att, iHTML);
}

//////////////////////////////////////////////////////////////////////
function $lnk(att, content)
{
   return $e("a", att, content);
}

//////////////////////////////////////////////////////////////////////
function $action(att, content, onClick)
{
   var aLink = $lnk(att, content);
   aLink.href = jsVoid;
   aLink.addEventListener("click", onClick, false);
   return aLink;
}

//////////////////////////////////////////////////////////////////////
function $i(att)
{
   var aInput = document.createElement("input");
   $at(aInput, att);
   return aInput;
}

//////////////////////////////////////////////////////////////////////
function $div(att, content)
{
   return $e("div", att, content);
}

//////////////////////////////////////////////////////////////////////
function $span(att, content)
{
   return $e("span", att, content);
}

//////////////////////////////////////////////////////////////////////
function getClasses(str)
{
   return  ( str instanceof Array ) ? str : str.split(" ");
}

//////////////////////////////////////////////////////////////////////
// check class of element ex. ex must be valid
// @cls may be string or RegExp
function hasClass(ex, cls)
{
   var classes,i;
   if ( cls ) 
   {
      var isRE = ( Object.prototype.toString.call(cls) === '[object RegExp]');
      if ( ex.className )
      {
         classes = getClasses(ex.className);
         for ( i = 0; i < classes.length; ++i)
         {
            if ( isRE )
            {
               if ( cls.test(classes[i]) )
               {
                  return true;
               }
            }
            else if ( classes[i] === cls )
            {
               return true;
            }
         }
      }
   }
   return false;
}

//////////////////////////////////////////////////////////////////////
// check presence one of classes of element ex. ex must be valid
//   call syntax:
//   1)   hasAnyClass(ex, "cls")
//   2)   hasAnyClass(ex, "cls1 cls2 ... clsN")
//   3)   hasAnyClass(ex, ["cls1", "cls2", ..., clsN])
function hasAnyClass(ex, cls)
{
   if ( cls ) 
   {
      if ( ex.className )
      {
         var i, j;
         var classes = getClasses(ex.className);
         var checked_classes = getClasses(cls);
         var bFound = false;

         for ( i = 0; i < classes.length; ++i )
         {
            for ( j = 0; j < checked_classes.length; ++j )
            {
               if ( classes[i] === checked_classes[j] )
               {
                  return true;
               }
            }
         }
      }
   }
   return false;
}

//////////////////////////////////////////////////////////////////////
//add class to element ex. ex must be valid
function addClass(ex,cls)
{
   if ( cls ) 
   {
      if ( !hasClass(ex,cls) )
      {
         if ( ex.className ) 
         {
            ex.className += " " + cls;
         }
         else 
         {
            ex.className = cls;
         }
      }
   }
}

//////////////////////////////////////////////////////////////////////
//delete class(es) from element ex. ex must be valid
//   call syntax:
//   1)   delClass(ex, "cls")
//   2)   delClass(ex, "cls1 cls2 ... clsN")
//   3)   delClass(ex, ["cls1", "cls2", ..., clsN])
function delClass(ex,cls)
{
   if ( cls ) 
   {
      if ( ex.className )
      {
         var i,j;
         var classes = getClasses(ex.className);
         var checked_classes = getClasses(cls);
         var bFound = false;

         for ( i = 0; i < classes.length; ++i )
         {
            for ( j = 0; j < checked_classes.length; ++j )
            {
               if ( classes[i] === checked_classes[j] )
               {
                  classes.splice(i,1);
                  --i; // continue with same position
                  bFound = true;
                  break;
               }
            }
         }
         if ( bFound ) { ex.className = classes.join(" "); }
      }
   }
}

//////////////////////////////////////////////////////////////////////
function toggleClass(ex,cls)
{
   if ( hasClass(ex,cls) ) 
   {
      delClass(ex,cls);
   }
   else
   {
      addClass(ex,cls);
   }
}

//////////////////////////////////////////////////////////////////////
function ifClass(ex, cond, cls)
{
   if ( cond )
   {
      addClass(ex, cls);
   }
   else
   {
      delClass(ex, cls);
   }
}

//////////////////////////////////////////////////////////////////////
function fireChangeEvent(ex)
{
   if ( ex )
   {
      var event = document.createEvent("Events");
      event.initEvent("change", true, false);
      ex.dispatchEvent(event);
   }
}

//////////////////////////////////////////////////////////////////////
function getX(element)
{
   var e;
   var x = 0;
   for ( e = element; e; e = e.offsetParent ) 
   {
      x += e.offsetLeft; 
   }

   for ( e = element.parentNode; e && e !== document.body; e = e.parentNode )
   {
      x -= e.scrollLeft;
   }

   return x;
}

//////////////////////////////////////////////////////////////////////
function getY(element)
{
   var e;
   var y = 0;
   for ( e = element; e; e = e.offsetParent ) 
   {
      y += e.offsetTop; 
   }

   for ( e = element.parentNode; e && e !== document.body; e = e.parentNode )
   {
      y -= e.scrollTop;
   }

   return y;
}

//////////////////////////////////////////////////////////////////////
function createHTMLDocument(title) 
{
   if ( document.implementation.createHTMLDocument ) 
   {
      return document.implementation.createHTMLDocument(title);
   }
   else
   {
      // Firefox does not support document.implementation.createHTMLDocument()
      // cf. http://www.quirksmode.org/dom/w3c_html.html#t12
      // the following is taken from http://gist.github.com/49453
      var strTitleTag = title ? '<title>' + title + '</title>' : '';
      var xmlDoc = document.implementation.createDocument('', '', null);
      var templ = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">'
              + '<xsl:output method="html"/><xsl:template match="/">'
              + '<html><head>' + strTitleTag + '</head><body/></html>'
              + '</xsl:template></xsl:stylesheet>';
      var proc = new XSLTProcessor();
      proc.importStylesheet(new DOMParser().parseFromString(templ,'text/xml'));
      return proc.transformToDocument(xmlDoc);
   }
}


