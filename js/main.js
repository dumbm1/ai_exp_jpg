/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
  'use strict';
  var csInterface = new CSInterface();
  init();

  function init() {

    themeManager.init();
    loadJSX('hostscript.jsx');
    loadJSX('json2.js');

    jQuery.fn.extend({
                       disableSelection: function () {
                         this.each(function () {
                           this.onselectstart = function () {
                             return false;
                           };
                         });
                       }
                     });
    $('body').disableSelection();

    /* set the size of the window */
    $(document).ready(function () {

      setTimeout(function () {
        fitWindowToContent();
      }, 100);
    });

    $('.exp-title').click(function () {
      //todo: I'm don't know, why 'e.target' don't work which work in next handler...
      var formName = this.parentElement.nextElementSibling.getAttribute('id').slice(5);
      $('#exp_content_' + formName).toggleClass('hiddenElem');
      setTimeout(function () {
        fitWindowToContent();
      }, 100);
    });
    $('.title-bg').click(function (e) {
      var formName = e.target.nextElementSibling.getAttribute('id').slice(5);
      $('#exp_content_' + formName).toggleClass('hiddenElem');
      setTimeout(function () {
        fitWindowToContent();
      }, 100);
    });

    $('#form_general').sisyphus({customKeyPrefix: 'general'});
    $('#form_text').sisyphus({customKeyPrefix: 'text'});
    $('#form_white').sisyphus({customKeyPrefix: 'white'});
    $('#form_other').sisyphus({customKeyPrefix: 'other'});

    $('#btn_defaults_all').click(function () {
      $('form').trigger('reset');
    });
    $('#btn_defaults_general').click(function () {
      $('#form_general').trigger('reset');
    });
    $('#btn_defaults_text').click(function () {
      $('#form_text').trigger('reset');
    });
    $('#btn_defaults_white').click(function () {
      $('#form_white').trigger('reset');
    });
    $('#btn_defaults_white').click(function () {
      $('#form_other').trigger('reset');
    });

    $('.btn-export').click(function () {
      // alert(($(this).attr('id')).slice(11));
      var opts = getFormValToObj(($(this).attr('id')).slice(11));
      new CSInterface().evalScript('ai_exp_jpg(' + JSON.stringify(opts) + ')');
    });

    $('#btn_reloadHtml').click(reloadPanel);

    $('#btn_reloadJsx').click(function () {
      new CSInterface().requestOpenExtension('com.wk.ai_exp.dialog');
      new CSInterface().closeExtension();
    });
  }

  function fitWindowToContent() {
    if (typeof csInterface.resizeContent != 'undefined') {
      var bodyVertMargin = parseInt($('body').css('marginTop')) + parseInt($('body').css('marginBottom'));
      var bodyHorzMargin = parseInt($('body').css('marginLeft')) + parseInt($('body').css('marginRight'));
      // console.log("Width: " + $("#extension-panel").width() + ", Height: " + Math.floor($("#extension-panel").innerHeight()));
      csInterface.resizeContent($('#content').width() +
                                bodyHorzMargin, Math.floor($('#content').innerHeight()) + bodyVertMargin);
    }
  }

  function getFormValToObj(name) {
    name = name || 'general';

    var obj = {};
    obj['sel_color_model'] = ($('#sel_color_model_' + name).find('option:selected').text());
    obj['nmb_quality'] = ($('#nmb_quality_' + name).val());
    obj['sel_resolution'] = ($('#sel_resolution_' + name).find('option:selected').text());
    obj['sel_compress_method'] = ($('#sel_compress_method_' + name).find('option:selected').text());
    obj['sel_scans'] = ($('#sel_scans_' + name).find('option:selected').text());
    obj['sel_anti_aliasing'] = ($('#sel_antialias_' + name).find('option:selected').text());
    obj['ch_use_artboards'] = ($('#ch_use_artbs_' + name).prop('checked'));
    obj['rad_artbs_all'] = ($('#rad_artbs_all_' + name).prop('checked'));
    obj['rad_artbs_range'] = ($('#rad_artbs_range_' + name).prop('checked'));
    obj['txt_artbs_range'] = ($('#txt_artbs_range_' + name).val());
    obj['txt_postfix'] = ($('#txt_postfix_' + name).val());

    return obj;
  }
  function loadJSX(fileName) {
    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + '/jsx/';
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
  }
  function reloadPanel() {
    location.reload();
  }
}());
