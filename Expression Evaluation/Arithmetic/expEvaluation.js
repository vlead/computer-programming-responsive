window.view = {
	operator: 'arithmatic',
	disableElement: function(Id) {
		document.getElementById(Id).disabled = true;
	},
	enableElement: function(Id) {
		document.getElementById(Id).disabled = false;
	},
	changeClass: function(id, className) {
		document.getElementById(id).className = className
	},
	setEnvironment: function( a, b, c, d, environment, expression) {
		document.getElementById('a').value = a
		document.getElementById('b').value = b
		document.getElementById('c').value = c
		document.getElementById('d').value = d
		this.operator = environment
		document.getElementById('selectedExpression').value = expression	
		if ( environment === 'logical' ) {
			document.getElementById('arithmaticExpressions').className += ' hide'
			document.getElementById('logicalExpressions').className = 'button loopList'
			document.getElementById('bitwiseExpressions').className += ' hide'
		}
		else if ( environment === 'arithmatic' ) {
			document.getElementById('arithmaticExpressions').className = 'button loopList'
			document.getElementById('logicalExpressions').className += ' hide'
			document.getElementById('bitwiseExpressions').className += ' hide'
		}
		else {
			document.getElementById('arithmaticExpressions').className += ' hide'
			document.getElementById('logicalExpressions').className += ' hide'
			document.getElementById('bitwiseExpressions').className = 'button loopList'	
		}
	},
	setOperatorEnvironment: function() {
		var list = document.getElementById('operatorList')
		var selectedOption = list.options[list.selectedIndex].text
		if ( selectedOption === 'Logical' )
			this.setEnvironment( 0, 1, 0, 1, 'logical', 'a || b && c' )
		else if ( selectedOption === 'Bitwise' )
			this.setEnvironment( 3, 2, 0, 1, 'bitwise', 'a | b & c ^ d' )
		else
			this.setEnvironment( 2, 5, 10, 11, 'arithmatic', 'a + b - c' )
	},
	setSelectedEquation: function(id) {
		var list = document.getElementById(id)
		var selectedOption = list.options[list.selectedIndex].text
		document.getElementById('selectedExpression').value = selectedOption
	},
	addClickEvent: function(id, method) {
		var element = document.getElementById(id)
		element.addEventListener('click', method, false)
	},
	addChangeEvent: function(id, method) {
		var element = document.getElementById(id)
		element.addEventListener('change', method, false)
	},
	freezeInputs: function() {
		this.disableElement('a')
		this.disableElement('b')
		this.disableElement('c')
		this.disableElement('d')
		document.getElementById('buttonSave').className += ' hide'
		document.getElementById('buttonEdit').className = 'button editButton'
	},
	deFreezeInputs: function() {
		this.enableElement('a')
		this.enableElement('b')
		this.enableElement('c')
		this.enableElement('d')
		document.getElementById('buttonEdit').className += ' hide'
		document.getElementById('buttonSave').className = 'button saveButton'
	},
	killWhiteSpaces: function(expression) {
			return expression.replace(/\s+/g, '')
	},
	// validateBothEnds: function(equation) {
	// 	var opertorPattern = /[^+-\/\*%]/
	// 	var charPattern = /[abcd()]/
	// 	var openBracketPattern = /[(]/
	// 	var closeBracketPattern = /[)]/	
	// 	var res = opertorPattern.test(equation[0]) && opertorPattern.test(equation[equation.length - 1])
	// 	var res1 = charPattern.test(equation[0]) && charPattern.test(equation[equation.length - 1])
	// 	var res2 = openBracketPattern.test(equation[0]) && closeBracketPattern.test(equation[equation.length - 1])
	// 	try {
	// 		if ( !res ) throw 'LOL !!!!!!!\nSyntax Error !!'
	// 		if ( !res2 ) throw 'LOL !!!!!!!\nSyntax Error !!'	
	// 		if ( !res1 ) throw 'Wrong Expression Entered !!! \n Only ( a, b, c, d ) characters and ( +, -, /, %, *,() ) operators are allowed!!!'
	// 		else return true
	// 	}
	// 	catch (err) {
	// 		alert(err) 
	// 		return false
	// 	}
	// },
	validateWholeExpression: function(exp) {
			exp = this.killWhiteSpaces(exp)
			for ( var i = 0 ; i < exp.length ; i++ ) {
				if ( exp[i] !== 'a' && exp[i] !== 'b' && exp[i] !== 'c' && exp[i] !== 'd' && exp[i] !== '*' && exp[i] !== '/' && 
				     exp[i] !== '+' && exp[i] !== '-' &&  exp[i] !== '(' && exp[i] !== ')' && exp[i] !== '%') {
					alert("\t\tYou Entered Wrong Expression . \n\n Only  \" a b c d \"  characters  and \" * / - + ( ) % \" operators are allowed  ")
					return false
				}
			}
			var characterOrOperator = 0 // what should be the next char? ( 0 => next should be char and 1 => next should be operator )
						// i.e 0 => last seen was OPERATOR  and 1 => last seen was CHARACTER 

			var braces = 0 // +1 is done each time "(" is seen and -1 is done each time ")" is seen .
						//  If count_brases goes to -Ve at any instant then WRONG EXP 
						// If the final value of the braces  != 0  then WRONG EXP 

			for ( var i = 0 ; i < exp.length ; i++ ) {
				if ( exp[i] === '(') {
					if ( characterOrOperator === 1 ) { // If the previous seen is CHARACTER  then WRONG  
						alert("Wrong use of \"()\" operator .\n ")
						return false // Cases eg :    1 (+ 3)
					}
					braces ++
				}
				else if ( exp[i] == ')') {
					if ( characterOrOperator == 0 ) { // If the previous seen is OPERATOR   then WRONG 
						alert("Wrong use of \"()\" operator .\n ")
						return false // Cases Eg :   1+ 3 + ( 4 + 6 + ) 0
					}
					braces --
				}
				else if ( exp[i] === 'a' || exp[i] === 'b' || exp[i] === 'c' || exp[i] === 'd' ) {
					if ( characterOrOperator === 1 ) {
						alert("You Have Entered  Wrong Expression Syntax .\n ")
						return false // Because expected is Operator NOT character 
					}
					else
						characterOrOperator = 1
				}
				else { // If Operator + - / * % are seen 
					if ( characterOrOperator === 0 ) {
						alert("You Have Entered  Wrong Expression Syntax .\n ")
						return false // Because expected is  character  NOT Operator 
					}
					else
						characterOrOperator = 0
				}

				if ( braces < 0 ) {
					alert("You Have Entered  Wrong Expression Syntax for \"()\" operator .\n ")
					return false // FOR the cases like : )a+b(
				}
			}
			if ( braces !== 0 ) {
				alert("You Have Entered  Wrong Expression Syntax .\n\n \"()\" operators are not complete. ")
				return false
			}
			else if ( characterOrOperator === 0 ) {
					alert("You Have Entered  Wrong Expression Syntax .\n ")
					return false // Because expected is  character  NOT Operator i.e. a + b -c / 
			}
			else 
				return true
	},
	validateExpression: function() {
		var expression = document.getElementById('selectedExpression').value
		var a = this.validateWholeExpression(expression)
		if ( a === true )
			alert('Bingo!!!')
	},
	activateEvents: function() {
		this.addClickEvent('buttonSave', function() { view.freezeInputs() })
		this.addClickEvent('buttonEdit', function() { view.deFreezeInputs() })
		this.addClickEvent('buttonStart', function() { view.validateExpression() })
		this.addClickEvent('stopButton', function() { view.clickStopButton() })
		this.addClickEvent('nextButton', function() { view.clickNextButton() })
		this.addChangeEvent('operatorList', function() { view.setOperatorEnvironment() })
		this.addChangeEvent('arithmaticExpressions', function() { view.setSelectedEquation('arithmaticExpressions') })
		this.addChangeEvent('logicalExpressions', function() { view.setSelectedEquation('logicalExpressions') })
		this.addChangeEvent('bitwiseExpressions', function() { view.setSelectedEquation('bitwiseExpressions') })
	},
	init: function() {
		this.activateEvents()
	}
}

window.onload = function() { view.init() }