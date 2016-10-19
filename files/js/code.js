ReactDOM.render(
    <MetaWidget
        toInspect={person}
        //inspector={new metawidget.inspector.JsonSchemaInspector(schema)}
        addWidgetProcessors={new metawidget.react.widgetprocessor.ReactBindingProcessor()}
    />,
    document.getElementById("metawidget")
)
