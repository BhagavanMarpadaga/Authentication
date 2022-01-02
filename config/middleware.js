module.exports.setFlash=function(req,res,next){
    res.locals.flash={
        'success':req.flash('success'),
        'error':req.flash('error')
    }
    // console.log('req flash success',req.flash('success'));
    // console.log('req flash success',req.flash('success'));
    next();
}