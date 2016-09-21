var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//Entry field with label
var InputField = React.createClass({
	//Set default value
	getInitialState: function () {
		return {
			//Works without || "", but complains about going from 'uncontrolled' value
			//to 'controlled' value if props.value is initially undefined
			value: this.props.value || "",
			checked: this.props["data-metawidgetAttributes"].checked || false
		};
	},

	//Handle change of value
	onChange: function (event) {
		this.setState({
			value: event.target.value,
			checked: event.target.checked
		});
	},

	render: function () {
		/*Could use defaultValue instead of value + onChange + state
     But then you couldn't get the new value?*/
		var field = React.createElement("input", {
			name: this.props.label,
			type: this.props.type,
			onChange: this.onChange,
			value: this.state.value,
			checked: this.state.checked,

			required: this.props["data-metawidgetAttributes"].required,
			placeholder: this.props["data-metawidgetAttributes"].placeholder,
			min: this.props["data-metawidgetAttributes"].min,
			max: this.props["data-metawidgetAttributes"].max
		});

		if (this.props.doLabel) {
			var fieldLabel = this.props.label;
			if (fieldLabel) {
				//http://stackoverflow.com/questions/5582228/insert-space-before-capital-letters
				//Seperate camelCase field names
				fieldLabel = fieldLabel.replace(/([A-Z])/g, ' $1').trim();
				fieldLabel = fieldLabel[0].toUpperCase() + fieldLabel.slice(1);

				field = React.createElement(
					"span",
					null,
					React.createElement(
						"label",
						{ htmlFor: fieldLabel },
						fieldLabel,
						": "
					),
					field
				);
			} else {
				field = React.createElement(
					"span",
					null,
					React.createElement(
						"label",
						{ htmlFor: this.props.label },
						this.props.label,
						": "
					),
					field
				);
			}
		}

		return field;
	}
});

//Entry field with label
var LargeTextInputField = React.createClass({
	//Set default value
	getInitialState: function () {
		return {
			//Works without || "", but complains about going from 'uncontrolled' value
			//to 'controlled' value if props.value is initially undefined
			value: this.props.value || ""
		};
	},

	//Handle change of value
	onChange: function (event) {
		this.setState({
			value: event.target.value
		});
	},

	render: function () {
		/*Could use defaultValue instead of value + onChange + state
     But then you couldn't get the new value?*/
		var field = React.createElement("textarea", {
			name: this.props.label,
			onChange: this.onChange,
			value: this.state.value,

			required: this.props["data-metawidgetAttributes"].required,
			placeholder: this.props["data-metawidgetAttributes"].placeholder,
			min: this.props["data-metawidgetAttributes"].min,
			max: this.props["data-metawidgetAttributes"].max
		});

		if (this.props.doLabel) {
			var fieldLabel = this.props.label;
			if (fieldLabel) {
				//http://stackoverflow.com/questions/5582228/insert-space-before-capital-letters
				//Seperate camelCase field names
				fieldLabel = fieldLabel.replace(/([A-Z])/g, ' $1').trim();
				fieldLabel = fieldLabel[0].toUpperCase() + fieldLabel.slice(1);

				field = React.createElement(
					"span",
					null,
					React.createElement(
						"label",
						{ htmlFor: fieldLabel },
						fieldLabel,
						": "
					),
					field
				);
			} else {
				field = React.createElement(
					"span",
					null,
					React.createElement(
						"label",
						{ htmlFor: this.props.label },
						this.props.label,
						": "
					),
					field
				);
			}
		}

		return field;
	}
});

var ReactTable = React.createClass({

	render: function () {
		var tr = [];
		var temprow = [];
		var inc = 0;
		for (var component in this.props.children) {
			var comp = this.props.children[component];
			var isWide = comp.props["data-metawidgetAttributes"] ? comp.props["data-metawidgetAttributes"].wide || comp.props["data-metawidgetAttributes"].large : false;
			var required = comp.props["data-metawidgetAttributes"] ? comp.props["data-metawidgetAttributes"].required : false;

			if (isWide) {
				if (temprow.length != 0) {
					//Have to use slice to copy array, otherwise it would continue
					//to be written to
					tr.push(React.createElement(
						"tr",
						{ key: tr.length },
						temprow.slice()
					));
					temprow.length = 0;
				}
			}

			//Add spaces to camelCase and make first letter capital
			var fieldLabel = comp.props.label;
			if (fieldLabel) {
				//http://stackoverflow.com/questions/5582228/insert-space-before-capital-letters
				//Seperate camelCase field names
				fieldLabel = fieldLabel.replace(/([A-Z])/g, ' $1').trim();
				fieldLabel = fieldLabel[0].toUpperCase() + fieldLabel.slice(1);

				temprow.push(React.createElement(
					"th",
					{ key: inc + 0.1 },
					React.createElement(
						"label",
						{ htmlFor: comp.props.label },
						fieldLabel
					),
					":"
				));
			}
			var colspan = 1;
			if (isWide) {
				colspan = this.props.numberOfColumns * 3 - temprow.length;
			}
			temprow.push(React.createElement(
				"td",
				{ colSpan: colspan, key: inc },
				comp
			));
			if (!isWide || required) {
				//Blank <td> on other cells somehow makes the * cell width fit to the character
				temprow.push(React.createElement(
					"td",
					{ key: inc + 0.2 },
					required ? "*" : ""
				));
			}

			inc++;

			if (inc % this.props.numberOfColumns == 0 || isWide) {
				//Have to use slice to copy array, otherwise it would continue
				//to be written to
				tr.push(React.createElement(
					"tr",
					{ key: tr.length },
					temprow.slice()
				));
				temprow.length = 0;
				inc = 0;
			}
		}
		if (temprow.length != 0) {
			tr.push(React.createElement(
				"tr",
				{ key: tr.length },
				temprow.slice()
			));
		}

		return React.createElement(
			"table",
			null,
			React.createElement(
				"tbody",
				null,
				tr
			)
		);
	}
});

