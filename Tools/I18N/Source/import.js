/*********************************************************************
******************************************************** TBEYOND SSE *
* Distrubuted under Creative Commons Attribution-Noncommercial-Share 
* Alike 3.0 License 
*                                            e-mail: npocmu@gmail.com 
*                           http://userscripts.org/scripts/show/98310 
**********************************************************************
* FILE:        import.js
* CREATED:     Fri, 25 Mar 2011 11:34:25 +0200
* AUTHORS:     npocmu
* COPYRIGHT:   (c) npocmu 2011
* PURPOSE:     
*********************************************************************/
var FS="\t"; 
var OFS="\t";
var NR = 0;
var FILENAME = "";
var MaxInfoLevel = 9;

var objFSO = WScript.CreateObject("Scripting.FileSystemObject");
var objIE = WScript.CreateObject("InternetExplorer.Application");
objIE.navigate("about:blank");

MSGTYPE_NONE    = 0;   // unknown msg type
MSGTYPE_EMERG   = 1;   // system is unusable
MSGTYPE_ALERT   = 2;   // action must be taken immediately
MSGTYPE_CRIT    = 3;   // (CRI) critical conditions
MSGTYPE_ERROR   = 4;   // (ERR) error conditions
MSGTYPE_WARNING = 5;   // (WRN) warning conditions
MSGTYPE_NOTICE  = 6;   // (NOT) normal, but significant, conditions
MSGTYPE_INFO    = 7;   // (INF) informational message
MSGTYPE_DEBUG   = 8;   // (DBG) debug message
MSGTYPE_DUMP    = 9;   // (DMP) dump message
MSGTYPE_TRACE   =10;   // (TRC) trace message

//////////////////////////////////////////////////////////////////////
function getMsgTypeName(type)
{
   var name = "";
   switch (type)
   {
      case MSGTYPE_CRIT : name = "fatal"; break;
      case MSGTYPE_ERROR : name = "error"; break;
      case MSGTYPE_WARNING: name = "warning"; break;
      case MSGTYPE_NOTICE: name = "notice"; break;
      case MSGTYPE_INFO  : name = ""; break;
   }
   return name;
}

//////////////////////////////////////////////////////////////////////
function StdOutLogger()
{
   this.Log = function(descr, msg)
   {
      var str = descr.facility;
      if ( descr.file )
      {
         str += " '" + descr.file + "'(" + descr.line + ")"
      }
      if ( descr.type )
      {
         str += " " + getMsgTypeName(descr.type);
      }
      str += ": " + msg;
      WScript.Echo(str);
   }
}

//////////////////////////////////////////////////////////////////////
function IELogger()
{
   this.Log = function(descr, msg)
   {
      var str = "import";
      var style = "";
      if ( descr.file )
      {
         str += " '" + descr.file + "'(" + descr.line + ")"
      }
      if ( descr.type )
      {
         str += " " + getMsgTypeName(descr.type);
         if ( descr.type == MSGTYPE_NOTICE ) { style ="color:darkgreen;font-weight:bold;"; }
         if ( descr.type == MSGTYPE_WARNING ) { style ="color:red;font-weight:bold;"; }

      }
      str += ": " + msg;
      while (objIE.Busy) {}
      objIE.Document.write("<div style='" + style + "'>" + str + "</div>");
      objIE.Visible = 1;
   }
}


//////////////////////////////////////////////////////////////////////
function LogDevice()
{
   this.loggers = [];

   this.Bind = function(logger, filter)
   {
      this.loggers.push({logger:logger, filter:filter});
   };

   this.Log = function(descr, msg)
   {
      var i;
      for ( i = 0; i < this.loggers.length; ++i )
      {
         var bFilterPassed = true;
         var filter = this.loggers[i].filter;
         if ( filter )
         {
            if ( descr.level !== undefined ) 
            {
               if ( filter.minLevel !== undefined && descr.level < filter.minLevel ) { bFilterPassed = false; }
               if ( filter.maxLevel !== undefined && descr.level > filter.maxLevel ) { bFilterPassed = false; }
            }
         }

         if ( bFilterPassed )
         {
            this.loggers[i].logger.Log(descr, msg);
         }
      }
   };
}

