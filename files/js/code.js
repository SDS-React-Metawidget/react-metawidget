ReactDOM.render(
    <MetaWidget
        //toInspect={person}
        inspector={new metawidget.inspector.JsonSchemaInspector(schema)}
        appendWidgetProcessors={new metawidget.react.widgetprocessor.ReactBindingProcessor()}
        readOnly
    />,
    document.getElementById("metawidget")
)
