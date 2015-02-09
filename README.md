# csv2sheet
Google Apps Scripts (aka JavaScript) to create and update Google Sheets with CSV files.

# Installation
[Download zip from GitHub](https://github.com/unendin/csv2sheet/archive/master.zip). Unzip it, delete the `csv2sheet_scripts/` folder, rename the top-level folder back to `csv2sheet/`, and place it anywhere in your **local** Google Drive. Once the contents sync with your Drive on the Web, you should have a working version with full access to source code.

To give it a spin, open `csv2sheet_scripts.gscript` from your Drive on the Web (you may be prompted to use the Google Apps Script application to open it). Run `main.gs` which, in test mode, generates two spreadsheets in `test/spreadsheets/` (more about "[Tests](https://github.com/unendin/csv2sheet#tests)"). This may take up to a minute or more.

```
csv2sheet                     <= Restore this folder name (see "Options" below)
|   csv2sheet_scripts         <= Delete this. Code is for versioning but won't run.
|   csv2sheet_scripts.gscript <= Use this instead. Points to scripts above (which
|   README.md                    Google hosts outside of Drive) and gives you full
|—— deploy                       source access. See "Managing Google Apps Script 
|    |—— csvs_new                Project" below.
|    |—— csvs_notValid
|    |—— csvs_processed
|    |—— logs
|    '—— spreadsheets
'—— test
     |—— csvs_new
     |—— csvs_notValid
     |—— csvs_processed
     |—— logs
     '—— spreadsheets
```

# Usage
The CSV generator (e.g., MATLAB) should output files to `csv2sheet/runs/csvs_new/`. Each new record consists of two files: 

#### 1. CSV file
Each CSV must have:
* One header row
* One or more data rows
* Column specified as primary key in metadata below
* Mime type `text/csv` (e.g., `filename.csv`)

#### 2. Metadata file
Loosely following [W3C recommendations for CSV data and metadata](http://www.w3.org/TR/tabular-data-model/#standard-file-metadata), each CSV must be associated with a JSON file of the same name, plus the extension `-metadata.json`, e.g.,
`filename.csv-metadata.json`.

Metadata must specify:
* `time` value used to determine order in which CSVs are converted
* `spreadsheet` name. If no spreadsheet by this name exists in `spreadsheets/` folder, it will be created.
* `sheet` name. If no sheet by this name exists in spreadsheet, it will be created.
* `primaryKey`. Column name in CSV used to identify and prevent duplicate records. 

Example:
```
{
  "time": "20150123T130634",
  "spreadsheet": "Saccade Experiments",
  "sheet" : "Memory Guided",
  "primaryKey" : "Run ID"
}
```

Note, metadata could be extended to specify column-level merge policies, formatting, etc.

#### Scripts
Run the scripts from `main.gs` or by setting up a Google Apps trigger, such as a [time-driven trigger](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers) (unfortunately there's no simple way to monitor a folder for new CSV files). Make sure `testMode` is set to `false` in [`main.gs`](https://github.com/unendin/csv2sheet/blob/master/csv2sheet_scripts/main.gs).

The scripts do the following:
* Process files (any number of CSV/metadata pairs) found in `csvs_new/` 
* Merge new data into sheets in `spreadsheets/`
* Move processed CSVs and metadata to `csvs_processed` (or `csvs_notValid`)
* Save activity log to `logs/` 

# Options
#### Merge rules
The scripts are intended for a workflow where additional spreadsheet data and formatting are maintained manually, so the merge tampers minimally with the spreadsheet. The default options (easily changed in [`main.gs`](https://github.com/unendin/csv2sheet/blob/master/csv2sheet_scripts/main.gs)) attempt to preserve columns and their order in both CSV and sheet, though they do give precedence to the CSV in the case where the same columns are in different positions.

#### Folder and file names
The scripts expect exactly one `csv2sheet/` folder in your Google Drive, containing all subfolders as named in the repositoty. Change folder names in [`CsvApp.gs`](https://github.com/unendin/csv2sheet/blob/master/csv2sheet_scripts/CsvApp.gs). Scripts have no way to know which folder they're running in, so a root folder must be specified, either by name (simple, though not reliably unique) or id.   

# Tests
The [`test/csvs_new/`](https://github.com/unendin/csv2sheet/tree/master/test/csvs_new) directory includes CSVs and metadata that demonstrate the basic functionality of csv2sheet and support further customization. When `testMode` is set to `true` in [`main.gs`](https://github.com/unendin/csv2sheet/blob/master/csv2sheet_scripts/main.gs), running the script will generate new spreadsheets in `test/spreadsheets/` (after first removing any previously generated test sheets and restoring any CSVs or metadata moved to `csvs_processed/` or `csvs_notValid/`). Cases handled by the tests should be clear from the filenames in [`test/csvs_new/`](https://github.com/unendin/csv2sheet/tree/master/test/csvs_new) and, in more detail, from the log saved to `test/logs/`.  

# Managing Google Apps Script Projects
Google provides a simple and reliable development environment. Among its many limitations are a lack of open-source collaboration workflows (to wit, the hacky installation instuctions above), no direct support for useful JS libraries like Underscore, and less-than-usable versioning. 

For what it's worth, Google does maintain an [Eclipse Plugin](https://developers.google.com/eclipse/docs/apps_script) which handles importing and exporting of [standalone scripts](https://developers.google.com/apps-script/guides/standalone) such as this one and effectively enables Git integration. Scripts are hosted separately from basic Drive files, so a project with multiple scripts is just represented by a pointer file in your Drive, of which [csv2sheet_scripts.gscript](https://github.com/unendin/csv2sheet/blob/master/csv2sheet_scripts.gscript) is an instance. Google generates a new `gscript` file with your own URL and username once you begin using or editing the scripts. 

# Limitations
The activity log includes useful messaging. Modest error handling is in place. But the script is still quite breakable, due primarily to unexpected input. The good news: the script is unlikely to overwrite valuable spreadsheet data—instead, it will simply error out.

Also, Google file operations can take a long (and variable) amount of time. It's not unusual for the testMode to run for 60 seconds, with over 50 seconds dedicated to moving files around. 