LogDevice.m_defDevice = null;
LogDevice.SetDefault = function (newDev)
{
   var oldDevice = LogDevice.m_defDevice;
   LogDevice.m_defDevice = newDev;
   return oldDevice;
};

LogDevice.GetDefault = function()
{
   if ( !LogDevice.m_defDevice )
   {
      LogDevice.m_defDevice = LogDevice.Standard();
   }
   return LogDevice.m_defDevice;
};

LogDevice.Standard = function() 
{ 
   return new LogDevice();
};




//////////////////////////////////////////////////////////////////////
function OpenFile(name)
{
   FILENAME = name;
   NR = 0;
   objFile = objFSO.OpenTextFile(name, 1);
}

//////////////////////////////////////////////////////////////////////
function CloseFile()
{
   FILENAME = "";
   NR = 0;
   objFile.Close();
}

//////////////////////////////////////////////////////////////////////
function CreateFile(name)
{
   outFile = objFSO.CreateTextFile(name, true);
}

//////////////////////////////////////////////////////////////////////
function getline()
{
   if ( !objFile.AtEndOfStream )
   {
      $0 = objFile.ReadLine();
      $=$0.split(FS);
      NF = $.length;
      ++NR;
      return 1;
   }
   return 0;
}

//////////////////////////////////////////////////////////////////////
function Confirm(prompt)
{
   while ( objIE.Busy ) {}
   var obj = objIE.Document.Script;
   return obj.confirm(prompt);
}

//////////////////////////////////////////////////////////////////////
function print(str)
{
   if ( arguments.length === 0 )
   {
      outFile.WriteLine($0);
   }
   else
   {
      outFile.WriteLine(str);
   }
}

//////////////////////////////////////////////////////////////////////
var contributors = [];

//////////////////////////////////////////////////////////////////////
(function()
{

   LogDevice.GetDefault().Bind(new StdOutLogger());
//   LogDevice.GetDefault().Bind(new IELogger(),{maxLevel:2});

   if ( WScript.Arguments.length < 1)
   {
      FatalMsg("Not enought arguments");
   }

   var TM = LoadTranslation(WScript.Arguments(0));
   SaveTranslation(TM);

})();


//////////////////////////////////////////////////////////////////////
function unquoteString(str)
{
   if ( str.charAt(0) === '"' && str.charAt(str.length-1) === '"' )
   {
      str = str.slice(1,-1);
      str = str.replace(/""/g,'"');
   }
   return str;
}

