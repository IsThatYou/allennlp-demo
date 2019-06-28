import React from 'react';
import { API_ROOT } from '../../api-config';
import { withRouter } from 'react-router-dom';
import Model from '../Model'
import { Accordion } from 'react-accessible-accordion';
import OutputField from '../OutputField'
import HotflipItem from '../Hotflip'
import InputReductionItem from '../InputReduction'
import InterpretationSingleInput from '../InterpretationSingleInput'

// APIs. These link to the functions in app.py
const apiUrl = () => `${API_ROOT}/predict/sentiment-analysis`
const attackapiUrl = () => `${API_ROOT}/attack/sentiment-analysis`
const attackapiUrl2 = () => `${API_ROOT}/hotflip/sentiment-analysis`
const apiUrlInterpret = ({interpreter}) => `${API_ROOT}/interpret/sentiment-analysis/${interpreter}`

// title of the page
const title = "Sentiment Analysis"

// Names of the interpreters used in this demo.
const IG_INTERPRETER = 'integrated_gradients_interpreter'
const GRAD_INTERPRETER = 'simple_gradients_interpreter'

// Text shown in the UI
const description = (
  <span> Sentiment Analysis predicts whether an input is positive or negative. The model is a simple LSTM using GloVe embeddings that is trained on the binary classification setting of the <a href="https://nlp.stanford.edu/sentiment/treebank.html">Stanford Sentiment Treebank</a>. </span>
);
const descriptionEllipsed = (  
  <span> Sentiment Analysis predicts whether an input is positive or negative… </span>
);

// Input fields to the model.
const fields = [
  {name: "tokens", label: "Input", type: "TEXT_INPUT",
   placeholder: 'E.g. "amazing movie"'}
]
  
// What is rendered as Output when the user hits buttons on the demo.
const Output = ({ responseData,requestData, attackData,attackData2,attackModel,attackModel2, interpretData, interpretModel}) => {
    var prediction = "";            
    if (responseData['probs'][1] < responseData['probs'][0]){  // if probability(negative_class) < probability(positive_class)  
        prediction = "Positive";
    }
    else{
      prediction = "Negative";
    }

  var t = requestData;                    
  var tokens = t['tokens'].split(' '); // this model expects space-separated inputs

  // The "Answer" output field has the models predictions. The other output fields are the reusable HTML/JavaScript for the interpretation methods.
  return (
  <div className="model__content answer">        
    <OutputField label="Answer">
      {prediction}      
    </OutputField>

    <OutputField>  
    <Accordion accordion={false}>        
        <InputReductionItem attackDataObject={attackData} attackModelObject={attackModel} requestDataObject={requestData}/>                              
        <HotflipItem attackDataObject2={attackData2} attackModelObject2={attackModel2} requestDataObject2={requestData}/>                             
        <InterpretationSingleInput interpretData={interpretData} tokens={tokens} interpretModel = {interpretModel} requestData = {requestData} interpreter={GRAD_INTERPRETER}/>        
        <InterpretationSingleInput interpretData={interpretData} tokens={tokens} interpretModel = {interpretModel} requestData = {requestData} interpreter={IG_INTERPRETER}/>         
      </Accordion>
    </OutputField>
  </div>
  );
}

// Examples the user can choose from in the demo
const examples = [
  { tokens: "a very well-made, funny and entertaining picture." },
  { tokens: "so unremittingly awful that labeling it a dog probably constitutes cruelty to canines" },  
  { tokens: "all the amped-up tony hawk-style stunts and thrashing rap-metal can't disguise the fact that, really, we've been here, done that."},  
  { tokens: "visually imaginative, thematically instructive and thoroughly delightful, it takes us on a roller-coaster ride from innocence to experience without even a hint of that typical kiddie-flick sentimentality."}
]

// A boilerplate call to a pre-existing model component that handles all of the inputs and outputs. We just need to pass it the things we've already defined as props:
const modelProps = {apiUrl, apiUrlInterpret, attackapiUrl, attackapiUrl2,title, description, descriptionEllipsed, fields, examples, Output}
export default withRouter(props => <Model {...props} {...modelProps}/>)