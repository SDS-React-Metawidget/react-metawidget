var person = {
    name: "Homer Simpson",
    email: "homer@nuclear.power.plant.com",
    retired: false,
    address: {
        street: "There St",
        suburb: "Dingbat",
        state: "NSW",
        postcode: 5678,
        country: "Australia",
        more: function () {
            reactWidget.mw.save();
        }
    }
};

var schema2Object = {
    buttonSave: function() {reactWidget.mw.save();},
    submit: function() {console.log("Submit")},
    checkbox: true,
    date: "",
    number: 12,
    numberInteger: 24,
    password: "SHould be masked",
    range: 5,
    text: "Normal Text",
    select: "A",
    textarea: "LLLAAARRGEE",
    rating: 4
}

var schema2 = {
    properties: {
        buttonSave: {
            type: "function",
        },
        submit: {
            type: "function",
            submit: true,
        },
        checkbox: {
            type: "boolean",
        },
        date: {
            type: "date",
        },
        number: {
            type: "number",
        },
        numberInteger: {
            type: "integer",
        },
        password: {
            type: "string",
            masked: true,
        },
        range: {
            type: "number",
            min: 1,
            max: 10,
        },
        text: {
            type: "string",
        },
        select: {
            type: "select",
            enum: ["A","B","C"]
        },
        textarea: {
            type:"string",
            large:true
        },
        rating: {
            type: "rating"
        }
    }
}

var reactWidget = ReactDOM.render(
    <MetaWidget
        toInspect={schema2Object}
        inspector={
            new metawidget.inspector.CompositeInspector([
                new metawidget.inspector.PropertyTypeInspector(),
                new metawidget.inspector.JsonSchemaInspector(schema2)
            ])
        }
        appendWidgetProcessors={
            new metawidget.react.widgetprocessor.ReactBindingProcessor()
        }
        widgetBuilder={
            new metawidget.widgetbuilder.CompositeWidgetBuilder([
                new metawidget.react.widgetbuilder.ReactWidgetBuilder(),
                new metawidget.react.widgetbuilder.RatingWidgetBuilder()
            ])
        }
        readOnly={true}
    />,
    document.getElementById("metawidget")
)
