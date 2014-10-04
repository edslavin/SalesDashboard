Metrics = new Meteor.Collection("metrics");

Meteor.subscribe("allMetrics");

UI.registerHelper('editMode', function(context, options) {
	if(Session.get("editMode"))
		return true;
});

UI.registerHelper('currentEdit', function(context, options) {
	if(Session.get("currentEdit") === context || Session.get("editMode") === true)
		return true;
});

Metrics.find().observeChanges({
	changed: function(id, doc) {
		setTimeout(
			function(){
				var metric = Metrics.findOne(id);
				if(metric.updated){
					Metrics.update( { _id : id} , { $set : { updated : false } } );
				}
			}, 3000);
	}
});

Template.metricContent.helpers({
	metrics:function(){
		return Metrics.find();
	}
});

Template.pageContent.events({
	'click .edit-mode':function(e,t){
		Session.set("editMode",true);
	},
	'dblclick .metric-text':function(e,t){
		Session.set("currentEdit",this._id);
	},
	'click .edit-mode-off':function(e,t){
		Session.set("editMode",false);
	},
	'submit .metric-form':function(e,t){
		e.preventDefault();
		var value = t.find("#"+this._id).value;
		var id = Metrics.update({_id:this._id},{$set:{count:value,updated:true}});
		if(id){
			Session.set("editMode",false);
			Session.set("currentEdit",false);
		}
	},
	'focusout .input-metric':function(e,t){
		Session.set("currentEdit",false);
	}
});