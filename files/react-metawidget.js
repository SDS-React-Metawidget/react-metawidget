var disallow = "`0123456789-=~!@#$%^&*()_+[]\\{}|;':\",./<>?";

//Entry field with label
var InputField = React.createClass({
    //Set default value
    getInitialState: function () {
        return {
            //Works without || "", but complains about going from 'uncontrolled' value
            //to 'controlled' value if props.value is initially undefined
            value: this.props.value || "",
            checked: this.props.metawidgetAttributes.checked || false,
        };
    },

    //Handle change of value
    onChange: function (event) {
        var change = true;
		//disallow invalid characters
        if (this.props.metawidgetAttributes.checkValid) {
            for (var i = 0; i < disallow.length; i++) {
                if (event.target.value.includes(disallow[i] + "")) {
                    change = false;
                    break;
                }
            }
        }
        if (change)
            this.setState({
                value: event.target.value,
                checked: event.target.checked,
            });
    },

    render: function () {
				
        /*Could use defaultValue instead of value + onChange + state
         But then you couldn't get the new value?*/
        var field = <input
            name={this.props.label}
            type={this.props.type}
            onChange={this.onChange}
            value={this.state.value}
            checked={this.state.checked}
        />;

        return (
            field
        );
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
            value: event.target.value,
        });
    },

    render: function () {
        /*Could use defaultValue instead of value + onChange + state
         But then you couldn't get the new value?*/
        var field = <textarea
            name={this.props.label}
            onChange={this.onChange}
            value={this.state.value}
            cols=""
            rows=""
            readOnly=""
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
		var options = this.props.options.map(function(selectOption){
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
		var options = this.props.options.map(function(selectOption){
			return <label  key={inc++} className="radio">
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

var ReactMetawidget = React.createClass({
	getInitialState: function () {
		return {
			toInspect:this.props.toInspect,
			config:this.props.config,
		};
    },
	
    render: function () {
		return <div ref={"metawidget"}/>
    },
	
	componentDidMount: function() {
		var mw = new metawidget.react.ReactMetawidget(this.refs.metawidget, this.state.config);
			
		mw.toInspect = this.state.toInspect;
		mw.buildWidgets();
	}
});
	

// Metawidget ${project.version}
//
// This file is dual licensed under both the LGPL
// (http://www.gnu.org/licenses/lgpl-2.1.html) and the EPL
// (http://www.eclipse.org/org/documents/epl-v10.php). As a
// recipient of Metawidget, you may choose to receive it under either
// the LGPL or the EPL.
//
// Commercial licenses are also available. See http://metawidget.org
// for details.

/**
 * @author <a href="http://kennardconsulting.com">Richard Kennard</a>
 */

var metawidget = metawidget || {};

( function() {

	'use strict';
	
	metawidget.react = metawidget.react || {}
	
	metawidget.react.ReactMetawidget = function(element, config) {
		
		if ( ! ( this instanceof metawidget.react.ReactMetawidget ) ) {
			throw new Error( 'Constructor called as a function' );
		}
		
		var _overriddenNodes = [];

		while ( element.childNodes.length > 0 ) {
			var childNode = element.childNodes[0];
			element.removeChild( childNode );

			if ( childNode.nodeType === 1 ) {
				_overriddenNodes.push( childNode );
			}
		}
		
		var _pipeline = new metawidget.Pipeline(element);
		
		_pipeline.inspector = new metawidget.inspector.PropertyTypeInspector();
		_pipeline.widgetBuilder = new metawidget.widgetbuilder.CompositeWidgetBuilder( [ new metawidget.widgetbuilder.OverriddenWidgetBuilder(), new metawidget.widgetbuilder.ReadOnlyWidgetBuilder(),
				new metawidget.react.widgetbuilder.ReactWidgetBuilder({doLabels:false}) ] );
		_pipeline.widgetProcessors = [ new metawidget.widgetprocessor.IdProcessor(), new metawidget.widgetprocessor.RequiredAttributeProcessor(),
				new metawidget.widgetprocessor.PlaceholderAttributeProcessor(), new metawidget.widgetprocessor.DisabledAttributeProcessor(),
				new metawidget.widgetprocessor.MaxLengthAttributeProcessor(), new metawidget.widgetprocessor.MaxAttributeProcessor(),
				new metawidget.widgetprocessor.MinAttributeProcessor(),	new metawidget.widgetprocessor.SimpleBindingProcessor() ];
		_pipeline.layout = new metawidget.layout.HeadingTagLayoutDecorator( new metawidget.layout.TableLayout({numberOfColumns:2}) );
		_pipeline.configure( config );
	
		this.inspect = function( toInspect, type, names ) {
			return _pipeline.inspect( toInspect, type, names, this );
		};

		this.buildWidgets = function( inspectionResult ) {
			// Defensive copy

			this.overriddenNodes = [];

			for ( var loop = 0, length = _overriddenNodes.length; loop < length; loop++ ) {
				this.overriddenNodes.push( _overriddenNodes[loop].cloneNode( true ) );
			}

			// Inspect (if necessary)

			if ( inspectionResult === undefined ) {

				// Safeguard against improperly implementing:
				// http://blog.kennardconsulting.com/2013/02/metawidget-and-rest.html

				if ( arguments.length > 0 ) {
					throw new Error( "Calling buildWidgets( undefined ) may cause infinite loop. Check your argument, or pass no arguments instead" );
				}

				var splitPath = metawidget.util.splitPath( this.path );
				inspectionResult = _pipeline.inspect( this.toInspect, splitPath.type, splitPath.names, this );
			}
			
			_pipeline.buildWidgets( inspectionResult, this );
		};
		
		this.clearWidgets = function() {

			var element = this.getElement();

			while ( element.childNodes.length > 0 ) {
				element.removeChild( element.childNodes[0] );
			}
		};
		
		this.getElement = function() {

			return _pipeline.element;
		};
		
		this.buildNestedMetawidget = function( attributes, config ) {

			// Create a 'div' not a 'metawidget', because whilst it's up to the
			// user what they want their top-level element to be, for browser
			// compatibility we should stick with something benign for nested
			// elements

			var nestedWidget = metawidget.util.createElement( this, 'div' );

			// Duck-type our 'pipeline' as the 'config' of the nested
			// Metawidget. This neatly passes everything down, including a
			// decremented 'maximumInspectionDepth'

			var nestedMetawidget = new metawidget.react.ReactMetawidget( nestedWidget, [ _pipeline, config ] );
			nestedMetawidget.toInspect = this.toInspect;
			nestedMetawidget.path = metawidget.util.appendPath( attributes, this );
			nestedMetawidget.readOnly = this.readOnly || metawidget.util.isTrueOrTrueString( attributes.readOnly );
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
			
			if (attributes.type) {
				//This bit's copied from HtmlWidgetBuilder
				//Gets the value of the field in the schema
				//eg. name = Jerry Smith
				//var typeAndNames = metawidget.util.splitPath(mw.path);
				//var toInspect = metawidget.util.traversePath(mw.toInspect, typeAndNames.names);
				//var fieldValue = toInspect[attributes.name] || attributes.value;

				var properties = {
					label: attributes.name,
					//value: fieldValue,
					metawidgetAttributes: attributes,
				};
				//Map type thing like Jacob suggested
				var arr = {
					"string":[InputField,{type:"text"}],
					"boolean":[InputField,{type:"checkbox"}],
					
					"color":[InputField,{type:"color"}],
					"colour":[InputField,{type:"color"}],
					
					"date":[InputField,{type:"date"}],
					"time":[InputField,{type:"time"}],
					
					"number":[InputField,{type:"number"}],
					"integer":[InputField,{type:"number"}],
					"float":[InputField,{type:"number"}],
					
					"rating":[Rating,{}],
				};
				var r = metawidget.util.createElement(mw, "div");
				
				var fromArr = arr[attributes.type];
				if(fromArr)
				{
					var Type = fromArr[0];
					var specificTypeProps = fromArr[1];
					ReactDOM.render(
								<Type
									{...properties}
									{...specificTypeProps}
								/>
								, r);
					//Work out a way to use attributes in the map
					//to check for large, masked etc
					/*if (attributes.type === "string") {
						if (attributes.large) {
							ReactDOM.render(
								<LargeTextInputField
									{...properties}
								/>
								, r);
						}
						else if (attributes.masked) {
							ReactDOM.render(
								<Type
									{...properties}
									type={"password"}
								/>
								, r);
						}
						else {
							ReactDOM.render(
								<InputField
									{...properties}
									type={"text"}
								/>
								, r);
						}
					}*/
					
					//ReactDOM.render has to render to a single element, so
					//extract the input field so it can go through widgetprocessors properly
					//Ask richard if there's a way to add new widgets during the process
					//or if it's just via nested that this is done
					return r.childNodes[0];
				}
				
				if ( attributes.type === 'boolean' && attributes.componentType === 'radio' && attributes['enum'] === undefined ) {
					attributes['enum'] = [ true, false ];
					attributes['enumTitles'] = [ 'Yes', 'No' ];
				}
				
				if(attributes["enum"] !== undefined)
				{
					if(attributes.componentType !== "radio")
					{
						ReactDOM.render(
									<Select
										{...properties}
										options={attributes["enum"]}
									/>
									, r);
					}
					else if(attributes.componentType == "radio")
					{
						ReactDOM.render(
									<Radio
										{...properties}
										options={attributes["enum"]}
									/>
									, r);
					}
					return r.childNodes[0];
				}
			}
		};
	};
	
	metawidget.widgetprocessor = metawidget.widgetprocessor || {};
	metawidget.widgetprocessor.MaxLengthAttributeProcessor = function() {

		if ( ! ( this instanceof metawidget.widgetprocessor.MaxLengthAttributeProcessor ) ) {
			throw new Error( 'Constructor called as a function' );
		}
	};

	metawidget.widgetprocessor.MaxLengthAttributeProcessor.prototype.processWidget = function( widget, elementName, attributes ) {

		if ( attributes.maxLength !== undefined ) {
			widget.setAttribute( 'maxLength', attributes.maxLength );
		}

		return widget;
	};
	
	metawidget.widgetprocessor.MaxAttributeProcessor = function() {

		if ( ! ( this instanceof metawidget.widgetprocessor.MaxAttributeProcessor ) ) {
			throw new Error( 'Constructor called as a function' );
		}
	};

	metawidget.widgetprocessor.MaxAttributeProcessor.prototype.processWidget = function( widget, elementName, attributes ) {

		if ( attributes.max !== undefined ) {
			widget.setAttribute( 'max', attributes.max );
		}

		return widget;
	};
	
	metawidget.widgetprocessor.MinAttributeProcessor = function() {

		if ( ! ( this instanceof metawidget.widgetprocessor.MinAttributeProcessor ) ) {
			throw new Error( 'Constructor called as a function' );
		}
	};

	metawidget.widgetprocessor.MinAttributeProcessor.prototype.processWidget = function( widget, elementName, attributes ) {

		if ( attributes.min !== undefined ) {
			widget.setAttribute( 'min', attributes.min );
		}

		return widget;
	};
})();
