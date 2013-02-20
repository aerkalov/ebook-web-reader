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

define("ebookreader/plugins/general", ["require", "jquery", "purl"], 
       function(require, jQuery, purl) {

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
		   var url = purl(name);
		   console.debug(typeof name);
		   console.debug('----------------------------------');
		   console.debug(name);
		   console.debug('protocol '+url.attr('protocol'));
		   console.debug('relative '+url.attr('relative')); // ovaj je bitan
		   console.debug('path '+url.attr('path'));
		   console.debug('file '+url.attr('file'));
		   console.debug('directory '+url.attr('directory'));

		   console.debug('fragment '+url.attr('fragment'));

		   if(url.attr('protocol') == '') {
		       if(url.attr('relative') != '') {
			   // '#something'
			   var n = name.indexOf(url.attr('relative'));
			   if( n == 0) {
			       $elem.setAttribute("href", url.attr('relative'));			   
			   } else { //page#something
			       var pageName = name.substring(0, n-1);
			       
			       $elem.setAttribute("href", "?"+pageName);

			       $elem.addEventListener('click', function(event) {
				   var gui = require("ebookreader/gui");		       
				   gui.showPage(name);
				   
				   event.preventDefault();		       
			       }, false);
			       
			   }
		       } else {
			   $elem.setAttribute("href", "?"+name);
			   
			   $elem.addEventListener('click', function(event) {
			       var gui = require("ebookreader/gui");		       
			       gui.showPage(name);
			       
			   event.preventDefault();		       
			   }, false);
		       }
		   } else {
		       $elem.setAttribute("target", "_blank");
		   }
	       });	       
	   }
	   	   
	   return {'info': {'name': 'General',
			    'version': '1.0',
			    'author': 'Aleksandar Erkalovic'},
		   'init': _init,
		   'parseText': _parseText};	   
       });
