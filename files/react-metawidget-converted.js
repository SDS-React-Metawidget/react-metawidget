var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };

var disallow = "`0123456789-=~!@#$%^&*()_+[]\\{}|;':\",./<>?";

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
        var doit = true;
        if (this.props["data-metawidgetAttributes"].checkValid) {
            for (var i = 0; i < disallow.length; i++) {
                if (event.target.value.includes(disallow[i] + "")) {
                    doit = false;
                    break;
                }
            }
        }
        if (doit) this.setState({
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
            max: this.props["data-metawidgetAttributes"].max,
            maxLength: this.props["data-metawidgetAttributes"].max
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
                        {htmlFor: fieldLabel},
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
                        {htmlFor: this.props.label},
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
            max: this.props["data-metawidgetAttributes"].max,
            maxLength: this.props["data-metawidgetAttributes"].max
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
                        {htmlFor: fieldLabel},
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
                        {htmlFor: this.props.label},
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
                "data-metawidgetAttributes": attributes
            };
            var r = metawidget.util.createElement(mw, "div");
            if (attributes.type === "string") {
                if (attributes.large) {
                    ReactDOM.render(React.createElement(LargeTextInputField, properties), r);
                } else if (attributes.masked) {
                    ReactDOM.render(React.createElement(InputField, _extends({}, properties, {
                        type: "password"
                    })), r);
                } else {
                    ReactDOM.render(React.createElement(InputField, _extends({}, properties, {
                        type: "text"
                    })), r);
                }
            } else if (attributes.type === "boolean") {
                ReactDOM.render(React.createElement(InputField, _extends({}, properties, {
                    type: "checkbox"
                })), r);
            } else if (attributes.type === "color" || attributes.type === "colour") {
                ReactDOM.render(React.createElement(InputField, _extends({}, properties, {
                    type: "color"
                })), r);
            } else if (attributes.type === "number" || attributes.type === "integer" || attributes.type === "float") {
                ReactDOM.render(React.createElement(InputField, _extends({}, properties, {
                    type: "number"
                })), r);
            } else if (attributes.type === "rating") {
                ReactDOM.render(React.createElement(Rating, properties), r);
            }
            return r;
        }
    };
};
