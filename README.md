
# Multiproject Gulp

## Installation

Tested for node 14.15.3

```bash
npm install
```

## Usage

To start watcher simply type

```javascript
gulp
```

To start any common task use

```javascript
gulp {projectName}{taskName}
```

Before pushing your progress to git make sure to do "Final build"

```javascript
gulp {projectName}{taskName}FinalBuild
```
Use listFunctions to see all available functions
```javascript
gulp listFunctions
```

## Common tasks parameters

- commonScss

    - scssPath* (path to files that are worked on)

    - cssPath* (css dest path)

    - cssNewFilename (default: main.css)

    - watchedScssPath (watcher files that triggers this function; jsPath if empty and watched)

- commonLess

    - lessPath* (path to files that are worked on)

    - cssPath* (css dest path)

    - cssNewFilename (default: styles.min.css)

    - watchedScssPath (watcher files that triggers this function; lessPath if empty and watched)

- commonJs

    - jsPath* (path to files that are worked on)

    - jsDestPath* (jsDestPath)

    - jsNewFilename (default: scripts-min.js)

    - watchedJsPath (watcher files that triggers this function; jsPath if empty and watched)



## How to start new project

### Projects without special needs

1. Create a new project in projectsSettings.js file and turn on whichever functions you need. Latest version no longer requires definition of functions that are turned off.

Project settings example:
```javascript
projectName:{
	projectName: "Project name in GUI"
	id: upcoming INT,
	commonScss: true,
	commonLess: false,
	commonJs: false,
	watched: true
}
```
Project sources example for above project settings:
```javascript
projectName:{
	id: upcoming INT,
	scssPath: "",
	cssPath: "",
	cssNewFilename: "",
	watchedCssPath:""
}
```

2. In gulpsrc.js define all necessary paths to activated functions

### Projects with special needs

In case no common task is sufficient for the job, you may create a unique project task, but preferably don't!

To create unique project tasks

1. Go to gulpfile.js and in the section "Unique project tasks" create whatever tasks you need for your project. Please keep project tidy and create all routing inside the gulp.src file and also initialize project inside projectsSettings.js even if you are not planning on using any commonTasks

2. After that push this functions into "allFunctions" array

3. Watched functions then push into "watchers" with params( pathToWatchedFiles, Function )

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Author

Tomáš Janda (tomasjanda@nacadria.com)
