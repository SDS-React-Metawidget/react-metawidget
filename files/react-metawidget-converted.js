var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var disallow = "`0123456789-=~!@#$%^&*()_+[]\\{}|;':\",./<>?";

//Entry field with label
var InputField = React.createClass({
    //Set default value
    getInitialState: function () {
        return {
            //Works without || "", but complains about going from 'uncontrolled' value
            //to 'controlled' value if props.value is initially undefined
            value: this.props.value || "",
            checked: this.props.metawidgetAttributes.checked || false
        };
    },

    //Handle change of value
    onChange: function (event) {

        this.setState({
            value: event.target.value,
            checked: event.target.checked
        });

        if (this.props.callback && typeof this.props.callback === 'function') this.props.callback();
    },

    render: function () {

        var pickedProps = { disabled: true };
        /*Could use defaultValue instead of value + onChange + state
         But then you couldn't get the new value?*/
        var field = React.createElement("input", _extends({
            name: this.props.label,
            type: this.props.type,
            onChange: this.onChange,
            value: this.state.value,
            checked: this.state.checked
        }, pickedProps));

        return field;
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
            value: event.target.value
        });
    },

    render: function () {
        /*Could use defaultValue instead of value + onChange + state
         But then you couldn't get the new value?*/
        var field = React.createElement("textarea", {
            name: this.props.label,
            onChange: this.props.callback,
            value: this.state.value,
            cols: "",
            rows: "",
            readOnly: ""
        });

        return field;
    }
});

var Select = React.createClass({
    render: function () {

        var t = this;
        var inc = 0;
        var options = this.props.options.map(function (selectOption) {
            return React.createElement(
                "option",
                { key: inc++ },
                selectOption
            );
        });

        var field = React.createElement(
            "select",
            null,
            options
        );

        return field;
    }
});

var Radio = React.createClass({
    render: function () {

        var t = this;
        var inc = 0;
        var options = this.props.options.map(function (selectOption) {
            return React.createElement(
                "label",
                { key: inc++, className: "radio" },
                React.createElement("input", { type: "radio", name: t.props.label }),
                selectOption
            );
        });

        var field = React.createElement(
            "span",
            null,
            options
        );

        return field;
    }
});

var MetaWidget = React.createClass({
    getInitialState: function () {
        return {
            toInspect: this.props.toInspect,
            config: this.props.config
        };
    },

    render: function () {
        return React.createElement("div", { ref: "metawidget" });
    },

    componentDidMount: function () {
        var mw = new metawidget.react.ReactMetawidget(this.refs.metawidget, this.state.config);

        mw.toInspect = this.state.toInspect;
        mw.buildWidgets();
    }
});

var metawidget = metawidget || {};

'use strict';

metawidget.react = metawidget.react || {};

