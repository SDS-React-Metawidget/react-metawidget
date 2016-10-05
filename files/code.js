var schema = {
    properties: {
        name: {
            type: "string",
            required: true,
            placeholder: "Name",
            checkValid: true,
            maxLength: 10,
        },
        age: {
            type: "number",
            placeholder: "Age",
            min: 0,
            max: 150,
        },
        retired: {
            type: "boolean",
            //checked: true,
        },
        birthday: {
            type: "date",
        },
        birthtime: {
            type: "time",
        },
        colour: {
            type: "color",
            //Have to use value, not placeholder for colour input
            value: "#4F6F1A",
        },
        notes: {
            type: "string",
            placeholder: "Notes",
            maxLength: 256,
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
            type: "rating",
            value: 3,
        },
        nestedAddress: {
            section: "Nested Testing",
            properties: {
                street: {
                    type: "string",
                    placeholder: "Street",
                    checkValid: true,
                    maxLength: 10,
                },
                suburb: {
                    type: "string",
                    placeholder: "Suburb",
                    checkValid: true,
                    maxLength: 10,
                },
                postcode: {
                    type: "number",
                    placeholder: "Suburb",
                    checkValid: true,
                    min: 1,
                    max: 9999,
                },
                state: {
                    type: "select",
                    componentType: "radio",
                    enum: ["NSW", "VIC", "QLD"]
                },
            },
        },
    },
};

ReactDOM.render(<MetaWidget
    toInspect={schema}
    config={{
        inspector: new metawidget.inspector.JsonSchemaInspector(schema),
    }}
/>, document.getElementById("metawidget"))
