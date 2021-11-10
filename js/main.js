(function () {
  'use strict';
  var FIT_WIN_TIMEOUT = 100;
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
      }, FIT_WIN_TIMEOUT);
    });
    /**
     * event delegation
     * */
    $('#export_sets').click(function (e) {
      var formName;

      if ($(e.target).hasClass('label-title')) {
        formName = e.target.parentElement.parentElement.nextElementSibling.getAttribute('id').slice(5);
        $('#exp_content_' + formName).toggleClass('hiddenElem');
        setTimeout(function () {
          fitWindowToContent();
        }, FIT_WIN_TIMEOUT);
      }
      if ($(e.target).hasClass('title-bg')) {
        formName = e.target.nextElementSibling.getAttribute('id').slice(5);
        $('#exp_content_' + formName).toggleClass('hiddenElem');
        setTimeout(function () {
          fitWindowToContent();
        }, FIT_WIN_TIMEOUT);
      }

    });

    $('#form_general').sisyphus({customKeyPrefix: 'general'});
    $('#form_text').sisyphus({customKeyPrefix: 'text'});
    $('#form_white').sisyphus({customKeyPrefix: 'white'});
    $('#form_other').sisyphus({customKeyPrefix: 'other'});
    $('#form_folderName').sisyphus();

    $('#btn_defaults_all').click(function () {
      if (!confirm('Вы уверены, что хотите сбросить все настройки?')) return;
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
    $('#btn_defaults_other').click(function () {
      $('#form_other').trigger('reset');
    });

    $('.btn-export').click(function () {
      // alert(($(this).attr('id')).slice(11));
      var opts = getFormValToObj(($(this).attr('id')).slice(11));
      opts.folderName = document.getElementById('txt_folderName').value;
      new CSInterface().evalScript('ai_exp_jpg(' + JSON.stringify(opts) + ')');
    });

    $('#btn_reloadHtml').click(reloadPanel);
  }

  function fitWindowToContent() {
    setTimeout(function () {
      csInterface.resizeContent(document.documentElement.offsetWidth, document.documentElement.offsetHeight);
    }, 100);
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
