/**
 * @author           Suat Secmen (http://su.at)
 * @copyright        2016 Suat Secmen
 * @license          GNU GENERAL PUBLIC LICENSE <https://github.com/FirePanther/apps-script-Gmail-to-GDrive/blob/master/LICENSE>
 */

/**
 * Downloads the attachments into a GDrive folder
 */
function parseAttachments() {
      // your GDrive folder (doesn't have to be the full path)
  var folder = getFolder('Backups/Mail Attachments'),
  
      // max 1 year old mails
      beginDate = new Date(new Date().getTime() - 1000 * 3600 * 24 * 365),
      begin = beginDate.getYear() + '-' + (beginDate.getMonth() + 1) + '-' + beginDate.getDate(),
      threads = GmailApp.search('-in:Trash AND has:attachment AND date-begin:' + begin);
  
  if (!folder) return ErrorMsg('Folder couldn\'t be found.');

  for (var x in threads) {
    var msgs = threads[x].getMessages();
    for (var i = 0; i < msgs.length; i++) {
      parseMessage(msgs[i], threads[x], folder);
    }
  }
}

/**
 * Push the error message to telegram
 */
function ErrorMsg(str) {
  // I send myself a Telegram message with the error message.
  Logger.log('🐞 *GMail > Attachments > Error*: ' + str);
}

/**
 * Checks for attachments in a single message from a thread.
 * Downloads the attachments into a subfolder of the given folder.
 */
function parseMessage(msg, thread, folder) {
  var props = PropertiesService.getScriptProperties(),
      subject = thread.getFirstMessageSubject(),
      id = msg.getId(),
      version = '1.1';
  
  if (props.getProperty(id) !== version) {
    var attachs = msg.getAttachments(),
        msgdate = msg.getDate(),
        msgdateMonth = msgdate.getMonth() + 1,
        threadfoldername = msgdate.getYear() + '-' +
          (msgdateMonth < 10 ? '0' : '') + msgdateMonth + '-' +
          (msgdate.getDate() < 10 ? '0' : '') +  msgdate.getDate() +
          ' • ' + msg.getFrom() + ' • "' + subject + '"',
        threadfolderIterator = folder.getFoldersByName(threadfoldername),
        threadfolder = null;
    
    // if folder doesn't exixst, create it
    if (!threadfolderIterator.hasNext()) {
      threadfolder = folder.createFolder(threadfoldername);
    } else {
      threadfolder = threadfolderIterator.next();
    }
    
    for (var x in attachs) {
      var ext = attachs[x].getContentType();
      
      if (ext) ext = '.' + ext.substr(ext.indexOf('/') + 1);
      else ext = '';
      
      var attachName = attachs[x].getName() || 'Mail Attachment - ' + attachs[x].getSize() + ext,
          blob = attachs[x].copyBlob().setName(attachName);
      threadfolder.createFile(blob);
    }
    props.setProperty(id, version);
  }
}

/**
 * Gets the folder that matches the given path (checks the parents).
 */
function getFolder(pathStr) {
  var path = pathStr.split('/'),
      name = path.pop(),
      pathLen = path.length,
      folders = DriveApp.getFoldersByName(name);
  if (!folders) return false;
  while (folders.hasNext()) {
    var folder = folders.next(),
        err = false,
        check = folder;
    for (var i = pathLen; i > 0; i--) {
      check = getParent(check);
      if (!check || check.getName() !== path[i - 1]) {
        err = true;
        break;
      }
    }
    if (!err) return folder;
  }
  return false;
}

/**
 * Gets the first parent of the file or folder, or returns null
 * if in the file/folder is in the root or invalid.
 */
function getParent(file) {
  if (typeof file != 'object' || !file.getParents) return null;
  var parents = file.getParents();
  if (parents.hasNext()) return parents.next();
  else return null;
}
