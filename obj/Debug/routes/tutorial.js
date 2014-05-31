exports.index = function(req, res){
  res.render('tutorial.html', { title: 'Express' });
};
exports.part = function(req, res){
    var tutorial_id = req.params.id;
    if (tutorial_id) {
        res.render('part' +tutorial_id+".html", { title: 'Express' });
    }
};