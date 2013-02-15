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

define("ebookreader/epub", ["require", "jquery"], 
       function(require, jQuery) {

	   /* parse nodes */
	   function parseNodes(items) {
	       var lst = [];
	       
	       for(var i = 0; i < items.length; i++) {
		   // i feel lazy but this is not really the best way how to do it
		   var a = {'title': jQuery(jQuery("navLabel text", items[i])[0]).text(),
			    'href':  jQuery(jQuery("content", items[i])[0]).attr("src"),
			    'children': null}
		   
		   var chldr = items[i].childNodes;
		   var cl = [];
		   
		   for(var j = 0; j < chldr.length; j++) {
		       /* On iPad, nodeName is in uppercase */
		       if(chldr[j].nodeName.toUpperCase() == 'NAVPOINT') {
			   cl.push(parseNodes(jQuery(chldr[j]))[0]);
		       }
		   }
		   
		   a.children = cl;
		   lst.push(a);	    
	       }
	       
	       return lst;
	   }

	   /* Parse NCX file */
	   /* As expected, one should check for errors here */
	   function _readNCX(ops, callback) {
	       jQuery.get(ops.ncxFile, function(data) {
		   var $ncx = jQuery(data);
		   var toc = parseNodes(jQuery("navMap", $ncx).children());
		   
		   //var ebookreader = require("ebookreader");
		   
		   callback(toc);
	       });	
	   }
	   
	   return {readNCX: _readNCX};
       });
