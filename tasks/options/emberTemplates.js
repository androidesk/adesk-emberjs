module.exports = {
    compile: {
        options: {
            templateNamespace: 'Handlebars',
            concatenate: true,
            precompile: true,
            templateBasePath: "",
            templateName: function(name) {
                return name.replace('lib/js/templates/', '');
            }
        },
        files: {
            'dist/js/<%= pkg.name %>-template.js': 'lib/js/templates/**/*.hbs'
        }
    }
}