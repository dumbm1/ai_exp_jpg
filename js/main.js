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
      if (this.getAttribute('id') == 'add_new_set') {
        var newSet = new AddNewExportSet();
        newSet.addNewSet('Test', this.parentElement);
        setTimeout(function () {
          fitWindowToContent();
        }, 100);
        return;
      }
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
    $('#btn_defaults_other').click(function () {
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

  /**
   * @constructor
   * */
  function AddNewExportSet() {
    this.devMessage = function () {
      alert('Adding a new set in develope');
    };
    this.addNewSet = function (setName, elem) {
      var elemTitle = _addSetTitle(setName, elem);
      _addForm(setName, elemTitle);

      /**
       * @private
       * */
      function _addForm(setName, elem) {
        var formContent = document.createElement('form')/*,
         divExpCont = document.createElement('div'),
         divFirstLine = document.createElement('div'),
         divCompress = document.createElement('div'),
         divAntialias = document.createElement('div'),
         divArtbs = document.createElement('div'),
         divPostfix = document.createElement('div'),
         divBtns = document.createElement('div')*/;
        formContent.className = 'form_' + setName.toLowerCase();
        formContent.innerHTML = '      <div id="exp_content_" + setName.toLowerCase() class="exp-content hiddenElem">\n' +
                                '        <div class="line">\n' +
                                '          <label for="sel_color_model_" + setName.toLowerCase()>Color Model:</label>\n' +
                                '          <select id="sel_color_model_" + setName.toLowerCase() class="hostTextarea">\n' +
                                '            <option>RGB</option>\n' +
                                '            <option>CMYK</option>\n' +
                                '            <option>Grayscale</option>\n' +
                                '          </select>\n' +
                                '          <label for="nmb_quality_" + setName.toLowerCase()>Quality:</label>\n' +
                                '          <input type="number" id="nmb_quality_" + setName.toLowerCase() class="hostTextarea" min="1" max="10" step="1"\n' +
                                '                 value="6">\n' +
                                '          <label for="sel_resolution_" + setName.toLowerCase()>Resolution:</label>\n' +
                                '          <select id="sel_resolution_" + setName.toLowerCase() class="hostTextarea">\n' +
                                '            <option>72</option>\n' +
                                '            <option>150</option>\n' +
                                '            <option>200</option>\n' +
                                '            <option>250</option>\n' +
                                '            <option>300</option>\n' +
                                '            <option>350</option>\n' +
                                '            <option>400</option>\n' +
                                '            <option>450</option>\n' +
                                '            <option>500</option>\n' +
                                '            <option>550</option>\n' +
                                '          </select>\n' +
                                '        </div>\n' +
                                '        <div id="compress_method_" + setName.toLowerCase() class="line">\n' +
                                '          <label for="sel_compress_method_" + setName.toLowerCase()>Compression Method:</label>\n' +
                                '          <select id="sel_compress_method_" + setName.toLowerCase() class="hostTextarea">\n' +
                                '            <option>Baseline (Standard)</option>\n' +
                                '            <option>Baseline Optimized</option>\n' +
                                '            <option>Progressive</option>\n' +
                                '          </select>\n' +
                                '          <label for="sel_scans_" + setName.toLowerCase()>Scans:</label>\n' +
                                '          <select id="sel_scans_" + setName.toLowerCase() class="hostTextarea">\n' +
                                '            <option>03</option>\n' +
                                '            <option>04</option>\n' +
                                '            <option>05</option>\n' +
                                '          </select>\n' +
                                '        </div>\n' +
                                '        <div id="antialias_" + setName.toLowerCase() class="line">\n' +
                                '          <label for="sel_antialias_" + setName.toLowerCase()>Anti-aliasing:</label>\n' +
                                '          <select id="sel_antialias_" + setName.toLowerCase() class="hostTextarea">\n' +
                                '            <option>None</option>\n' +
                                '            <option>Art Optimized (Supersampling)</option>\n' +
                                '            <option>Text Optimized (Hinted)</option>\n' +
                                '          </select>\n' +
                                '        </div>\n' +
                                '        <div id="artbs_" + setName.toLowerCase() class="line">\n' +
                                '          <input type="checkbox" value="Use artboards" id="ch_use_artbs_" + setName.toLowerCase()>\n' +
                                '          <label for="ch_use_artbs_" + setName.toLowerCase()>Use Artboards</label>\n' +
                                '          <input type="radio" id="rad_artbs_all_" + setName.toLowerCase() name="choose_artbs" checked>\n' +
                                '          <label for="rad_artbs_all_" + setName.toLowerCase()>All</label>\n' +
                                '          <input type="radio" id="rad_artbs_range_" + setName.toLowerCase() name="choose_artbs">\n' +
                                '          <label for="rad_artbs_range_" + setName.toLowerCase()>Range</label>\n' +
                                '          <label for="txt_artbs_range_" + setName.toLowerCase()></label>\n' +
                                '          <input type="text" id="txt_artbs_range_" + setName.toLowerCase() class="hostTextarea" value="2-3">\n' +
                                '        </div>\n' +
                                '        <div id="postfix_" + setName.toLowerCase() class="line">\n' +
                                '          <label for="txt_postfix_" + setName.toLowerCase()>Postfix Label:</label>\n' +
                                '          <input type="text" id="txt_postfix_" + setName.toLowerCase() class="hostTextarea" value=""\n' +
                                '                 placeholder="" width="200px">\n' +
                                '        </div>\n' +
                                '        <div id="btns_" + setName.toLowerCase() class="line">\n' +
                                '          <input type="button" id="btn_defaults_" + setName.toLowerCase() class="hostButton" value="Defaults"/>\n' +
                                '        </div>\n' +
                                '      </div>';
        // elem.insertBefore(formContent, elem.lastElementChild);
      }
      /**
       * @private
       * */
      function _addSetTitle(setName, elem) {
        var inputSetName = prompt('Input the set name: ', setName);

        var divTitleBg = document.createElement('div');
        var divExpTitle = document.createElement('div');
        var labelName = document.createElement('label');
        var labelDel = document.createElement('label');
        var inputBtnExport = document.createElement('input');

        divTitleBg.className = 'title-bg';
        divExpTitle.className = 'exp-title';
        labelName.className = 'setName';
        labelDel.className = 'setName';
        labelName.innerHTML = inputSetName;
        labelDel.innerHTML = ' (–)';

        inputBtnExport.className = 'hostButton btn-export';
        inputBtnExport.setAttribute('type', 'button');
        inputBtnExport.setAttribute('id', 'btn_export_' + inputSetName.toLowerCase());
        inputBtnExport.setAttribute('value', 'Export');

        divExpTitle.appendChild(labelName);
        divExpTitle.appendChild(labelDel);
        divTitleBg.appendChild(divExpTitle);
        divTitleBg.appendChild(inputBtnExport);

         elem.insertBefore(divTitleBg, elem.lastElementChild);
         return divTitleBg;
      }
    };

  }
}());
