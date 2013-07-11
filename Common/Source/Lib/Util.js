//////////////////////////////////////////////////////////////////////
function parseInt10(str,defv) 
{ 
   var v = parseInt(str,10);
   if ( isNaN(v) && defv !== undefined ) { v = defv; } 
   return v;
}

//////////////////////////////////////////////////////////////////////
function parseSeparatedInt10(str,defv) 
{ 
   str = str.replace(/[\s,.'"]/g, '');
   return parseInt10(str,defv);
}

/////////////////////////////////////////////////////////////////////
//Compute the seconds for a given human time
function toSeconds(hTime)
{
   var p = hTime.split(":");
   return (p.length === 3) ? (p[0] * 3600) + (p[1] * 60) + (p[2] * 1) : Number.NaN;
} 

/////////////////////////////////////////////////////////////////////
// convert Date to timestamp
function toTimeStamp(dt)
{
   return ( dt instanceof Date ) ? dt.getTime() : dt;
}

/////////////////////////////////////////////////////////////////////
// convert timestamp to Date
function toDate(tt)
{
   return ( tt instanceof Date ) ? tt : new Date(tt);
}

/////////////////////////////////////////////////////////////////////
function getTimeSpan(date1, date2)
{
   return (date1 === null || date2 === null) ? null : (toTimeStamp(date1) - toTimeStamp(date2))/1000;
} 

/////////////////////////////////////////////////////////////////////
//convert to a 2 digit string (time representation)
function to2Str(n)
{
   return (n > 9 ? n : '0' + n);
}

/////////////////////////////////////////////////////////////////////
//inverse of "toSeconds" -> convert seconds to "human understandable time" => format h:mm:ss (or h:mm:s?)
//aFormat: 0 = h:mm:ss (h = 0->... can be more than 24); 
//         1 = days, h:mm:ss; 
//         2 = h:mm:ss (h = 0->23:59:59 = only time)
function formatTimeSpan(sec, aFormat)
{
   var h,m,s,d,ht;

   if ( sec === Infinity || sec === -Infinity)
   {
      ht = String.fromCharCode(0x221E);
   }
   else if ( isIntValid(sec) && sec > -1 )
   {
      h = Math.floor(sec / 3600);
      m = Math.floor(sec / 60) % 60;
      s = parseInt(sec % 60);
      ht = "";

      switch ( aFormat )
      {
         case 1:
            d = Math.floor(h / 24);
            h = h - d * 24;
            ht += d + ", ";
            break;
         case 2:
            h = h % 24;
            break;
      }
      ht += h + ":" + to2Str(m) + ":" + to2Str(s);
   }
   else
   {
      ht = "0:00:0?";
   }
   return ht;
}


/////////////////////////////////////////////////////////////////////
//aFormat: 0 = at hh:mm; tomorrow at hh:mm; on DD/MM at hh:mm  
//         1 = at hh:mm:ss; DD/MM at hh:mm:ss 
//         2 = at hh:mm:ss
function formatDateTime(dtNow, aD, aFormat)
{
   var timeR = '';

   if ( aD === null )
   {
      timeR += T('AT') + " 00:00:0?"
   }
   else if ( aD === Infinity )
   {
      timeR += T('NEVER');
   }
   else
   {
      dtNow = toDate(dtNow);
      aD = toDate(aD);

      switch ( aFormat )
      {
         case 0:
            var h = ((aD.getTime() - dtNow.getTime()) / 1000 / 3600) + dtNow.getHours() + (dtNow.getMinutes() / 60);
            if ( h < 24 )      { timeR = ""; }
            else if ( h < 48 ) { timeR = T('TOMORROW'); }
            else if ( h < 72 ) { timeR = T('DAYAFTERTOM'); }
            else { timeR = T('ON') + " " + to2Str(aD.getDate()) + "/" + to2Str((aD.getMonth() + 1)); }
            break;

         case 1:
            var day = aD.getDate();
            var month = aD.getMonth();
            if ( day !== dtNow.getDate() || month !== dtNow.getMonth() ) 
            { 
               timeR = to2Str(day) + "/" + to2Str(month + 1); 
            }
            break;
      }

      if ( timeR !== "" ) {  timeR += " "; }
      timeR += T('AT') + " " + to2Str(aD.getHours()) + ":" + to2Str(aD.getMinutes());
      if ( aFormat !== 0 ) {  timeR += ":" + to2Str(aD.getSeconds()); }
   }

   return timeR;
}

/////////////////////////////////////////////////////////////////////
function _ifHelper(f, args)
{
   var i;
   for ( i = 1; i < args.length-1; i += 2 )
   {
      if ( f(args[0],args[i]) ) { return args[i+1]; }
   }
   if ( args.length%2 === 0 ) { return args[args.length-1]; }
}

/////////////////////////////////////////////////////////////////////
// return first exprN where v is equal caseN 
// or if no match is founded return exprDefault if it present or undefined 
function ifEqual(v/*, case1, expr1, ..., caseN, exprN[, exprDefault]*/)
{
   return _ifHelper(function(n1,n2){ return n1 == n2; }, arguments);
}

/////////////////////////////////////////////////////////////////////
// return first exprN where v is greater than caseN 
// or if no match is founded return exprDefault if it present or undefined 
function ifGreater(v/*, case1, expr1, ..., caseN, exprN[, exprDefault]*/)
{
   return _ifHelper(function(n1,n2){ return n1 > n2; }, arguments);
}

/////////////////////////////////////////////////////////////////////
// return true if v is equal some of test1 - testN values
// or false no match is founded
function isSomeOf(v/*, test1, ..., testN*/)
{
   var i;
   for ( i = 1; i < arguments.length; ++i )
   {
      if ( v === arguments[i] ) { return true; }
   }
   return false;
}

/////////////////////////////////////////////////////////////////////
// A robust and universal forEach from sizzlemctwizzle
function forEach(lst, cb) 
{
   if ( lst )
   {
      var i, len;
      if ( lst.snapshotItem )
      {
         for ( i = 0, len = lst.snapshotLength; i < len; ++i)
         {
            cb(lst.snapshotItem(i), i, lst);
         }
      }
      else if ( lst.iterateNext ) 
      {
         var item, next = lst.iterateNext;
         for(i = 0; item = next(); ++i )  { cb(item, i, lst); }
      } 
      else if ( typeof lst.length !== 'undefined' )
      {
         for ( i = 0, len = lst.length; i < len; ++i) { cb(lst[i], i, lst); }
      }
      else if ( typeof lst === "object" )
      {
         for ( i in lst ) { cb(lst[i], i, lst); }
      }
   }
}

/////////////////////////////////////////////////////////////////////
function convertToArray(lst)
{
  var arr = [];
  forEach(lst, function(item){ arr.push(item) });
  return arr;
}

/////////////////////////////////////////////////////////////////////
function countIf(lst, cb) 
{
   var count = 0;

   function counterCB(item, i, lst) 
   {
      if ( cb(item, i, lst) ) { ++count; }
   }
   forEach(lst, counterCB);
   return count;
}

/////////////////////////////////////////////////////////////////////
function join(lst, sep) 
{
   var str = "";
   var bFirst = true;

   function joinCB(item) 
   {
      if ( !bFirst )  { str += sep; }
      bFirst = false; 
      str += item;
   }
   forEach(lst, joinCB);
   return str;
}

/////////////////////////////////////////////////////////////////////
function compare(m, n) 
{
   return m == n ? 0 : (m > n ? 1 : -1);
}

/////////////////////////////////////////////////////////////////////
function compareNumbers(m, n) 
{
   return m - n;
}

/////////////////////////////////////////////////////////////////////
function trimBlanks(s)
{
   var l = 0;
   var r = s.length - 1;
   while (l < s.length && s[l] === ' ')
   {
      l++;
   }
   while (r > l && s[r] === ' ')
   {
      r -= 1;
   }
   return s.substring(l, r + 1);
}

/////////////////////////////////////////////////////////////////////
function trimWhitespaces(s)
{
   if ( !trimWhitespaces.re )
   {
      trimWhitespaces.re = /^\s*(.*?)\s*$/;
   }

   if ( trimWhitespaces.re.exec(s) ) { s = RegExp.$1; }
   return s;
}

/////////////////////////////////////////////////////////////////////
function removeInvisibleChars(str) 
{
   return str.replace(/[\u200E\u200F\u202A\u202B\u202C\u202D\u202E]/g,'');
}

/////////////////////////////////////////////////////////////////////
function decodeHTMLEntities(str) 
{
   if ( !decodeHTMLEntities.element ) { decodeHTMLEntities.element = document.createElement('div'); }

   decodeHTMLEntities.element.innerHTML = str;
   str = removeInvisibleChars(decodeHTMLEntities.element.innerHTML);
   decodeHTMLEntities.element.textContent = '';

   return str;
}


/////////////////////////////////////////////////////////////////////
// create function that call <f> with <boundArgs>
// ex.:  
//   proxy = bind(f,[a,b,c]);
//   proxy(); // ---> f(a,b,c)
function bind(f, boundArgs)
{
   return function()
          {
             return f.apply(this, boundArgs);
          };
}

/////////////////////////////////////////////////////////////////////
// create function that call method <f> of object <o> with <boundArgs>
// ex.:  
//   proxy = bindMethod(o, o.f, [a,b,c]);
//   proxy(); // ---> o.f(a,b,c)
function bindMethod(o, f, boundArgs)
{
   return function()
          {
             return f.apply(o, boundArgs);
          };
}

/////////////////////////////////////////////////////////////////////
// create function that call <f> with <boundArgs> and self arguments
// ex.:  
//   proxy = bind2(f,[a,b,c]);
//   proxy(x,y); // ---> f(a,b,c,x,y)
function bind2(f,boundArgs) 
{
   return function() 
          {
             var i, args = [];
             for(i = 0; i < boundArgs.length; i++) { args.push(boundArgs[i]); }
             for(i = 0; i < arguments.length; i++) { args.push(arguments[i]); }
             return f.apply(this, args);
          };
}

/////////////////////////////////////////////////////////////////////
// create function that call method <f> of object <o> with  with rest of arguments and self arguments
// ex.:  
//   proxy = xbindMethod2(o, o.f, a,b,c);
//   proxy(x,y); // ---> o.f(a,b,c, x,y)
function xbindMethod2(o,f) 
{
   var i, args = [];
   for(i = 2; i < arguments.length; i++) { args.push(arguments[i]); }
   return function() 
          {
             return f.apply(o, args.concat(convertToArray(arguments)));
          };
}

/////////////////////////////////////////////////////////////////////
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [rev. #1]

shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
}

/////////////////////////////////////////////////////////////////////
function cloneArray(v) 
{
   return v.slice();
}

//////////////////////////////////////////////////////////////////////
function fillArray(a,v) 
{
   var i = a.length;
   while ( i-- ) 
   {
      a[i] = v;
   }
   return a;
}

//////////////////////////////////////////////////////////////////////
// a1 += a2;
// return a1
function accumulateArray(a1, a2)
{
   var len = a1.length
   var i;

   for ( i = 0; i < a1.length; ++i )
   {
      if ( a2[i] !== undefined ) 
      {
         a1[i] += a2[i];
      }
   }

   return a1;
}

/////////////////////////////////////////////////////////////////////
function cloneObject(obj)
{
   if ( obj !== null && typeof(obj) === 'object' )
   {
      var prop_name;
      var dest_obj  = (obj instanceof Array) ? [] : {};
      for ( prop_name in obj )
      {
         dest_obj[prop_name] = cloneObject(obj[prop_name]);
      }
      return dest_obj;
   }
   return obj;
}

/////////////////////////////////////////////////////////////////////
// return true if dest object updated
function cloneUndefinedProperties(src_obj, dest_obj) 
{
   var prop, prop_name;
   var destUpdated = false;

   for ( prop_name in src_obj ) 
   {
      if ( src_obj.hasOwnProperty(prop_name) )
      {
         prop = src_obj[prop_name];
         if ( prop !== null && typeof(prop) === "object" )
         {
            if ( !dest_obj.hasOwnProperty(prop_name) ) 
            {
               dest_obj[prop_name] = (prop instanceof Array) ? [] : {};
               destUpdated = true;
            }
            if ( cloneUndefinedProperties(prop, dest_obj[prop_name]) )
            {
               destUpdated = true;
            }
         }
         else 
         {
            if ( !dest_obj.hasOwnProperty(prop_name) ) 
            {
               dest_obj[prop_name] = prop;
               destUpdated = true;
            }
         }
      }
   }
   return destUpdated;
}

/////////////////////////////////////////////////////////////////////
function removeUndefinedProperties(src_obj, dest_obj) 
{
   var prop_name, src_prop, dest_prop;

   for ( prop_name in dest_obj ) 
   {
      if ( prop_name in src_obj ) 
      {
         src_prop = src_obj[prop_name];
         dest_prop = dest_obj[prop_name];
         if ( typeof(src_prop) === "object" && typeof(dest_prop) === "object" )
         {
            if ( !src_prop instanceof Array && !dest_prop instanceof Array )
            {
               removeUndefinedProperties(src_prop, dest_prop);
            }
         }
      }
      else
      {
         delete dest_obj[prop_name];
      }
   }
}

/////////////////////////////////////////////////////////////////////
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
// modified npocmu: added hashbang parser (hash,hashbang,hashKey)
function parseUri(str)
{
   if ( !parseUri.options )
   {
      parseUri.options = 
      {
         strictMode: false,
         key:        ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","hash","anchor","hashbang"],
         q:          {
                        key: "query",
                        name:   "queryKey",
                        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                     },
         h:          {
                        key: "hashbang",
                        name:   "hashKey",
                        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                     },
         parser:     {
                        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(([^!]*)(?:!(.*)?)?))?)/,
                        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(([^!]*)(?:!(.*)?)?))?)/
                     }
      };
   }

   function subparse(uri,rules)
   {
      uri[rules.name] = {};
      uri[rules.key].replace(rules.parser, function ($0, $1, $2)
                                           {
                                              if ($1) uri[rules.name][$1] = $2;
                                           });
   }

   var o = parseUri.options,
       m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
       uri = {},
       i = 16;

   while (i--) uri[o.key[i]] = m[i] || "";
   subparse(uri,o.q);
   subparse(uri,o.h);
   return uri;
}

