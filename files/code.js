
ReactDOM.render(<MetaWidget
    toInspect={person}
    config={{
        inspector: new metawidget.inspector.CompositeInspector([
						new metawidget.inspector.PropertyTypeInspector(), 
						new metawidget.inspector.JsonSchemaInspector(schema)
				]),
    }}
/>, document.getElementById("metawidget"))
