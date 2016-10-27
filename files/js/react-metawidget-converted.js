'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var DOMProperties = ["accept", "acceptCharset", "accessKey", "action", "allowFullScreen", "allowTransparency", "alt", "async", "autoComplete", "autoFocus", "autoPlay", "capture", "cellPadding", "cellSpacing", "challenge", "charSet",, /*"checked"*/"cite", "classID", "className", "colSpan", "cols", "content", "contentEditable", "contextMenu", "controls", "coords", "crossOrigin", "data", "dateTime", "default", "defer", "dir", "disabled", "download", "draggable", "encType", "form", "formAction", "formEncType", "formMethod", "formNoValidate", "formTarget", "frameBorder", "headers", "height", "hidden", "high", "href", "hrefLang", "htmlFor", "httpEquiv", "icon", "id", "inputMode", "integrity", "is", "keyParams", "keyType", "kind", "label", "lang", "list", "loop", "low", "manifest", "marginHeight", "marginWidth", "max", "maxLength", "media", "mediaGroup", "method", "min", "minLength", "multiple", "muted", "name", "noValidate", "nonce", "open", "optimum", "pattern", "placeholder", "poster", "preload", "profile", "radioGroup", "readOnly", "rel", "required", "reversed", "role", "rowSpan", "rows", "sandbox", "scope", "scoped", "scrolling", "seamless", "selected", "shape", "size", "sizes", "span", "spellCheck", "src", "srcDoc", "srcLang", "srcSet", "start", "step", "style", "summary", "tabIndex", "target", "title", "type", "useMap",, /*"value"*/"width", "wmode", "wrap"];
//Disallow "value" and "checked", as they are explicitly handled
var dontCheckProperties = ["checked", "value", "metawidgetAttributes"];

var DOMEvents = ["onCopy", "onCut", "onPaste", "onCompositionEnd", "onCompositionStart", "onCompositionUpdate", "onKeyDown", "onKeyPress", "onKeyUp", "onFocus", "onBlur",, /*"onChange"*/"onInput", "onSubmit", "onClick", "onContextMenu", "onDoubleClick", "onDrag", "onDragEnd", "onDragEnter", "onDragExit", "onDragLeave", "onDragOver", "onDragStart", "onDrop", "onMouseDown", "onMouseEnter", "onMouseLeave    onMouseMove", "onMouseOut", "onMouseOver", "onMouseUp", "onSelect", "onTouchCancel", "onTouchEnd", "onTouchMove", "onTouchStart", "onScroll", "onWheel", "onAbort", "onCanPlay", "onCanPlayThrough", "onDurationChange", "onEmptied", "onEncrypted", "onEnded", "onError", "onLoadedData", "onLoadedMetadata", "onLoadStart", "onPause", "onPlay", "onPlaying", "onProgress", "onRateChange", "onSeeked", "onSeeking", "onStalled", "onSuspend", "onTimeUpdate", "onVolumeChange", "onWaiting", "onLoad", "onError", "onAnimationStart", "onAnimationEnd", "onAnimationIteration", "onTransitionEnd"];
//Disallow "onChange" as it is explicitly handled
var dontCheckEvents = ["onChange"];

//Entry field with label
var InputField = React.createClass({
    componentWillMount: function () {
        this.checkValidProps(this.props);
    },

    getInitialState: function () {
        var state = {};
        if (this.props.type === "checkbox") state.checked = this.props.checked || false;else state.value = this.props.value || "";

        return state;
    },

    //Handle change of value
    onChange: function (event) {
        var updateState = {};
        if (this.props.type === "checkbox") updateState.checked = event.target.checked;else updateState.value = event.target.value;

        this.setState(updateState);

        if (this.props.onChange) {
            if (this.props.type === "checkbox") this.props.onChange(event.target.checked);else this.props.onChange(event.target.value);
        }
    },

    checkValidProps: function (props) {
        this.validProps = {};
        this.validEvents = {};

        for (let key in this.props) {
            if (!dontCheckProperties.includes(key) && !dontCheckEvents.includes(key)) {
                if (DOMProperties.includes(key)) this.validProps[key] = this.props[key];else if (DOMEvents.includes(key)) this.validEvents[key] = this.props[key];else this.validProps["data-" + key] = this.props[key];
            }
        }
    },

    render: function () {
        return React.createElement("input", _extends({
            onChange: this.onChange,
            value: this.state.value,
            checked: this.state.checked
        }, this.validProps, this.validEvents));
    }
});

