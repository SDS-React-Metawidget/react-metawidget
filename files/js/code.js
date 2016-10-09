ReactDOM.render(
    <MetaWidget
        inspector={new metawidget.inspector.JsonSchemaInspector(schema)}
        widgetProcessors={[
            new metawidget.react.widgetprocessor.IdProcessor(),
            new metawidget.react.widgetprocessor.RequiredAttributeProcessor(),
            new metawidget.react.widgetprocessor.PlaceholderAttributeProcessor(),
            new metawidget.react.widgetprocessor.DisabledAttributeProcessor(),
            new metawidget.react.widgetprocessor.MaxLengthAttributeProcessor(),
            new metawidget.react.widgetprocessor.MaxAttributeProcessor(),
            new metawidget.react.widgetprocessor.MinAttributeProcessor(),
            new metawidget.react.widgetprocessor.ValueAttributeProcessor(),
            new metawidget.widgetprocessor.SimpleBindingProcessor()
        ]}
    />,
    document.getElementById("metawidget")
)
