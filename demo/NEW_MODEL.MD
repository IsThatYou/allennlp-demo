# Add a New Model to Be Analyzed

The following describes the steps to add a new [AllenNLP](https://github.com/allenai/allennlp) model to the online [AllenNLP demo](https://demo.allennlp.org), as well adding analysis methods (interpretations and attacks) for that model.

To begin, we assume you have an AllenNLP model with the code for the model in `allennlp/models/`. First, create an AllenNLP Predictor for your model in `allennlp/predictors`. A good template to start with would be the [Sentiment Analysis predictor](https://github.com/IsThatYou/allennlp/blob/re_attacks/allennlp/predictors/sentiment_analysis.py). The predictor should include a function `predictions_to_labeled_instances` if you want to be able to have interpretations and attacks. This function will convert the model's output (e.g., class probabilities) into a predicted label and add this label to the instance passed in. For example, for classification this function takes the argmax of the class probabilities. [Here](https://github.com/IsThatYou/allennlp/blob/re_attacks/allennlp/predictors/sentiment_analysis.py) is an example predictor for a Sentiment Analysis model with the `predictions_to_labeled_instances` function.

With the predictor set up, we will now consider two possible scenarios: 

1. The task your model solves is already available in the demos (e.g., adding a new textual entailment model). 

2. You are creating a demo for a task that is not in the demos (below we pretend Sentiment Analysis is not present in the demo to illustrate this process). 

## Adding a New Model for an Existing Task

Adding a new model for a task that exists in the demos is a one line change of code: 

1. Fork and clone [allennlp-demo](https://github.com/allenai/allennlp-demo) and follow the installation instructions.

2. Modify the line that points to the saved model in `server/models.py`. For example, we can replace the link to the current textual entailment model `https://s3-us-west-2.amazonaws.com/allennlp/models/decomposable-attention-2017.09.04.tar.gz` with the path to another archived AllenNLP model `my_model.tar.gz`. Note that if you specify a relative path to the gzip file, the path should start from the root directory of the project (the directory with `app.py` in it). If you run the demo now, you should see your model and the corresponding interpretations and attacks visualized.

## Creating a Demo for a New Task

If your task is not implemented in the AllenNLP demos, we will need to create the backend code (about 5 lines) to run the model predictions, as well as the front-end JavaScript/HTML to display its predictions and interpretations. We will use Sentiment Analysis as a running example.

1. Fork and clone [allennlp-demo](https://github.com/allenai/allennlp-demo) and follow the installation instructions.

2. Add the path to your trained model using a `DemoModel` in `server/models.py`. For example, we will add 
```py
        'sentiment-analysis': DemoModel(
                'my_sentiment_model.tar.gz',
                'sentiment-analysis',
                1000
        ),   
```
where 1000 is the limit on input length. Make sure `sentiment-analysis` matches the name from your AllenNLP predictor. In our case, the predictor class should have `@Predictor.register('sentiment-analysis')`. 

3. In `app.py` consider adding logging of your model's outputs. Search for `log_blob` in the `predict` route for an example of how to do this. Furthermore, for attacks, specify the name of the input you want to attack. For example, in Reading Comprehension there is a paragraph and a question, and you should specify which you want to modify. Add this to the `inputs_to_attack` map ([here](https://github.com/IsThatYou/allennlp-demo/blob/attack_demo/app.py#L207) and [here](https://github.com/IsThatYou/allennlp-demo/blob/attack_demo/app.py#L232)) using the name from your predictor (e.g., `tokens` for sentiment analysis).

4. The backend is now set up. Now let's create the front end for your model. Add your model under the fitting category in the `modelGroups` object in `demo/src/models.js`. Also make sure to import your component at the top of the file.

5. Create a new JavaScript file for your model in `demo/src/components/demo`. The JavaScript follows a basic template that can be copied from other files. See the [Sentiment Analysis front end](https://github.com/IsThatYou/allennlp-demo/blob/attack_demo/demo/src/components/demos/SentimentAnalysis.js) for an example template with interpretations. 

We have created reusable components for gradient-based interpretations, attacks, etc. For example, the four lines below create dropdowns for Input Reduction, HotFlip, gradient-based interpretations, and integrated gradients. 
```js
<InputReductionItem attackDataObject={attackData} attackModelObject={attackModel} requestDataObject={requestData}/>                              
<HotflipItem attackDataObject2={attackData2} attackModelObject2={attackModel2} requestDataObject2={requestData}/>                             
<InterpretationSingleInput interpretData={interpretData} tokens={tokens} interpretModel = {interpretModel} requestData = {requestData} interpreter={GRAD_INTERPRETER}/>        
<InterpretationSingleInput interpretData={interpretData} tokens={tokens} interpretModel = {interpretModel} requestData = {requestData} interpreter={IG_INTERPRETER}/>        
```

where: 
- `attackData` contains the original and final tokens after Input Reduction is applied 
- `attackModel` is a is a method on the [Model class](https://github.com/IsThatYou/allennlp-demo/blob/attack_demo/demo/src/components/Model.js) that sends a request to the allennlp API for an Input Reduction attack
- `attackData2` contains the original and final input after HotFlip is applied. It also contains the new prediction of the model for the flipped input. 
- `attackModel2` is a method on the [Model class](https://github.com/IsThatYou/allennlp-demo/blob/attack_demo/demo/src/components/Model.js) that sends a request to the allennlp API for a HotFlip attack
- `requestData` contains the raw (not tokenized) input(s) to the model and the interpreter to use
- `interpretData` contains the values of the normalized saliency scores for the input tokens
- `tokens` are the input tokens of the model
- `interpretModel` is a method on the [Model class](https://github.com/IsThatYou/allennlp-demo/blob/attack_demo/demo/src/components/Model.js) that sends a request to the allennlp API to interpret the model (using a technique specified in the request)

You can find more information about the front end creation [here](https://github.com/IsThatYou/allennlp-demo/blob/attack_demo/demo/FRONT_END.md).
