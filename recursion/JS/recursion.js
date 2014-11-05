window.view = {
	S: 1,
	D: 2,
	T: 3,
	n: 0,
	callerFunction: 'none',
	lastRedDiv: new Object(),
	nextRedDiv: new Object(),
	disks: ['disk1', 'disk2', 'disk3', 'disk4', 'disk5'],
	highlightNextStep: function() {
		this.changeClass(this.lastRedDiv.id, 'showDiv')
		this.changeClass(this.nextRedDiv.id, 'showDivInRed')
	},
	getInput: function() {
		 var input = Number(document.getElementById('input').value)
		 if ( input === 0 )
		 	alert('Enter number of disks first !')
		 else if ( isNaN(input) === true )
			alert('Number of disks must be an integer value !')
		 else if ( input > 5 || input % 1 !== 0 )
			alert('Only integral value (Greater than equal to 1 and less than equal to 5) is accepted !')
		 else {
			this.disableElement('btnOk')
			this.enableElement('btnStart')
			this.disableElement('input')
			this.changeClass('btnOk', 'buttonDisable okButton')
			this.changeClass('btnStart', 'button startButton')
			this.n = input
			var elements = document.getElementById('1').childNodes
			for ( i = 0 ; i < input ; i++ )
				elements[i].className += ' ' + this.disks[i]
		}
	},
	changeClass: function(id, className) {
		document.getElementById(id).className = className
	},
	getLastHighlightedDiv: function() {
		var findClass = document.getElementsByClassName('showDivInRed')
		return findClass[0]
	},
	getNextDivToHighlight: function(lastHighlightedDiv) {
		var next = lastHighlightedDiv.nextSibling
		next = next.nextSibling
		return next
	},
	jumpTo: function(targetDivId) {
		var element = document.createElement('div')
		element.id = targetDivId
		return element
	},
	disableElement: function(buttonId) {
		document.getElementById(buttonId).disabled = true
	},
	enableElement: function(buttonId) {
		document.getElementById(buttonId).disabled = false
	},
	addClickEvent: function(id, method) {
		var element = document.getElementById(id)
		element.addEventListener('click', method, false)
	},
	showCode: function() {
		document.getElementById('code').className = 'codeLayout'
		this.changeClass('line1', 'showDivInRed')
		this.disableElement('btnStart')
		this.enableElement('btnNext')
		this.changeClass('btnStart', 'buttonDisable startButton')
		this.changeClass('btnNext', 'button nextButton')
	},
	setLocalVariables: function() {
		document.getElementById('s').innerHTML = '&nbsp;'  + ':' + '&emsp;&emsp;' + this.S
		document.getElementById('d').innerHTML = '&nbsp;'  + ':' + '&emsp;&emsp;' + this.D
		document.getElementById('t').innerHTML = '&nbsp;'  + ':' + '&emsp;&emsp;' + this.T
		document.getElementById('n').innerHTML = '&nbsp;'  + ':' + '&emsp;&emsp;' + this.n
	},
	swapTandD: function() {
		var temp = this.T
		this.T = this.D
		this.D = temp
		this.n --
	},
	swapSandT: function() {
		var temp = this.T
		this.T = this.S
		this.S = temp
		this.n --
	},
	moveDisksAround: function() {
		
	},
	executeCode: function() {
		this.lastRedDiv = this.getLastHighlightedDiv()
		this.nextRedDiv = this.getNextDivToHighlight(this.lastRedDiv)

		if ( this.lastRedDiv.id === 'line4' ) {
			this.nextRedDiv = this.jumpTo('line6')
			this.highlightNextStep()
			this.setLocalVariables()
		}
		else if ( this.lastRedDiv.id === 'line7' && this.n !== 1 ) {
			this.nextRedDiv = this.jumpTo('line10')
			this.highlightNextStep()
		}
		else if ( this.lastRedDiv.id === 'line8' ) {
			this.moveDisksAround()
			this.highlightNextStep()
		}
		else if ( this.lastRedDiv.id === 'line10' && this.callerFunction === 'none') {
			this.nextRedDiv = this.jumpTo('line6')
			this.highlightNextStep()
			this.swapTandD()
			this.setLocalVariables()
			if (this.n === 1)
				this.callerFunction = 'firstCaller'
		}
		else if ( this.lastRedDiv.id === 'line10' && this.callerFunction === 'firstCaller') {
			this.swapTandD()
			this.n = 2
			this.setLocalVariables()
			this.highlightNextStep()
		}
		else if ( this.lastRedDiv.id === 'line11' ) {
			this.moveDisksAround()
			this.highlightNextStep()
		}
		else if ( this.lastRedDiv.id === 'line12' ) {
			if ( this.callerFunction !== 'secondCaller' ) {
				this.nextRedDiv = this.jumpTo('line6')
				this.swapSandT()
				this.setLocalVariables()
				this.highlightNextStep()
				if (this.n === 1)
					this.callerFunction = 'secondCaller'
			}
		}
		else 
			this.highlightNextStep()
	},
	activateEvents: function() {
		this.addClickEvent('btnOk', function() { view.getInput() })
		this.addClickEvent('btnStart', function() { view.showCode() })
		this.addClickEvent('btnNext', function() { view.executeCode() })
	},
	init: function() {
		this.activateEvents()
	}
}
window.onload = function() { view.init() }