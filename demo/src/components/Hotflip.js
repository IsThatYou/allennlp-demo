import React from 'react';
import {postprocessHotflip} from './Attack'
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
    const { attackDataObject2, attackModelObject2, requestDataObject2, task } = this.props     
    var attack_visual2 = '';    
    var attack_visual2_og = '';
    let new_prediction = ''  
    if (attackDataObject2 === undefined) {
      attack_visual2 = " "
    }
    else{    
      var [first,second] = postprocessHotflip(attackDataObject2["original"],attackDataObject2["final"][0])
      attack_visual2 = second
      attack_visual2_og = first 

      if (task === "sentiment") {
        let [pos, neg] = attackDataObject2["new_prediction"]
        new_prediction = <p><b>Prediction changed to:</b> {pos > neg ? 'Positive' : 'Negative'}</p>
      }

      if (task === "textual_entailment") {
        let [entail, contr, neutral] = attackDataObject2["new_prediction"]
        let prediction = ''
        if (entail > contr) {
          if (entail > neutral) {
            prediction = "Entailment"
          } else {
            prediction = "Neutral"
          }
        } else {
          if (contr > neutral) {
            prediction = "Contradiction"
          } else {
            prediction = "Neutral"
          }
        }
        new_prediction = <p><b>Prediction changed to:</b> {prediction}</p>
      }
    }

  if (task === "sentiment"){
    return (<div> <AccordionItem expanded={true}>
          <AccordionItemTitle>
            HotFlip Attack
            <div className="accordion__arrow" role="presentation"/>
          </AccordionItemTitle>
          <AccordionItemBody>            
            <p> <a href="https://arxiv.org/abs/1712.06751" target="_blank" rel="noopener noreferrer">HotFlip</a> flips words in the input to change the model's prediction. We iteratively flip the word in the Hypothesis with the highest gradient until the prediction changes.</p>                                
            {attack_visual2 !== " " ? <p><strong>Original Input:</strong> {attack_visual2_og}</p> : <p style={{color: "#7c7c7c"}}>Press "flip words" to run HotFlip.</p>}    
            {attack_visual2 !== " " ? <p><strong>Flipped Input:</strong> {attack_visual2}</p> : <p></p>}     
            {new_prediction}                 
                <button
                  type="button"
                  className="btn"
                  style={{margin: "30px 0px"}}
                  onClick={ () => attackModelObject2(requestDataObject2) }>Flip Words
                </button>
          </AccordionItemBody>
        </AccordionItem></div>
    )
  }
  else {
    return (<div> <AccordionItem expanded={true}>
          <AccordionItemTitle>
            HotFlip Attack
            <div className="accordion__arrow" role="presentation"/>
          </AccordionItemTitle>
          <AccordionItemBody>            
            <p> <a href="https://arxiv.org/abs/1712.06751" target="_blank" rel="noopener noreferrer">HotFlip</a> flips words in the Hypothesis to change the model's prediction. We iteratively flip the word in the Hypothesis with the highest gradient until the prediction changes.</p>                                
            {attack_visual2 !== " " ? <p><strong>Original Premise:</strong> {requestDataObject2['premise']}</p> : <p></p>}    
            {attack_visual2 !== " " ? <p><strong>Original Hypothesis:</strong> {attack_visual2_og}</p> : <p style={{color: "#7c7c7c"}}>Press "flip words" to run HotFlip.</p>}    
            {attack_visual2 !== " " ? <p><strong>Flipped Hypothesis:</strong> {attack_visual2}</p> : <p></p>}             
            {new_prediction}         
                <button
                  type="button"
                  className="btn"
                  style={{margin: "30px 0px"}}
                  onClick={ () => attackModelObject2(requestDataObject2) }>Flip Words
                </button>

          </AccordionItemBody>
        </AccordionItem></div>
    )
  }
}
}