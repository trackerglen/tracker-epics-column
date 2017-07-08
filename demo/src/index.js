import React, {Component} from 'react'
import {render} from 'react-dom'

import TrackerEpicsColumn from '../../src/TrackerEpicsColumn'

class Demo extends Component {
  render() {
    return <div>
      <h1>tracker-epics-column Demo</h1>
      <div style={ {float: "left", width: "400px"} }>

        <TrackerEpicsColumn
	  projectId = "1042066"
	/>

      </div>
      <div style={ {float: "left", width: "400px"} }>

        <TrackerEpicsColumn
	  projectId = "993188"
          includeProjectName = {true}
	/>

      </div>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
