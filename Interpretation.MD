# Adding a New Interpretation or Attack Method

Below are the steps to add a new interpretation/attack method and the corresponding front-end visualization.

We will walk through adding the [SmoothGrad](https://arxiv.org/abs/1706.03825) gradient-based interpretation method from scratch. We will first modify the [AllenNLP repo](https://github.com/allenai/allennlp) to create the interpretation method. Then, we will  modify the [AllenNLP Demo repo](https://github.com/allenai/allennlp-demo) to create the front end visualization.

## Instructions
1. Fork and clone [AllenNLP from source](https://github.com/allenai/allennlp#installing-from-source), so the library is editable.

2. The interpretations live inside `allennlp/interpretation`. Create a new file for your interpretation method inside that folder, e.g., `allennlp/interpretation/smooth_gradient.py`. Now, write the code for your interpretation method. In SmoothGrad's case, we compute the gradient averaged over many noisy versions of the input. We began by copying the integrated_gradient file at `allennlp/interpretation/integrated_gradient.py` and modifying accordingly. You can see the final code with a commented walkthrough [TODO link here](TODOlink).

3. Add your new function to the `__init__.py` file in  `allennlp/interpretation/__init__.py`. In our case we add the line `from allennlp.interpretation.smooth_gradient import SmoothGradient`. 

4. You are done with the interpretation method, let's move on to the front-end. We will demonstrate adding SmoothGrad to the Sentiment Analysis demo. First, fork and clone the allennlp-demo repo. 

5. In `app.py`, you need to register the Interpreter for Smoothgrad. Add the two lines: 
```
smooth_gradient_interpreter = Interpreter.by_name('smooth-gradient-interpreter')(predictor)
app.interpreters[name]['smooth-gradient-interpreter'] = smooth_gradient_interpreter
```
in the `make_app()` function.

6. Add the front end message for SmoothGrad into the shared interpretation component [here](https://github.com/IsThatYou/allennlp-demo/blob/attack_demo/demo/src/components/Interpretation.js).