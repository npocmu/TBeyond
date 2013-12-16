/*
 * grunt-m4
 * https://github.com/litmit/grunt-m4
 *
 * Copyright (c) 2013 limit
 * Licensed under the MIT license.
 */

"use strict";
var path = require("path");


module.exports = function (grunt)
{
   // Project configuration.
   grunt.initConfig(
   {
      jshint:
      {
         options: { jshintrc: true },
         all: [
            "Gruntfile.js",
            "tasks/*.js",
           // "<%= nodeunit.tests %>",
         ]
      },

      // Before generating any new files, remove any previously-created files.
      clean:
      {
         tests: ["test/tmp"],
      },

      // Configuration to be run (and then tested).
      m4:
      {
         default_options:
         {
            src: ["test/fixtures/part1.css", "test/fixtures/part2.css"],
            dest: "test/tmp/output.css",
         },
         custom_options:
         {
            options:
            {
               prefix_builtins: true,
               include: "test/include" + path.delimiter + "test/include main",
               define: {VAR1:"value1", VAR2:2 }
            },
            files:
            [{
               expand : true,
               cwd: "test/fixtures/",
               src: "**/*.m4",
               dest: "test/tmp/",
               rename: function(dst, src) { return dst + src.replace(/(\.[^.\/]*)?$/, ""); },
            }],
         },
      },

      // Unit tests.
      nodeunit:
      {
         tests: ["test/*_test.js"],
      },

   });

   // Actually load this plugin"s task(s).
   grunt.loadTasks("tasks");

   // These plugins provide necessary tasks.
   grunt.loadNpmTasks("grunt-contrib-jshint");
   grunt.loadNpmTasks("grunt-contrib-clean");
   grunt.loadNpmTasks("grunt-contrib-nodeunit");

   // Whenever the "test" task is run, first clean the "tmp" dir, then run this
   // plugin"s task(s), then test the result.
   grunt.registerTask("test", ["clean", "m4", "nodeunit"]);

   // By default, lint and run all tests.
   grunt.registerTask("default", ["jshint", "test"]);
};