/////////////////////////////////////////////////////////////////////
function combineUri(uri)
{
   function combineCollection(collection)
   {
      var s = "";
      var p;
      for ( p in collection ) 
      { 
         if ( s ) { s += "&"; }
         s += p + "=" + collection[p];
      }
      return s;
   }

   uri.query = combineCollection(uri.queryKey);
   uri.hashbang = combineCollection(uri.hashKey);

   uri.hash = "";
   if ( uri.anchor )   { uri.hash += uri.anchor; }
   if ( uri.hashbang ) { uri.hash += "!" + uri.hashbang; }

   var str = uri.protocol;
   if ( str ) { str += ":"; }
   if ( uri.authority ) { str += "//" + uri.authority; }

   return str + uri.path + (uri.query ? "?" + uri.query : "") + (uri.hash ? "#" + uri.hash : "");
}

//////////////////////////////////////////////////////////////////////
function isStrValid(s)
{
   return typeof(s) === "string" && s.length > 0;
}

//////////////////////////////////////////////////////////////////////
function isIntValid(v)
{
   return v !== null && isFinite(v);
}

//////////////////////////////////////////////////////////////////////
// return a first number from a 'str' using regexp 're', NaN if number is absent
function scanIntRE(str, re)
{
   var v = Number.NaN;
   if ( str !== undefined && str.search(re) !== -1 )
   {
      v = parseInt10(RegExp.$1);
   }
   return v;
}