//Entry field with label
var TextAreaInput = React.createClass({
    componentWillMount: function () {
        this.checkValidProps(this.props);
    },

    getInitialState: function () {
        return {
            value: this.props.value || ""
        };
    },

    //Handle change of value
    onChange: function (event) {
        this.setState({
            value: event.target.value
        });

        if (this.props.onChange) this.props.onChange(event.target.value);
    },

    checkValidProps: function (props) {
        this.validProps = {};
        this.validEvents = {};

        for (let key in this.props) {
            if (!dontCheckProperties.includes(key) && !dontCheckEvents.includes(key)) {
                if (DOMProperties.includes(key)) this.validProps[key] = this.props[key];else if (DOMEvents.includes(key)) this.validEvents[key] = this.props[key];else this.validProps["data-" + key] = this.props[key];
            }
        }
    },

    render: function () {
        return React.createElement("textarea", _extends({
            onChange: this.onChange,
            value: this.state.value
        }, this.validProps, this.validEvents));
    }
});

var Select = React.createClass({
    onChange: function (e) {
        if (this.props.onChange) this.props.onChange(e.target.value);
    },

    render: function () {
        var options = this.props.options.map(function (option, i) {
            return React.createElement(
                "option",
                { key: i },
                option
            );
        });

        return React.createElement(
            "select",
            { onChange: this.onChange },
            options
        );
    }
});

var Radio = React.createClass({
    getInitialState: function () {
        return { selectedOption: "1" };
    },

    onChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });

        if (this.props.onChange) this.props.onChange(this.props.options[e.target.value]);
    },

    render: function () {
        var options = this.props.options.map(function (option, i) {
            return React.createElement(
                "label",
                { key: i },
                React.createElement("input", { type: "radio", value: i + "", name: this.props.label,
                    checked: this.state.selectedOption === i + "",
                    onChange: this.onChange }),
                " ",
                option
            );
        }, this);

        return React.createElement(
            "span",
            null,
            options
        );
    }
});

