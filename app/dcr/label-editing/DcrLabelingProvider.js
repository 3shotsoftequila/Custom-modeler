import inherits from 'inherits';

import {
    assign
} from 'min-dash';

import {
    getLabel
} from 'bpmn-js/lib/features/label-editing/LabelUtil';

import {
    is
} from 'bpmn-js/lib/util/ModelUtil';

import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
//import { isExpanded } from '../../util/DiUtil';

import {
    getExternalLabelMid,
    isLabelExternal,
    hasExternalLabel,
    isLabel
} from 'bpmn-js/lib/util/LabelUtil';

var HIGH_PRIORITY = 2000;

import LabelEditingProvider from 'bpmn-js/lib/features/label-editing/LabelEditingProvider';


export default function DcrLabelEditingProvider(
    injector, canvas
) {
    injector.invoke(LabelEditingProvider, this);
    this._canvas = canvas;
}


inherits(DcrLabelEditingProvider, LabelEditingProvider);

DcrLabelEditingProvider.$inject = [
    'injector',
    'canvas'
];


DcrLabelEditingProvider.prototype.activate = function(element) {
    
      const context = LabelEditingProvider.prototype.activate.call(this, element);
      
      if (is(element, 'dcr:Lane')) {
        assign(context.options, {
          centerHorizontally: true
        });
      }

      return context;
    //}
  };



 DcrLabelEditingProvider.prototype.getEditingBBox = function(element) {
    var canvas = this._canvas;

    var target = element.label || element;
  
    var bbox = canvas.getAbsoluteBBox(target);
  
    var mid = {
      x: bbox.x + bbox.width / 2,
      y: bbox.y + bbox.height / 2
    };

    var bounds = { x: bbox.x, y: bbox.y };

    var zoom = canvas.zoom();
  
    var defaultStyle = this._textRenderer.getDefaultStyle(),
        externalStyle = this._textRenderer.getExternalStyle();
  
    // take zoom into account
    var externalFontSize = externalStyle.fontSize * zoom,
        externalLineHeight = externalStyle.lineHeight,
        defaultFontSize = defaultStyle.fontSize * zoom,
        defaultLineHeight = defaultStyle.lineHeight;
  
    var style = {
      fontFamily: this._textRenderer.getDefaultStyle().fontFamily,
      fontWeight: this._textRenderer.getDefaultStyle().fontWeight
    };

    if (is(element, 'dcr:Lane')) {
      
        assign(bounds, {
            width: bbox.height,
            height: 30 * zoom,
            x: bbox.x - bbox.height / 2 + (15 * zoom),
            y: mid.y - (30 * zoom) / 2
        });

        assign(style, {
            fontSize: defaultFontSize + 'px',
            lineHeight: defaultLineHeight,
            paddingTop: (7 * zoom) + 'px',
            paddingBottom: (7 * zoom) + 'px',
            paddingLeft: (5 * zoom) + 'px',
            paddingRight: (5 * zoom) + 'px',
            //transform: 'rotate(-90deg)'
          });
      
    }

    return { bounds: bounds, style: style };
};













