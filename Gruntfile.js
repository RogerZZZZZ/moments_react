module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),

            connect: {
                server: {
                    options: {
                        port: 8887,
                        keepalive: true,
                        hostname: "*"
                    }
                }
            },

            uglify: {
                options: {
                    banner: '/**!\n Date: <%= grunt.template.today("yyyy-mm-dd HH:MM") %> \n*/\n'
                },
                dist: {
                    expand: true, 
                    dest: 'dist/',
                    filter: 'isFile',
                    cwd: "./",
                    src: ['*.js']
                }
            },

            cssmin: {
                main: {
                    files: {
                        './dist/css/bootstrap-theme.css': ['css/bootstrap-theme.css'],
                        './dist/css/demo.css': ['css/demo.css'],
                        './dist/css/bootstrap.css': ['css/bootstrap.css'],
                        './dist/css/index.css': ['css/index.css'],
                        './dist/css/iscroll.css': ['css/iscroll.css'],
                        './dist/css/webloader.css': ['css/webloader.css']
                    }
                }
            },

            copy: {
                images: {
                    files: [
                        {expand: true, src: ['./*.html'], dest: 'dist/', filter: 'isFile'},
                        {expand: true, src: ['./libs/*.js'], dest: 'dist', filter: 'isFile'},
                        {expand: true, src: ['./css/*'], dest: 'dist', filter: 'isFile'},
                        {expand: true, src: ['./images/*'], dest: 'dist', filter: 'isFile'},
                        {src: ['./libs/Uploader.swf'], dest: 'dist/'}
                    ]
                }
            },

            clean: ['./dist/']
        });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['connect:server']);
    grunt.registerTask('build', ['clean', 'copy:images', 'cssmin:main', 'uglify']);
    grunt.registerTask('compile', ['sass']);

}
;
