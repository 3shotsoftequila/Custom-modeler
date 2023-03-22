import inherits from 'inherits-browser';

import {
  isObject,
  assign,
  forEach
} from 'min-dash';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    isExpanded,
    isEventSubProcess
} from 'bpmn-js/lib/util/DiUtil';
  
import {
    getLabel
} from  'bpmn-js/lib/features/label-editing/LabelUtil';
 
import { is, isAny } from 'bpmn-js/lib/util/ModelUtil';

import {
    createLine
} from 'diagram-js/lib/util/RenderUtil';

import {
    isTypedEvent,
    isThrowEvent,
    isCollection,
    getDi,
    getSemantic,
    getCirclePath,
    getRoundRectPath,
    getDiamondPath,
    getRectPath,
    getFillColor,
    getStrokeColor,
    getLabelColor
} from 'bpmn-js/lib/draw/BpmnRenderUtil';


import {query as domQuery} from 'min-dom'


import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    classes as svgClasses
} from 'tiny-svg';

import {
    rotate,
    transform,
    translate
} from 'diagram-js/lib/util/SvgTransformUtil';
  
import Ids from 'ids';

import { black } from 'bpmn-js/lib/draw/BpmnRenderUtil';

//add the var declarations here later
var RENDERER_IDS = new Ids();

var TASK_BORDER_RADIUS = 10;
var INNER_OUTER_DIST = 3;

var DEFAULT_FILL_OPACITY = .95,
    HIGH_FILL_OPACITY = .35;

var ELEMENT_LABEL_DISTANCE = 10;

