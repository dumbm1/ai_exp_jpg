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
      addParams2Titles();
    });
    /**
     * event delegation
     * */
    $('#export_sets').click(function (e) {
      let formName;

      if ($(e.target).hasClass('label-title')) {
        formName = e.target.parentElement.nextElementSibling.getAttribute('id').slice(5);
        $('#exp_content_' + formName).toggleClass('hiddenElem');
        setTimeout(function () {
          fitWindowToContent();
        }, FIT_WIN_TIMEOUT);
        addParams2Titles();
      } else if ($(e.target).hasClass('settings-in-title')) {
        formName = e.target.parentElement.nextElementSibling.getAttribute('id').slice(5);
        $('#exp_content_' + formName).toggleClass('hiddenElem');
        setTimeout(function () {
          fitWindowToContent();
        }, FIT_WIN_TIMEOUT);
        addParams2Titles();
      } else if ($(e.target).hasClass('settings-in-title__elem')) {
        formName = e.target.parentElement.parentElement.nextElementSibling.getAttribute('id').slice(5);
        $('#exp_content_' + formName).toggleClass('hiddenElem');
        setTimeout(function () {
          fitWindowToContent();
        }, FIT_WIN_TIMEOUT);
        addParams2Titles();
      } else if ($(e.target).hasClass('title-bg')) {
        formName = e.target.nextElementSibling.getAttribute('id').slice(5);
        $('#exp_content_' + formName).toggleClass('hiddenElem');
        setTimeout(function () {
          fitWindowToContent();
        }, FIT_WIN_TIMEOUT);
        addParams2Titles();
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

  function addParams2Titles() {

    let previousParams = document.querySelectorAll('.settings-in-title');
    for (let i = 0; i < previousParams.length; i++) {
      previousParams[i].remove();
    }

    let title_backgrounds = document.querySelectorAll('.title-bg');

    for (let i = 0; i < title_backgrounds.length; i++) {
      let div = document.createElement('div');
      let formName = document.getElementsByTagName('form')[i].getAttribute('id').slice(5);
      let params = getFormValToObj(formName);
      div.classList = 'settings-in-title hiddenElem';

      for (let key in params) {

        switch (params['ch_use_artboards']) {
          case false:
            params['ch_use_artboards'] = '';
            params['rad_artbs_all'] = '';
            params['rad_artbs_range'] = '';
          case true:
            if (params['rad_artbs_all'] === true) {
              params['ch_use_artboards'] = 'Artboards=all';
              params['rad_artbs_all'] = '';
              params['rad_artbs_range'] = '';
            } else {
              params['ch_use_artboards'] = 'Artboards=' + params['txt_artbs_range'];
              params['rad_artbs_all'] = '';
              params['rad_artbs_range'] = '';
              params['txt_artbs_range'] = '';
            }
            break;

          default:
            break;
        }

        switch (params[key]) {
          case 'Baseline (Standard)':
            params[key] = 'Baseline';
            params['sel_scans'] = '';
            break;
          case 'Baseline Optimized':
            params[key] = 'Baseline Opt.';
            params['sel_scans'] = '';
            break;
          case 'Art Optimized (Supersampling)':
            params[key] = 'Art Opt.';
            break;
          case 'Text Optimized (Hinted)':
            params[key] = 'Text Opt.';
            break;
          case 'Progressive':
            params[key] = 'Progressive=' + params['sel_scans'] + 'sc';
            params['sel_scans'] = '';
            break;
          default:
            break;
        }

        if (params[key] === '') continue;

        let span = document.createElement('span');
        span.className = 'settings-in-title__elem';

        span.innerHTML = params[key] + ', ';
        div.append(span);
      }
      document.getElementsByClassName('btn-export__ext')[i].before(div);
    }
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