var Output = React.createClass({
    render: function () {
        return React.createElement(
            "output",
            null,
            this.props.value
        );
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

        // var nestedMetawidget = <MetaWidget
        // toInspect={this.toInspect}
        // config={[_pipeline,config]}
        // element={nestedWidget}
        // readOnly={this.readOnly || metawidget.util.isTrueOrTrueString(attributes.readOnly)}
        // />

        return nestedWidget;
    };

    var t = this;
    this.save = function () {

        return _pipeline.getWidgetProcessor(function (widgetProcessor) {
            return widgetProcessor instanceof metawidget.react.widgetprocessor.ReactBindingProcessor;
        }).save(t);
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
            var properties = {
                name: attributes.name,
                metawidgetAttributes: attributes
            };

            let elements = {
                textInput: {
                    parameters: {
                        type: e => e === 'string',
                        maxLength: e => !e || e <= 32
                    },
                    result: [InputField, { type: 'text' }]
                },
                password: {
                    parameters: {
                        type: e => e === 'string',
                        masked: e => e === true
                    },
                    result: [InputField, { type: 'password' }]
                },
                textArea: {
                    parameters: {
                        type: e => e === 'string',
                        //maxLength: (e) => e > 32,
                        large: e => e === true
                    },
                    result: [TextAreaInput, {}]
                },
                checkbox: {
                    parameters: {
                        type: e => e === 'boolean'
                    },
                    result: [InputField, { type: 'checkbox' }]
                },
                color: {
                    parameters: {
                        type: e => e === 'color' || e === 'colour'
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
                        type: e => e === 'number' || e === 'integer' || e === 'float'
                    },
                    result: [InputField, { type: 'number' }]
                },
                range: {
                    parameters: {
                        type: e => e === 'number' || e === 'integer' || e === 'float',
                        min: e => e !== undefined,
                        max: e => e !== undefined
                    },
                    result: [InputField, { type: 'range' }]
                },
                button: {
                    parameters: {
                        type: e => e === 'function'
                    },
                    result: [InputField, {
                        type: "button",
                        onClick: metawidget.util.traversePath(mw.toInspect, metawidget.util.splitPath(mw.path).names)[attributes.name],
                        value: metawidget.util.getLabelString(attributes, mw)
                    }]
                },
                submit: {
                    parameters: {
                        type: e => e === 'function',
                        submit: e => e === true
                    },
                    result: [InputField, {
                        type: "submit",
                        onClick: metawidget.util.traversePath(mw.toInspect, metawidget.util.splitPath(mw.path).names)[attributes.name],
                        value: metawidget.util.getLabelString(attributes, mw)
                    }]
                },
                booleanRadio: {
                    parameters: {
                        type: e => e === 'boolean',
                        componentType: e => e === 'radio'
                    },
                    result: [Radio, { options: [true, false] }]
                },
                select: {
                    parameters: {
                        //type: (e) => e === 'select',
                        enum: e => e !== undefined
                    },
                    result: [Select, { options: attributes["enum"] }]
                },
                radio: {
                    parameters: {
                        componentType: e => e === 'radio',
                        enum: e => e !== undefined
                    },
                    result: [Radio, { options: attributes["enum"] }]
                },
                output: {
                    parameters: {
                        readOnly: e => e === true
                    },
                    result: [Output, {}]
                }
            };

            let Element = Object.keys(elements).reduce((prev, element) => {
                for (let param in elements[element].parameters) {
                    if (!elements[element].parameters[param](attributes[param])) return prev;
                }
                return elements[element].result;
            }, null);

            if (Element == null) return undefined;
            // var fromArr = arr[attributes.type];
            if (Element) {
                var ElementType = Element[0];
                var uniqueElementProps = Element[1];
                return React.createElement(ElementType, _extends({}, properties, uniqueElementProps));
            }
        }
    };
};

metawidget.react.layout = metawidget.react.layout || {};

metawidget.react.layout.ReactRenderDecorator = function (config) {

    if (!(this instanceof metawidget.react.layout.ReactRenderDecorator)) {
        throw new Error('Constructor called as a function');
    }

    //Trigger events of actual layout
    this.onStartBuild = function (mw) {
        if (config.onStartBuild !== undefined) config.onStartBuild(mw);
    };

    this.startContainerLayout = function (container, mw) {
        if (config.startContainerLayout !== undefined) config.startContainerLayout(container, mw);
    };

    this.endContainerLayout = function (container, mw) {
        if (config.endContainerLayout !== undefined) config.endContainerLayout(container, mw);
    };

    this.onEndBuild = function (mw) {
        if (config.onEndBuild !== undefined) config.onEndBuild(mw);
    };

    //Convert from React element to DOM element, and pass through to actual layout
    this.layoutWidget = function (widget, elementName, attributes, container, mw) {

        if (React.isValidElement(widget)) {
            var r = metawidget.util.createElement(mw, "div");
            ReactDOM.render(widget, r);
            widget = r.childNodes[0];
        }

        config.layoutWidget(widget, elementName, attributes, container, mw);
    };
};

//Various processors for 'volatile' attributes
//Could be combined into a single one?
metawidget.react.widgetprocessor = metawidget.react.widgetprocessor || {};

