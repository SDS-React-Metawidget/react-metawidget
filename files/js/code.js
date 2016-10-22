ReactDOM.render(
    <MetaWidget
        toInspect={person}
        addInspectors={new metawidget.inspector.JsonSchemaInspector(schema)}
        addWidgetProcessors={new metawidget.react.widgetprocessor.ReactBindingProcessor()}
    />,
    document.getElementById("metawidget")
)
