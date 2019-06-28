# Add A New Model to Be Analyzed

The following describes the steps to add a new [AllenNLP](https://github.com/allenai/allennlp) model to the online AllenNLP demo, as well adding interpretations, attacks, and analysis.

To begin, we assume you have an AllenNLP model with the code for the model in `allennlp/models/`. You will first need to create a AllenNLP Predictor for your model in `allennlp/predictor`. The predictor must include a function `predictions_to_labeled_instances`. This function will convert the model's output (e.g., class probabilities) into a predicted label. For example, in classification this function takes the argmax of the class probabilities. [Here](https://github.com/IsThatYou/allennlp/blob/re_attacks/allennlp/predictors/sentiment_analysis.py) is an example predictor for a Sentiment Analysis model.

With the predictor set up, we will now consider two possible scenarios. 1.) You want to demo a model for a task that is already available in the demos (e.g., a new textual entailment model). 2.) You are considering a new task that is not in the demos (e.g., say Sentiment Analysis is not present in the demo). 

## New Model for Existing Task

Adding a new model for a task that exists in the demos is a one line change of code. 

1. Fork and clone [allennlp-demo](https://github.com/allenai/allennlp-demo) and follow the installation instructions.

2. Modify the line that points to the saved model in `server/models.py`. For example, we can replace the link to the current textual entailment model `https://s3-us-west-2.amazonaws.com/allennlp/models/decomposable-attention-2017.09.04.tar.gz` with the path to another archived AllenNLP model `my_model.tar.gz`. If you run the demo, you should now see your model and the corresponding interpretations.

## New Task

If your task is not implemented in AllenNLP demos, we will need to create the back end code (about 5 lines) to run the model predictions, as well as the front end JavaScript/HTML to display its predictions and interpretations. We will use Sentiment Analysis as a running example.

1. Fork and clone [allennlp-demo](https://github.com/allenai/allennlp-demo) and follow the installation instructions.

2. Add the path to your trained model using a `DemoModel` in `server/models.py`. For example, we will add 
```
        'sentiment-analysis': DemoModel(
                'my_sentiment_model.tar.gz',
                'sentiment-analysis',
                1000
        ),   
```
, where 1000 is the limit on input length. Make sure `sentiment-analysis` matches the name from your AllenNLP predictor. In our case, the predictor should have `@Predictor.register('sentiment-analysis')`. 

3. In `app.py` consider adding logging of your model's outputs. Search for `log_blob` in the `predict` function. Also, specify the name of the input you want to attack/interpret. For example, in Reading Comprehension there is a paragraph and a question, and you should specify which you want to modify. Add this to the `inputs_to_interpret` map using the name from your predictor, e.g., `tokens` for sentiment analysis.

4. The backend is now set up. Now let's create the front end for your model. Add a line for your model in `demo/src/model.js`. Also make sure to import your component at the top of the file.

5. Create a new JavaScript file for your model in `demo/src/components/demo`. The JavaScript follows a basic template that can be copied from other files. See [this](https://github.com/allenai/allennlp-demo/blob/master/demo/ADDING_A_DEMO.md) for a guide on what the individual components do. We have created reusable components for gradient-based interpretations, attacks, etc. For example, the four lines below create dropdowns for Input Reduction, HotFlip, gradient-based interpretations, and integrated gradients. 
```
<InputReductionItem attackDataObject={attackData} attackModelObject={attackModel} requestDataObject={requestData}/>                              
<HotflipItem attackDataObject2={attackData2} attackModelObject2={attackModel2} requestDataObject2={requestData}/>                             
<InterpretationSingleInput interpretData={interpretData} tokens={tokens} interpretModel = {interpretModel} requestData = {requestData} interpreter={GRAD_INTERPRETER}/>        
<InterpretationSingleInput interpretData={interpretData} tokens={tokens} interpretModel = {interpretModel} requestData = {requestData} interpreter={IG_INTERPRETER}/>        
```
See the [Sentiment Analysis front end](https://github.com/IsThatYou/allennlp-demo/blob/attack_demo/demo/src/components/demos/SentimentAnalysis.js) for an example template with interpretations. 
