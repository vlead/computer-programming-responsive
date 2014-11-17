window.model = {
	calculation: function(expressions) {
	return eval(expressions)
	}
}
window.view = {
	childDivNo: 0,
	functionPrecedence: 0,	
	validationKey: 0,
	currentOperation: null,
	removeChild: function(id) {
		var element = document.getElementById(id);
		while( element.hasChildNodes() ){
    	element.removeChild(element.lastChild);
		}
	},
	checkValidation: function(input) {
		if(isNaN(input)===true) 
		{
			this.validationKey = this.validationKey + 1;
		}
	},
	inputValidation: function() {
		var valueOfA = document.getElementById("inputValueOfA").value
		this.checkValidation(valueOfA)
		var valueOfB = document.getElementById("inputValueOfB").value
		this.checkValidation(valueOfB)
		var valueOfC = document.getElementById("inputValueOfC").value
		this.checkValidation(valueOfC)
		var valueOfD = document.getElementById("inputValueOfD").value
		this.checkValidation(valueOfD)
	},
	expressionValidation: function(expression) {
		var expressionValidationKey = expression.match(/([e-z]|((\+|\-|\*|\/)\s){2,9}|((\&|\|){2,9})|((\<|\>){3,9})|(\<\>)|(\>\<)|\s(\<|\>)\s)/g);
		return expressionValidationKey;
	},
	resetVariables: function() {
		this.childDivNo = 0;
		this.validationKey = 0;
		this.functionPrecedence = 0;
		this.currentOperation = null;
		document.getElementById('currentStep').innerHTML = '';
	},
	resetValidationKey: function() {
		this.validationKey = 0;
	},
	resetButtons: function() {
		this.disableElement('nextButton');
		this.enableElement('textfieldExpression');
		this.enableElement('expressionsList');
		this.enableElement('editButton');
		this.changeClass('expressionsList', 'button loopList');
		this.changeClass('startButton', 'button startButton');
		this.changeClass('nextButton', 'buttonDisable nextButton');
		this.changeClass('stopButton', 'button stopButton hide');
		this.changeClass('editButton', 'button editButton');
	},
	getNextEvaluationStep: function(matches,expression) {
		var matchedExpression = matches
		var	evaluatedExpression = model.calculation(matches)
		this.currentOperation = matchedExpression+'&nbsp;=&nbsp;'+evaluatedExpression;
		expression = expression.replace(matchedExpression,evaluatedExpression)
		return expression;
	},
	disableElement: function(Id) {
		document.getElementById(Id).disabled = true;
	},
	enableElement: function(Id) {
		document.getElementById(Id).disabled = false;
	},
	changeClass: function(id, className) {
		document.getElementById(id).className = className
	},
	expressionSelection: function(expressionsList) {
		document.getElementById("textfieldExpression").value=expressionsList;
	},
	printCurrentOperation: function(expression) {
		document.getElementById("currentStep").innerHTML = expression;
	},
	messageDialogBox: function() {
		document.getElementById('modelBox').click();
	},
	getExpressionForBrackets: function(expression) {
		var newExpression = "";
		for (var i = 0; i < expression.length ; i++) {
			if(expression[i]=='(')
			{
				newExpression = '';
				newExpression = newExpression + expression[i];
			}
			else
			{
				newExpression = newExpression + expression[i];	
			}
			if(expression[i]==')')
				break;	
		};
		return newExpression;
	},
	getExpression: function() {
		var originalExpression = document.getElementById("textfieldExpression").value
		var properExpression =  this.changeToProperExpression(originalExpression)
		var expressionwithoutGapBetweenDisitAndOperater = this.removeGapBetweenDigitAndOperators(properExpression)
		var expressionwithoutAnyGap = this.removeGapBetweenLogicalOperators(expressionwithoutGapBetweenDisitAndOperater)
		var expressionWithAllValues = this.setValuesInExpression(expressionwithoutAnyGap)
		return expressionWithAllValues;
	},
	changeToProperExpression: function(originalExpression)
	{
		var expression = "";
		for (var i = 0; i < originalExpression.length ; i++) {
			expression = expression + originalExpression[i]+" ";
		};
		var properExpression = expression.replace(/\s+/g, ' ');
		return properExpression;
	},
	removeGapBetweenDigitAndOperators: function(expression) {
	var expressionSearch = expression.match(/(\+|\-|\*|\/)\s(\+|\-)\s\d/g);
	var p = 0;
	if(expressionSearch !== null)
	{
		while(p < expressionSearch.length) {
			var matches = expression.match(/(\+|\-|\*|\/)\s(\+|\-)\s\d/);
			var innerMatches = matches[0].match(/(\+|\-)\s\d/);
			var matchedExpression = innerMatches[0].replace(/\s/,'')
			var newExpression = matches[0].replace( innerMatches[0],matchedExpression)
			expression = expression.replace(matches[0],newExpression)
			p++;
		}
	}
	return expression;
	},
	removeGapBetweenLogicalOperators: function(expression) {
	var expressionSearch = expression.match(/(\<|\>)\s(\<|\>)/g);
	var p = 0;
	if(expressionSearch !== null)
	{
		while(p < expressionSearch.length) {
			var matches = expression.match(/(\<|\>)\s(\<|\>)/);
			var matchedExpression = matches[0].replace(/\s/,'')
			var expression = expression.replace( matches[0],matchedExpression)
			p++;
		}
	}
	return expression;
	},
	setValuesInExpression: function(expressionwithoutAnyGap) {
		var expressionWithValueOfA=expressionwithoutAnyGap.replace(/a/g,document.getElementById("inputValueOfA").value)
	 	var expressionWithValueOfAB=expressionWithValueOfA.replace(/b/g,document.getElementById("inputValueOfB").value)
	 	var expressionWithValueOfABC=expressionWithValueOfAB.replace(/c/g,document.getElementById("inputValueOfC").value)
	 	var expressionWithValueOfABCD=expressionWithValueOfABC.replace(/d/g,document.getElementById("inputValueOfD").value)
		return expressionWithValueOfABCD;
	},
	addChildExpression: function(displayValue) {
		var childDiv = document.createElement('div');
		if(this.childDivNo<1) {
			childDiv.textContent = "[ "+displayValue+" ]";
		}
		else
		{
			childDiv.textContent = displayValue;
		}	
		childDiv.id = 'childOfExpressionDivision'+this.childDivNo;
		childDiv.className = 'evaluationFlow';
		document.getElementById("expressionDivision").appendChild(childDiv);
	},
	addChildReasoning: function() {
		var childDiv = document.createElement('div');
		switch(this.functionPrecedence)
		{
		case 0:
			childDiv.textContent = '() is preferred over other Bitwise operators. Hence the operators inside the brackets is evaluated first and then following left to right rule'
		  break;
		case 1:
		  	childDiv.textContent = '& operater has higher preference over | and ^ operators and then following left to right rule.'
		  break;
		case 2:
			childDiv.textContent = '^ is preferred over | operators and then following left to right rule.'
		  break;
		case 3:
		  	childDiv.textContent = '| operater has higher preference over other remaining operators and then following left to right rule.'
		  break;
		case 4:
			childDiv.textContent = '<< is preferred over >> operatorsand and then following left to right rule.'
		  break;
		default:
		 	childDiv.textContent = '>> operater has higher preference over remaining bitwise operators and then following left to right rule.'
		}
		childDiv.id = 'childOfReasoningDivision'+this.childDivNo;
		childDiv.className = 'reasoningStep';
		document.getElementById("reasoningStep").appendChild(childDiv);
	},
	expressionEvaluationOfBrackets: function() {	
		var expression = document.getElementById("childOfExpressionDivision"+this.childDivNo).textContent;	
		var matches = expression.match(/\(/);
		if(matches!=null) 
		{	var newExpression = this.getExpressionForBrackets(expression)
			expression = this.getNextEvaluationStep(newExpression,expression)
		}
		else
		{
			this.functionPrecedence = this.functionPrecedence + 1;
			expression =  this.expressionEvaluationOfANDOperator()
		}
		return expression;
	},
	expressionEvaluationOfANDOperator: function() {	
		var expression = document.getElementById("childOfExpressionDivision"+this.childDivNo).textContent;	
		var matches = expression.match(/(\-\d+\.\d+|\+\d+\.\d+|\d+\.\d+|\.\d+|\-\d+|\+\d+|\d+)\s\&\s(\-\d+\.\d+|\+\d+\.\d+|\d+\.\d+|\.\d+|\-\d+|\+\d+|\d+)/);
		if(matches!=null)
		{
			expression = this.getNextEvaluationStep(matches[0],expression)
		}
		else
		{
			this.functionPrecedence = this.functionPrecedence + 1;
			expression =  this.expressionEvaluationOfXOROperator()
		}
		return expression;
	},
	expressionEvaluationOfXOROperator: function() {	
		var expression = document.getElementById("childOfExpressionDivision"+this.childDivNo).textContent;	
		var matches = expression.match(/(\-\d+\.\d+|\+\d+\.\d+|\d+\.\d+|\.\d+|\-\d+|\+\d+|\d+)\s\^\s(\-\d+\.\d+|\+\d+\.\d+|\d+\.\d+|\.\d+|\-\d+|\+\d+|\d+)/);
		if(matches!=null)
		{
			expression = this.getNextEvaluationStep(matches[0],expression)
		}
		else
		{
			this.functionPrecedence = this.functionPrecedence + 1;
			expression =  this.expressionEvaluationOfOROperator()
		}
		return expression;
	},
	expressionEvaluationOfOROperator: function() {	
		var expression = document.getElementById("childOfExpressionDivision"+this.childDivNo).textContent;	
		var matches = expression.match(/(\-\d+\.\d+|\+\d+\.\d+|\d+\.\d+|\.\d+|\-\d+|\+\d+|\d+)\s\|\s(\-\d+\.\d+|\+\d+\.\d+|\d+\.\d+|\.\d+|\-\d+|\+\d+|\d+)/);
		if(matches!=null)
		{
			expression = this.getNextEvaluationStep(matches[0],expression)
		}
		else
		{
			this.functionPrecedence = this.functionPrecedence + 1;
			expression =  this.expressionEvaluationOfLeftShiftOperator()
		}
		return expression;
	},
	expressionEvaluationOfLeftShiftOperator: function() {	
		var expression = document.getElementById("childOfExpressionDivision"+this.childDivNo).textContent;	
		var matches = expression.match(/(\-\d+\.\d+|\+\d+\.\d+|\d+\.\d+|\.\d+|\-\d+|\+\d+|\d+)\s\<\<\s(\-\d+\.\d+|\+\d+\.\d+|\d+\.\d+|\.\d+|\-\d+|\+\d+|\d+)/);
		if(matches!=null)
		{
			expression = this.getNextEvaluationStep(matches[0],expression)
		}
		else
		{
			this.functionPrecedence = this.functionPrecedence + 1;
			expression =  this.expressionEvaluationOfRightShiftOperator()
		}
		return expression;
	},
	expressionEvaluationOfRightShiftOperator: function() {	
		var expression = document.getElementById("childOfExpressionDivision"+this.childDivNo).textContent;	
		var matches = expression.match(/(\-\d+\.\d+|\+\d+\.\d+|\d+\.\d+|\.\d+|\-\d+|\+\d+|\d+)\s\>\>\s(\-\d+\.\d+|\+\d+\.\d+|\d+\.\d+|\.\d+|\-\d+|\+\d+|\d+)/);
		if(matches!=null) {
			expression = this.getNextEvaluationStep(matches[0],expression)
		}
		else
		{
			expression = 'null'
		}
		return expression;
	},
	expressionEvaluation: function() {	
		var expressionResult ;
		switch(this.functionPrecedence)
		{
		case 0:
		  expressionResult =  this.expressionEvaluationOfBrackets();
		  break;
		case 1:
		  expressionResult =  this.expressionEvaluationOfANDOperator();
		  break;	
		case 2:
		  expressionResult =  this.expressionEvaluationOfXOROperator();
		  break;		
		case 3:
		  expressionResult =  this.expressionEvaluationOfOROperator();
		  break;
		case 4:
		  expressionResult =  this.expressionEvaluationOfLeftShiftOperator();
		  break;		
		default:
		  expressionResult =  this.expressionEvaluationOfRightShiftOperator();
		}
		this.childDivNo = this.childDivNo + 1;
		return expressionResult;
	},
	addClickEvent: function(id, method) {
		var element = document.getElementById(id)
		element.addEventListener('click', method, false)
	},
	activateEvents: function() {
		this.addClickEvent('saveButton', function() { controller.saveInputValues() })
		this.addClickEvent('editButton', function() { controller.editInputValues() })
		this.addClickEvent('expressionsList', function() { view.expressionSelection(this.value) })
		this.addClickEvent('startButton', function() { controller.clickStartButton() })
		this.addClickEvent('stopButton', function() { controller.clickStopButton() })
		this.addClickEvent('nextButton', function() { controller.clickNextButton() })
	},
	init: function() {
		this.activateEvents()
	}
}

window.controller = {
	editInputValues: function() {
		view.enableElement('inputValueOfA');
		view.enableElement('inputValueOfB');
		view.enableElement('inputValueOfC');
		view.enableElement('inputValueOfD');
		view.disableElement('startButton');
		view.disableElement('expressionsList');
		view.disableElement('textfieldExpression');
		view.changeClass('startButton', 'buttonDisable startButton');
		view.changeClass('saveButton', 'button saveButton');
		view.changeClass('editButton', 'button editButton hide');
		view.changeClass('expressionsList', 'buttonDisable loopList');
	},
	saveInputValues: function() {
		view.inputValidation();
		if(view.validationKey>0)
		 {
			alert('Invalid input ! The values must be integer or float !');
			view.resetValidationKey();
		}
		else
		{
			view.disableElement('inputValueOfA');
			view.disableElement('inputValueOfB');
			view.disableElement('inputValueOfC');
			view.disableElement('inputValueOfD');
			view.enableElement('expressionsList');
			view.enableElement('textfieldExpression');
			view.enableElement('startButton');
			view.changeClass('expressionsList', 'button loopList');
			view.changeClass('startButton', 'button startButton');
			view.changeClass('saveButton', 'button saveButton hide');
			view.changeClass('editButton', 'button editButton');
		}
	},
	clickStopButton: function() {
		view.resetButtons();
		view.removeChild('expressionDivision');
		view.removeChild('reasoningStep');
		view.resetVariables();
	},
	clickStartButton: function() {
		var expressionToPrint = view.getExpression()
		var validationMetch = view.expressionValidation(expressionToPrint)
		if(validationMetch == null) {
			if(view.currentOperation!=null) {
				view.removeChild('expressionDivision');
				view.removeChild('reasoningStep');
				view.resetVariables();
			}
			view.enableElement('nextButton');
			view.disableElement('expressionsList');
			view.disableElement('textfieldExpression');
			view.disableElement('editButton');
			view.changeClass('expressionsList', 'buttonDisable loopList');
			view.changeClass('editButton', 'buttonDisable editButton');
			view.changeClass('startButton', 'button startButton hide');
			view.changeClass('stopButton', 'button stopButton');
			view.changeClass('nextButton', 'button nextButton');
			view.addChildExpression(expressionToPrint) 
		}
		else
		{
			alert('invalid expression!')
		}
	},
	clickNextButton: function() {
		var expressionOutputToDisplay = view.expressionEvaluation()	
		if(expressionOutputToDisplay!='null') {
			view.addChildExpression(expressionOutputToDisplay)	
			view.addChildReasoning()
			view.printCurrentOperation(view.currentOperation)
		}
		else
		{
			view.messageDialogBox();
			view.resetButtons();
		}
	}
}

window.onload = function() { view.init() }





