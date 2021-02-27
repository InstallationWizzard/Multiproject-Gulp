const {gulpSources} = require('./gulpsrc.js');
const {projectsSettings} = require('./projectsSettings.js');
const {gulpConfig, gulpConfigLogging} = require('./gulpconfig.js');
// Modules
const gulp =              require('gulp'),
      sass =              require('gulp-sass'),
      postcss =           require('gulp-postcss'),
      autoprefixer =      require('autoprefixer'),
      pixrem  =           require('pixrem'),
      concat =            require('gulp-concat'),
      uglify =            require('gulp-uglify'),
      cssnano =           require('cssnano'),
      removeCSSComments = require('postcss-discard-comments'),
      sourcemaps =        require('gulp-sourcemaps'),
      less =              require('gulp-less'),
      rename =            require('gulp-rename'),
      path =              require('path'),
      gulpIf =            require('gulp-if'),
      babel =             require('gulp-babel'),
      notifier =          require('node-notifier'),
      fs =                require('fs');
      gui =               require('./script_modules/gui/gui.js')

      var frontendProjects = []

  
/* ==================================
          Check for updates
===================================*/
/*
git.init()
  .then(function onInit (initResult) { })
  .then(() => git.addRemote('origin', 'git@github.com:steveukx/git-js.git'))
  .then(function onRemoteAdd (addRemoteResult) { })
  .then(git.checkout("main"))
  .then(notifier.notify({
    title: 'Gulp sucessfuly updated',
    message: 'Yes'
  }))
  .catch(err => console.error(err));
*/
/* ==================================
            Common tasks
===================================*/
async function listFunctions(){
  allFunctions.forEach(fnc => {console.log(fnc)});
  /*notifier.notify(
    {
      title: 'My awesome title',
      message: 'Hello from node, Mr. User!',
      icon: "https://cdn.iconscout.com/icon/free/png-256/gulp-226000.png", // Absolute path (doesn't work on balloons)
      sound: true, // Only Notification Center or Windows Toasters
      wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },
    function (err, response) {
      // Response is response from notification
    }
  );
  */
}
async function debugProject(project){
  var id, i_id = process.argv.indexOf("--id");
  var name , i_name = process.argv.indexOf("--name");
  if(i_id>-1) {
    id = process.argv[i_id+1];
  }
  
  if(i_name>-1) {
    name = process.argv[i_name+1];
  }

}

// SCSS
function commonScss(scssPath, cssPath, newName){
  if(newName === undefined || newName == "" || newName == "undefined"){
    newName = 'main.css'
  }
  return gulp.src(scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer(), pixrem()]))
    /*.pipe(gulpIf((newName !== undefined && newName != "" && newName !== "undefined"), rename(newName)))*/
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(cssPath));
}

function commonScssFinalBuild(scssPath, cssPath, newName){
  if(newName === undefined || newName == "" || newName == "undefined"){
    newName = 'main.css'
  }
  lastFinalBuild = new Date().getTime();
  return gulp.src(scssPath, {sourcemaps:true})
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
   /*.pipe(gulpIf((newName !== undefined && newName != "" && newName !== "undefined"), rename(newName)))*/
    .pipe(postcss([ autoprefixer(), pixrem(), removeCSSComments({removeAll: true}), cssnano()]))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(cssPath));
}

// LESS
function commonLess(lessPath, cssPath, newName = 'styles.min.css'){
  lastFinalBuild = new Date().getTime();
  return gulp.src(lessPath, {sourcemaps:true})
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulpIf((newName !== undefined && newName != ""), rename(newName)))
    .pipe(gulp.dest(cssPath));
}

function commonLessFinalBuild(lessPath, cssPath, newName){
  lastFinalBuild = new Date().getTime();
  return gulp.src(lessPath, {sourcemaps:true})
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(postcss([ autoprefixer(), removeCSSComments({removeAll: true}), cssnano()]))
    .pipe(gulp.dest(cssPath));
}

// JS
function commonJs(jsPath, jsDestPath, newName = 'scripts-min.js'){
  return gulp.src(jsPath, {sourcemaps:true})
    .pipe(sourcemaps.init())
    .pipe(concat(newName))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(jsDestPath))
}

