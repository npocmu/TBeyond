# grunt-m4

> Grunt plugin for preprocess any files using m4 macro processor

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-m4 --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-m4');
```

## The "m4" task

_Run this task with the `grunt m4` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Overview
In your project's Gruntfile, add a section named `m4` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  m4: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.prefix_builtins
Type: `Boolean`
Default value: `true`

Enable/disable --prefix-builtins option in m4.
If option enabled then m4 internally modify all builtin macro names so they all start with the prefix `m4_`
For more information see m4 manual.

#### options.include
Type: `String` or `Array`
Default value: `'include'`

Make m4 search directory for included files that are not found in the current working directory.

#### options.define
Type: `Object`
Default value: `{}`

Add names into the symbol table.

### Usage Examples

#### Basic usage
In this example, we just preprocess one file `source.js.m4` into `source.js`

```js
grunt.initConfig({
  m4: {
    files:
    {
       src: 'source.js.m4',
       dest: 'source.js'
    },
  },
});
```

#### Average usage
In this example, we preprocess all files `source/*.js.m4` and rewrite them as
`source/*.js`. When prepocessing then m4 will be search files for include in folders `includes` and `more_includes`.
Also defines some macros `DEBUG`, `PI` and `SOME_CONSTANT` widely available in all sources.

```js
grunt.initConfig({
  m4: {
    options: {
      include: ['includes','more_includes'],
      define: { DEBUG:'', PI:'Math.PI', SOME_CONSTANT:2 }
    },
    files:
    [{
       expand : true,
       cwd: "source/",
       src: "**/*.js.m4",
       dest: "source/",
       rename: function(dst, src) { return dst + src.replace(/(\.[^.\/]*)?$/, ""); },
    }],
  },
});
```

## Contributing

## Release History
 * 2013-12-16 v0.1.0 First release
