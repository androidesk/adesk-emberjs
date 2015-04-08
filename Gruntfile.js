module.exports = function(grunt) {

  var path = require('path');
  var js_source_path = 'adesk/js';
  var css_source_path = 'adesk/css';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %>' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage %>\n' + '* Copyright (c) <%= grunt.template.today("yyyy") %> zhyq0826: <%= pkg.author %> */\n'
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        // the file to concatenate
        src: [
          'dist/js/<%= pkg.name %>-template.js',
          'dist/js/<%= pkg.name %>-app.js',
        ],
        // the location of the resulting js file
        dest: 'dist/js/<%= pkg.name %>.js'
        // dest: '/home/zhyq/adesk/adesk-ad/god-backend/static/js/<%= pkg.name %>.js'
      },
      app: {
        src: [
          'adesk/js/components/*.js',
          'adesk/js/mixins/*.js',
          'adesk/js/helpers/*.js',
          'adesk/js/models/*.js'
        ],
        dest: 'dist/js/<%= pkg.name %>-app.js'
      }
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the ouput
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %>' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage %>\n' + '* Copyright (c) <%= grunt.template.today("yyyy") %> zhyq0826: <%= pkg.author %> */\n'
      },
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'adesk/js/*/*.js'
      ],
      options: {
        asi: true,
        curly: false,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      }
    },
    less: {
      production: {
        options: {
          paths: ["css/css"],
          yuicompress: true
        },
        files: {
          "dist/css/<%= pkg.name %>.css": "adesk/css/base.less"
        }
      }
    },
    watch: {
      css: {
        files: 'adesk/css/*.less',
        tasks: ['less'],
        options: {
          event: ['changed']
        }
      },
      emberApp: {
        files: 'adesk/js/**/*.js',
        tasks: ['concat', 'jshint', 'uglify'],
        options: {
          event: ['changed']
        }
      },
      emberTemplates: {
        files: 'adesk/js/templates/**/*.hbs',
        tasks: ['emberTemplates']
      }
    },
    bower: {
      install: {
        options: {
          targetDir: 'lib',
          layout: function(type, byComponent, source) {
            //bower task layout:byComponet don't work hack like this
            var source_list = source.split('/');
            var real_path = []
            if (source_list[2] === 'dist') {
              real_path = source_list.slice(3, -1).join('/')
            } else {
              real_path = source_list.slice(2, -1).join('/')
            }
            return path.join(byComponent, real_path);
          },
          install: false,
          verbose: false,
          cleanTargetDir: false,
          cleanBowerDir: false,
          bowerOptions: {

          }
        }
      }
    },
    emberTemplates: {
      compile: {
        options: {
          templateNamespace: 'Handlebars',
          concatenate: true,
          precompile: true,
          templateBasePath: "",
          templateName: function(name){
            return name.replace('adesk/js/templates/','');
          }
        },
        files: {
          'dist/js/<%= pkg.name %>-template.js': 'adesk/js/templates/**/*.hbs'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-ember-templates');

  //grunt.registerTask('test', ['jshint', 'qunit']);
  //grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
  grunt.registerTask('default', ['emberTemplates', 'concat', 'uglify', 'less', 'jshint', 'bower'])
}
