var schema = {
		properties: {
			name: {
				type:"string",
				required:true,
				placeholder:"Name",
				checkValid: true,
				maxLength:10,
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
			colour: {
				type:"color",
				//Have to use value, not placeholder for colour input
				value:"#4F6F1A",
			},
			notes: {
				type:"string",
				placeholder:"Notes",
				large:true,
			},
			employer: {
				type: "string",
				section: "Work",
				placeholder: "Employer",
			},
			department: {
				type: "string",
				placeholder: "Department",
			},
			customerRating: {
				type:"rating",
				value:3,
			},
			nested: {
				section: "Nested Testing",
				properties: {
					street: {
						type:"string",
						placeholder:"Street",
						checkValid: true,
						maxLength:10,
					},
					suburb: {
						type:"string",
						placeholder:"Suburb",
						checkValid: true,
						maxLength:10,
					},
					postcode: {
						type:"number",
						placeholder:"Suburb",
						checkValid: true,
						min:1,
						max:9999,
					},
				},
			},
		},
	};

var mw = new metawidget.react.ReactMetawidget(document.getElementById("metawidget"), {
		inspector: new metawidget.inspector.JsonSchemaInspector(schema),
	});
		
mw.toInspect = schema;
mw.buildWidgets();