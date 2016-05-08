(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("pass-when", [], factory);
	else if(typeof exports === 'object')
		exports["pass-when"] = factory();
	else
		root["pass-when"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function pass(what) {
	  var lastMatches = null;
	  var result = null;
	
	  var afterPassContext = {
	    when: when,
	    whenNot: whenNot
	  };
	
	  var afterWhenContext = {
	    orWhen: orWhen,
	    orWhenNot: orWhenNot,
	    andWhen: andWhen,
	    andWhenNot: andWhenNot,
	    to: to
	  };
	
	  var afterToContext = {
	    when: when,
	    whenNot: whenNot,
	    or: or,
	    resolve: resolve,
	    resolveToPromise: resolveToPromise
	  };
	
	  var afterOrContext = {
	    to: to
	  };
	
	  function when(fn) {
	    if (typeof fn !== "function") {
	      throw new Error("first argument passed to \"when\" must be a function");
	    }
	    lastMatches = !result && fn(what);
	    return afterWhenContext;
	  }
	
	  function whenNot(fn) {
	    if (typeof fn !== "function") {
	      throw new Error("first argument passed to \"whenNot\" must be a function");
	    }
	    lastMatches = !result && !fn(what);
	    return afterWhenContext;
	  }
	
	  function andWhen(fn) {
	    if (typeof fn !== "function") {
	      throw new Error("first argument passed to \"andWhen\" must be a function");
	    }
	    lastMatches = !result && lastMatches && fn(what);
	    return afterWhenContext;
	  }
	
	  function andWhenNot(fn) {
	    if (typeof fn !== "function") {
	      throw new Error("first argument passed to \"andWhenNot\" must be a function");
	    }
	    lastMatches = !result && lastMatches && !fn(what);
	    return afterWhenContext;
	  }
	
	  function orWhen(fn) {
	    if (typeof fn !== "function") {
	      throw new Error("first argument passed to \"orWhen\" must be a function");
	    }
	    if (!result && fn(what)) {
	      lastMatches = true;
	    }
	    return afterWhenContext;
	  }
	
	  function orWhenNot(fn) {
	    if (typeof fn !== "function") {
	      throw new Error("first argument passed to \"orWhen\" must be a function");
	    }
	    if (!result && !fn(what)) {
	      lastMatches = true;
	    }
	    return afterWhenContext;
	  }
	
	  function to(fn) {
	    if (typeof fn !== "function") {
	      throw new Error("first argument passed to \"to\" must be a function");
	    }
	    if (lastMatches) {
	      result = fn;
	    }
	    return afterToContext;
	  }
	
	  function or() {
	    lastMatches = !result && !lastMatches;
	    return afterOrContext;
	  }
	
	  function resolve() {
	    if (typeof result !== "function") {
	      throw new Error("at least one \"when\" case must match before resolve");
	    }
	    return result(what);
	  }
	
	  function resolveToPromise() {
	    if (typeof result !== "function") {
	      throw new Error("at least one \"when\" case must match before resolveToPromise");
	    }
	    return Promise.resolve(result(what));
	  }
	
	  return afterPassContext;
	}
	
	exports.default = pass;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=pass-when.js.map