export default function DcrRenderer(
    eventBus, styles, pathMap, priority, textRenderer, canvas) {
    
    BaseRenderer.call(this, eventBus, 1500);


    //var computeStyle = styles.computeStyle;

    var rendererId = RENDERER_IDS.next();

    var markers = {};

    var computeStyle = styles.computeStyle;

    function addMarker(id, options) {}

    function colorEscape(str) {

        // only allow characters and numbers
        return str.replace(/[^0-9a-zA-z]+/g, '_');
    }

    function marker(type, fill, stroke) {
        var id = type + '-' + colorEscape(fill) + '-' + colorEscape(stroke) + '-' + rendererId;
    
        if (!markers[id]) {
          createMarker(id, type, fill, stroke);
        }
    
        return 'url(#' + id + ')';
    }

    function createMarker(id, type, fill, stroke) {}

    function drawRect(parentGfx, width, height, r, offset, attrs) {

        if (isObject(offset)) {
          attrs = offset;
          offset = 0;
        }
    
        offset = offset || 0;
    
        attrs = computeStyle(attrs, {
          stroke: black,
          strokeWidth: 2,
          fill: 'white'
        });
    
        var rect = svgCreate('rect');
        svgAttr(rect, {
          x: offset,
          y: offset,
          width: width - offset * 2,
          height: height - offset * 2,
          rx: r,
          ry: r
        });
        svgAttr(rect, attrs);
    
        svgAppend(parentGfx, rect);
    
        return rect;
    }

    function drawLine(parentGfx, waypoints, attrs) {
        attrs = computeStyle(attrs, [ 'no-fill' ], {
          stroke: black,
          strokeWidth: 2,
          fill: 'none'
        });
    
        var line = createLine(waypoints, attrs);
    
        svgAppend(parentGfx, line);
    
        return line;
    }

    function drawPath(parentGfx, d, attrs) {

        attrs = computeStyle(attrs, [ 'no-fill' ], {
          strokeWidth: 2,
          stroke: black
        });
    
        var path = svgCreate('path');
        svgAttr(path, { d: d });
        svgAttr(path, attrs);
    
        svgAppend(parentGfx, path);
     
        return path;
    }

    function drawMarker(type, parentGfx, path, attrs) {
        return drawPath(parentGfx, path, assign({ 'data-marker': type }, attrs));
    }

    function renderer(type) {
        return handlers[type];
    }

    function as(type) {
        return function(parentGfx, element) {
          return renderer(type)(parentGfx, element);
        };
    }

    function renderLabel(parentGfx, label, options) {

        options = assign({
          size: {
            width: 100
          }
        }, options);
    
        var text = textRenderer.createText(label || '', options);
    
        svgClasses(text).add('djs-label');
    
        svgAppend(parentGfx, text);
    
        return text;
    }

    function renderExternalLabel(parentGfx, element) {

        var box = {
          width: 90,
          height: 30,
          x: element.width / 2 + element.x,
          y: element.height / 2 + element.y
        };
    
        return renderLabel(parentGfx, getLabel(element), {
          box: box,
          fitBox: true,
          style: assign(
            {},
            textRenderer.getExternalStyle(),
            {
              fill: getLabelColor(element, defaultLabelColor, defaultStrokeColor)
            }
          )
        });
    }
    
    function renderLaneLabel(parentGfx, text, element) {
        var textBox = renderLabel(parentGfx, text, {
            box: {
                height: 30,
                width: element.height
            },
            align: 'center-middle',
            style: {
                fill: getLabelColor(element, defaultLabelColor, defaultStrokeColor)
            }
        });

        var top = -1 * element.height;

        transform(textBox, 0, -top, 270);
    }

    function createPathFromConnection(connection) {
        var waypoints = connection.waypoints;
    
        var pathData = 'm  ' + waypoints[0].x + ',' + waypoints[0].y;
        for (var i = 1; i < waypoints.length; i++) {
          pathData += 'L' + waypoints[i].x + ',' + waypoints[i].y + ' ';
        }
        return pathData;
    }


    function shapeStyle(attrs) {
        return styles.computeStyle(attrs, {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            stroke: black,
            strokeWidth: 2,
            fill: 'white'
        });
    }

    
    function lineStyle(attrs) {
        return styles.computeStyle(attrs, ['no-fill'], {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            stroke: black,
            strokeWidth: 2
        });
    }

    
    function drawConnectionSegments(parentGfx, waypoints, attrs) {
      return drawLine(parentGfx, waypoints, attrs, 5);
    }
  
    


    //function renderEventContent   (mostly used in Bpmn Event (s) - check the BmnRenderer 4 proper understanding)
    //432

  
















  


    

    

    

    //574 852

    var handlers = this.handlers = {

        
        'dcr:DcrTask': function (parentGfx, element) {

            if (element.width < 250) {
                element.width = 100;
            }
            if (element.height < 250) {
                element.height = 140;
            }

            var strokeWidth = 1.5;

            var attrs = {
                fill: '#e1ebf7',
                stroke: 'black',
                strokeWidth
            };

            var lane = renderer('dcr:Lane')(parentGfx, element, attrs);



            drawLine(parentGfx, [
                { x: 0,y: 30 },
                { x: element.width, y: 30 }
            ], {
                stroke: 'black',
                strokeWidth
            });

            attachTaskMarkers(parentGfx, element);

            return lane;

        },

        'dcr:Lane': function(parentGfx, element, attrs) {
            var rect = drawRect(parentGfx, element.width, element.height, 5, {
              fill: 'e1ebf7',
              //fillOpacity: HIGH_FILL_OPACITY,
              stroke: 'black',
              strokeWidth: 1.5,
              ...attrs
            });
      
            var semantic = getSemantic(element);
      
            if (semantic.$type === 'dcr:Lane') {
              var text = semantic.name;
              renderEmbeddedLabel(parentGfx, text, element);
            }
      
            return rect;
        },

        'dcr:DcrTaskInc': function (parentGfx, element) {

            if (element.width < 250) {
                element.width = 100;
            }
            if (element.height < 250) {
                element.height = 140;
            }


            var strokeWidth = 1.5;

            var attrs = {
                fill: '#e1ebf7',
                stroke: 'black',
                strokeWidth,
                strokeDasharray: '12 5'
            };

            var lane = renderer('dcr:Lane')(parentGfx, element, attrs);

            drawLine(parentGfx, [
                { x: 0,y: 30 },
                { x: element.width, y: 30 }
            ], {
                stroke: 'black',
                strokeWidth,
                strokeDasharray: '12 5'
            });

            return lane;
 

        },

        'label': function(parentGfx, element) {
            return renderExternalLabel(parentGfx, element);
        },

        
        'LoopMarker': function (parentGfx, element, position) {
            var markerPath = pathMap.getScaledPath('MARKER_LOOP', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: ((element.width / 2 + position.loop) / element.width),
                    my: (element.height - 7) / element.height
                }
            });

            drawMarker('loop', parentGfx, markerPath, {
                strokeWidth: 1,
                fill: 'none',
                strokeLinecap: 'round',
                strokeMiterlimit: 0.5
            });
        },

        //look at = flows start here



    }

    function attachTaskMarkers(parentGfx, element, taskMarkers) {
        var obj = getSemantic(element);
    
        var subprocess = taskMarkers && taskMarkers.indexOf('SubProcessMarker') !== -1;
        var position;
    
        if (subprocess) {
          position = {
            seq: -21,
            parallel: -22,
            compensation: -42,
            loop: -18,
            adhoc: 10
          };
        } else {
          position = {
            seq: -3,
            parallel: -6,
            compensation: -27,
            loop: 0,
            adhoc: 10
          };
        }
    
        forEach(taskMarkers, function(marker) {
          renderer(marker)(parentGfx, element, position);
        });
    
        
    
        var loopCharacteristics = obj.loopCharacteristics,
            isSequential = loopCharacteristics && loopCharacteristics.isSequential;
    
        if (loopCharacteristics) {
    
          if (isSequential === undefined) {
            renderer('LoopMarker')(parentGfx, element, position);
          }
    
          
        }
    }

  

    this.canRender = function (element) {
        return this.handlers[element.type] != undefined;
    };

    this.drawShape = function (parent, element) {

        if (this.canRender(element)) {
            var handler = this.handlers[element.type];

            if (handler instanceof Function) {
                return handler(parent, element);
            }
        }

        return false;
    };

    this.drawConnection = function (parent, element) {
        
        if (isAny(element, getConnectionsAbleToDraw())) {

            return this.drawShape(parent, element);
        }

    }

    //Complete this = this.drawfunction () {}
}

inherits(DcrRenderer, BaseRenderer);

DcrRenderer.$inject = [
    'eventBus',
    'styles',
    'pathMap',
    'canvas',
    'textRenderer'
];


function getConnectionsAbleToDraw() {
    return ['dcr:DcrTask', 'dcr:DcrTaskInc', 'dcr:DcrSubProcess', 'dcr:DcrIncludeFlow', /* 'dcr:DcrExcludeFlow', 'dcr:DcrResponseFlow', 'dcr:PreconditionFlow'*/];
}




