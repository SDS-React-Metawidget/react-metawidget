var DOMProperties = ["accept","acceptCharset","accessKey","action","allowFullScreen","allowTransparency","alt",
					 "async","autoComplete","autoFocus","autoPlay","capture","cellPadding","cellSpacing","challenge",
					 "charSet",/*"checked"*/,"cite","classID","className","colSpan","cols","content","contentEditable",
					 "contextMenu","controls","coords","crossOrigin","data","dateTime","default","defer","dir",
					 "disabled","download","draggable","encType","form","formAction","formEncType","formMethod",
					 "formNoValidate","formTarget","frameBorder","headers","height","hidden","high","href","hrefLang",
					 "htmlFor","httpEquiv","icon","id","inputMode","integrity","is","keyParams","keyType","kind","label",
					 "lang","list","loop","low","manifest","marginHeight","marginWidth","max","maxLength","media",
					 "mediaGroup","method","min","minLength","multiple","muted","name","noValidate","nonce","open",
					 "optimum","pattern","placeholder","poster","preload","profile","radioGroup","readOnly","rel",
					 "required","reversed","role","rowSpan","rows","sandbox","scope","scoped","scrolling","seamless",
					 "selected","shape","size","sizes","span","spellCheck","src","srcDoc","srcLang","srcSet","start","step",
					 "style","summary","tabIndex","target","title","type","useMap",/*"value"*/,"width","wmode","wrap"];
					 //Disallow "value" and "checked", as they are explicitly handled
					 
//Entry field with label
var InputField = React.createClass({
    //Set default value
    getInitialState: function () {
        return {
            //Works without || "", but complains about going from 'uncontrolled' value
            //to 'controlled' value if props.value is initially undefined
            value: this.props.value || "",
            checked: this.props.checked || false,
        };
    },

    //Handle change of value
    onChange: function (event) {
        this.setState({
            value: event.target.value,
            checked: event.target.checked,
        });

        if (this.props.callback && typeof this.props.callback === 'function')
            this.props.callback();
    },

    render: function () {
		var validProps = {};
		for(key in this.props)
		{
			if(DOMProperties.includes(key))
				validProps[key] = this.props[key];
		}
		
        /*Could use defaultValue instead of value + onChange + state
         But then you couldn't get the new value?*/
        var field = <input
            name={this.props.label}
            onChange={this.onChange}
            value={this.state.value}
            checked={this.state.checked}
			{...validProps}
        />;

        return (
            field
        );
    }
});

//Entry field with label
var TextAreaInput = React.createClass({
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
            value: event.target.value,
        });

        if (this.props.callback && typeof this.props.callback === 'function')
            this.props.callback();
    },

    render: function () {
		var validProps = {};
		for(key in this.props)
		{
			if(DOMProperties.includes(key))
				validProps[key] = this.props[key];
		}
		
        /*Could use defaultValue instead of value + onChange + state
         But then you couldn't get the new value?*/
        var field = <textarea
            name={this.props.label}
            onChange={this.onChange}
            value={this.state.value}
			{...validProps}
        />;

        return (
            field
        );
    }
});

var Select = React.createClass({
    render: function () {

        var t = this;
        var inc = 0;
        var options = this.props.options.map(function (selectOption) {
            return <option key={inc++}>{selectOption}</option>;
        });

        var field = <select>
            {options}
        </select>;

        return (
            field
        );
    }
});

var Radio = React.createClass({
    render: function () {

        var t = this;
        var inc = 0;
        var options = this.props.options.map(function (selectOption) {
            return <label key={inc++}>
                <input type="radio" name={t.props.label}/>
                {selectOption}
            </label>
        });

        var field = <span>
			{options}
		</span>;

        return (
            field
        );
    }
});

var Output = React.createClass({
    render: function () {
        var field = <output>
			{this.props.value}
		</output>;

        return (
            field
        );
    }
});

var MetaWidget = React.createClass({
    getInitialState: function () {
        return {
            toInspect: this.props.toInspect,
            config: this.props.config,
        };
    },

    render: function () {
        return <div ref={"metawidget"}/>
    },

    componentDidMount: function () {
        var mw = new metawidget.react.ReactMetawidget(this.refs.metawidget, this.state.config);

        mw.toInspect = this.state.toInspect;
        mw.buildWidgets();
    }
});

