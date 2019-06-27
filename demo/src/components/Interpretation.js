import React from 'react'
import colormap from 'colormap'
import styled from 'styled-components';
import { Tooltip, ColorizedToken } from './Shared';
import {  
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
  } from 'react-accessible-accordion';

export default class TextSaliencyMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      premtopK: 3,
      hypotopK: 3
    }

    this.colorize = this.colorize.bind(this)
    this.handlePremTopKChange = this.handlePremTopKChange.bind(this)
    this.handleHypoTopKChange = this.handleHypoTopKChange.bind(this)
    this.getTopKIndices = this.getTopKIndices.bind(this)
  }

  static defaultProps = {
    colormapProps: {
      colormap: 'RdBu',
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

  handlePremTopKChange = e => {
    let stateUpdate = Object.assign({}, this.state)
    console.log('state updatessss', stateUpdate)
    if (e.target.value.trim() === "") {
      stateUpdate['premtopK'] = e.target.value    
    } else {
      stateUpdate['premtopK'] = parseInt(e.target.value, 10)      
    }
    this.setState(stateUpdate)
  }
  handleHypoTopKChange = e => {
    let stateUpdate = Object.assign({}, this.state)
    console.log('state updatessss', stateUpdate)
    if (e.target.value.trim() === "") {
      stateUpdate['hypotopK'] = e.target.value
    } else {
      stateUpdate['hypotopK'] = parseInt(e.target.value, 10)
    }
    this.setState(stateUpdate)
  }

  getTopKIndices(tokensWithWeights, use_prem) {
    function grad_compare(obj1, obj2) {
      return obj1.weight - obj2.weight
    }

    // Add indices so we can keep track after sorting
    let indexedTokens = tokensWithWeights.map((obj, idx) => Object.assign({}, obj, {idx}))
    
    indexedTokens.sort(grad_compare)
  
    // Extract top K tokens and return only the indices of the top tokens
    if (use_prem){
      const topKTokens = indexedTokens.slice(0, this.state.premtopK)
      return topKTokens.map(obj => obj.idx)
    }
    else{
      const topKTokens = indexedTokens.slice(0, this.state.hypotopK) 
      return topKTokens.map(obj => obj.idx)
    }  
  }

  render() {
    const { premTokensWithWeights, hypoTokensWithWeights, interpretModelObject, requestDataObject, interpreter } = this.props 
    const premtopKIdx = new Set(this.getTopKIndices(premTokensWithWeights, true))
    const hypoKIdx = new Set(this.getTopKIndices(hypoTokensWithWeights, false))
    const prem_token_color_map = this.colorize(premTokensWithWeights, premtopKIdx)
    const hypo_token_color_map = this.colorize(hypoTokensWithWeights, hypoKIdx)
        
    return (
      <div>
       <AccordionItem expanded={true}>
          <AccordionItemTitle>
            Simple Gradients Interpretation
            <div className="accordion__arrow" role="presentation"/>
          </AccordionItemTitle>
          <AccordionItemBody>
            <p> See saliency map interpretations generated by <a href="https://arxiv.org/abs/1312.6034" target="_blank">visualizing the gradient</a>. </p>
            <p><strong>Saliency Map for Premise:</strong></p>
            {premTokensWithWeights.length !== 0 ? <div>{prem_token_color_map} <Tooltip /> <input type="range" min={0} max={prem_token_color_map.length} step="1" value={this.state.premtopK} className="slider" onChange={this.handlePremTopKChange} style={{ padding: "0px", margin: "0px" }} /> <br /><br /></div> : <p style={{color: "#000000"}}>Press "interpret prediction" to show the premise interpretation.</p>}
                                                                                         
            <p><strong>Saliency Map for Hypothesis:</strong></p>
            {hypoTokensWithWeights.length !== 0 ? <div>{hypo_token_color_map} <Tooltip /> <input type="range" min={0} max={hypo_token_color_map.length} step="1" value={this.state.hypotopK} className="slider"
            onChange={this.handleHypoTopKChange} style={{ padding: "0px", margin: "0px" }} /> <br /><br /></div> : <p style={{color: "#000000"}}>Press "interpret prediction" to show the hypothesis interpretation.</p>}
                                                                                            
            <button type="button" className="btn" style={{margin: "30px 0px"}} onClick={ () => interpretModelObject(requestDataObject, interpreter) }>Interpret Prediction
            </button>
          </AccordionItemBody>
        </AccordionItem>
      </div>
    )
  }
}