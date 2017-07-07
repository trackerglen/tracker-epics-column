import React from "react";
import baseStyles from "./styles.js";


const CATEGORIES = [ "Accepted", "Active", "Unstarted", "Unscheduled" ];
const PIVOTAL_TRACKER = "https://www.pivotaltracker.com";
const EPICS_PARAMETERS = "?fields=:default,after_id,before_id,completed_at,label(:default,counts)";
const PROJECT_PARAMETERS = "?fields=name";

export class TrackerEpicsColumn extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      epics: [],
      project: { name: "" }
    };

    this.getEpicHashes();
    if (this.props.includeProjectName) {
      this.getProjectHash();
    }
  }

  render () {
    const projectId = this.props.projectId;
    const styles = Object.assign({}, baseStyles, this.props.styles || {});

    const epicsToShow = this.sortedEpics().filter(epic => { return !epic.completed_at; });
    const maxTotal = this.getMaxTotal(epicsToShow);

    var projectName = "";
    if (this.props.includeProjectName) {
      projectName = <span style={styles.projectName}>{this.state.project.name}</span>
    }

    return <div className="tracker-epics-column" style={styles.column}>
      {projectName}
      <ul style={styles.ul}>{
        epicsToShow.map(epic => {
	  var progressBar = "";
	  if (this.totalForEpic(epic) > 0) {
	    progressBar = <div style={styles.progress}>{
	      CATEGORIES.map(key => {
		var style = Object.assign({}, styles["progress"+key]);
		style.width = (epic.totals[key]*100 / maxTotal) + "%";
		return <div style={style} key={epic.id+key}>&nbsp;</div>;
	      })
	    }</div>
	  }

	  return <li style={styles.li} key={epic.id}>
            <span style={styles.epicName}>{epic.name}</span>
	    {progressBar}
          </li>;
	})
      }</ul>
    </div>;
  }



    ////////////////
    //// network/API stuff

  getEpicHashes () {
    fetch(this.epicsEndpoint(this.props.projectId))
      .then(response => { return response.json(); })
      .then(this.loadEpicHashes.bind(this));
  }

  loadEpicHashes (epics) {
    this.annotateEpics(epics);

    this.setState(prevState => {
      var newState = Object.assign({}, prevState);
      newState.epics = epics;
      return newState;
    });
  }

  epicsEndpoint (projectId) {
    var endpoint = PIVOTAL_TRACKER + "/services/v5/projects/" + projectId + "/epics" + EPICS_PARAMETERS;
    if (this.props.apiToken) {
      endpoint += "&token=" + this.props.apiToken;
    }
    return endpoint;
  }

  getProjectHash () {
    fetch(this.projectEndpoint(this.props.projectId))
      .then(response => { return response.json(); })
      .then(this.loadProjectHash.bind(this));
  }

  loadProjectHash (project) {
    this.setState(prevState => {
      var newState = Object.assign({}, prevState);
      newState.project = project;
      return newState;
    });
  }

  projectEndpoint (projectId) {
    var endpoint = PIVOTAL_TRACKER + "/services/v5/projects/" + projectId + PROJECT_PARAMETERS;
    if (this.props.apiToken) {
      endpoint += "&token=" + this.props.apiToken;
    }
    return endpoint;
  }



    ////////////////
    //// utility methods

    sortedEpics () {
      var epicsMap = {};
      this.state.epics.forEach((epic) => { epicsMap[epic.id] = epic; });

      const firstEpic = this.state.epics.find((epic) => { return epic.after_id == null; });
      if (!firstEpic) {
        return [];
      }

      var sorted = [ firstEpic ];
      var current = firstEpic;
      while (current.before_id) {
        current = epicsMap[current.before_id];
	sorted.push(current);
      }

      return sorted;
    }

    getMaxTotal (epics) {
      var max = 0;
      epics.forEach((epic) => {
	const total = this.totalForEpic(epic);
	max = total > max ? total : max;
      });

      return max;
    }

    annotateEpics (epics) {
      epics.forEach((epic) => {
	const counts = epic.label.counts;
	epic.totals = {
	  Accepted: this.total(counts, "accepted"),
	  Active: this.total(counts, "rejected", "delivered", "finished", "started"),
	  Unstarted: this.total(counts, "planned", "unstarted"),
	  Unscheduled: this.total(counts, "unscheduled")
	};
      });
    }

    total () {
      const counts = arguments[0];
      const keys = Array.prototype.slice.call(arguments, 1);

      var total = 0;
      keys.forEach(key => {
        total += counts.sum_of_story_estimates_by_state[key];
	total += counts.number_of_zero_point_stories_by_state[key] * 0.5;
      });
      return total;
    }

    totalForEpic (epic) {
      return CATEGORIES.reduce((sum, key) => { return sum + epic.totals[key]; }, 0);
    }
};

export default TrackerEpicsColumn;
