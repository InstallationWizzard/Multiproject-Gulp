const gulpConfig = {
    finalBuildIsDefault: false,
    rootFolderPath: '../',
    onlyForgeTasksWithExistantFilesInPath: true,
}

/* Severity
    1 - pure logging (green)
    2 - may cause problems (blue)
    3 - probably cause problems (yellow)
    4 - is problem (red)
*/
const gulpConfigLogging = {
    c_logging :false,
    c_minimumSeverity: 4,
    c_fullLogging: true,
    c_fileExistanceLogging: false,
    c_taskNotBuiltLogging: false
}
module.exports = {gulpConfig, gulpConfigLogging}