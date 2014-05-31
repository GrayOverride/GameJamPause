
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('tutorial.html', { title: 'Express' });
};