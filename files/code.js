
var mw = new metawidget.Metawidget(document.getElementById("metawidget"), {
	inspector: new metawidget.inspector.JsonSchemaInspector({
		properties: {
			name: {
				type:"string",
				required:true,
				placeholder:"Name",
			},
			age: {
				type:"number",
				placeholder:"Age",
				min:0,
				max:150,
			},
			retired: {
				type:"boolean",
				//checked: true,
			},
			notes: {
				type:"string",
				placeholder:"Notes",
				large:true,
			},
			colour: {
				type:"color",
				//Have to use value, not placeholder for colour input
				value:"#4F6F1A",
			},
			employer: {
				type: "string",
				section: "Work",
				placeholder: "Employer",
			},
			department: {
				type: "string",
				placeholder: "Department",
			}
		},
	}),
	widgetBuilder: new metawidget.widgetbuilder.CompositeWidgetBuilder([
		new metawidget.widgetbuilder.OverriddenWidgetBuilder(), 
		new metawidget.widgetbuilder.ReadOnlyWidgetBuilder(),
		//Add React widget builder
		new ReactWidgetBuilder({doLabels: false}),
	]),
	
	widgetProcessors: [
		//new metawidget.widgetprocessor.PlaceholderAttributeProcessor(),
		//new metawidget.widgetprocessor.DisabledAttributeProcessor(),
		function(widget, elementName, attributes, mw) {
			//console.log(attributes);
			//Further processing after building of React component
			console.log(widget);
			return widget;
		}
	],
	
	//Cannot use inbuilt metawidget.layout.HeadingTagLayoutDecorator, as ReactDOM.render
	//doesnt want to render non-react elements (HtmlElement)
	layout:	new ReactHeadingTagLayoutDecorator(new TableReactLayout({numberOfColumns: 2})),
});
		
mw.toInspect = {};
mw.buildWidgets();