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

define("ebookreader", ["require", "jquery", "ebookreader/gui", "ebookreader/epub", "ebookreader/plugins/general"], 
       function(require, jQuery, ebookgui, epub, b) {

	   /* default options */
	   var options = {bookTitle: '',
			  bookURL: '',
			  ncxFile: null,
			  toc: null,
			  autoHide: false,
			  plugins: ["general"]
			 };

	   /* list of initialized plugins */
	   var plugins = {};
	   
	   /* expand default options with user options */
	   function _configure(ops) {
	       options = jQuery.extend(options, ops); 
	   }
	   
	   /* initialize plugins */
	   function _initPlugins() {
	       require(options.plugins, function() {
		   for(var i=0; i < options.plugins.length; i++) {
		       var pluginName = options.plugins[i];
		       plugins[pluginName] = arguments[i];	    
		       plugins[pluginName].init(options);	    
		   }
	       });
	   }
	   
	   /* run to the plugins! */
	   function _exec(func, args) {
	       jQuery.each(plugins, function(i, plug) {
		   if(typeof plug[func] !== 'undefined') {
		       plug[func](args);
		   }
		   
	       });
	   }
	   
	   /* initialize e-book web reader */
	   function _init() {
	       _initPlugins();
	       
	       /* initialize gui */
	       ebookgui.initUI(options);
	       
	       /* read the toc */
	       if(options.ncxFile != null) {
		   epub.readNCX(options, function(toc) {
		       options['toc'] = toc;
		       ebookgui.showIntro();
		       // ebookgui.showTOC();
		   });
	       }
	   }
	   
	   /* set option */
	   /* not really happy with this */
	   function _set(name, value) {
	       options[name] = value;
	   }
	   
	   /* get option */
	   /* not really happy with this */
	   function _get(name) {
	       return options[name];
	   }
	   
	   
	   return {configure: _configure,
		   init: _init,
		   set: _set,
		   get: _get,
		   exec: _exec
		  }	   
       }
);