metawidget.react.ReactMetawidget = function (element, config) {

    if (!(this instanceof metawidget.react.ReactMetawidget)) {
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
    _pipeline.widgetBuilder = new metawidget.widgetbuilder.CompositeWidgetBuilder([new metawidget.widgetbuilder.OverriddenWidgetBuilder(), new metawidget.widgetbuilder.ReadOnlyWidgetBuilder(), new metawidget.react.widgetbuilder.ReactWidgetBuilder({ doLabels: false })]);
    _pipeline.widgetProcessors = [new metawidget.widgetprocessor.IdProcessor(), new metawidget.widgetprocessor.RequiredAttributeProcessor(), new metawidget.widgetprocessor.PlaceholderAttributeProcessor(), new metawidget.widgetprocessor.DisabledAttributeProcessor(), new metawidget.widgetprocessor.MaxLengthAttributeProcessor(), new metawidget.widgetprocessor.MaxAttributeProcessor(), new metawidget.widgetprocessor.MinAttributeProcessor(), new metawidget.widgetprocessor.SimpleBindingProcessor()];
    _pipeline.layout = new metawidget.layout.HeadingTagLayoutDecorator(new metawidget.layout.TableLayout({ numberOfColumns: 2 }));
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
};

metawidget.react.widgetbuilder = metawidget.react.widgetbuilder || {};

metawidget.react.widgetbuilder.ReactWidgetBuilder = function (config) {

    if (!(this instanceof metawidget.react.widgetbuilder.ReactWidgetBuilder)) {
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
                metawidgetAttributes: attributes
            };

            let elements = {
                textArea: {
                    parameters: {
                        type: e => e === 'string',
                        maxLength: e => e > 32
                    },
                    result: [TextAreaInput, {}]
                },
                textInput: {
                    parameters: {
                        type: e => e === 'string',
                        maxLength: e => !e || e <= 32
                    },
                    result: [InputField, { type: 'text' }]
                },
                checkbox: {
                    parameters: {
                        type: e => e === 'boolean'
                    },
                    result: [InputField, { type: 'checkbox' }]
                },
                color: {
                    parameters: {
                        type: e => e === 'color'
                    },
                    result: [InputField, { type: 'color' }]
                },
                date: {
                    parameters: {
                        type: e => e === 'date'
                    },
                    result: [InputField, { type: 'date' }]
                },
                time: {
                    parameters: {
                        type: e => e === 'time'
                    },
                    result: [InputField, { type: 'time' }]
                },
                number: {
                    parameters: {
                        type: e => e === 'number'
                    },
                    result: [InputField, { type: 'number' }]
                },
                rating: {
                    parameters: {
                        type: e => e === 'rating'
                    },
                    result: [Rating, {}]
                }
            };

            // alternate names for same elements
            elements.colour = elements.color;
            elements.integer = elements.number;
            elements.float = elements.number;

            let newType = Object.keys(elements).reduce((prev, element) => {
                for (let param in elements[element].parameters) {
                    if (!elements[element].parameters[param](attributes[param])) return prev;
                }
                return elements[element].result;
            }, elements.textArea.result);

            console.log(newType);

            //Map type thing like Jacob suggested
            // var arr = {
            //     "string": [InputField, {type: "text"}],
            //     "boolean": [InputField, {type: "checkbox"}],
            //
            //     "color": [InputField, {type: "color"}],
            //     "colour": [InputField, {type: "color"}],
            //
            //     "date": [InputField, {type: "date"}],
            //     "time": [InputField, {type: "time"}],
            //
            //     "number": [InputField, {type: "number"}],
            //     "integer": [InputField, {type: "number"}],
            //     "float": [InputField, {type: "number"}],
            //
            //     "rating": [Rating, {}],
            // };
            var r = metawidget.util.createElement(mw, "div");

            /*this.props.callback = function(attributes.name) {
                 attributes.name
             };*/

            // var fromArr = arr[attributes.type];
            if (newType) {
                var Type = newType[0];
                var specificTypeProps = newType[1];
                var a = React.createElement(Type, _extends({}, properties, specificTypeProps));
                console.log(a);
                ReactDOM.render(a, r);
                //Work out a way to use attributes in the map
                //to check for large, masked etc

                //ReactDOM.render has to render to a single element, so
                //extract the input field so it can go through widgetprocessors properly
                //Ask richard if there's a way to add new widgets during the process
                //or if it's just via nested that this is done
                return r.childNodes[0];
            }

            if (attributes.type === 'boolean' && attributes.componentType === 'radio' && attributes['enum'] === undefined) {
                attributes['enum'] = [true, false];
                attributes['enumTitles'] = ['Yes', 'No'];
            }

            if (attributes["enum"] !== undefined) {
                if (attributes.componentType !== "radio") {
                    ReactDOM.render(React.createElement(Select, _extends({}, properties, {
                        options: attributes["enum"]
                    })), r);
                } else if (attributes.componentType == "radio") {
                    ReactDOM.render(React.createElement(Radio, _extends({}, properties, {
                        options: attributes["enum"]
                    })), r);
                }
                return r.childNodes[0];
            }
        }
    };
};

metawidget.widgetprocessor = metawidget.widgetprocessor || {};
metawidget.widgetprocessor.MaxLengthAttributeProcessor = function () {

    if (!(this instanceof metawidget.widgetprocessor.MaxLengthAttributeProcessor)) {
        throw new Error('Constructor called as a function');
    }
};

metawidget.widgetprocessor.MaxLengthAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.maxLength !== undefined) {
        widget.setAttribute('maxLength', attributes.maxLength);
    }

    return widget;
};

metawidget.widgetprocessor.MaxAttributeProcessor = function () {

    if (!(this instanceof metawidget.widgetprocessor.MaxAttributeProcessor)) {
        throw new Error('Constructor called as a function');
    }
};

metawidget.widgetprocessor.MaxAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.max !== undefined) {
        widget.setAttribute('max', attributes.max);
    }

    return widget;
};

metawidget.widgetprocessor.MinAttributeProcessor = function () {

    if (!(this instanceof metawidget.widgetprocessor.MinAttributeProcessor)) {
        throw new Error('Constructor called as a function');
    }
};

metawidget.widgetprocessor.MinAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.min !== undefined) {
        widget.setAttribute('min', attributes.min);
    }

    return widget;
};
