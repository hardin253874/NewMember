module.exports = function (grunt) {
    grunt.registerTask('local', [
            'clean:prepare', 'copy:before', 'includeSource',
            'less:local', 'ngtemplates:local', 'rename:after', 'preprocess:local'
        ]);
    grunt.registerTask('dev', [
        'jshint','karma:unit','protractor:local'
    ]);
    grunt.registerTask('uat',  [
            'clean:prepare', 'copy:before', 'includeSource', 'less:uat', 'ngtemplates:app',
            'useminPrepare', 'concat:generated', 'ngAnnotate', 'uglify:generated', 'copy:owner',
      'usemin', 'rename:after', 'preprocess:live'
        ]);
    grunt.registerTask('masterDeploy',  [
        'clean:prepare', 'copy:before', 'includeSource', 'less:uat', 'ngtemplates:app',
        'useminPrepare', 'concat:generated', 'ngAnnotate', 'uglify:generated', 'copy:owner', 'filerev',
        'usemin',
        'rename:after', 'preprocess:live'
    ]);
    grunt.registerTask('uat1Deploy',  [
        'clean:prepare', 'copy:before', 'includeSource', 'less:uat', 'ngtemplates:app',
        'useminPrepare', 'concat:generated', 'ngAnnotate', 'uglify:generated', 'copy:owner', 'filerev',
        'usemin',
        'rename:after', 'preprocess:live'
    ]);
    grunt.registerTask('uat2Deploy',  [
        'clean:prepare', 'copy:before', 'includeSource', 'less:uat', 'ngtemplates:app',
        'useminPrepare', 'concat:generated', 'ngAnnotate', 'uglify:generated', 'copy:owner', 'filerev',
        'usemin',
        'rename:after', 'preprocess:live'
    ]);
    grunt.registerTask('live', [
            'clean:prepare', 'copy:before', 'includeSource', 'less:uat', 'ngtemplates:app', 'useminPrepare',
            'concat:generated', 'ngAnnotate', 'uglify:generated', 'copy:owner',  'filerev', 'usemin',
            'rename:after',  'copy:after',
            'clean:after', 'preprocess:live'
        ]);
    grunt.registerTask('liveDeploy', [
        'clean:prepare', 'copy:before', 'includeSource', 'less:uat', 'ngtemplates:app', 'useminPrepare',
        'concat:generated', 'ngAnnotate', 'uglify:generated', 'copy:owner', 'filerev', 'usemin',
        'rename:after',
        'clean:after', 'preprocess:live'
    ]);



    var path = {
        'root': 'src/owner/',
        'portal': 'portal/',
        'app': 'app/',
        'dist': 'dist/' //,
        // 'cshtml': 'Views/',
        // 'reporting': 'reporting/'
    };

    var root = path.root;
    var root_dist = root +  path.dist;
    var app = path.root + path.app;
    var app_dist = app + path.dist;
    var portal = path.root + path.portal;
    var portal_dist = portal + path.dist;
   // var path_cshtml = root + path.cshtml + '**/*.cshtml';
   // var reporting = root + path.reporting;

    var app_index = root + 'index.html';
    var report = app + 'open/report.html';
    var portal_index = portal + 'index.html';

    var app_index_tpl = 'src/owner/index.tpl.html';
    var report_tpl = 'src/owner/app/open/report.tpl.html';
    var portal_index_tpl = 'src/owner/portal/index.tpl.html';
    var msg_cshtml_tpl = 'src/owner/Views/Shared/_MessageLayout.tpl.cshtml';
    var expiredInvite_html_tpl = 'src/owner/Views/ExpiredInvitation.tpl.html';
    var expiredPortalInvite_html_tpl = 'src/ownerViews/ExpiredPortalInvitation.tpl.html';

    var app_styles_css = app + 'content/css/styles.css';
    var app_styles_less = app + 'content/css/less/styles.less';
    var app_initial_css = app + 'content/css/initial.css';
    var app_initial_less = app + 'content/css/less/initial/initial.less';
    var portal_styles_css = portal + 'content/css/styles.css';
    var portal_styles_less = portal + 'content/css/less/styles.less';
    //var reporting_styles_css = reporting + 'content/css/styles.css';
    //var reporting_styles_less = reporting + 'content/css/less/styles.less';

    var app_gen_css = app + 'content/css/styles.*.css';
    var initial_gen_css = app + 'content/css/initial.*.css';
    var portal_gen_css = portal + 'content/css/styles.*.css';

    var source_map = root + 'source_map/';

    var version = grunt.file.readJSON('package.json').version;
    if (grunt.file.exists('version.txt')) {
        version = grunt.file.read('version.txt');
    }

    var banner = "/*!\n" +
        "  PropertyMe " + version + " (<%= grunt.template.today('yyyymmdd') %>)\n" +
        "  Copyright 2013-<%= grunt.template.today('yyyy') %>\n" +
        "*/" +
        "\n";

    grunt.initConfig({
        env: {
            options: {},
            local: {
                ENV: 'local'
            },
            uat: {
                ENV: 'uat'
            },
            live: {
                ENV: 'live'
            }
        },
        //usemin cannot natively handle .CSHTML files. So we make copies those files (*.tpl.cshtml)
        //with the extension .tpl.html and run usemin on those.
        //then afterwards we rename those specific files back to .cshtml

        clean: {
            prepare: [source_map, root_dist,  app_dist, portal_dist, app_index,  report, portal_index, app_styles_css,
                app_initial_css, portal_styles_css, app_gen_css, portal_gen_css, initial_gen_css,
                'src/owner/Views/Shared/_MessageLayout.cshtml', 'src/owner/Views/Shared/_PortalLayout.cshtml'],
            after: [
                'src/owner/Views/Shared/_MessageLayout.tpl.html',
                'src/owner/Views/Shared/_PortalLayout.tpl.html',
                'src/owner/app/dist/scripts/*.js.map'
            ]
        },
        copy: {
            before: {
                files: {

                }

            },
            after: {
                files: {
                    'src/owner/app/dist/scripts/app.js.map': 'src/owner/source_map/concat/app/dist/scripts/app.js.map'

                }
            },
            owner: {
              files: [
                {filter: 'isFile',
                  flatten: true,
                  cwd: 'src/owner/dist/app/dist/scripts/',
                  src: "*.js",
                  expand:true,
                  dest: 'src/owner/app/dist/scripts/'},
                {
                  filter: 'isFile',
                  flatten: true,
                  cwd: 'src/owner/dist/portal/dist/scripts/',
                  src: "*.js",
                  expand:true,
                  dest: 'src/owner/portal/dist/scripts/'
                }
              ]


            }
        },
        rename: {
            after: {
                files: {

                }

            }

        },
        includeSource: {
            options: {
                basePath: root
            },
            target: {
                files: {
                    'src/owner/index.html': app_index_tpl,
                    'src/owner/portal/index.html': portal_index_tpl
                }
            }
        },
        useminPrepare: {
            options: {
                dest: root,
                uglifyConcat: true,
                staging: source_map
            },
            html: [app_index,portal_index]
        },
        concat: {
            options: {
                banner: banner
            },
            generated:{
                options: {
                    sourceMap: true
                }
            }
        },
        uglify: {
            options: {

                compress: {
                    drop_console: true
                },
                banner: banner,
                sourceMap: true,
                sourceMapIncludeSources: true,
                sourceMapIn: 'src/owner/source_map/concat/app/dist/scripts/app.js.map'
            }
        },
        less: {
            local: {
                options: {
                    banner: banner,
                    sourceMap:{
                        sourceMapFileInline: true
                    }
                },
                files: {
                    'src/owner/app/content/css/styles.css': app_styles_less,
                    'src/owner/app/content/css/initial.css': app_initial_less,
                    'src/owner/portal/content/css/styles.css': portal_styles_less
                }
            },
            uat: {
                options: {
                    cleancss: true,
                    banner: banner,
                    compress: true,
                    sourceMap:{
                        sourceMapFileInline: true
                    }
                },
                files: {
                    'src/owner/app/content/css/styles.css': app_styles_less,
                    'src/owner/app/content/css/initial.css': app_initial_less,
                    'src/owner/portal/content/css/styles.css': portal_styles_less

                }
            },
            test: {
                files:{

                },
                options:{
                    compress: true
                }
            }
        },
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            js: {
                src: [app_dist + '**/*.js', portal_dist + '**/*.js']
            },
            css: {
                src: [app_styles_css, app_initial_css, portal_styles_css]
            }
        },
        usemin: {
            html: [app_index,portal_index],
            options: {
                assetsDirs: [root]
            }
        },
        preprocess : {
            local: {
                src: app_index,
                options: {
                    inline: true,
                    context: {
                        //add variables here
                    }
                }
            },
            live: {
                src: app_index,
                options: {
                    inline: true,
                    context: {
                        //add variables here
                    }
                }
            }
        },
        watch:{

        },
        ngAnnotate: {
          options: {
            add: true
          },
          app: {
            files: {
              'src/owner/source_map/concat/app/dist/scripts/app.js': 'src/owner/source_map/concat/app/dist/scripts/app.js'
            }
          }

        },
        ngtemplates:  {
            app: {
                cwd:      'src/owner',
                src:      ['src/owner/**/**.html'],
                dest:     'src/owner/app/templates.js',
                options:{
                    prefix: '/',
                    htmlmin: {
                        removeComments: true,
                        collapseWhitespace: true,
                        conservativeCollapse: true,
                    }
                }
            },
            local:{
                cwd:      'src/owner',
                src:      ['src/owner/404.html'],
                dest:     'src/owner/app/templates.js',
                options:{
                    prefix: '/',
                    htmlmin: {
                        removeComments: true,
                        collapseWhitespace: true,
                        conservativeCollapse: true,
                    }
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-rename');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-ng-annotate');

}
