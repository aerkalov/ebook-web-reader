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

define("general", ["require", "jquery"], 
       function(require, jQuery) {

	   function _init(options) {

	   }
	   
	   function _parseText(args) {
	       var $data = args.data;
	       
	       jQuery("IMG", $data).each(function() {
		   var $img = jQuery(this);
		   $img.attr("src", args.bookURL+$img.attr("src"));
	       });
	       
	       jQuery("A", $data).each(function() {
		   var $a = jQuery(this);
		   var href = $a.attr("href");
		   $a.attr("href", '?'+href);
	       });
	       
	       jQuery("A", $data).click(function(event) {
		   var $this = jQuery(this);
		   var gui = require("ebookreader/gui");
		   
		   gui.showPage($this.attr("href"));
		   
		   return false;
	       });
	   }
	   	   
	   return {'info': {'name': 'General',
			    'version': '1.0',
			    'author': 'Aleksandar Erkalovic'},
		   'init': _init,
		   'parseText': _parseText};	   
       });
