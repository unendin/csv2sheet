/**
* Folder
* 
* Wraps Google Folder object with useful methods. 
* Note: Google Apps Script does not allow addition
* of prototype properties to its native classes.
*  
* @param {Object} DriveFolder - Google Drive Folder object
*/

function Folder(DriveFolder) {
  
	this.obj = DriveFolder;
	this.name = this.obj.getName();
};

Folder.prototype = {
		
	/**
	 * empty
	 * 
	 * Set all files in folder to Trashed
	 */
	empty : function() {
		var files = this.obj.getFiles();
		while (files.hasNext()) {
			files.next().setTrashed(true);
		}
	},
	
	/**
	 * getFiles
	 * 
	 * @returns {Object} files - Google File objects keyed by file name
	 */
	getFiles : function() {
		var files = {};
		var fileIterator = this.obj.getFiles();
		while (fileIterator.hasNext()) {
			var file = fileIterator.next();
			files[file.getName()] = file;
		}
		
		return files;
	},
  
	/**
	 * moveFile
	 * 
	 * @param {Object} DriveFile - Google file object
	 * @param {Object} toFolder - CsvApp folder object
	 */
	moveFile : function(DriveFile, toFolder) { 
		toFolder.obj.addFile(DriveFile);
		this.obj.removeFile(DriveFile);
	},
	
	/**
	 * moveFiles
	 * 
	 * Move all files to another folder
	 * 
	 * @param {Object} toFolder - CsvApp Folder object
	 */ 
	moveFiles : function (toFolder) { 
		var fileIterator = this.obj.getFiles();
		while (fileIterator.hasNext()) {
			var file = fileIterator.next();
			toFolder.obj.addFile(file);
			this.obj.removeFile(file);
		}
	}				
}