'use strict';

var Rating = React.createClass({
    getInitialState: function() {
        return {
            rating: this.props.value || 2,
        };
    },
    
    rate: function(e) {
        this.setState({
            rating: e.currentTarget.attributes["data-value"].value,
        });
        
        if(this.props.onChange)
            this.props.onChange(e.currentTarget.attributes["data-value"].value);
    },
    
    render: function (){
        var arr = [];
        for(var i = 1; i <= 5; i++)
        {
            var src = this.state.rating >= i ? "img/filledStar.png" : "img/emptyStar.png";
            var inner = <img src={src} width="20px"/>;
            arr.push(<span key={i}>
                        <b data-value={i}
                           onClick={this.rate}
                           style={{cursor:"pointer",}}>
                            {inner}
                        </b>
                        &nbsp;
                    </span>);
        }
        return <span>{arr}</span>;
    }
});

var metawidget = metawidget || {};
metawidget.react = metawidget.react || {}
metawidget.react.widgetbuilder = metawidget.react.widgetbuilder || {}

metawidget.react.widgetbuilder.RatingWidgetBuilder = function (config) {

    if (!( this instanceof metawidget.react.widgetbuilder.RatingWidgetBuilder )) {
        throw new Error('Constructor called as a function');
    }

    this.buildWidget = function (elementName, attributes, mw) {

        if (metawidget.util.isTrueOrTrueString(attributes.hidden)) {
            return metawidget.util.createElement(mw, 'stub');
        }

        if (attributes.type) {
            var properties = {
                name: attributes.name,
                metawidgetAttributes: attributes,
            };

            let elements = {
                rating: {
                    parameters: {
                        type: (e) => e === 'rating'
                    },
                    result: [Rating, {}]
                },
            }

            let Element = Object.keys(elements).reduce((prev, element) => {
                for ( let param in elements[element].parameters ) {
                    if (!elements[element].parameters[param](attributes[param]))
                        return prev
                }
                return elements[element].result
            }, null)

            if(Element == null)
                return undefined;
            // var fromArr = arr[attributes.type];
            if (Element) {
                var ElementType = Element[0];
                var uniqueElementProps = Element[1];
                return (
                    <ElementType
                        {...properties}
                        {...uniqueElementProps}
                    />
                )
            }
        }
    };
};