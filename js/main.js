/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
  'use strict';

  // Reloads extension panel
  function reloadPanel() {
    location.reload();
  }

  var csInterface = new CSInterface();

  function loadJSX(fileName) {
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
  }

  function init() {

    themeManager.init();
    loadJSX("json2.js");

    function testCount() {
      var count = 0;
      return function (str) {
        return str + ++count;
      }
    }

    var count = testCount();

    $("#btn_test").click(function () {

      this.value = count('Test #');
      csInterface.evalScript("ai_exp_jpg()", function (result) {

      });
    });

    $("#btn_send").click(function () {
      csInterface.evalScript('sendObjToHTML()', function (result) {
        alert(result);
      });
    });

    $("#btn_reloadHtml").click(reloadPanel);
    $("#btn_reloadJsx").click(function () {
      new CSInterface().closeExtension();
    });

  }

  init();

}());
    
