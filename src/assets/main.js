require.config({
    baseUrl: 'assets/',
    paths: {
	'jquery': 'js/jquery',
	'bootstrap': 'js/bootstrap.min',
	'switch': 'js/bootstrapSwitch',
	'purl': 'js/purl'
    },
    shim: {
	'bootstrap': ['jquery', 'purl']
    } 
});

