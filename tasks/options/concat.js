module.exports = {
  options: {
    separator: ''
  },
  dist: {
    // the file to concatenate
    src: [
      'dist/js/<%= pkg.name %>-template.js',
      'dist/js/<%= pkg.name %>-app.js',
    ],
    // the location of the resulting js file
    dest: 'dist/js/<%= pkg.name %>.js'
  },
  app: {
    src: [
      'lib/js/components/*.js',
      'lib/js/mixins/*.js',
      'lib/js/helpers/*.js',
      'lib/js/models/*.js'
    ],
    dest: 'dist/js/<%= pkg.name %>-app.js'
  }
}