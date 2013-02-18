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

define("ebookreader/plugins/general", ["require", "jquery"], 
       function(require, jQuery) {

	   function _init(options) {

	   }
	   
	   function _parseText(args) {
	       var $data = args.data;

	       jQuery($data.getElementsByTagName('img')).each(function() {
		   var $elem = this;
		   $elem.setAttribute("src", args.bookURL+$elem.getAttribute('src'));
	       });

	       jQuery($data.getElementsByTagName('a')).each(function() {
		   var $elem = this;
		   var name  = $elem.getAttribute("href");

		   // it should guess is it relative link, link to remote resource and etc...
		   
		   $elem.setAttribute("href", "?"+name);

		   $elem.addEventListener('click', function(event) {
		       var gui = require("ebookreader/gui");		       
		       gui.showPage(name);

		       event.preventDefault();		       
		   }, false);
	       });	       
	   }
	   	   
	   return {'info': {'name': 'General',
			    'version': '1.0',
			    'author': 'Aleksandar Erkalovic'},
		   'init': _init,
		   'parseText': _parseText};	   
       });
