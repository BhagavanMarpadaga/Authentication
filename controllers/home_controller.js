module.exports.home=function(req,res)
{
    return res.render('home',{title:'home',
        success:req.flash('success')
    });
}