module.exports = {
    css: {
        files: 'lib/css/*.less',
        tasks: ['less'],
        options: {
            event: ['changed']
        }
    },
    emberApp: {
        files: 'lib/js/**/*.js',
        tasks: ['concat', 'jshint', 'uglify'],
        options: {
            event: ['changed']
        }
    },
    emberTemplates: {
        files: 'lib/js/templates/**/*.hbs',
        tasks: ['emberTemplates']
    },
    devCopy: {
        files: 'dist/js/adesk-ember.js',
        tasks: ['copy:adeskAd']
    }
}