//////////////////////////////////////////////////////////////////////
// return a first number from an arbitrary string 'str', NaN if number is absent
function scanIntAny(str)
{
   return scanIntRE(str, /(\d+)/);
}

//////////////////////////////////////////////////////////////////////
function scanIntWithoutLetter(str)
{
   return scanIntRE(str, /^\W*(\d+)/);
}

//////////////////////////////////////////////////////////////////////
// return a number from a string 'str'. Number must started with 'prefix'.
// NaN if number is absent
function scanIntWithPrefix(prefix, str)
{
   return scanIntRE(str, "(?:\\s+|^)" + prefix + "(\\d+)");
}


//////////////////////////////////////////////////////////////////////
function Timer()
{
   this.timer = null;
}

Timer.prototype.isActive = function () 
{
   return Boolean( this.timer ) 
}

Timer.prototype.cancel = function () 
{
   if ( this.timer ) 
   {
      clearTimeout(this.timer);
      this.timer = null;
   }
}

Timer.prototype.set = function () 
{
   this.timer = setTimeout.apply(null, arguments);
}

Timer.prototype.interval = function () 
{
   this.timer = setInterval.apply(null, arguments);
}


//////////////////////////////////////////////////////////////////////
// force content of input field to be valid integer in bounds [min,max], or empty string
// Always returns a valid integer (0 if value of input control is an empty string)
function validateInputInt(input, min /*opt*/, max /*opt*/)
{
   var value = 0;
   if ( input.value !== "" ) 
   {
      value = Number(input.value);
      if ( max !== undefined && (isNaN(value) || value > max) )
      {
         value = max;
      }
      else if ( min !== undefined && (isNaN(value) || value < min) )
      {
         value = min;
      }
      
      if ( isNaN(value) )
      { 
         input.value = "";
         value = 0; 
      }
      else
      {
         input.value = value;
      }
   }
   return value;
}
