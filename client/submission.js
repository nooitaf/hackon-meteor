
Template.submissionItemsItem.events({
  'click .submission-edit-toggle': function(){
    if (Session.equals('submission-edit-id',this._id)){
      Session.set('submission-edit-id',false)
    } else {
      Session.set('submission-edit-id',this._id)
    }
  }
})

Template.submissionItemsItem.helpers({
  isOpen: function(){
    return Session.equals('submission-edit-id',this._id)
  }
})

UI.registerHelper('submissionTypes', function(){
  return ['---','lecture','(lightning)talk','workshop','installation','project','performance','pancakes','$somethingawesome','other']
})
UI.registerHelper('submissionMinutes', function(){
  return [
    5,10,15,20,30,45,60,90,120,180,240
  ]
})
UI.registerHelper('countSubmissionsUser', function(pid){
    return Submissions.find({}).count() || "-"
})
UI.registerHelper('countSubmissionsAll', function(){
    return Counts.get('submissions') || "-"
})
UI.registerHelper('submissions', function(){
  return Submissions.find({},{sort:{date_created:-1}})
})
UI.registerHelper('submissionsByDateStart', function(){
  return Submissions.find({},{sort:{date_start:1}})
})
UI.registerHelper('submissionsWithoutTrackId', function(){
  return Submissions.find({track:{$in:[null,false,'0']}},{sort:{date_start:1}}).fetch() || false
})
UI.registerHelper('submissionsCanceled', function(){
  return Submissions.find({canceled:true})
})
UI.registerHelper('submissionsByDateStartWithTrackId', function(trackid){
  return Submissions.find({track:trackid},{sort:{date_start:1}})
})
UI.registerHelper('submissionsWithUserId', function(uid){
  return Submissions.find({owner:uid},{sort:{date_created:-1}})
})
UI.registerHelper('submissionsWithCurrentUserId', function(){
  return Submissions.find({owner:Meteor.userId()},{sort:{date_created:-1}})
})


Template.submissionEdit.events({
  'click .submission-submit': function(e,t){
    var type = t.find('select[name=submission-type]').value || false
    var title = t.find('input[name=submission-title]').value || false
    var text = t.find('textarea[name=submission-text]').value || false
    var minutes = t.find('select[name=submission-minutes]').value || false
    if (type && title && text) {
      var item = {
        type: type,
        title: title,
        text: text,
        minutes: parseInt(minutes),
        owner: this.owner || Meteor.userId()
      }
      Submissions.update(this._id, {$set:item})
      Session.set('submission-edit-id',false)
    } else {
      alert('Please fill out type, title and text.')
    }
  },
  'click .submission-delete': function(){
    if(confirm('are you sure you want to remove the submission: "'+this.title+'"? ')) {
      Submissions.remove(this._id)
    }
  }
})
Template.submissionItemAdd.events({
  'click .submission-show-form': function(e,t){
    t.find('.row').style.display = 'block';
    t.find('.submission-show-form').style.display = 'none';

  },
  'click .submission-submit': function(e,t){
    var type = t.find('select[name=submission-type]').value || false
    var title = t.find('input[name=submission-title]').value || false
    var text = t.find('textarea[name=submission-text]').value || false
    var minutes = t.find('select[name=submission-minutes]').value || false
    if (type && title && text) {
      var item = {
        type: type,
        title: title,
        text: text,
        minutes: parseInt(minutes),
        owner: Meteor.userId()
      }
      Submissions.insert(item, function(err,res){
        if (err) throw new Meteor.Error(err)
        if (res) {
          t.find('.row').style.display = 'none';
          t.find('.submission-show-form').style.display = 'block';
          t.find('select[name=submission-type]').value = '---';
          t.find('select[name=submission-minutes]').value = '5';
          t.find('input[name=submission-title]').value = '';
          t.find('textarea[name=submission-text]').value = '';
        }
      })
    } else {
      alert('Please fill out type, title and text.')
    }
  }
})
