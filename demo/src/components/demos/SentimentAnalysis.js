import React from 'react';
import { API_ROOT } from '../../api-config';
import { withRouter } from 'react-router-dom';
import Model from '../Model'
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
  } from 'react-accessible-accordion';
import OutputField from '../OutputField'
import styled from 'styled-components';

const apiUrl = () => `${API_ROOT}/predict/sentiment-analysis`
const attackapiUrl = () => `${API_ROOT}/attack/sentiment-analysis`
const attackapiUrl2 = () => `${API_ROOT}/hotflip/sentiment-analysis`

const title = "Sentiment Analysis"

const description = (
  <span> Sentiment Analysis predicts whether an input is positive or negative. The model is a variant of the Biattentive Classification Network from the <a href="https://arxiv.org/abs/1802.05365">ELMo paper</a>. This model is trained on the binary classification setting of the <a href="https://nlp.stanford.edu/sentiment/treebank.html">Stanford Sentiment Treebank</a>. </span>
);

const descriptionEllipsed = (  
  <span> Sentiment Analysis predicts whether an input is positive or negative… </span>
);

const fields = [
  {name: "tokens", label: "Input", type: "TEXT_INPUT",
   placeholder: 'E.g. "This movie is amazing"'}
]


const ColorizedToken = styled.span`
  background-color: ${props => props.backgroundColor};
  padding: 1px;
  margin: 1px;
  display: inline-block;
  border-radius: 3px;
`;

function postprocess(org,data) 
{
  let result_string = []
  let result_string2 = []
  console.log(org)
  var obj = ''
  for (let idx=0; idx<org.length; idx++) {
    obj = org[idx]
    
    if (obj !== data[idx])
    {
      console.log(obj,data[idx])
      result_string.push(
        <ColorizedToken backgroundColor={"#FF5733"}
        key={idx}>{obj} </ColorizedToken>)
        result_string2.push(
          <ColorizedToken backgroundColor={"#26BD19"}
          key={idx}>{data[idx]} </ColorizedToken>)
    }
    else{
      result_string.push(
        <ColorizedToken backgroundColor={"transparent"}
        key={idx}>{obj} </ColorizedToken>)
        result_string2.push(
          <ColorizedToken backgroundColor={"transparent"}
          key={idx}>{data[idx]} </ColorizedToken>)
    }
    
  }
  
  return [result_string,result_string2]
}

const Output = ({ responseData,requestData, attackData,attackData2,attackModel,attackModel2}) => {
    var returnVal = "";
    if (responseData['probs'][1] < responseData['probs'][0]){    
        returnVal = "Positive";
    }
    else{
      returnVal = "Negative";
    }

  var attack_visual = '';
  var attack_visual2 = '';
  var attack_visual_og = '';
  var attack_visual2_og = '';  
  if (attackData === undefined) {
    attack_visual = " "
  }
  else{
    attack_visual = attackData["final"][0].join(" ")
    attack_visual_og = attackData["original"].join(" ")
  }
  if (attackData2 === undefined) {
    attack_visual2 = " "
  }
  else{
    var [first,second] = postprocess(attackData2["original"],attackData2["final"][0])
    attack_visual2 = second
    attack_visual2_og = first        
  }  

  return (
  <div className="model__content answer">        
    <OutputField label="Answer">
      {returnVal}
    </OutputField>        

    <OutputField>    
       <Accordion accordion={false}>
       <AccordionItem expanded={true}>
          <AccordionItemTitle>
            Input Reduction
            <div className="accordion__arrow" role="presentation"/>
          </AccordionItemTitle>
          <AccordionItemBody>
            <p> <a href="https://arxiv.org/abs/1804.07781" target="_blank">Input Reduction</a> removes as many words from the input as possible without changing the model's prediction.</p>
            {attack_visual != " " ? <p><strong>Original Input:</strong> {attack_visual_og}</p> : <p style={{color: "#7c7c7c"}}>Press "reduce input" to run input reduction.</p>}    
            {attack_visual != " " ? <p><strong>Reduced Input:</strong> {attack_visual}</p> : <p></p>}          
                <button
                  type="button"
                  className="btn"
                  style={{margin: "30px 0px"}}
                  onClick={ () => attackModel(requestData) }>Reduce Input
                </button>

          </AccordionItemBody>
        </AccordionItem>

          <AccordionItem expanded={true}>
          <AccordionItemTitle>
            HotFlip Attack
            <div className="accordion__arrow" role="presentation"/>
          </AccordionItemTitle>
          <AccordionItemBody>            
            <p> <a href="https://arxiv.org/abs/1712.06751" target="_blank">HotFlip</a> flips words in the Hypothesis to change the model's prediction. We iteratively flip the word in the Hypothesis with the highest gradient until the prediction changes.</p>                                
            {attack_visual2 != " " ? <p><strong>Original Input:</strong> {attack_visual2_og}</p> : <p style={{color: "#7c7c7c"}}>Press "flip words" to run HotFlip.</p>}    
            {attack_visual2 != " " ? <p><strong>Flipped Input:</strong> {attack_visual2}</p> : <p></p>}                      
                <button
                  type="button"
                  className="btn"
                  style={{margin: "30px 0px"}}
                  onClick={ () => attackModel2(requestData) }>Flip Words
                </button>
          </AccordionItemBody>
        </AccordionItem>
      </Accordion>
    </OutputField>
  </div>
  );
}




const examples = [
  {
    tokens: "a very well-made, funny and entertaining picture.",    
  },
  {
    tokens: "so unremittingly awful that labeling it a dog probably constitutes cruelty to canines"
  },  
  {
    tokens: "all the amped-up tony hawk-style stunts and thrashing rap-metal can't disguise the fact that, really, we've been here, done that."
  },  
  {
    tokens: "visually imaginative, thematically instructive and thoroughly delightful, it takes us on a roller-coaster ride from innocence to experience without even a hint of that typical kiddie-flick sentimentality."
  },    
]

const modelProps = {apiUrl, attackapiUrl, attackapiUrl2,title, description, descriptionEllipsed, fields, examples, Output}

export default withRouter(props => <Model {...props} {...modelProps}/>)