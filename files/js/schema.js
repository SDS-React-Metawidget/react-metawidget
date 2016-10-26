/**
 * Created by alex on 9/10/2016.
 */

var schema = {
  properties: {
    name: {
      type: "string",
      required: true,
      placeholder: "Name",
      checkValid: true,
      maxLength: 10,
      //readOnly:true,
      value: "Jerry"
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
          maxLength: 10,
        },
        suburb: {
          type: "string",
          placeholder: "Suburb",
          maxLength: 10,
        },
        postcode: {
          type: "number",
          placeholder: "Postcode",
          min: 1,
          max: 9999,
        },
        state: {
          type: "select",
          componentType: "radio",
          enum: ["NSW", "VIC", "QLD"],
        },
        ausResident: {
          type: "boolean",
        },
        occupation: {
          type: "string",
          readOnly: true,
          value: "Plumber"
        },
      },
    },
	save: {
		type: "function",
		save: true,
	}
  },
};

var schema2 = {
	properties: {
		buttonSave: {
			type: "function",
			save: true,
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
			enum: ["A","B","C"]
		},
		textarea: {
			type:"string",
			large:true
		},
	}
}

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
						console.log("more");
					}
				}
};
