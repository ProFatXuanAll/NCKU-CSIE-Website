const express = require( 'express' );
const router = new express.Router();

// route to filter (announcement/)
router.get( '/', (req, res) => {
    res.render('/');
} );

// route to /announcement/all
router.get( '/all', (req, res) => {
    res.render('announcement/all');
} );

// route to /announcement/administrator
router.get( '/administrator', (req, res) => {
    res.render( 'announcement/administrator' );
} );

// route to /announcement/activity
router.get( '/activity', (req, res) => {
    res.render( 'announcement/activity' );
} );

// route to /announcement/speech
router.get( '/speech', () => {
    res.render( 'announcement/speech' );
} );

// route to /announcement/recruitment
router.get( '/recruitment', function ( req, res ) {
    res.render( 'announcement/recruitment' );
} );

function errorHandler( err, req, res, next ) {
    //if ( res. )
}

module.exports = router;
