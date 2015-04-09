module.exports = {
    production: {
        options: {
            paths: ["css/css"],
            yuicompress: true
        },
        files: {
            "dist/css/<%= pkg.name %>.css": "adesk/css/base.less"
        }
    }
}