metawidget.react.widgetprocessor.ValueAttributeProcessor = function () {

    if (!(this instanceof metawidget.react.widgetprocessor.ValueAttributeProcessor)) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.ValueAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes, mw) {

    if (attributes.type !== "function") {
        //Get value from toInspect object
        var value;
        var typeAndNames = metawidget.util.splitPath(mw.path);
        var toInspect = metawidget.util.traversePath(mw.toInspect, typeAndNames.names);

        if (typeAndNames.names === undefined) {
            typeAndNames.names = [];
        }
        if (elementName !== 'entity' && toInspect !== undefined) {
            value = toInspect[attributes.name];
            typeAndNames.names.push(attributes.name);
        } else {
            value = toInspect;
        }

        if (value !== undefined) {
            if (React.isValidElement(widget)) widget = React.cloneElement(widget, { value: value, checked: value });
        }

        //Get value from attributes
        //Currently overwrites that from toInspect
        if (attributes.value !== undefined) {
            if (React.isValidElement(widget)) widget = React.cloneElement(widget, { value: attributes.value, checked: attributes.value });
        }
    }

    return widget;
};

metawidget.react.widgetprocessor.MaxLengthAttributeProcessor = function () {

    if (!(this instanceof metawidget.react.widgetprocessor.MaxLengthAttributeProcessor)) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.MaxLengthAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.maxLength !== undefined) {
        if (React.isValidElement(widget)) widget = React.cloneElement(widget, { maxLength: attributes.maxLength });
    }

    return widget;
};

metawidget.react.widgetprocessor.MaxAttributeProcessor = function () {

    if (!(this instanceof metawidget.react.widgetprocessor.MaxAttributeProcessor)) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.MaxAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.max !== undefined) {
        if (React.isValidElement(widget)) widget = React.cloneElement(widget, { max: attributes.max });
    }

    return widget;
};

metawidget.react.widgetprocessor.MinAttributeProcessor = function () {

    if (!(this instanceof metawidget.react.widgetprocessor.MinAttributeProcessor)) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.MinAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.min !== undefined) {
        if (React.isValidElement(widget)) widget = React.cloneElement(widget, { min: attributes.min });
    }

    return widget;
};

metawidget.react.widgetprocessor.DisabledAttributeProcessor = function () {

    if (!(this instanceof metawidget.react.widgetprocessor.DisabledAttributeProcessor)) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.DisabledAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.disabled !== undefined) {
        if (React.isValidElement(widget)) widget = React.cloneElement(widget, { disabled: attributes.disabled });
    }

    return widget;
};

metawidget.react.widgetprocessor.PlaceholderAttributeProcessor = function () {

    if (!(this instanceof metawidget.react.widgetprocessor.PlaceholderAttributeProcessor)) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.PlaceholderAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.placeholder !== undefined) {
        if (React.isValidElement(widget)) widget = React.cloneElement(widget, { placeholder: attributes.placeholder });
    }

    return widget;
};

metawidget.react.widgetprocessor.RequiredAttributeProcessor = function () {

    if (!(this instanceof metawidget.react.widgetprocessor.RequiredAttributeProcessor)) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.RequiredAttributeProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.required !== undefined) {
        if (React.isValidElement(widget)) widget = React.cloneElement(widget, { required: attributes.required });
    }

    return widget;
};

metawidget.react.widgetprocessor.IdProcessor = function () {

    if (!(this instanceof metawidget.react.widgetprocessor.IdProcessor)) {
        throw new Error('Constructor called as a function');
    }
};
metawidget.react.widgetprocessor.IdProcessor.prototype.processWidget = function (widget, elementName, attributes) {

    if (attributes.id !== undefined) {
        if (React.isValidElement(widget)) widget = React.cloneElement(widget, { id: attributes.id });
    }

    return widget;
};

