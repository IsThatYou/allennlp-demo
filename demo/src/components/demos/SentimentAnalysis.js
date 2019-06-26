import React from 'react';
import { API_ROOT } from '../../api-config';
import { withRouter } from 'react-router-dom';
import Model from '../Model'
import OutputField from '../OutputField'

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

const apiUrl = () => `${API_ROOT}/predict/sentiment-analysis`

const title = "Sentiment Analysis"

const description = (
  <span> Sentiment Analysis predicts how positive/negative an input is on a scale of 1-5. The model is the Biattentive Classification Network from the <a href="https://arxiv.org/abs/1802.05365">ELMo paper</a>. This model is trained on the 5-way classification setting of the <a href="https://nlp.stanford.edu/sentiment/treebank.html">Stanford Sentiment Treebank</a>. </span>
);

const descriptionEllipsed = (  
  <span> Sentiment Analysis predicts how positive/negative an input is on a scale of 1-5… </span>
);

const fields = [
  {name: "sentence", label: "Input", type: "TEXT_INPUT",
   placeholder: 'E.g. "This movie is amazing"'}
]


const Output = ({ requestData, responseData }) => {        
    var answer = indexOfMax(responseData['class_probabilities'])+1    
    return (
        <div className="model__content answer answer">            
            <OutputField label="Answer">
                {answer} on a scale of 1-5.
            </OutputField>        
        </div>
    )
}


const examples = [
  {
    sentence: "a very well-made, funny and entertaining picture.",    
  },
  {
    sentence: "so unremittingly awful that labeling it a dog probably constitutes cruelty to canines"
  },  
  {
    sentence: "all the amped-up tony hawk-style stunts and thrashing rap-metal can't disguise the fact that, really, we've been here, done that."
  },  
  {
    sentence: "visually imaginative, thematically instructive and thoroughly delightful, it takes us on a roller-coaster ride from innocence to experience without even a hint of that typical kiddie-flick sentimentality."
  },    
]

const modelProps = {apiUrl, title, description, descriptionEllipsed, fields, examples, Output}

export default withRouter(props => <Model {...props} {...modelProps}/>)