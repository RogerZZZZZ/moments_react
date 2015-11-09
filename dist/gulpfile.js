/**!
 Date: 2015-11-05 21:25 
*/
var gulp=require("gulp"),react=require("gulp-react");gulp.task("jsx",function(){browserify({entries:["./state_demo1.jsx"],transform:[reactify]}).bundle().pipe(source()).pipe(gulp.dest("./"))}),gulp.task("compile",function(){gulp.src("./*.jsx").pipe(react()).pipe(gulp.dest("./"))}),gulp.task("default",["compile"]);