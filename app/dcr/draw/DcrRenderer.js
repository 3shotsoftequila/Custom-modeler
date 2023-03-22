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

export default function DcrRenderer(
    eventBus, styles, pathMap, priority, textRenderer, canvas) {
    
    BaseRenderer.call(this, eventBus, 1500);


    //var computeStyle = styles.computeStyle;

    var rendererId = RENDERER_IDS.next();


    var markers = {};

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

    function addMarker(id, options) {
        var {
            ref = { x: 0, y: 0 },
            scale = 1,
            element
        } = options;

        var marker = svgCreate('marker', {
            id: id,
            viewBox: '0 0 20 20',
            refX: ref.x,
            refY: ref.y,
            markerWidth: 20 * scale,
            markerHeight: 20 * scale,
            orient: 'auto'
        });

        svgAppend(marker, element);

        var defs = domQuery('defs', canvas._svg);

        if (!defs) {
            defs = svgCreate('defs');

            svgAppend(canvas._svg, defs);
        }

        svgAppend(defs, marker);

        markers[id] = marker;
    }

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

    function createMarker(id, type, fill, stroke) {

        if (type === 'includeflow-end') {
            var includeflowEnd = svgCreate( 'path', {




                
                d: 'M 1 5 L 11 10 L 1 15 Z',
                ...shapeStyle({
                    fill: black,
                    stroke: black,
                    strokeWidth: 1
                })
            });

            addMarker(id, {
                element: includeflowEnd,
                ref: { x: 11, y: 10 },
                scale: 0.5
            });
            
        } 

        if (type === 'circle-end') {
            var circleEnd = svgCreate( 'path', {
                d: "M 14.00,7.50 C 14.00,11.64 10.87,15.00 7.00,15.00 3.13,15.00 0.00,11.64 0.00,7.50 0.00,3.36 3.13,0.00 7.00,0.00 10.87,0.00 14.00,3.36 14.00,7.50 Z",
                ...shapeStyle({
                    fill: black,
                    stroke: black,
                    strokeWidth: 1
                })
            });

            addMarker(id, {
                element: circleEnd,
                ref: { x: -1, y: 10 },
                scale: 0.5
            });
            
        } 
    }


//155  note to self

    function drawRect(parentGfx, width, height, r, offset, attrs) {

        if (isObject(offset)) {
            attrs = offset;
            offset = 0;
          }
      
          offset = offset || 0;
      
          attrs = shapeStyle(attrs);
        
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


    /**
     * @param {SVGElement} parentGfx
     * @param {Point[]} waypoints
     * @param {any} attrs
     * @param {number} [radius]
     *
     * @return {SVGElement}
     */
    function drawLine(parentGfx, waypoints, attrs, radius) {
        attrs = lineStyle(attrs);
    
        var line = createLine(waypoints, attrs, radius);
    
        svgAppend(parentGfx, line);
    
        return line;
    }

    /**
     * @param {SVGElement} parentGfx
     * @param {Point[]} waypoints
     * @param {any} attrs
     *
     * @return {SVGElement}
     */
    function drawConnectionSegments(parentGfx, waypoints, attrs) {
      return drawLine(parentGfx, waypoints, attrs, 5);
    }
  
    function drawPath(parentGfx, d, attrs) {
  
      attrs = lineStyle(attrs);
  
      var path = svgCreate('path', {
        ...attrs,
        d
      });
  
      svgAppend(parentGfx, path);
  
      return path;
    }

    //look at below again

    function drawMarker(type, parentGfx, path, attrs) {
        return drawPath(parentGfx, path, assign({ 'data-marker': type }, attrs));
    }

    //function renderEventContent   (mostly used in Bpmn Event (s) - check the BmnRenderer 4 proper understanding)
    //432

    //Look from here=e way 4ward

    function renderer(type) {
        return handlers[type];
    }

    // delete function as(type) later on if not used
    function as(type) {
      return function(parentGfx, element) {
        return renderer(type)(parentGfx, element);
      };
    }


    

    //function renderLabel

    function renderLabel(parentGfx, label, options) {/*
        var text = textUtil.createText(parentGfx, label || '', options);
        svgClasses(text).add('djs-label');

        return text;*/
    }

    //function renderEmbeddedLabel

    function renderEmbeddedLabel(parentGfx, element, align, attr) {
        //enter code here
    }

    //function renderExternalLabel

    function renderExternalLabel(parentGfx, element) {
        //enter code here
    }
    
    //function renderLaneLabel

    function renderLaneLabel(parentGfx, element) {
        //enter code here
    }

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

            //var text = getSemantic(element).name;
            //renderLaneLabel(parentGfx, text, element);

            //attachEventMarkers( parentGfx, element);

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
              //renderEmbeddedLabel(parentGfx, text, element);
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

        'dcr:DcrSubProcesses': function (parentGfx, element) {

            if (element.width < 250) {
                element.width = 100;
            }
            if (element.height < 250) {
                element.height = 140;
            }

            var elementObject = drawRectWithHeader(parentGfx, element.width, element.height, TASK_BORDER_RADIUS, {
                header: {
                    fill: "#e1ebf7", //"white",
                    stroke: 'black',
                    //border
                }, body: {fill: "#e1ebf7" /*"white"*/, stroke: 'black'}
            });

            return elementObject; //strokeDasharray: '12 5'
        },

        //look at = flows start here

        'dcr:IncludeFlow': function(parentGfx, element) {
            var fill = 'green',
                stroke = 'green';
      
            var path = drawConnectionSegments(parentGfx, element.waypoints, {
              markerStart: marker('circle-end', fill, stroke),
              markerEnd: marker('includeflow-end', fill, stroke),
              stroke: 'purple'
            });

            var includeflow = getSemantic(element);

            var source;

            /*
            if (element.source) {
                source = element.source.businessObject;

                
            }*/
      
            return path;
        },


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




