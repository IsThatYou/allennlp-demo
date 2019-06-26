import React from 'react';
import { API_ROOT } from '../../api-config';
import { withRouter } from 'react-router-dom';
import HighlightContainer from '../highlight/HighlightContainer';
import { Highlight } from '../highlight/Highlight';
import Model from '../Model'
import { truncateText } from '../DemoInput'

import OutputField from '../OutputField'
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
  } from 'react-accessible-accordion';
import styled from 'styled-components';

// LOC, PER, ORG, MISC
const attackapiUrl = () => `${API_ROOT}/attack/named-entity-recognition`
const attackapiUrl2 = () => `${API_ROOT}/HotFlip/named-entity-recognition`

const title = "Named Entity Recognition";

const description = (
  <span>
    <span>
        The named entity recognition model identifies named entities
        (people, locations, organizations, and miscellaneous)
        in the input text. This model is the "baseline" model described in
    </span>
    <a href = "https://www.semanticscholar.org/paper/Semi-supervised-sequence-tagging-with-bidirectiona-Peters-Ammar/73e59cb556351961d1bdd4ab68cbbefc5662a9fc" target="_blank" rel="noopener noreferrer">
      {' '} Peters, Ammar, Bhagavatula, and Power 2017 {' '}
    </a>
    <span>
      .  It uses a Gated Recurrent Unit (GRU) character encoder as well as a GRU phrase encoder,
      and it starts with pretrained
    </span>
    <a href = "https://nlp.stanford.edu/projects/glove/" target="_blank" rel="noopener noreferrer">{' '} GloVe vectors {' '}</a>
    <span>
      for its token embeddings. It was trained on the
    </span>
    <a href = "https://www.clips.uantwerpen.be/conll2003/ner/" target="_blank" rel="noopener noreferrer">{' '} CoNLL-2003 {' '}</a>
    <span>
      NER dataset. It is not state of the art on that task, but it&#39;s not terrible either.
      (This is also the model constructed in our
    </span>
    <a href = "https://github.com/allenai/allennlp/blob/master/tutorials/getting_started/walk_through_allennlp/creating_a_model.md" target="_blank" rel="noopener noreferrer">{' '}Creating a Model{' '}</a>
    <span>
      tutorial.)
    </span>
  </span>
)

