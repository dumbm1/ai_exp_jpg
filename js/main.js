/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
  'use strict';
  init();

  function init() {

    themeManager.init();
    _loadJSX("json2.js");
    jQuery.fn.extend({
      disableSelection: function () {
        this.each(function () {
          this.onselectstart = function () {
            return false;
          };
        });
      }
    });
    $("body").disableSelection();


    var expTitleGeneral = document.getElementsByClassName("exp-title")[0];
    var expTitleText    = document.getElementsByClassName("exp-title")[1];
    var expTitleWhite   = document.getElementsByClassName("exp-title")[2];
    var expTitleOther   = document.getElementsByClassName("exp-title")[3];


    expTitleGeneral.addEventListener('click', function () {
      $("#exp_content_general").toggleClass("hiddenElem");
    });
    expTitleText.addEventListener('click', function () {
      $("#exp_content_text").toggleClass("hiddenElem");
    });
    expTitleWhite.addEventListener('click', function () {
      $("#exp_content_white").toggleClass("hiddenElem");
    });
    expTitleOther.addEventListener('click', function () {
      $("#exp_content_other").toggleClass("hiddenElem");
    });

    $("#form_general").sisyphus({customKeyPrefix: 'general'});
    $("#form_text").sisyphus({customKeyPrefix: 'text'});
    $("#form_white").sisyphus({customKeyPrefix: 'white'});
    $("#form_other").sisyphus({customKeyPrefix: 'other'});

    $("#btn_defaults_all").click(function () {
      $("form").trigger('reset');
    });
    $("#btn_defaults_general").click(function () {
      $("#form_general").trigger('reset');
    });
    $("#btn_defaults_text").click(function () {
      $("#form_text").trigger('reset');
    });
    $("#btn_defaults_white").click(function () {
      $("#form_white").trigger('reset');
    });
    $("#btn_defaults_white").click(function () {
      $("#form_other").trigger('reset');
    });

    function addInfo() {
      expTitleGeneral.setAttribute('title', _getFormValues('general'));
      expTitleText.setAttribute('title', _getFormValues('text'));
      expTitleWhite.setAttribute('title', _getFormValues('white'));
      expTitleOther.setAttribute('title', _getFormValues('other'));

      var inf_general = document.createElement('label');
      var inf_text    = document.createElement('label');
      var inf_white   = document.createElement('label');
      var inf_other   = document.createElement('label');

      inf_general.innerHTML = _getFormValues('general');
      expTitleGeneral.appendChild(inf_general);

      inf_text.innerHTML = _getFormValues('text');
      expTitleText.appendChild(inf_text);

      inf_white.innerHTML = _getFormValues('white');
      expTitleWhite.appendChild(inf_white);

      inf_other.innerHTML = _getFormValues('other');
      expTitleOther.appendChild(inf_other);
    }

    function _getFormValues(name) {
      var result = [];
      result.push($("#sel_color_model_" + name).find('option:selected').text());
      result.push($("#nmb_quality_" + name).val());
      result.push($("#sel_resolution_" + name).find('option:selected').text());
      result.push($("#sel_compress_method_" + name).find('option:selected').text());
      result.push($("#sel_antialias_" + name).find('option:selected').text());
      result.push($("#ch_use_artbs_" + name).prop('checked'));
      result.push($("#rad_artbs_all_" + name).prop('checked'));
      result.push($("#rad_artbs_range_" + name).prop('checked'));
      result.push($("#txt_artbs_range_" + name).val());
      result.push($("#txt_postfix_" + name).val());
      return result;
    }

    function _getFormValToObj(name) {
      var obj                 = {};
      obj["Color Model"]      = ($("#sel_color_model_" + name).find('option:selected').text());
      obj["Quality"]          = ($("#nmb_quality_" + name).val());
      obj["Resolution"]       = ($("#sel_resolution_" + name).find('option:selected').text());
      obj["Compression"]      = ($("#sel_compress_method_" + name).find('option:selected').text());
      obj["Anti-aliasing"]    = ($("#sel_antialias_" + name).find('option:selected').text());
      obj["Use artboards"]    = ($("#ch_use_artbs_" + name).prop('checked'));
      obj["rad_artbs_all_"]   = ($("#rad_artbs_all_" + name).prop('checked'));
      obj["rad_artbs_range_"] = ($("#rad_artbs_range_" + name).prop('checked'));
      obj["txt_artbs_range_"] = ($("#txt_artbs_range_" + name).val());
      obj["txt_postfix_"]     = ($("#txt_postfix_" + name).val());
      return obj;
    }

    $("#btn_reloadHtml").click(_reloadPanel);

    $("#btn_reloadJsx").click(function () {
      new CSInterface().requestOpenExtension('com.wk.ai_exp.dialog');
      new CSInterface().closeExtension();
    });

    function _loadJSX(fileName) {
      var csInterface   = new CSInterface();
      var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
      csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
    }

    // Reloads extension panel
    function _reloadPanel() {
      location.reload();
    }


  }
}());
    