function commonJsFinalBuild(jsPath,jsDestPath, newName = 'scripts-min.js'){
  lastFinalBuild = new Date().getTime();
  return gulp.src(jsPath, {sourcemaps:true})
    .pipe(sourcemaps.init())
    .pipe(concat(newName))
    .pipe(babel({
      presets: ['@babel/env']
     }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(jsDestPath));
}


/* ==================================
          Combined tasks
===================================*/

var commonScssFunctions = [];
var commonJsFunctions = [];
var commonLessFunctions = [];
var allFunctions = [];
var watchers = []




//Global settings 

  // Gulp config
  var finalBuildIsDefault = gulpConfig['finalBuildIsDefault'];
  var rootFolderPath = gulpConfig['rootFolderPath'];
  var onlyForgeTasksWithExistantFilesInPath =  gulpConfig['onlyForgeTasksWithExistantFilesInPath'];



    // Logging
    for (const [key, value] of Object.entries(gulpConfigLogging)) {
      eval(`var ${key} = ${value}`)
    }
    var severitySettings = {
      "1": "\x1b[32m",
      "2": "\x1b[34m",
      "3": "\x1b[33m",
      "4": "\x1b[31m"
    }

for (var project in gulpSources) {

  var guiData = {
    gulpConfig:  gulpConfig,
    gulpConfigLogging: gulpConfigLogging,
    gulpSources: gulpSources[project],
    projectsSettings: projectsSettings[project],
    gulpTasks:{}
  }


  // Gulp sources
  // for (const [key, value] of Object.entries(gulpSources[project])) {
  //   if(key != 'id'){
  //     console.log(`var ${key} = '${value}'`)
  //     eval(`var ${key} = '${value}'`);
  //   }
  // }

  // Project settings
  // for (const [key, value] of Object.entries(projectsSettings[project])) {
  //   if(key != 'id'){
  //     eval(`var ${key}On = ${value}`);
  //   }
  // }

  // Gulp sources

    // Scss
    let scssPath = gulpSources[project]['scssPath'];
    let cssPath = gulpSources[project]['cssPath'];
    let watchedScssPath = gulpSources[project]['watchedScssPath'];
    let cssNewFilename = gulpSources[project]['cssNewFilename'];

    // Js
    let jsPath = gulpSources[project]['jsPath'];
    let jsDestPath = gulpSources[project]['jsDestPath'];
    let watchedJsPath = gulpSources[project]['watchedJsPath'];
    let jsNewFilename = gulpSources[project]['jsNewFilename'];

    // Less
    let lessPath = gulpSources[project]['lessPath'];
    let watchedLessPath = gulpSources[project]['watchedLessPath'];

  // Project settings
  let commonScssOn = projectsSettings[project]['commonScss'];
  let commonJsOn = projectsSettings[project]['commonJs'];
  let commonLessOn = projectsSettings[project]['commonLess'];
  let watched = projectsSettings[project]['watched'];
  
  let projectTasks = []

  if(typeof commonScssOn === undefined || commonScssOn == ""){commonScssOn = false} 
  if(typeof commonJsOn === undefined || commonJsOn == ""){commonJsOn = false} 
  if(typeof commonLessOn === undefined || commonLessOn == ""){commonLessOn = false}
  if(typeof watched === undefined || watched == ""){watched = false}


  // guiData['gulpSources'] = {
  //   scssPath: scssPath,
  //   cssPath: cssPath,
  //   watchedScssPath: watchedScssPath,
  //   cssNewFilename: cssNewFilename,
  //   jsPath: jsPath,
  //   jsDestPath:jsDestPath,
  //   watchedJsPath:watchedJsPath,
  //   jsNewFilename:jsNewFilename,
  //   lessPath:lessPath,
  //   watchedLessPath:watchedLessPath
  // }
  // guiData['projectsSettings'] = {
  //   commonScssOn:commonScssOn,
  //   commonJsOn:commonJsOn,
  //   commonLessOn:commonLessOn,
  //   watched:watched
  // }


  if(commonScssOn){
    /* 
      It has to be done this way because there is probably no other way to generate function name dynamicly.
      I tried changing it in function props, building function via constructor, building it into variable and then renaming variable. I either ran into
      compilation error, or function beeing called "commonCss" or "anynonymous". Building into variable and redaclaring into 
      another variable is also impossible due to same name beeing applyed to function and variable causing imposibility to distinguish
      function from variable. When using constructor I think I was running into compilation error or into function beeing called anonymous.
      Either way point is that it's likely imposible nor even worth time to try using anything else than eval.
    */
    if(!evaluateFileExistance([gulpConfig['rootFolderPath']+gulpSources[project]['scssPath']]) && gulpSources[project]['cssPath'] && onlyForgeTasksWithExistantFilesInPath){
      loggerConsoleDefault({
        severity: 4,
        loggingConditions: [c_taskNotBuiltLogging],   
        message: `Task ${project}CommonScss was not build due to missing required file source.`
      })
    } else{
      // Forging function 
      eval(`function ${project}CommonScss(){ return commonScss('${gulpConfig['rootFolderPath']+gulpSources[project]['scssPath']}','${gulpConfig['rootFolderPath']+gulpSources[project]['cssPath']}','${gulpSources[project]['cssNewFilename']}')};`)      
      eval(`function ${project}CommonScssFinalBuild(){ return commonScssFinalBuild('${gulpConfig['rootFolderPath']+gulpSources[project]['scssPath']}','${gulpConfig['rootFolderPath']+gulpSources[project]['cssPath']}','${gulpSources[project]['cssNewFilename']}')};`)
      
      // If function is watched add it to array of watched functions
      if(watched){
        if (gulpSources[project]['watchedScssPath'] !== undefined && gulpSources[project]['watchedScssPath'] != ""){
          if(finalBuildIsDefault){
            watchers.push([gulpConfig['rootFolderPath']+gulpSources[project]['watchedScssPath'], eval(project + 'CommonScssFinalBuild')])
          }
          else {
            watchers.push([gulpConfig['rootFolderPath']+gulpSources[project]['watchedScssPath'], eval(project + 'CommonScss')])
          }
        } else {
          if(finalBuildIsDefault){
            watchers.push([gulpConfig['rootFolderPath']+gulpSources[project]['scssPath'], eval(project + 'CommonScssFinalBuild')])
          }
          else {
            watchers.push([gulpConfig['rootFolderPath']+gulpSources[project]['scssPath'], eval(project + 'CommonScss')])
          }
        }
      }
      // Add both functions to allFunctions array (for exports)
      allFunctions.push(eval(project + 'CommonScss'))
      projectTasks.push({'taskType':'commonScss','taskId':allFunctions.length - 1})
      allFunctions.push(eval(project + 'CommonScssFinalBuild'))
      projectTasks.push(eval({'taskType':'commonScssFinalBuild','taskId':allFunctions.length - 1}))
    }

  }

  if(commonJsOn){
    if(!evaluateFileExistance([gulpConfig['rootFolderPath']+gulpSources[project]['jsPath']]) && gulpConfig['rootFolderPath']+gulpSources[project]['jsDest'] && onlyForgeTasksWithExistantFilesInPath){
      loggerConsoleDefault({
        severity: 4,
        loggingConditions: [c_taskNotBuiltLogging],
        message: `Task ${project}CommonJs was not build due to missing required file source.`
      })
    } else{
      // Forging function
      if(gulpSources[project]['jsNewFilename'] !== undefined && gulpSources[project]['jsNewFilename'] != ""){
        eval(`function ${project}CommonJs(){ return commonJs('${gulpConfig['rootFolderPath']+gulpSources[project]['jsPath']}','${gulpConfig['rootFolderPath']+gulpSources[project]['jsDestPath']}','${gulpSources[project]['jsNewFilename']}')};`)
        eval(`function ${project}CommonJsFinalBuild(){ return commonJsFinalBuild('${gulpConfig['rootFolderPath']+gulpSources[project]['jsPath']}','${gulpConfig['rootFolderPath']+gulpSources[project]['jsDestPath']}','${gulpSources[project]['jsNewFilename']}')};`)
      } else {
          eval(`function ${project}CommonJs(){ return commonJs('${gulpConfig['rootFolderPath']+gulpSources[project]['jsPath']}','${gulpConfig['rootFolderPath']+gulpSources[project]['jsDestPath']}')};`)
          eval(`function ${project}CommonJsFinalBuild(){ return commonJsFinalBuild('${gulpConfig['rootFolderPath']+gulpSources[project]['jsPath']}','${gulpConfig['rootFolderPath']+gulpSources[project]['jsDestPath']}')};`)
      }
      if(watched){
        if (gulpSources[project]['watchedJsPath'] !== undefined && gulpSources[project]['watchedJsPath'] != ""){
          if(finalBuildIsDefault){
            watchers.push([gulpConfig['rootFolderPath']+gulpSources[project]['watchedJsPath'], eval(project + 'CommonJsFinalBuild')])
          } else {
            watchers.push([gulpConfig['rootFolderPath']+gulpSources[project]['watchedJsPath'], eval(project + 'CommonJs')])
          }
        } else {
          if(finalBuildIsDefault){
            watchers.push([gulpConfig['rootFolderPath']+gulpSources[project]['jsPath'], eval(project + 'CommonJsFinalBuild')])
          } else {
            

            watchers.push([gulpConfig['rootFolderPath']+gulpSources[project]['jsPath'], eval(project + 'CommonJs')])
          }
        }
      }
      allFunctions.push(eval(project + 'CommonJs'))
      projectTasks.push({'taskType':'commonJs','taskId':allFunctions.length - 1})
      allFunctions.push(eval(project + 'CommonJsFinalBuild'))
      projectTasks.push({'taskType':'commonJsFinalBuild','taskId':allFunctions.length - 1})
    }
  }


  if(commonLessOn){
    if(!evaluateFileExistance([gulpSources[project]['lessPath']]) && gulpSources[project]['cssPath'] && onlyForgeTasksWithExistantFilesInPath){
      loggerConsoleDefault({
        severity: 4,
        loggingConditions: [c_taskNotBuiltLogging],
        message: `Task ${project}CommonLess was not build due to missing required file source.`
      })
    } else{
      eval("function "+project+"CommonLess(){ return commonLess('"+gulpSources[project]['lessPath']+"','"+gulpSources[project]['cssPath']+"','"+gulpSources[project]['cssNewFilename']+"')};")
      commonLessFunctions.push(eval(project+"CommonLess"))


      eval("function "+project+"CommonLessFinalBuild(){ return commonLessFinalBuild('"+gulpSources[project]['lessPath']+"','"+gulpSources[project]['cssPath']+"','"+gulpSources[project]['cssNewFilename']+"')};")
      commonLessFunctions.push(eval(project + 'CommonLessFinalBuild'))

      if(watched){
        if (gulpSources[project]['watchedLessPath'] !== undefined && gulpSources[project]['watchedLessPath'] != ""){
          if(finalBuildIsDefault){
            watchers.push([gulpConfig['rootFolderPath']+gulpSources[project]['watchedLessPath'], eval(project + 'CommonLessFinalBuild')])
          } else{
            watchers.push([gulpConfig['rootFolderPath']+gulpSources[project]['watchedLessPath'], eval(project + 'CommonLess')])
          }
        } else {
          if(finalBuildIsDefault){
            watchers.push([gulpConfig['rootFolderPath']+gulpSources[project]['lessPath'], eval(project + 'CommonLessFinalBuild')])
          } else{
            watchers.push([gulpConfig['rootFolderPath']+gulpSources[project]['lessPath'], eval(project + 'CommonLess')])
          }
        }
      }

      allFunctions.push(eval(project + 'CommonLess'))
      projectTasks.push({'taskType':'CommonLess','taskId':allFunctions.length - 1})
      allFunctions.push(eval(project + 'CommonLessFinalBuild'))
      projectTasks.push({'taskType':'CommonLessFinalBuild','taskId':allFunctions.length - 1})
    }
  }
  guiData.gulpTasks = projectTasks
  frontendProjects.push(guiData)
}

function watcher(){
  watchers.forEach(function(fnc){
    gulp.watch([fnc[0]], fnc[1])
    //gulp.watch([fnc[0]], gulp.parallel([fnc[1]]))
  })
};
/*
const lastFinalBuildCheckCountdown = 120;
var lastFinalBuild;
var lastProject = ""

function prematurePushPrevent(){
  let now = new Date().getTime();
  gulp.watch([gulpSources.test], gulpIf(((now - lastFinalBuild) > lastFinalBuildCheckCountdown),  gulp.parallel(notify("Premature push prevent"))));
}
*/

/* ==================================
        Unique project tasks
===================================*/

/* ==================================
            Evaluators
===================================*/
// Evaluating existence of files
async function evaluateFileExistance(filesArray){
  let valid = true
  filesArray.forEach(file => {

    if(!fs.existsSync(file)){
      if(file.includes('*')){
        loggerConsoleDefault({
          severity: 3,
          loggingConditions: [true],
          message: `File ${file} may not exist`
        })
      } else {
        loggerConsoleDefault({
          severity: 4,
          loggingConditions: [true],
          message: `File ${file} does not exist`
        })
        valid = false
      }
    }
  });
  return valid
}

/* ==================================
            Loggers
===================================*/
// Evaluating existence of files
async function loggerConsoleDefault(payload){
  /* sample object
      {
        severity: 4,
        loggingConditions: [c_taskNotBuiltLogging],
        message: `Task ${project}CommonJs was not build due to missing required file source.`
      }
  */
  let conditions = false
  payload.loggingConditions.forEach(condition => {
    if(condition){
      conditions = true
    }
  });
  if((conditions || c_fullLogging) && c_logging && payload.severity  >= c_minimumSeverity){
    console.log(severitySettings[payload.severity], payload.message)
  }
}

/* ==================================
                Exports
===================================*/
//Export all functions
allFunctions.forEach(fnc => {
  eval("exports."+fnc.name+"="+fnc+";")
});
gui.startServer()
gui.io.on('connection', (socket) => {
  socket.emit('guiData', frontendProjects)
  socket.on('executeTask', (taskId) => {
    allFunctions[taskId]()
  })
});

// Set watcher as gulps default function
exports.listFunctions = listFunctions
exports.default = watcher;