import React from 'react';
import{postprocessInputReduction} from './Attack'
import {  
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
  } from 'react-accessible-accordion';

export default class HotflipItem extends React.Component {
  constructor(props) {
    super(props)      
  }
  
  render() {
    const { attackDataObject, attackModelObject, requestDataObject } = this.props     

    var attack_visual = '';    
    var attack_visual_og = '';
    if (attackDataObject === undefined) {
      attack_visual = " "
    }
    else{    
      var [first,second] = postprocessInputReduction(attackDataObject["original"],attackDataObject["final"][0])    
      attack_visual = second
      attack_visual_og = first
    }

  return (<div><AccordionItem expanded={true}>               
      <AccordionItemTitle>
            Input Reduction
            <div className="accordion__arrow" role="presentation"/>
          </AccordionItemTitle>
          <AccordionItemBody>                  
     <p> <a href="https://arxiv.org/abs/1804.07781" target="_blank" rel="noopener noreferrer">Input Reduction</a> removes as many words from the input as possible without changing the model's prediction.</p>
      {attack_visual !== " " ? <p><strong>Original Input:</strong> {attack_visual_og}</p> : <p style={{color: "#7c7c7c"}}>Press "reduce input" to run input reduction.</p>}    
            {attack_visual !== " " ? <p><strong>Reduced Input:</strong> {attack_visual}</p> : <p></p>}          
        <button
          type="button"
          className="btn"
          style={{margin: "30px 0px"}}
          onClick={ () => attackModelObject(requestDataObject) }>Reduce Input
        </button>
        </AccordionItemBody></AccordionItem></div>
    )
  }
}