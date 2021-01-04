/*
*  jquery-svg - v0.0.0
*  A lightweight jQuery plugin to apply css styles and js scripts to a SVG which is embedded (using the <object> tag).
*  http://berneti.ir
*
*  Made by Mohammadreza Berneti
*  Under MIT License
*/

"use strict";

(function ($) {
	// select a svg element from embed or object tag
	$.fn.getSVG = function (selector) {
		var svgDoc = this[0].contentDocument; // Get the document object for the SVG
		return $(svgDoc);
	};
	$.fn.setSVGStyle = function (style) {
		var svgDoc = this[0].contentDocument; // Get the document object for the SVG
		var styleElement = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
		styleElement.textContent = style; // add whatever you need here
		svgDoc.getElementsByTagName("svg")[0].appendChild(styleElement);
		return;
	};
	$.fn.setSVGStyleLink = function (link) {
		var svgDoc = this[0].contentDocument; // Get the document object for the SVG
		var linkElm = svgDoc.createElementNS("http://www.w3.org/1999/xhtml", "link");
		linkElm.setAttribute("href", link);
		linkElm.setAttribute("type", "text/css");
		linkElm.setAttribute("rel", "stylesheet");
		svgDoc.getElementsByTagName("svg")[0].appendChild(linkElm);
		return;
	};
	// get a random number between min and max
	$.getRandom = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
})(jQuery);

