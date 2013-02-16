require.config({
    baseUrl: 'assets/',
    paths: {
	'jquery': 'js/jquery',
	'bootstrap': 'js/bootstrap.min',
	'switch': 'js/bootstrapSwitch'
    },
    shim: {
	'bootstrap': ['jquery']
    } 
});

