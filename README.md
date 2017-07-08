# tracker-epics-column

`tracker-epics-column` is a React component that allows you to show a
column within your page/app that contains the (active) "epics" from a
project in [Pivotal Tracker](https://www.pivotaltracker.com).

## Installation

```
npm install tracker-epics-column --save
```


## Features

* Displays the names and current-completion information (progress bar)
  for each epic.
* Displays epics in priority order.
* Filters out epics that Tracker considers "complete."
* Uses the Pivotal Tracker API (verson 5) and CORS to display epics
  anywhere.
* Supports retrieving epics from a "Public" Pivotal Tracker project as
  well as from private projects accessed through a Tracker API
  authorization token supplied by the hosting page.


## Usage

```
import TrackerEpicsColumn from "tracker-epics-column";

<TrackerEpicsColumn
  projectId = "1042066"             // required, no default; ID number of project in Pivotal Tracker
  includeProjectName = {boolean}    // optional, defaults to false; when true, a heading is shown at the top of the epics column with the name of the project from Tracker
  apiToken = {string}               // optional, no default; when provided, included in Pivotal Tracker API requests to authorize reading information from private projects
  styles = {object}                 // optional, allows override of built-in CSS styling; see src/styles.js for supported keys and default values
/>
```


## Example

See `demo/src/index.js` which displays two instances of
`TrackerEpicsColumn` with information from two different public
Tracker projects.  If you clone the `git` repository for the component
locally and run `yarn start` the demo app will be served from you
local system.


## License

MIT