//////////////////////////////////////////////////////////////////////
function quoteString(str)
{
   str = unquoteString(str);
   var q = '"';
//   if ( str.indexOf(q) !== -1 ) { q = "'"; }

   return q + str.replace(/["]/g,"\\\"") + q;
}

/////////////////////////////////////////////////////////////////////
function trimBlanks(s)
{
   var l = 0;
   var r = s.length - 1;
   while (l < s.length && s.charAt(l) === ' ')
   {
      l++;
   }
   while (r > l && s.charAt(r) === ' ')
   {
      r -= 1;
   }
   return s.substring(l, r + 1);
}


//////////////////////////////////////////////////////////////////////
function LoadTranslation(file)
{
   if ( file )
   {
      InfoMsg(1,"Loading translation from '" + file + "'");
      var TM = [];
      var langCodes = [];
      var i;

      OpenFile(file);
      if ( getline() > 0 )
      {
         for (i = 1; i < NF; ++i)
         {
            langCodes[i] = unquoteString($[i]);
            TM[langCodes[i]] = [];
         }
      }
      else
      {
         FatalMsg("Invalid file format");
         return null;
      }

      if ( getline() > 0 && $[0] === "Contributors" )
      {
         for (i = 1; i < NF; ++i)
         {
            contributors[langCodes[i]] = unquoteString($[i]);
         }
      }
      else
      {
         FatalMsg("Invalid file format");
         return null;
      }

      while ( getline() > 0)
      {
         var tag = $[0];
         for (i = 1; i < NF; ++i)
         {
            var v = undefined;
            if ( $[i] === "~~~" ) { v = ''; } // special markup for empty string
            else if ( $[i] !== "" ) { v = $[i]; }
            TM[langCodes[i]][tag] = v;
         }
      }
      CloseFile();

      return TM;
   }

   FatalMsg("Missing file name");
   return null;
}


//////////////////////////////////////////////////////////////////////
function printTranslation(tran)
{
   var tag;
   for ( tag in tran )
   {
      if ( tran[tag] !== undefined )
      {
         print("t['" + tag + "'] = " + quoteString(tran[tag]) + ";");
      }
   }
}

//////////////////////////////////////////////////////////////////////
function SaveTranslation(TM)
{
   var lang = 'en'
   var tran = TM[lang];

   var fname = "Output/Default.js";
   CreateFile(fname);
   InfoMsg(1,"Write localization for '" + lang + "' to file '" + fname + "'");

   print("function setDefLang()");
   print("{");
   print("//default = English");
   if ( contributors[lang] ) 
   {
      print("//contributors: " + contributors[lang]);
   }

   print("t['0'] = " + quoteString("Script language"));
   printTranslation(tran);
   print("};");
   outFile.Close();


   var fname = "Output/Other.js";
   CreateFile(fname);
   InfoMsg(1,"Write localization for other languages to file '" + fname + "'");

   print("function switchLanguage(lang) { if ( lang !== 'en' ) { switch ( lang ) {");


   for ( lang in TM )
   {
      if ( lang !== 'en' )
      {
         tran = TM[lang];
         var str = '';
         if ( contributors[lang] ) 
         {
            str = " //contributors: " + contributors[lang];
         }

         var l = lang.split(",");
         var i;
         for (i = 0; i < l.length; ++i )
         {
            print("case '" + trimBlanks(l[i]) + "':" + str);
            str = "";
         }
         printTranslation(tran);
         print("break;\n");
      }
   }
   print("}}}");

   outFile.Close();
}

//////////////////////////////////////////////////////////////////////
function Stringify(obj)
{
   var str = "";
   var len = 0;
   var type = typeof(obj);

   function addSep(sep)
   {
      str += sep;
      len += sep.length;
      if ( len > 100 ) { str += "\n"; len = 0;}
   }
   function addStr(s)
   {
      str += s;
      len += s.length;
   }

   if ( type === "object" )
   {
      if ( obj instanceof Array )
      {
         addSep('[');
         for ( var i = 0; i < obj.length; ++i )
         {
            if ( i ) { addSep(','); }
            addStr(Stringify(obj[i]));
         }
         addSep(']');
      }
      else
      {
         if ( obj === null ) { str = 'null'; }
         else
         {
            var bFirst = true;
            addSep('{');
            for ( var k in obj ) 
            {
               if ( !bFirst ) { addSep(','); }
               addStr(k + ":" + Stringify(obj[k]));
               bFirst = false;
            }
            addSep('}');
         }
      }
   }
   else if ( type === "string" )
   {
      str = '"' + obj + '"';
   }
   else
   {
      str = String(obj);
   }
   return str;
}


//////////////////////////////////////////////////////////////////////
function Dump(obj)
{
   if ( MaxInfoLevel >= 9 )
   {
      WScript.Echo(Stringify(obj));
   }
}

//////////////////////////////////////////////////////////////////////
function LogMsg(lvl, type, msg)
{
   LogDevice.GetDefault().Log({ file: FILENAME, line: NR, type: type, level:lvl, facility:"import i18n"},  
                               msg);
}

//////////////////////////////////////////////////////////////////////
function InfoMsg(lvl,str)
{
   LogMsg(lvl, MSGTYPE_INFO, str);
}

//////////////////////////////////////////////////////////////////////
function ErrMsg(str)
{
   LogMsg(0, MSGTYPE_ERROR, str);
}

//////////////////////////////////////////////////////////////////////
function FatalMsg(str)
{
   LogMsg(0, MSGTYPE_CRIT, str);
   WScript.Quit(10);
}

/*************************** END OF FILE ****************************/
