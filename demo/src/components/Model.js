import React from 'react'
import { PaneLeft, PaneRight, PaneTop, PaneBottom } from './Pane'
import DemoInput from './DemoInput'

class Model extends React.Component {
    constructor(props) {
      super(props);

      const { requestData, responseData, interpretData, attackData } = props;

      this.state = {
        outputState: responseData ? "received" : "empty", // valid values: "working", "empty", "received", "error"
        requestData: requestData,
        responseData: responseData,
        attackData: attackData,
        interpretData: interpretData
      };

      this.runModel = this.runModel.bind(this)
      this.attackModel = this.attackModel.bind(this)
      this.attackModel2 = this.attackModel2.bind(this)      
      this.interpretModel = this.interpretModel.bind(this)
    }

    runModel(inputs) {
      console.log('inputs', inputs)
      const { selectedModel, apiUrl } = this.props

      this.setState({outputState: "working"});

      fetch(apiUrl(inputs), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs)
      }).then((response) => {
        return response.json();
      }).then((json) => {
        // If the response contains a `slug` for a permalink, we want to redirect
        // to the corresponding path using `history.push`.
        const { slug } = json;
        const newPath = slug ? `/${selectedModel}/${slug}` : `/${selectedModel}`
        // We'll pass the request and response data along as part of the location object
        // so that the `Demo` component can use them to re-render.
        const location = {
          pathname: newPath,
          state: { requestData: inputs, responseData: json }
        }
        this.props.history.push(location);
      }).catch((error) => {
        this.setState({outputState: "error"});
        console.error(error);
      });
    }

    interpretModel(inputs, interpreter) {
      console.log('interpreter', Object.assign(inputs, {interpreter}))
      const { apiUrlInterpret } = this.props

      fetch(apiUrlInterpret(Object.assign(inputs, {interpreter})), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs)
      }).then((response) => {
        return response.json();
      }).then((json) => {
        console.log(json)
        let stateUpdate = Object.assign({}, this.state)
        console.log('STATE UPDATE 1', stateUpdate['interpretData'])
        stateUpdate['interpretData'] = Object.assign({}, { [interpreter]: json }, stateUpdate['interpretData'])
        console.log('STATE UPDATE', stateUpdate)
        this.setState(stateUpdate)
      })
    }

    attackModel(inputs) {
      const { selectedModel, attackapiUrl } = this.props

      fetch(attackapiUrl(inputs), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs)
      }).then((response) => {
        return response.json();
      }).then((json) => {
        //console.log(json)
        this.setState({attackData: json})
      });
    }
      attackModel2(inputs) {
      const { selectedModel, attackapiUrl2 } = this.props

      fetch(attackapiUrl2(inputs), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs)
      }).then((response) => {
        // console.log(response.json())
        return response.json();
      }).then((json) => {
        //console.log(json)
        this.setState({attackData2: json})
      });
    }

 render() {
        const { title, description, descriptionEllipsed, examples, fields, selectedModel, vertical, Output } = this.props;
        const { requestData, responseData, outputState } = this.state;
        const demoInput = <DemoInput selectedModel={selectedModel}
                                     title={title}
                                     description={description}
                                     descriptionEllipsed={descriptionEllipsed}
                                     examples={examples}
                                     fields={fields}
                                     inputState={requestData}
                                     responseData={responseData}
                                     outputState={outputState}
                                     runModel={this.runModel}/>

        const demoOutput = requestData && responseData ? <Output {...this.state} interpretModel={this.interpretModel} attackModel={this.attackModel} attackModel2={this.attackModel2}/> : null        
        let className, InputPane, OutputPane
        if (vertical) {
          className = "pane model"
          InputPane = PaneLeft
          OutputPane = PaneRight
        } else {
          className = "pane__horizontal model"
          InputPane = PaneTop
          OutputPane = PaneBottom
        }

        return (
            <div className={className}>
                <InputPane>{demoInput}</InputPane>
                <OutputPane outputState={outputState}>{demoOutput}</OutputPane>
            </div>
        )
    }
}


export default Model
