Metrics = new Meteor.Collection("metrics");

Metrics.update({},{ $set: { updated:false} } ,{multi:true});

Meteor.publish('allMetrics',function(){
	return Metrics.find();
});