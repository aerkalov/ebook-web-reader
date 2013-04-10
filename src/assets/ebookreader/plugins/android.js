/*
 This file is part of E-Book Web Reader.
 Copyright (c) 2013 Aleksandar Erkalovic <aleksandar.erkalovic@sourcefabric.org>

 E-Book Web Reader is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 E-Book Web Reader is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with E-Book Web Reader.  If not, see <http://www.gnu.org/licenses/>.
*/

define("ebookreader/plugins/android", ["require", "jquery"], 
       function(require, jQuery) {

	   function _init(options) {

	   }


	   function toggleMenu() {
	       jQuery("#footer").toggle();
	       jQuery("DIV.navbar-fixed-top").toggle();
	   }

	   function _pageLoaded() {
	       var d = null;
	       var _moved = false;

	       function _getTime() {
		   var d = new Date();
		   return d.getTime();
	       }

	       jQuery("#page").contents().bind('touchstart', function() {
		   d = _getTime();
		   _moved = false;
	       });

	       jQuery("#page").contents().bind('touchmove', function() {
		   _moved = true;
	       });

	       jQuery("#page").contents().bind('touchend', function() {
		   if(_getTime()-d < 500 && _moved == false) {
		       toggleMenu();
		   }
	       });

	   }


	   /*****************************************************************************************/
	   /* Initialize UI                                                                         */
	   /*****************************************************************************************/	   
	  
	   function _initUI(options) {	       
	       var gui = require('ebookreader/gui');

	       jQuery("DIV.navbar A.booktitle").html(options.bookTitle);


	       _pageLoaded();

	       /* Set default css */
	       gui.setCSS();	       
	       toggleMenu();
	   }
 
	   return {'info': {'name': 'Android UI',
			    'version': '1.0',
			    'author': 'Aleksandar Erkalovic'},
		   'init': _init,
		   'initUI': _initUI,
		   'pageLoaded': _pageLoaded};
       });