/**
 * @class LayoutDecorator to decorate widgets from different sections using
 *        an HTML heading tag (i.e. <tt>h1</tt>, <tt>h2</tt> etc).
 */

var ReactHeadingTagLayoutDecorator = function (config) {

	if (!(this instanceof ReactHeadingTagLayoutDecorator)) {
		throw new Error('Constructor called as a function');
	}

	var _level = config !== undefined && config.level !== undefined ? config.level : 1;

	metawidget.layout.createFlatSectionLayoutDecorator(config, this, 'headingTagLayoutDecorator');

	this.addSectionWidget = function (section, level, attributes, container, mw) {

		var Element = "h" + (level + _level);
		var h1 = React.createElement(
			Element,
			{ key: a++, "data-metawidgetAttributes": { wide: true } },
			section
		);

		this.getDelegate().layoutWidget(h1, "property", {}, container, mw);
	};
};

var ReactWidgetBuilder = function (config) {

	if (!(this instanceof ReactWidgetBuilder)) {
		throw new Error('Constructor called as a function');
	}

	var doLabels = config !== undefined && config.doLabels !== undefined ? config.doLabels : true;

	this.buildWidget = function (elementName, attributes, mw) {

		if (metawidget.util.isTrueOrTrueString(attributes.hidden)) {
			return metawidget.util.createElement(mw, 'stub');
		}
		//console.log(attributes);
		if (attributes.type) {
			//This bit's copied from HtmlWidgetBuilder
			//Gets the value of the field in the schema
			//eg. name = Jerry Smith
			var typeAndNames = metawidget.util.splitPath(mw.path);
			var toInspect = metawidget.util.traversePath(mw.toInspect, typeAndNames.names);
			var fieldValue = toInspect[attributes.name] || attributes.value;

			var properties = {
				doLabel: doLabels,
				label: attributes.name,
				value: fieldValue,
				"data-metawidgetAttributes": attributes,
				key: a++ };
			if (attributes.type === "string") {
				if (attributes.large) {
					return React.createElement(LargeTextInputField, properties);
				} else if (attributes.masked) {
					return React.createElement(InputField, _extends({}, properties, {
						type: "password"
					}));
				} else {
					return React.createElement(InputField, _extends({}, properties, {
						type: "text"
					}));
				}
			} else if (attributes.type === "boolean") {
				return React.createElement(InputField, _extends({}, properties, {
					type: "checkbox"
				}));
			} else if (attributes.type === "color" || attributes.type === "colour") {
				return React.createElement(InputField, _extends({}, properties, {
					type: "color"
				}));
			} else if (attributes.type === "number" || attributes.type === "integer" || attributes.type === "float") {
				return React.createElement(InputField, _extends({}, properties, {
					type: "number"
				}));
			}
			return React.createElement(InputField, properties);
		}
	};
};

//Lazy unique key for each field
//Requirement by React to render from array
var a = 1;

var SimpleReactLayout = function () {
	//Array of widget elements
	//React then renders from this array
	this.components = [];

	//Collate elements into array
	this.layoutWidget = function (widget, elementName, attributes, container, mw) {
		//console.log(widget);
		if (React.isValidElement(widget)) this.components.push(widget);
	};

	//Render out the array of fields/widgets
	this.endContainerLayout = function (container, mw) {
		ReactDOM.render(
		//Have to surround with div, as there must be a main element for React
		React.createElement(
			"div",
			null,
			this.components
		), container);
	};
};

var bb = 0;
var TableReactLayout = function (config) {
	//Array of widget elements
	//React then renders from this array
	this.components = [];
	var _numberOfColumns = config !== undefined && config.numberOfColumns ? config.numberOfColumns : 1;

	//Collate elements into array
	this.layoutWidget = function (widget, elementName, attributes, container, mw) {
		//console.log(widget);
		if (React.isValidElement(widget)) this.components.push(widget);
		//Can be used to add raw html elements to the tree
		//Does not follow formatting rules though
		//since no information is known about the elements
		/*
  else
  {
  	var span = <div dangerouslySetInnerHTML={{__html: widget.outerHTML}}/>;
  	this.components.push(span);
  }
  */
	};

	//Render out the array of fields/widgets
	this.endContainerLayout = function (container, mw) {
		ReactDOM.render(
		//Have to surround with div, as there must be a main element for React
		React.createElement(
			ReactTable,
			{ numberOfColumns: _numberOfColumns },
			this.components
		), container);
	};
};