var metawidget = metawidget || {};

'use strict';

metawidget.react = metawidget.react || {}

metawidget.react.ReactMetawidget = function (element, config) {

    if (!( this instanceof metawidget.react.ReactMetawidget )) {
        throw new Error('Constructor called as a function');
    }

    var _overriddenNodes = [];

    while (element.childNodes.length > 0) {
        var childNode = element.childNodes[0];
        element.removeChild(childNode);

        if (childNode.nodeType === 1) {
            _overriddenNodes.push(childNode);
        }
    }

    var _pipeline = new metawidget.Pipeline(element);

    _pipeline.inspector = new metawidget.inspector.PropertyTypeInspector();
    _pipeline.widgetBuilder = new metawidget.widgetbuilder.CompositeWidgetBuilder([
        new metawidget.react.widgetbuilder.ReactWidgetBuilder({doLabels: false})]);
    _pipeline.widgetProcessors = [new metawidget.react.widgetprocessor.IdProcessor(), new metawidget.react.widgetprocessor.RequiredAttributeProcessor(),
        new metawidget.react.widgetprocessor.PlaceholderAttributeProcessor(), new metawidget.react.widgetprocessor.DisabledAttributeProcessor(),
        new metawidget.react.widgetprocessor.MaxLengthAttributeProcessor(), new metawidget.react.widgetprocessor.MaxAttributeProcessor(),
        new metawidget.react.widgetprocessor.MinAttributeProcessor(), new metawidget.react.widgetprocessor.ValueAttributeProcessor()];
    _pipeline.layout = new metawidget.react.layout.ReactRenderDecorator(new metawidget.layout.HeadingTagLayoutDecorator(new metawidget.layout.TableLayout({numberOfColumns: 2})));
    _pipeline.configure(config);

    this.inspect = function (toInspect, type, names) {
        return _pipeline.inspect(toInspect, type, names, this);
    };

    this.buildWidgets = function (inspectionResult) {
        // Defensive copy

        this.overriddenNodes = [];

        for (var loop = 0, length = _overriddenNodes.length; loop < length; loop++) {
            this.overriddenNodes.push(_overriddenNodes[loop].cloneNode(true));
        }

        // Inspect (if necessary)

        if (inspectionResult === undefined) {

            // Safeguard against improperly implementing:
            // http://blog.kennardconsulting.com/2013/02/metawidget-and-rest.html

            if (arguments.length > 0) {
                throw new Error("Calling buildWidgets( undefined ) may cause infinite loop. Check your argument, or pass no arguments instead");
            }

            var splitPath = metawidget.util.splitPath(this.path);
            inspectionResult = _pipeline.inspect(this.toInspect, splitPath.type, splitPath.names, this);
        }
			
			
        _pipeline.buildWidgets(inspectionResult, this);
    };

    this.clearWidgets = function () {

        var element = this.getElement();

        while (element.childNodes.length > 0) {
            element.removeChild(element.childNodes[0]);
        }
    };

    this.getElement = function () {

        return _pipeline.element;
    };

    this.buildNestedMetawidget = function (attributes, config) {

        // Create a 'div' not a 'metawidget', because whilst it's up to the
        // user what they want their top-level element to be, for browser
        // compatibility we should stick with something benign for nested
        // elements

        var nestedWidget = metawidget.util.createElement(this, 'div');

        // Duck-type our 'pipeline' as the 'config' of the nested
        // Metawidget. This neatly passes everything down, including a
        // decremented 'maximumInspectionDepth'

        var nestedMetawidget = new metawidget.react.ReactMetawidget(nestedWidget, [_pipeline, config]);
        nestedMetawidget.toInspect = this.toInspect;
        nestedMetawidget.path = metawidget.util.appendPath(attributes, this);
        nestedMetawidget.readOnly = this.readOnly || metawidget.util.isTrueOrTrueString(attributes.readOnly);
        nestedMetawidget.buildWidgets();

        return nestedWidget;
    };
}