metawidget.react.widgetprocessor.ReactBindingProcessor = function () {

    if (!(this instanceof metawidget.react.widgetprocessor.ReactBindingProcessor)) {
        throw new Error('Constructor called as a function');
    }
    this.holder = {};
};
metawidget.react.widgetprocessor.ReactBindingProcessor.prototype.processWidget = function (widget, elementName, attributes, mw) {

    var t = this;
    if (React.isValidElement(widget)) {
        widget = React.cloneElement(widget, {
            onChange: function (e) {
                t.holder[metawidget.util.appendPath(attributes, mw)] = e;
            }
        });
    }

    return widget;
};

function copyAcross(toThis, fromThis) {
    console.log("ft", fromThis);
    for (var bigKey in fromThis) {
        var splitKey = metawidget.util.splitPath(bigKey);

        //Nested widgets will have more than one name
        if (splitKey.names.length > 1) {
            //Check if nestedWidget object exists
            //If not, create 'just in time'
            if (toThis[splitKey.names.slice(0, 1)] === undefined) toThis[splitKey.names.slice(0, 1)] = {};

            //Set toInspect to the nestedWidget object
            var toInspect = toThis[splitKey.names.slice(0, 1)];

            //Recreate path string, just one deeper
            var string = splitKey.type + "";
            splitKey.names.splice(0, 1);
            splitKey.names.forEach(function (val) {
                string += "." + val;
            });

            //Create object using path string and value
            var obj = {};
            obj[string] = fromThis[bigKey];

            //Recurse this function with nestedWidget object
            //and deeper path
            copyAcross(toInspect, obj);
        } else {
            //Works when toInspect is already populated
            //but not guaranteed, so have to use nested logic to manually
            //set and check each level
            //var toInspect = metawidget.util.traversePath(toThis, splitKey.names.slice(0, splitKey.names.length-1));

            var toInspect = toThis;
            if (toInspect === undefined) toInspect = {};

            var name = splitKey.names[splitKey.names.length - 1];
            //Have to use [], else it sets by value, not reference
            toInspect[name] = fromThis[bigKey];
        }
    }
}
metawidget.react.widgetprocessor.ReactBindingProcessor.prototype.save = function (mw) {

    copyAcross(mw.toInspect, this.holder);
    console.log("m", mw.toInspect);
    return true;
};

var MetaWidget = React.createClass({
    propTypes: {
        toInspect: React.PropTypes.object,
        inspector: React.PropTypes.object,
        widgetBuilder: React.PropTypes.object,
        widgetProcessors: React.PropTypes.arrayOf(React.PropTypes.object),
        layout: React.PropTypes.object,
        readOnly: React.PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            toInspect: {},
            inspector: new metawidget.inspector.PropertyTypeInspector(),
            widgetBuilder: new metawidget.react.widgetbuilder.ReactWidgetBuilder(),
            widgetProcessors: [new metawidget.react.widgetprocessor.IdProcessor(), new metawidget.react.widgetprocessor.RequiredAttributeProcessor(), new metawidget.react.widgetprocessor.PlaceholderAttributeProcessor(), new metawidget.react.widgetprocessor.DisabledAttributeProcessor(), new metawidget.react.widgetprocessor.MaxLengthAttributeProcessor(), new metawidget.react.widgetprocessor.MinAttributeProcessor(), new metawidget.react.widgetprocessor.MaxAttributeProcessor(), new metawidget.react.widgetprocessor.ValueAttributeProcessor()],
            layout: new metawidget.react.layout.ReactRenderDecorator(new metawidget.layout.HeadingTagLayoutDecorator(new metawidget.layout.TableLayout({ numberOfColumns: 2 }))),
            readOnly: false
        };
    },

    componentDidMount: function () {
        this.mw = new metawidget.react.ReactMetawidget(this.metawidget, _extends({}, this.props));

        this.mw.toInspect = this.props.toInspect;
        this.mw.readOnly = this.props.readOnly;

        this.mw.buildWidgets();
        this.metawidget.mw = this.mw;
    },

    render: function () {
        return React.createElement("div", { id: "mwContainer", ref: div => this.metawidget = div });
    }
});
