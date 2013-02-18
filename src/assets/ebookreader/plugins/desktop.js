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

define("ebookreader/plugins/desktop", ["require", "jquery"], 
       function(require, jQuery) {

	   function _init(options) {

	   }


	   /*****************************************************************************************/
	   /* Open Font Option                                                                      */
	   /*****************************************************************************************/	   
	   
	   function openFontOption() {
	       jQuery("#textmodal").modal({'show': true,
					   'backdrop': false,					
					   'keyboard': false});	       
	   }


	   /*****************************************************************************************/
	   /* Initialize Font Dialog                                                                */
	   /*****************************************************************************************/	   

	   function initFontDialog() {
	       var gui = require('ebookreader/gui');

	       /* open font options */	       
	       jQuery("#footer .fontoption").click(function() {
		   openFontOption();
		   return false;
	       });
	       
	       /* choose the color */
	       jQuery("#textmodal DIV.colorblock").click(function() {
		   var $this = jQuery(this);
		   var color = $this.css("background-color");
		   
		   gui.cssStyle['background-color'] = color;
		   gui.setCSS();
	       });
	       
	       jQuery("#textmodal DIV.fontblock").click(function() {
		   var $this = jQuery(this);
		   var font = $this.css("font-family");
		   
		   gui.cssStyle['font-family'] = font;
		   gui.setCSS();
	       });
	       
	       jQuery('#textmodal').on('show', function () {
		   
	       })

	       /* close the font dialog */
	       jQuery("#textmodal .btn").click(function() {
		   jQuery("#textmodal").modal('hide');
		   return false;
	       });


	   }

	   /*****************************************************************************************/
	   /* Auto Hide Event                                                                       */
	   /*****************************************************************************************/	   

	   function autoHideEvent(options) {

	       /* AUTOHIDE */
	       if(options.autoHide == true) {
		   inProgress = true;
		   jQuery("#footer").slideUp(function() {
		       inProgress = false;
		   });
		   
		   function _mousemove(e) {
		       var diff = jQuery(window).innerHeight()-e.clientY;
		       
                       if(!inProgress) {
			   if(diff < 190) {
                               inProgress = true;
                               jQuery("#footer").slideDown(function() {
				   inProgress = false;
                               });
			   } else {
                               inProgress = true;
                               jQuery("#footer").slideUp(function() {
				   inProgress = false;
                               });
			   }
                       }
		   }
		   
		   jQuery(document).mousemove(_mousemove);
		   jQuery("#page").contents().mousemove(_mousemove);
	       }

	   }

	   /*****************************************************************************************/
	   /* Keydown   Event                                                                       */
	   /*****************************************************************************************/	   

	   function keydownEvent(options) {
	       var gui = require('ebookreader/gui');

	       function _keydown(event) {
		   if(event.type == 'keydown') {
		       if(event.which == 84)
			   gui.showTOC(1);
		       
		       if(event.which == 70)
			   openFontOption();
		       
		       if(event.which == 66)
			   history.back();
		   }
		   /*
		     console.debug("pressed");
		     console.debug(event.type);
		     console.debug(event.which);
		   */
	       }
	       
	       jQuery(document).bind('keydown', _keydown);
	       jQuery("#page").contents().bind('keydown', _keydown);	       
	   }


	   /*****************************************************************************************/
	   /* Initialize UI                                                                         */
	   /*****************************************************************************************/	   
	  
	   function _initUI(options) {	       
	       var gui = require('ebookreader/gui');

	       /* Initialize all tooltips */
	   	jQuery("[rel='tooltip']").tooltip();
    
	       jQuery("DIV.navbar A.booktitle").html(options.bookTitle);
	       
	       jQuery("DIV.navbar A.toc").click(function() {
		   /* open table of contents */
		   gui.showTOC(1);
		   return false;
	       });	

	       jQuery("DIV.navbar A.booktitle").click(function() {
		   /* open table of contents */
		   gui.showTOC(1);
		   return false;
	       });	

	       jQuery("#footer A.infolink").click(function() {
		   gui.showIntro();
		   return false;
	       });	

	       
	       /* day night switch */
	       jQuery('#switchnight').on('switch-change', function (e, data) {
		   var value = data.value;
		   gui.isDay = !value;
		   gui.setCSS();
	       });
	       
	       initFontDialog();
	       autoHideEvent(options);

	       keydownEvent(options);	       

	       /* Set default css */
	       gui.setCSS();	       
	       jQuery("A.bookmarklink").popover();


	   }
 
	   return {'info': {'name': 'Desktop UI',
			    'version': '1.0',
			    'author': 'Aleksandar Erkalovic'},
		   'init': _init,
		   'initUI': _initUI};
       });