metawidget.react.widgetbuilder = metawidget.react.widgetbuilder || {}

metawidget.react.widgetbuilder.ReactWidgetBuilder = function (config) {

    if (!( this instanceof metawidget.react.widgetbuilder.ReactWidgetBuilder )) {
        throw new Error('Constructor called as a function');
    }

    this.buildWidget = function (elementName, attributes, mw) {

        if (metawidget.util.isTrueOrTrueString(attributes.hidden)) {
            return metawidget.util.createElement(mw, 'stub');
        }
		//console.log(attributes);

        if (attributes.type) {
            //This bit's copied from HtmlWidgetBuilder
            //Gets the value of the field in the schema
            //eg. name = Jerry Smith
            //var typeAndNames = metawidget.util.splitPath(mw.path);
            //var toInspect = metawidget.util.traversePath(mw.toInspect, typeAndNames.names);
            //var fieldValue = toInspect[attributes.name] || attributes.value;

            var properties = {
                label: attributes.name,
                metawidgetAttributes: attributes,
				callback:function() {console.log("CALLBACK TRIGGERED")},
            };

            let elements = {
                textArea: {
                    parameters: {
                        type: (e) => e === 'string',
                        maxLength: (e) => e > 32
                    },
                    result: [TextAreaInput, {}]
                },
                textInput: {
                    parameters: {
                        type: (e) => e === 'string',
                        maxLength: (e) => !e || e <= 32
                    },
                    result: [
                        InputField,
                        {type: 'text'}
                    ]
                },
                checkbox: {
                    parameters: {
                        type: (e) => e === 'boolean'
                    },
                    result: [
                        InputField,
                        {type: 'checkbox'}
                    ]
                },
                color: {
                    parameters: {
                        type: (e) => e === 'color' || e === 'colour'
                    },
                    result: [
                        InputField,
                        {type: 'color'}
                    ]
                },
                date: {
                    parameters: {
                        type: (e) => e === 'date'
                    },
                    result: [
                        InputField,
                        {type: 'date'}
                    ]
                },
                time: {
                    parameters: {
                        type: (e) => e === 'time'
                    },
                    result: [
                        InputField,
                        {type: 'time'}
                    ]
                },
                number: {
                    parameters: {
                        type: (e) => e === 'number' || e === 'integer' || e === 'float'
                    },
                    result: [
                        InputField,
                        {type: 'number'}
                    ]
                },
                booleanRadio: {
                    parameters: {
                        type: (e) => e === 'boolean',
						componentType: (e) => e === 'radio'
                    },
                    result: [
                        Radio,
						{options:[true,false]}
                    ]
                },
                select: {
                    parameters: {
                        type: (e) => e === 'select',
						enum: (e) => e !== undefined
                    },
                    result: [
                        Select,
						{options:attributes["enum"]}
                    ]
                },
                radio: {
                    parameters: {
						componentType: (e) => e === 'radio'
                    },
                    result: [
                        Radio,
						{options:attributes["enum"]}
                    ]
                },
                rating: {
                    parameters: {
                        type: (e) => e === 'rating'
                    },
                    result: [Rating, {}]
                },
				output:{
                    parameters: {
                        readOnly: (e) => e === true
                    },
                    result: [Output, {}]
				}
            }

            let newType = Object.keys(elements).reduce((prev, element) => {
                for ( let param in elements[element].parameters ) {
                    if (!elements[element].parameters[param](attributes[param]))
                        return prev
                }
                return elements[element].result
            }, elements.textInput.result)

            // var fromArr = arr[attributes.type];
            if (newType) {
                var Type = newType[0];
                var specificTypeProps = newType[1];
				return <Type
                        {...properties}
                        {...specificTypeProps}
                    />;
            }
		}
    };
};

metawidget.react.layout = metawidget.react.layout || {};

