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

define("ebookreader/gui", ["require", "jquery", "bootstrap", "switch"], 
       function(require, jQuery, bootstrap, switchGui) {
	   var inProgress = false; /* auto hide is in progress */
	   var isDay = true;       /* day or night */
	   
	   /* default options */
	   var cssStyle = {
	       'background-color': 'white',
	       'font-family': " 'lucida grande','lucida sans unicode', sans-serif"
	   }
	   
	   /*****************************************************************************************/
	   /* Set iframe size                                                                       */
	   /*****************************************************************************************/
	   
	   function setIframeHeight() {
	       var iframe = document.getElementById('page');

	       if (iframe) {
		   var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
		   if (iframeWin.document.body) {
		       iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
		   }
	       }
	   };


	   /*****************************************************************************************/
	   /* Set CSS                                                                               */
	   /*****************************************************************************************/

	   function setCSS() {	
               var iframe = jQuery("#page").contents();
               var styl = jQuery("STYLE[id=localcss]", iframe);
               var readerStyl = jQuery("STYLE[id=localcss]");
	       
               styl.empty();
	       
	       function getBackgroundColor() {
		   if(isDay) {
		       return 'BODY { background-color: '+ cssStyle['background-color']+'; } ';
		   } else {
		       return 'BODY { background-color: black; color: white;} A, A:visited, A:hover { color: white; text-decoration: underline; }';
		   }
		   
	       }
	       
	       var s = getBackgroundColor();
	       var s2 = 'BODY { font-family: '+ cssStyle['font-family']+'; }   ';
	       
	       readerStyl.html(s);
	       styl.html(s+s2);
	   }
	   
	   /*****************************************************************************************/
	   /* Show Page                                                                             */
	   /*****************************************************************************************/
	   
	   function _showPage(pageID, nopush) {
               var $iframe = jQuery("#page").contents();
	       var ebookreader = require("ebookreader");
	       var bookURL = ebookreader.get('bookURL');
	       
	       var e = pageID;
	       
	       if(e.substr(0, 1) == '?')
		   e = e.substr(1);
	       
	       if(!nopush) {
		   history.pushState(e, pageID, "?"+e);
	       } else {
		   history.replaceState(e, pageID, "?"+e);	
	       }

	       jQuery.ajax({
		   type: 'GET', 
		   url: bookURL+e,
		   dataType: 'html',
		   success: function(data) {	       
		       $iframe.unbind('click');

		       try {
			   var parser=new DOMParser();
			   var xmlDoc=parser.parseFromString(data,"text/xml");
                       } catch(e) {
			   alert(e.message);
			   return;
                       }
		       var $data = xmlDoc.getElementsByTagName("body")[0];
		       /*
		       var e = [];
		       
		       for(var i = 0; i < $d.length; i++) {
			   var name = $d[i].nodeName;
			   if(name != 'TITLE' && name != 'LINK' && name != 'SCRIPT' && name != '#comment' && name != '#text') {
			       e.push($d[i]);
			   }
		       }
		       
		       var $data = jQuery(e);
		       */
		       console.debug($data);
		       ebookreader.exec('parseText', {'data': $data, 
						      'bookURL': bookURL});
		       
		       jQuery("BODY", $iframe).html(jQuery($data));
		       setTimeout(function() {
			   setIframeHeight();
			   jQuery(window).scrollTop(0);
		       }, 200);
		       
		       return false;
		   }
	       });	
	   }
	   
	   
	   /*****************************************************************************************/
	   /* Show TOC                                                                              */
	   /*****************************************************************************************/
	   
	   function _showTOC(first) {
	       var ebookreader = require("ebookreader");
               var $iframe = jQuery("#page").contents();
	       var toc = ebookreader.get('toc');
	       
	       
	       if(first) {
		   history.pushState('toc', "Table of Contents", "?");
	       } else {
		   history.replaceState('toc', "Table of Contents", "?");
	       }
	       
	       function _showNodes(nodes) {
		   var s = '';
		   
		   for(var i = 0; i < nodes.length; i++) {
		       var node = nodes[i];
		       s += '<li><span><a href="?'+node.href+'">'+node.title+'</a></span>';
		       
		       if(node.children && node.children.length > 0) {
			   s += '<ol>'+_showNodes(node.children)+'</ol>';
		       } 
		       s += '</li>';
		   }
		   
		   return s;
	       }
	       
	       
	       jQuery("BODY", $iframe).html('<div id="toc"><ol>' + _showNodes(toc) + '</ol></div>');
	       
	       jQuery("A", $iframe).click(function(event) {
		   event.preventDefault();
		   
		   var $this = jQuery(this);
		   _showPage($this.attr("href"));
		   return false;
	       });
	       
	       setIframeHeight();
	       jQuery(window).scrollTop(0);
	   }
	   
	   /*****************************************************************************************/
	   /* Show Intro                                                                            */
	   /*****************************************************************************************/	   

	   function _showIntro(first) {
               var $iframe = jQuery("#page").contents();
	       // also set white color as background
	       // maybe just use bootstrap css here
	       var s = '<h1 style="text-align: center; padding-bottom: 10px; margin-bottom: 0px;">E-Book Web Reader v0.1</h1><h2 style="margin-top: 0px; text-align: center; padding-bottom: 15px; color: #999;">~ Rheya ~</h2>\
<p style="clear: both; padding-bottom: 20px; text-align: center;"><a style="color: #08c; font-size: 120%; font-weight: bold;" href="#" class="read">START READING THE BOOK</a></p> \
<p><img src="assets/images/book-vector-small.png" width="300" height="226" style="float: left; margin-right: 30px;"/>\
<ul><li>read EPUB books</li><li>read <a href="http://www.booktype.org/" target="_blank">Booktype</a> books</li><li>customizable interface</li><li>soon to come: support for mathematics, offline reading, annotations, support for more devices, ...</li></ul>\
</p>\
<p style="text-align: center; clear: left; padding-top: 10px;"><a style="color: #08c;" href="https://github.com/aerkalov/ebook-web-reader">https://github.com/aerkalov/ebook-web-reader</a></p> \
';
	       jQuery("BODY", $iframe).html(s);
	       
	       jQuery('A.read', $iframe).click(function(event) {
		   _showTOC(1);
	       });
	       
	       setIframeHeight();
	       jQuery(window).scrollTop(0);
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
	       /* open font options */	       
	       jQuery("#footer .fontoption").click(function() {
		   openFontOption();
		   return false;
	       });
	       
	       /* choose the color */
	       jQuery("#textmodal DIV.colorblock").click(function() {
		   var $this = jQuery(this);
		   var color = $this.css("background-color");
		   
		   cssStyle['background-color'] = color;
		   setCSS();
	       });
	       
	       jQuery("#textmodal DIV.fontblock").click(function() {
		   var $this = jQuery(this);
		   var font = $this.css("font-family");
		   
		   cssStyle['font-family'] = font;
		   setCSS();
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
	       function _keydown(event) {
		   if(event.type == 'keydown') {
		       if(event.which == 84)
			   _showTOC(1);
		       
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
	   /* History Event                                                                        */
	   /*****************************************************************************************/	   

	   function historyEvent() {
	       /* browser history */
	       jQuery(window).bind("popstate", function(event) {
		   if (event.originalEvent && event.originalEvent.state) {
		       if(event.originalEvent.state == "toc") {
			   _showTOC();
		       } else {
			   _showPage(event.originalEvent.state, 1);
		       }
		       
		   }
		   event.preventDefault();
		   return false;
	       });
	   }
	   
	   /*****************************************************************************************/
	   /* Initialize UI                                                                         */
	   /*****************************************************************************************/	   
	   
	   function _initUI(options) {	       

	       /* Initialize all tooltips */
	   	jQuery("[rel='tooltip']").tooltip();
    
	       jQuery("DIV.navbar A.booktitle").html(options.bookTitle);
	       
	       jQuery("DIV.navbar A.toc").click(function() {
		   /* open table of contents */
		   _showTOC(1);
		   return false;
	       });	

	       jQuery("DIV.navbar A.booktitle").click(function() {
		   /* open table of contents */
		   _showTOC(1);
		   return false;
	       });	

	       jQuery("#footer A.infolink").click(function() {
		   _showIntro();
		   return false;
	       });	

	       
	       /* day night switch */
	       jQuery('#switchnight').on('switch-change', function (e, data) {
		   var value = data.value;
		   isDay = !value;
		   setCSS();
	       });
	       
	       initFontDialog();

	       autoHideEvent(options);
	       keydownEvent(options);	       
	       historyEvent();

	       /* Set default css */
	       setCSS();	       
	       jQuery("A.bookmarklink").popover();
	   }
	   
	   return {initUI: _initUI,
		   showIntro: _showIntro,
		   showTOC: _showTOC,
		   showPage: _showPage};
       });
