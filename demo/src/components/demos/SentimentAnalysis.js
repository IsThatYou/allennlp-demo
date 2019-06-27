import React from 'react';
import { API_ROOT } from '../../api-config';
import { withRouter } from 'react-router-dom';
import Model from '../Model'
import { Accordion } from 'react-accessible-accordion';
import OutputField from '../OutputField'
import HotflipItem from '../Hotflip'
import InputReductionItem from '../InputReduction'
import TextSaliencyMap from '../Interpretation'

const apiUrl = () => `${API_ROOT}/predict/sentiment-analysis`
const attackapiUrl = () => `${API_ROOT}/attack/sentiment-analysis`
const attackapiUrl2 = () => `${API_ROOT}/hotflip/sentiment-analysis`
const apiUrlInterpret = ({interpreter}) => `${API_ROOT}/interpret/textual-entailment/${interpreter}`

const title = "Sentiment Analysis"

// Interpreters
const IG_INTERPRETER = 'integrated_gradients_interpreter'
const GRAD_INTERPRETER = 'simple_gradients_interpreter'

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
  
const Output = ({ responseData,requestData, attackData,attackData2,attackModel,attackModel2}) => {
    var returnVal = "";
    if (responseData['class_probabilities'][1] < responseData['class_probabilities'][0]){    
        returnVal = "Positive";
    }
    else{
      returnVal = "Negative";
    }
  
  return (
  <div className="model__content answer">        
    <OutputField label="Answer">
      {returnVal}      
    </OutputField>

    <OutputField>  
    <Accordion accordion={false}>        
        <InputReductionItem attackDataObject={attackData} attackModelObject={attackModel} requestDataObject={requestData}/>                              
        <HotflipItem attackDataObject2={attackData2} attackModelObject2={attackModel2} requestDataObject2={requestData}/>                                       
      </Accordion>
    </OutputField>
  </div>
  );
}


const examples = [
  { tokens: "a very well-made, funny and entertaining picture." },
  { tokens: "so unremittingly awful that labeling it a dog probably constitutes cruelty to canines" },  
  { tokens: "all the amped-up tony hawk-style stunts and thrashing rap-metal can't disguise the fact that, really, we've been here, done that."},  
  { tokens: "visually imaginative, thematically instructive and thoroughly delightful, it takes us on a roller-coaster ride from innocence to experience without even a hint of that typical kiddie-flick sentimentality."}
]

const modelProps = {apiUrl, apiUrlInterpret, attackapiUrl, attackapiUrl2,title, description, descriptionEllipsed, fields, examples, Output}

export default withRouter(props => <Model {...props} {...modelProps}/>)