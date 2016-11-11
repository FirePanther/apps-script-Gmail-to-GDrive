# Gmail Attachments to Google Drive Downloader for Google Apps Script

This script scans your (default config: up to one year old) Mails, creates a
subfolder for every message in Google Drive, and downloads the attachments
into it.

# Setup and First Run

Set the path of your (already existing) target folder (where the subfolders
should be created and the attachments downloaded).
Run the function "parseAttachments". If the script finishes too fast (it
should run a few minutes at least) check the Error Logs (ctrl/cmd + enter).
If you get an error message, like "maximum time exceeded", just run the
script again, the first download takes too long, cause it's downloading
attachments of your mails up to one year old.

# Trigger

You can create a trigger for the "parseAttachments" function. You could
run this function like daily or more often to download the newest attachments
into your Google Drive.

# Tip

I have [Documents by Readdle](https://readdle.com/products/documents) on my
Smartphone and Tablet. They're syncing with my "Mail Attachments" folder
automatically (and also I've activated "indexing" in the Documents settings).
This way I have my attachments locally and can access them offline or with bad
internet connection.