metawidget.react.layout.ReactRenderDecorator = function (config) {

    if (!( this instanceof metawidget.react.layout.ReactRenderDecorator)) {
        throw new Error('Constructor called as a function');
    }
	
	//Trigger events of actual layout
	this.onStartBuild = function( mw ) {
		if(config.onStartBuild !== undefined)
			config.onStartBuild(mw);
	};

	this.startContainerLayout = function( container, mw ) {
		if(config.startContainerLayout !== undefined)
			config.startContainerLayout(container,mw);
	};

	this.endContainerLayout = function( container, mw ) {
		if(config.endContainerLayout !== undefined)
			config.endContainerLayout(container,mw);
	};

	this.onEndBuild = function( mw ) {
		if(config.onEndBuild !== undefined)
			config.onEndBuild(mw);
	};
	
	//Convert from React element to DOM element, and pass through to actual layout
	this.layoutWidget = function( widget, elementName, attributes, container, mw ) {
		
		if(React.isValidElement(widget))
		{
			var r = metawidget.util.createElement(mw, "div");
			ReactDOM.render(widget,r);
			widget = r.childNodes[0];
		}
		
		config.layoutWidget( widget, elementName, attributes, container, mw );
	}
}

//Various processors for 'volatile' attributes
//Could be combined into a single one?
metawidget.widgetprocessor = metawidget.widgetprocessor || {};
metawidget.react.widgetprocessor = metawidget.react.widgetprocessor || {};

metawidget.react.widgetprocessor.ValueAttributeProcessor = function () {

    if (!( this instanceof metawidget.react.widgetprocessor.ValueAttributeProcessor )) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.ValueAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.value !== undefined) {
		if(React.isValidElement(widget))
		widget = React.cloneElement(widget, {value:attributes.value});
    }
	if (attributes.checked !== undefined) {
		if(React.isValidElement(widget))
		widget = React.cloneElement(widget, {checked:attributes.checked});
    }

    return widget;
};

metawidget.react.widgetprocessor.MaxLengthAttributeProcessor = function () {

    if (!( this instanceof metawidget.react.widgetprocessor.MaxLengthAttributeProcessor )) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.MaxLengthAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.maxLength !== undefined) {
		if(React.isValidElement(widget))
		widget =  React.cloneElement(widget, {maxLength:attributes.maxLength});
    }

    return widget;
};

metawidget.react.widgetprocessor.MaxAttributeProcessor = function () {

    if (!( this instanceof metawidget.react.widgetprocessor.MaxAttributeProcessor )) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.MaxAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.max !== undefined) {
		if(React.isValidElement(widget))
		widget = React.cloneElement(widget, {max:attributes.max});
    }

    return widget;
};

metawidget.react.widgetprocessor.MinAttributeProcessor = function () {

    if (!( this instanceof metawidget.react.widgetprocessor.MinAttributeProcessor )) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.MinAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.min !== undefined) {
		if(React.isValidElement(widget))
		widget = React.cloneElement(widget, {min:attributes.min});
    }

    return widget;
};

metawidget.react.widgetprocessor.DisabledAttributeProcessor = function () {

    if (!( this instanceof metawidget.react.widgetprocessor.DisabledAttributeProcessor )) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.DisabledAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.disabled !== undefined) {
		if(React.isValidElement(widget))
		widget = React.cloneElement(widget, {disabled:attributes.disabled});
    }

    return widget;
};

metawidget.react.widgetprocessor.PlaceholderAttributeProcessor = function () {

    if (!( this instanceof metawidget.react.widgetprocessor.PlaceholderAttributeProcessor )) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.PlaceholderAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.placeholder !== undefined) {
		if(React.isValidElement(widget))
		widget = React.cloneElement(widget, {placeholder:attributes.placeholder});
    }

    return widget;
};

metawidget.react.widgetprocessor.RequiredAttributeProcessor = function () {

    if (!( this instanceof metawidget.react.widgetprocessor.RequiredAttributeProcessor )) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.RequiredAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.required !== undefined) {
		if(React.isValidElement(widget))
		widget = React.cloneElement(widget, {required:attributes.required});
    }

    return widget;
};

metawidget.react.widgetprocessor.IdProcessor = function () {

    if (!( this instanceof metawidget.react.widgetprocessor.IdProcessor )) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.IdProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.id !== undefined) {
		if(React.isValidElement(widget))
		widget = React.cloneElement(widget, {id:attributes.id});
    }

    return widget;
};