const descriptionEllipsed = (
  <span>
    The named entity recognition model identifies named entities (people, locations, organizations, and…
  </span>
)

const taskModels = [
  {
    name: "elmo-ner",
    desc: "Reimplementation of the NER model described in 'Deep<br/>contextualized word representations' by Peters, et. al."
  },
  {
    name: "fine-grained-ner",
    desc: "This Model identifies a broad range of 16 semantic types in the input text.<br/>This model is a reimplementation of Lample (2016) and uses a biLSTM<br/>with a CRF layer, character embeddings and ELMo embeddings. It was<br/>trained on the Ontonotes 5.0 dataset, and has dev set F1 of 88.2."
  }
]

const taskEndpoints = {
  "elmo-ner": "named-entity-recognition",
  "fine-grained-ner": "fine-grained-named-entity-recognition"
};

const fields = [
    {name: "sentence", label: "Sentence", type: "TEXT_INPUT",
     placeholder: `E.g. "John likes and Bill hates ice cream."`},
    {name: "model", label: "Model", type: "RADIO", options: taskModels, optional: true}
]

const TokenSpan = ({ token }) => {
    // Lookup table for entity style values:
    const entityLookup = {
      "PER": {
        tooltip: "Person",
        color: "pink"
      },
      "LOC": {
        tooltip: "Location",
        color: "green"
      },
      "ORG": {
        tooltip: "Organization",
        color: "blue"
      },
      "MISC": {
        tooltip: "Miscellaneous",
        color: "gray"
      },
      "PERSON": {
        tooltip: "Person",
        color: "pink"
      },
      "CARDINAL": {
        tooltip: "Cardinal Number",
        color: "orange"
      },
      "EVENT": {
        tooltip: "Event",
        color: "green"
      },
      "DATE": {
        tooltip: "Date",
        color: "fuchsia"
      },
      "FAC": {
        tooltip: "Facility",
        color: "cobalt"
      },
      "GPE": {
        tooltip: "Country/City/State",
        color: "teal"
      },
      "LANGUAGE": {
        tooltip: "Language",
        color: "red"
      },
      "LAW": {
        tooltip: "Law",
        color: "brown"
      },
      // LOC - see above
      "MONEY": {
        tooltip: "Monetary Value",
        color: "orange"
      },
      "NORP": {
        tooltip: "Nationalities, Religious/Political Groups",
        color: "green"
      },
      "ORDINAL": {
        tooltip: "Ordinal Value",
        color: "orange"
      },
      // ORG - see above.
      "PERCENT": {
        tooltip: "Percentage",
        color: "orange"
      },
      "PRODUCT": {
        tooltip: "Product",
        color: "purple"
      },
      "QUANTITY": {
        tooltip: "Quantity",
        color: "orange"
      },
      "TIME": {
        tooltip: "Time",
        color: "fuchsia"
      },
      "WORK_OF_ART": {
        tooltip: "Work of Art/Media",
        color: "tan"
      },
    }

    const entity = token.entity;

    if (entity !== null) { // If token has entity value:
      // Display entity text wrapped in a <Highlight /> component.
      return (<Highlight label={entity} color={entityLookup[entity].color} tooltip={entityLookup[entity].tooltip}>{token.text} </Highlight>);
    } else { // If no entity:
      // Display raw text.
      return (<span>{token.text} </span>);
    }
}
const ColorizedToken = styled.span`
  background-color: ${props => props.backgroundColor};
  padding: 1px;
  margin: 1px;
  display: inline-block;
  border-radius: 3px;
`;
function postprocess(org,perturbed_data) 
{
  let result_string = []
  let result_string3 = []
  for (let i=0; i<perturbed_data.length; i++) {
    let result_string2 = []
    console.log(org)
    var obj = ''
    var data = perturbed_data[i]
    for (let idx=0; idx<org.length; idx++) {
      obj = org[idx]
      if (obj !== data[idx])
      {
        console.log(obj,data[idx])
        result_string.push(
          <ColorizedToken backgroundColor={"transparent"}
          key={idx}>{obj} </ColorizedToken>)
          result_string2.push(
            <ColorizedToken backgroundColor={"green"}
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
    result_string3.push(result_string2)
}
  
  return [result_string,result_string3]
}
// const AttackOut = ({ formattedTokens, attackData }) => {
//   console.log(formattedTokens)
//   let sentences = []
//   if (attackData === undefined) {
//     return (<span> </span>);
//   }
//   else{
//     for (let idx=0; idx<attackData["final"].length; idx++)
//     {
//       sentences.push(attackData["final"][idx].join(" "))
//     }
    
//   }
//   return (
//     <div>
//     {sentences.map((s) => <p>{s}</p>)}
//     </div>
//   );
// }
const Output = ({ attackModel,requestData,responseData,attackData,attackData2,attackModel2 }) => {
    const { words, tags } = responseData

    // "B" = "Beginning" (first token in a sequence of tokens comprising an entity)
    // "I" = "Inside" (token in a sequence of tokens (that isn't first or last in its sequence) comprising an entity)
    // "L" = "Last" (last token in a sequence of tokens comprising an entity)
    // "O" = "Outside" (token that isn't associated with any entities)
    // "U" = "Unit" (A single token representing a single entity)

    // Defining an empty array for building a list of formatted token objects.
    let formattedTokens = [];
    // Defining an empty string to store temporary span text (this field is used to build up the entire text in a single BIL span).
    let spanStr = "";
    // Iterate through array of tags from response data.
    tags.forEach(function (tag, i) {
      // Defining an empty object to store temporary token data.
      let tokenObj = {};
      if (tag === "O") { // If this tag is not part of an entity:
        // Build token object using this token's word and set entity to null.
        tokenObj = {
          text: words[i],
          entity: null
        }
        // Append array of formatted token objects with this token object.
        formattedTokens.push(tokenObj);
      } else if (tag[0] === "U") { // If this tag is a unit token:
        // Build token object using this token's word and entity.
        tokenObj = {
          text: words[i],
          entity: tag.slice(2) // tag value with "U-" stripped from the beginning
        }
        // Append array of formatted token objects with this token object.
        formattedTokens.push(tokenObj);
      } else if (tag[0] === "B") { // If this tag is beginning of a span:
        // Reset span string to current token's word.
        spanStr = `${words[i]}`;
      } else if (tag[0] === "I") { // If this tag is inside a span:
        // Append current word to span string w/ space at beginning.
        spanStr += ` ${words[i]} `;
      } else if (tag[0] === "L") { // If this tag is last in a span:
        // Append current word to span string w/ space at beginning.
        spanStr += ` ${words[i]}`;
        // Build token object using final span string and entity tag for this token.
        tokenObj = {
          text: spanStr,
          entity: tag.slice(2) // tag value with "L-" stripped from the beginning
        }
        // Append array of formatted token objects with this token object.
        formattedTokens.push(tokenObj);
      }
    });
    
    let relevantTokens = []
    formattedTokens.forEach(token => {
      if (token.entity !== null) {
        relevantTokens.push(token)
      }
    })

    var attack_visual = '';
    var attack_visual2 = '';
    var attack_visual_og = '';
    var attack_visual2_og = '';
    if (attackData === undefined) {
      attack_visual = " "
    }
    else{
      let reducedInputs = []
      for (let idx=0; idx<attackData["final"].length; idx++)
      {
        reducedInputs.push(
        <div key={idx} style={{ display: "flex", flexWrap: "wrap" }}>
          <p style={{ padding: "2px", margin: "3px" }}><strong>Reduced input for</strong></p>
          <TokenSpan key={idx} token={relevantTokens[idx]} />
          {attackData["final"][idx].join(" ")}
          <br />
        </div>
    )
      }
      attack_visual = reducedInputs
      attack_visual_og = attackData["original"].join(" ")
      console.log("yeet");
      console.log(formattedTokens);
      console.log(attack_visual);
    }

    if (attackData2 === undefined) {
      attack_visual2 = " "
    }
    else{
      //attack_visual2= attackData2["final"].join(" ")
      //var original = attackData2["original"]
      console.log("attackData2",attackData2)
      var [first,second] = postprocess(attackData2["original"],attackData2["final"])
      attack_visual2 = second
      attack_visual2_og = first
      console.log("attack_visual2",attack_visual2)
      console.log(attack_visual2_og)
    }
    return (
      
      <div className="model__content model__content--ner-output">
        <div className="form__field">
          <HighlightContainer layout="bottom-labels">
            {formattedTokens.map((token, i) => <TokenSpan key={i} token={token} />)}
          </HighlightContainer>
        </div>
        <OutputField>
          <Accordion accordion={false}>
                <AccordionItem expanded={true}>
                <AccordionItemTitle>
                Input Reduction
                  <div className="accordion__arrow" role="presentation"/>
                </AccordionItemTitle>
                <AccordionItemBody>                  
                  <p> <a href="https://arxiv.org/abs/1804.07781" target="_blank">Input Reduction</a> removes as many words from the input as possible without changing the model's prediction.</p>              
                  {attack_visual != " " ? <p>{attack_visual}</p> : <p style={{color: "#7c7c7c"}}>Press "reduce input" to run Input Reduction.</p>}                    
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
            <p> <a href="https://arxiv.org/abs/1712.06751" target="_blank">HotFlip</a> flips words in the question to change the model's prediction. We iteratively flip the word with the highest gradient until the prediction changes.</p>                                            
                  {attack_visual2 != " " ? <p><strong>Flipped Inputs:</strong> {attack_visual2}</p> : <p style={{color: "#7c7c7c"}}>Press "flip words" to run HotFlip.</p>}                      
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


    )
}

const examples = [
    "AllenNLP is a PyTorch-based natural language processing library developed at the Allen Institute for Artificial Intelligence in Seattle.",
    "Did Uriah honestly think he could beat The Legend of Zelda in under three hours?",
    "Michael Jordan is a professor at Berkeley.",
    "My preferred candidate is Cary Moon, but she won't be the next mayor of Seattle.",
    "If you like Paul McCartney you should listen to the first Wings album.",
    "When I told John that I wanted to move to Alaska, he warned me that I'd have trouble finding a Starbucks there."
  ].map(sentence => ({sentence, snippet: truncateText(sentence)}))

const apiUrl = ({model}) => {
    const selectedModel = model || (taskModels[0] && taskModels[0].name);
    const endpoint = taskEndpoints[selectedModel]
    return `${API_ROOT}/predict/${endpoint}`
}

const modelProps = {apiUrl, attackapiUrl,attackapiUrl2,title, description, descriptionEllipsed, fields, examples, Output}

export default withRouter(props => <Model {...props} {...modelProps}/>)
