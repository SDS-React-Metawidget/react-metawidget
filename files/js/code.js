var person = {
				name: "Homer Simpson",
				email: "homer@nuclear.power.plant.com",
				retired: false,
				address: {
					street:"There St",
					suburb:"Dingbat",
					state:"NSW",
					postcode:5678,
					country:"Australia",
					more:function() {
						a.mw.save();
					}
				}
};

var a = ReactDOM.render(
    <MetaWidget
        toInspect={person}
        //inspector={new metawidget.inspector.CompositeInspector([new metawidget.inspector.PropertyTypeInspector(),new metawidget.inspector.JsonSchemaInspector(schema)])}
        appendWidgetProcessors={new metawidget.react.widgetprocessor.ReactBindingProcessor()}
		readOnly={true}
    />,
    document.getElementById("metawidget")
)