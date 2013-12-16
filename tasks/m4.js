/*
 * grunt-m4
 * https://github.com/litmit/grunt-m4
 *
 * Copyright (c) 2013 limit
 * Licensed under the MIT license.
 */
"use strict";
var fs = require("fs");
var path = require("path");

module.exports = function (grunt)
{
   // Please see the Grunt documentation for more information regarding task
   // creation: http://gruntjs.com/creating-tasks
   var child_count = 0;
   var noErrors = true;

   function m4(options, src_path, dest_path, cb)
   {
      grunt.file.mkdir(path.dirname(dest_path));
      var dest = fs.createWriteStream(dest_path);

      grunt.verbose.writeln("m4 preprocess '" + src_path + "' ==> '" + dest_path + "'");
      grunt.verbose.writeln("Command line options: " + grunt.log.wordlist(options, {separator:" "}));
      var child = grunt.util.spawn({cmd: "m4", args: options.concat(src_path)}, 
         function (error, result, code)
         {
            var bSuccess = (code === 0);

            if (code === 127)
            {
               return grunt.warn(
                  "You need to have m4 installed and in your system PATH for this task to work."
               );
            }
            else 
            {
               grunt.verbose.writeln("m4 done preprocessing '" + src_path + "' ==> '" + dest_path + "' [" + code + "]");
            }

            if ( bSuccess ) { grunt.verbose.ok(); }
            else { grunt.log.error(result.stderr); }

            noErrors = noErrors && bSuccess;

            if ( --child_count === 0 )
            {
               if (noErrors) { grunt.log.notverbose.ok(); }
               cb(noErrors);
            }
         });
      child.stdout.pipe(dest);
      ++child_count;
   }


   grunt.registerMultiTask("m4", "Grunt plugin for preprocess any files using m4 macro processor", 
      function ()
      {
         var done = this.async();

         // Merge task-specific and/or target-specific options with these defaults.
         var options = this.options(
         {
            prefix_builtins: true,
            define: {},  //define: { name:value, ... },
            include: "include" // include: ["dir1",...,"dirN"]
         });

         var args = [];
         var includes = options.include;
         var def;

         if ( options.prefix_builtins )
         {
            args.push("--prefix-builtins");
         }

         if ( !Array.isArray(options.include) )
         {
            includes = String(options.include).split(path.delimiter);
         }

         includes.forEach(function (i) { args.push("--include="+i); });

         for ( def in options.define )
         {
            if ( options.define.hasOwnProperty(def) )
            {
               args.push("--define=" + def + "=" + options.define[def]);
            }
         }

         grunt.log.notverbose.write("Preprocessing...");
         // Iterate over all specified file groups.
         this.files.forEach(
            function (f)
            {
               if ( !f.src.length ) 
               {
                  grunt.warn("Source files not defined yet.");
               }
               f.src.filter(
                  function (filepath)
                  {
                     // Warn on and remove invalid source files (if nonull was set).
                     if (!grunt.file.exists(filepath))
                     {
                        grunt.log.warn("Source file '" + filepath + "' not found.");
                        return false;
                     }
                     else
                     {
                        return true;
                     }
                  });

               m4(args,f.src,f.dest,done);
            });
      });
};
