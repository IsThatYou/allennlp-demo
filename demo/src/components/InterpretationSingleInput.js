import React from 'react'
import colormap from 'colormap'
import styled from 'styled-components';
import { Tooltip, ColorizedToken } from './Shared';
import {  
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
  } from 'react-accessible-accordion';


const getTokenWeightPairs = (grads, tokens) => {
  // We do 1 - weight to get the colormap scaling right
  const tokensWithWeights = tokens.map((token, idx) => {
    let weight = grads[idx]
    return { token, weight: 1 - weight }
  })  
  return tokensWithWeights
}

export default class InterpretationComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      topK: 3      
    }

    this.colorize = this.colorize.bind(this)
    this.handleTopKChange = this.handleTopKChange.bind(this)    
    this.getTopKIndices = this.getTopKIndices.bind(this)
  }
  
  static defaultProps = {
    colormapProps: {
      colormap: 'copper',
      format: 'hex',
      nshades: 20
    }
  }

  colorize(tokensWithWeights, topKIdx) {
    const {colormapProps} = this.props
    // colormap package takes minimum of 6 shades 
    colormapProps.nshades =  Math.min(Math.max(colormapProps.nshades, 6), 72);
    let colors = colormap(colormapProps)

    let result_string = [];
    tokensWithWeights.forEach((obj, idx) => {
      result_string.push(
        // IMPORTANT: * the colormap pictures for colormap js go from left to right!
        //            * This means that for RdBu, low extreme is blue and high extreme is red 
        <label key={idx} data-tip={(1 - obj.weight).toFixed(3)} style={{ display: "inline-block" }} >
          <ColorizedToken backgroundColor={topKIdx.has(idx) ? colors[Math.round(obj.weight * (colormapProps.nshades - 1))] : 'transparent'}
                          key={idx}>
                          {obj.token}
          </ColorizedToken>
        </label>
      )
    })

    return result_string 
  }

  handleTopKChange = e => {
    let stateUpdate = Object.assign({}, this.state)
    console.log('state updatessss', stateUpdate)
    if (e.target.value.trim() === "") {
      stateUpdate['topK'] = e.target.value    
    } else {
      stateUpdate['topK'] = parseInt(e.target.value, 10)      
    }
    this.setState(stateUpdate)
  } 

  getTopKIndices(tokensWithWeights) {
    function grad_compare(obj1, obj2) {
      return obj1.weight - obj2.weight
    }

    // Add indices so we can keep track after sorting
    console.log('tokenswithweights', tokensWithWeights);
    let indexedTokens = tokensWithWeights.map((obj, idx) => Object.assign({}, obj, {idx}))
    
    indexedTokens.sort(grad_compare)
  
    // Extract top K tokens and return only the indices of the top tokens    
    const topKTokens = indexedTokens.slice(0, this.state.topK) 
    return topKTokens.map(obj => obj.idx)    
  }

  render() {
    console.log("RENDERING")
    const { interpretData, tokens, interpretModel, requestData, interpreter } = this.props 

    const GRAD_INTERPRETER = 'simple_gradients_interpreter'
    const IG_INTERPRETER = 'integrated_gradients_interpreter'    

    let title1 = ''
    let title2 = ''
    if (interpreter === GRAD_INTERPRETER){
        title1 = 'Simple Gradients Visualization'
        title2 = '<p> See saliency map interpretations generated by <a href="https://arxiv.org/abs/1312.6034" target="_blank">visualizing the gradient</a>. </p>'
    }
    else if (interpreter == IG_INTERPRETER){
        title1 = 'Integrated Gradients Visualization'
        title2 = '<p> See saliency map interpretations generated using <a href="https://arxiv.org/abs/1703.01365" target="_blank">Integrated Gradients</a>.</p>'
    }

    const { simple_gradients_interpreter, integrated_gradients_interpreter } = interpretData ? interpretData : {[GRAD_INTERPRETER]: undefined, [IG_INTERPRETER]: undefined} 

    let tokensWithWeights = []    
    
    if (simple_gradients_interpreter) {
      const { instance_1 } = simple_gradients_interpreter
      const { grad_input_1 } = instance_1 
      console.log("grad_input_1", grad_input_1);
      console.log("tokens", tokens);

      tokensWithWeights = getTokenWeightPairs(grad_input_1, tokens)    
    }

    if (integrated_gradients_interpreter) {
      const { instance_1 } = integrated_gradients_interpreter
      const { grad_input_1 } = instance_1 

      tokensWithWeights = getTokenWeightPairs(grad_input_1, tokens)    
    }
    
    const topKIdx = new Set(this.getTopKIndices(tokensWithWeights, true))        
    const token_color_map = this.colorize(tokensWithWeights, topKIdx)
                
    return (
      <div>
       <AccordionItem expanded={true}>
          <AccordionItemTitle>
            {title1}
            <div className="accordion__arrow" role="presentation"/>
          </AccordionItemTitle>
          <AccordionItemBody>
            <div className="content" dangerouslySetInnerHTML={{__html: title2}}></div>            
            <p><strong>Saliency Map:</strong></p>
            {tokensWithWeights.length !== 0 ? <div>{token_color_map} <Tooltip /> <input type="range" min={0} max={token_color_map.length} step="1" value={this.state.topK} className="slider" onChange={this.handleTopKChange} style={{ padding: "0px", margin: "0px" }} /> <br /> Visualizing the top {this.state.topK} words. <br /><br /></div> : <p style={{color: "#7c7c7c"}}>Press "interpret prediction" to show the interpretation.</p>}
                                               
            <button type="button" className="btn" style={{margin: "30px 0px"}} onClick={() => interpretModel(requestData, interpreter)}>Interpret Prediction
            </button>
          </AccordionItemBody>
        </AccordionItem>
      </div>
    )
  }
}