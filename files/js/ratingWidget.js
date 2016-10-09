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
