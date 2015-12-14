module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        //pkg: grunt.file.readJSON("package.json"),

        clean: {
            release: [
                "release"
            ]
        },

        concat: {
            release: {
                options: {
                    // Replace all 'use strict' statements in the code with a single one at the top
                    banner: "\"use strict\";\n",
                    process: function (src, filepath) {
                        return "// Source: " + filepath + "\n" + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, "$1");
                    }
                },
                files: {
                    "release/ng-objects.js": ["src/module.js",
                        "src/enum/**/*",
                        "src/utility/extend.js",
                        "src/utility/ds/*",
                        "src/utility/em/*",
                        "src/model/abstract/*",
                        "src/model/*",
                        "src/service/**/*",
                        "src/directive/*"]
                }
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            js: {
                src: "release/ng-objects.js",
                dest: "release/ng-objects.min.js"
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("Release", [
        "clean",
        "concat",
        "uglify"
    ]);

};