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
    eventBus, styles, pathMap, textRenderer, canvas, priority) {
    
    BaseRenderer.call(this, eventBus, 1500);
 

    var computeStyle = styles.computeStyle;

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
        var attrs = assign({
          fill: black,
          strokeWidth: 1,
          strokeLinecap: 'round',
          strokeDasharray: 'none'
        }, options.attrs);
    
        var ref = options.ref || { x: 0, y: 0 };
    
        var scale = options.scale || 1;
    
        // fix for safari / chrome / firefox bug not correctly
        // resetting stroke dash array
        if (attrs.strokeDasharray === 'none') {
          attrs.strokeDasharray = [ 10000, 1 ];
        }
    
        var marker = svgCreate('marker');
    
        svgAttr(options.element, attrs);
    
        svgAppend(marker, options.element);
    
        svgAttr(marker, {
          id: id,
          viewBox: '0 0 20 20',
          refX: ref.x,
          refY: ref.y,
          markerWidth: 20 * scale,
          markerHeight: 20 * scale,
          orient: 'auto'
        });
    
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
            var includeflowEnd = svgCreate( 'path');
            svgAttr(includeflowEnd, {

                
                d: "M 19.84,4.42 C 19.84,4.42 19.87,6.42 19.87,6.42 19.87,6.42 9.72,6.44 9.72,6.44 9.72,6.44 9.69,4.43 9.69,4.43 9.69,4.43 19.84,4.42 19.84,4.42 Z M 13.93,0.02 C 13.93,0.02 15.94,0.00 15.94,0.00 15.94,0.00 15.91,10.98 15.91,10.98 15.91,10.98 13.90,11.00 13.90,11.00 13.90,11.00 13.93,0.02 13.93,0.02 Z M 9.16,5.74 C 9.16,5.74 4.58,7.77 4.58,7.77 4.58,7.77 0.00,9.81 0.00,9.81 0.00,9.81 0.01,5.72 0.01,5.72 0.01,5.72 0.02,1.63 0.02,1.63 0.02,1.63 4.59,3.68 4.59,3.68 4.59,3.68 9.16,5.74 9.16,5.74 Z",
                //'M 1 5 L 11 10 L 1 15 Z',
                
        });

            addMarker(id, {
                element: includeflowEnd,
                ref: { x: 20, y: 5.62 },
                scale: 0.55,
                attrs: {
                  fill: 'green',
                  stroke: 'green'
                }
            });
            
        } 

        if (type === 'excludeflow-end') {
            var excludeflowEnd = svgCreate( 'path');
            svgAttr(excludeflowEnd, {

                
                d: "M 18.28,0.00 C 18.28,0.00 20.00,0.92 20.00,0.92 20.00,0.92 11.84,14.84 11.84,14.84 11.84,14.84 10.12,13.92 10.12,13.92 10.12,13.92 18.28,0.00 18.28,0.00 Z M 16.61,13.64 C 16.61,14.39 17.23,15.00 18.01,15.00 18.78,15.00 19.41,14.39 19.41,13.64 19.41,12.88 18.78,12.27 18.01,12.27 17.23,12.27 16.61,12.88 16.61,13.64 Z M 13.74,1.47 C 13.74,2.22 13.11,2.83 12.34,2.83 11.56,2.83 10.94,2.22 10.94,1.47 10.94,0.72 11.56,0.11 12.34,0.11 13.11,0.11 13.74,0.72 13.74,1.47 Z M 12.25,7.81 C 12.25,7.81 6.13,11.23 6.13,11.23 6.13,11.23 -0.00,14.65 -0.00,14.65 -0.00,14.65 0.02,7.78 0.02,7.78 0.02,7.78 0.03,0.92 0.03,0.92 0.03,0.92 6.14,4.36 6.14,4.36 6.14,4.36 12.25,7.81 12.25,7.81 Z",
   
                //'M 1 5 L 11 10 L 1 15 Z',
                
        });

            addMarker(id, {
                element: excludeflowEnd,
                ref: { x: 20, y: 7.73 },
                scale: 0.4,
                attrs: {
                  fill: 'red',
                  stroke: 'red'
                }
            });
            
        }

        if (type === 'responseflow-end') {
            var responseflowEnd = svgCreate( 'path');
            svgAttr(responseflowEnd, {

                
                d: "M 1 5 L 11 10 L 1 15 Z",
                
        });

            addMarker(id, {
                element: responseflowEnd,
                ref: { x: 11, y: 10 },
                scale: 0.55,
                attrs: {
                  fill: '#0096FF',  //#0096FF = bright blue 
                  stroke: '#0096FF'
                }
            });
            
        } 


        
        if (type === 'pre-conditionflow-end') {
            var preconditonflowEnd = svgCreate( 'path');
            svgAttr(preconditonflowEnd, {

                
                d: "M 15.25,0.00 C 15.25,0.00 17.13,3.26 17.13,3.26 17.13,3.26 19.00,6.53 19.00,6.53 19.00,6.53 15.26,6.53 15.26,6.53 15.26,6.53 11.52,6.54 11.52,6.54 11.52,6.54 13.39,3.27 13.39,3.27 13.39,3.27 15.25,0.00 15.25,0.00 Z M 15.27,13.00 C 15.27,13.00 13.40,9.74 13.40,9.74 13.40,9.74 11.52,6.47 11.52,6.47 11.52,6.47 15.26,6.47 15.26,6.47 15.26,6.47 19.00,6.46 19.00,6.46 19.00,6.46 17.13,9.73 17.13,9.73 17.13,9.73 15.27,13.00 15.27,13.00 Z M 10.78,6.62 C 10.78,6.62 5.39,9.06 5.39,9.06 5.39,9.06 -0.00,11.51 -0.00,11.51 -0.00,11.51 0.01,6.61 0.01,6.61 0.01,6.61 0.03,1.70 0.03,1.70 0.03,1.70 5.41,4.16 5.41,4.16 5.41,4.16 10.78,6.62 10.78,6.62 Z",
       
                
        });

            addMarker(id, {
                element: preconditonflowEnd,
                ref: { x: 20, y: 7 },
                scale: 0.55,
                attrs: {
                  fill: 'orange',  
                  stroke: 'orange'
                }
            });
            
        } 



        if (type === 'circle-start') {
            var circleEnd = svgCreate( 'circle');
            svgAttr(circleEnd, {
                cx: 6, cy: 6, r: 2.0
            });

            addMarker(id, {
                element: circleEnd,
                attrs: {
                    ref: { x: -1, y: 10 },
                    scale: 0.5,
                    fill: '#0096FF',
                    stroke: '#0096FF'
                },
                ref: { x: 6, y:6 }
            });   
        } 
    }

/*   
  function drawCircle(parentGfx, width, height, offset, attrs) {

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

    if (attrs.fill === 'none') {
      delete attrs.fillOpacity;
    }

    var cx = width / 2,
        cy = height / 2;

    var circle = svgCreate('circle');
    svgAttr(circle, {
      cx: cx,
      cy: cy,
      r: Math.round((width + height) / 4 - offset)
    });
    svgAttr(circle, attrs);

    svgAppend(parentGfx, circle);

    return circle;
  } */


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
        attrs = computeStyle(attrs, [ 'no-fill' ], {
            stroke: black,
            strokeWidth: 2,
            fill: 'none'
        });
    
        var line = createLine(waypoints, attrs, radius);
    
        svgAppend(parentGfx, line);
    
        return line;
    }

//bamenda

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

    //function renderEmbeddedLabel

    function renderEmbeddedLabel(parentGfx, element, align, attr) {
        //enter code here
        var semantic = getSemantic(element);

        return renderLabel(parentGfx, semantic.name, {
          box: element,
          align: align,
          padding: 7,
          style: {
            fill: 'black'
          }
        });
    }

    //function renderExternalLabel

    function renderExternalLabel(parentGfx, element) {
        //enter code here
    }
    
    //function renderLaneLabel

    function renderLaneLabel(parentGfx, text, element) {
        //enter code here
        var textBox = renderLabel(parentGfx, text, {
            box: {
              height: 30,
              width: element.width
            },
            align: 'center-middle',
            style: {
              fill: 'black'
            }
          });
      
          var top = 0;
      
          transform(textBox, 0, -top, 0);
    }

    function renderCustomLabel(parentGfx, text, element) {
        //enter code here
        var textBox = renderLabel(parentGfx, text, {
            box: {
              height: 30,
              width: element.height
            },
            align: 'center-middle',
            style: {
              fill: 'black'
            }
          });
      
          var top = -1*element.height;
      
          transform(textBox, 0, -top, 270);
    }

    //574 852

    function createPathFromConnection(connection) {
        var waypoints = connection.waypoints;
    
        var pathData = 'm  ' + waypoints[0].x + ',' + waypoints[0].y;
        for (var i = 1; i < waypoints.length; i++) {
          pathData += 'L' + waypoints[i].x + ',' + waypoints[i].y + ' ';
        }
        return pathData;
    }

    var handlers = this.handlers = {

        
        'dcr:DcrTask': function (parentGfx, element) {

            if (element.width < 250) {
                element.width = 140;
            }
            if (element.height < 250) {
                element.height = 190;
            }

            var strokeWidth = 1.5;

            var attrs = {
                fill: '#e1ebf7',
                stroke: 'black',
                strokeWidth
            };

            var lane = renderer('dcr:Lane')(parentGfx, element, attrs);

            drawLine(parentGfx, [
                { x: 0, y: 40 },
                { x: element.width, y: 40 }
            ], {
                stroke: 'black',
                strokeWidth
            });

            var text = getSemantic(element).name;
            var secondtext = getSemantic(element).secondname;
            renderLaneLabel(parentGfx, text, element);
            //renderCustomLabel(parentGfx, secondtext, element );
            //renderEmbeddedLabel(parentGfx, element, 'center-middle');


            //attachEventMarkers( parentGfx, element);

            return lane;

        },


        'dcr:Lane': function(parentGfx, element, attrs) {
            var rect = drawRect(parentGfx, element.width, element.height, 5, assign({
                fill: 'e1ebf7',
                stroke: 'black'
            }, attrs)
            /*{
              fill: 'e1ebf7',
              //fillOpacity: HIGH_FILL_OPACITY,
              stroke: 'black',
              strokeWidth: 1.5,
              ...attrs
            }*/
            
            );
      
            var semantic = getSemantic(element);
      
            if (semantic.$type === 'dcr:Lane') {
              var text = semantic.name;
              renderLaneLabel(parentGfx, text, element);
            }
      
            return rect;
        },

        'dcr:Activity': function(parentGfx, element, attrs) {

            attrs = attrs || {};

            return drawRect(parentGfx, element.width, element.height, TASK_BORDER_RADIUS, attrs);
          },

        'dcr:DcrTaskInc': function (parentGfx, element) {

            if (element.width < 250) {
                element.width = 140;
            }
            if (element.height < 250) {
                element.height = 190;
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
                { x: 0, y: 40 },
                { x: element.width, y: 40 }
            ], {
                stroke: 'black',
                strokeWidth,
                strokeDasharray: '12 5'
            });

            var text = getSemantic(element).name;
            renderLaneLabel(parentGfx, text, element);
            

            return lane;
 

        },


        
        'dcr:DcrPendingInc': function(parentGfx, element) {
            var task = renderer('dcr:DcrTask')(parentGfx, element);

            var pathData = pathMap.getScaledPath('TASK_TYPE_PENDING', {
                abspos: {
                    x: 3,
                    y: 67
                }
            });

            
            /* pending path */ 
            drawPath(parentGfx, pathData, {
                strokeWidth: 0.5, // 0.25,
                fill: '#0096FF',
                stroke: '#0096FF'
            });

            return task;
        },   
        
        'dcr:DcrPendingExc': function (parentGfx, element) {
            var task = renderer('dcr:DcrTaskInc')(parentGfx, element);

            var pathData = pathMap.getScaledPath('TASK_TYPE_PENDING', {
                abspos: {
                    x: 3,
                    y: 67
                }
            });

            
            /* pending path */ 
            drawPath(parentGfx, pathData, {
                strokeWidth: 0.5, // 0.25,
                fill: '#0096FF',  //#0096FF = bright blue 
                stroke: '#0096FF'
            });

            return task;
        },   


                
        'dcr:DcrExecutedInc': function(parentGfx, element) {
            var task = renderer('dcr:DcrTask')(parentGfx, element);

            var pathData = pathMap.getScaledPath('TASK_TYPE_EXECUTED', {
                scale: 10,
                abspos: {
                    x: 136, //133,
                    y: 50
                  }
            });

            
            /* executed path */ 
            drawPath(parentGfx, pathData, {
                strokeWidth: 0.5, // 0.25,
                fill: 'green',
                stroke: 'green' 
            });

            return task;
        },   
        
        
        'dcr:DcrExecutedExc': function(parentGfx, element) {
            var task = renderer('dcr:DcrTaskInc')(parentGfx, element);

            var pathData = pathMap.getScaledPath('TASK_TYPE_EXECUTED', {
                abspos: {
                    x: 136,  //133,
                    y: 50
                  }
            });

            
            /* executed path */ 
            drawPath(parentGfx, pathData, {
                strokeWidth: 0.5, // 0.25,
                fill: 'green',
                stroke: 'green' 
            });

            return task;
        },

        
        'dcr:DcrPendingExecutedInc': function(parentGfx, element) {
            var task = renderer('dcr:DcrExecutedInc')(parentGfx, element);

            var pathData = pathMap.getScaledPath('TASK_TYPE_PENDING', {
                abspos: {
                    x: 3,
                    y: 67
                }
            });

            
            /* pending path */ 
            drawPath(parentGfx, pathData, {
                strokeWidth: 0.5, // 0.25,
                fill: '#0096FF',
                stroke: '#0096FF'
            });

            return task;
        },

        'dcr:DcrPendingExecutedExc': function(parentGfx, element) {
            var task = renderer('dcr:DcrExecutedExc')(parentGfx, element);

            var pathData = pathMap.getScaledPath('TASK_TYPE_PENDING', {
                abspos: {
                    x: 3,
                    y: 67
                }
            });

            
            /* pending path */ 
            drawPath(parentGfx, pathData, {
                strokeWidth: 0.5, // 0.25,
                fill: '#0096FF',
                stroke: '#0096FF'
            });

            return task;
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
            
            var pathData = createPathFromConnection(element);

            var attrs = {
                strokeLinejoin: 'round',
                markerEnd: marker('includeflow-end', 'black', 'black'),
                //markerStart: marker('circle-start', 'green', 'green'),
                stroke: 'green'
            };

            var path = drawPath(parentGfx, pathData, attrs);

            var includeFlow = getSemantic(element);

            var source;

            /**
             * Enter code for replacement flows
             * Look at the code in the bpmnRenderer file in bpmn-js for guidance
             * Look from line: 1936 - 1412
             */
            
            return path;
        },

        
        'dcr:ExcludeFlow': function(parentGfx, element) {
            
            var pathData = createPathFromConnection(element);

            var attrs = {
                strokeLinejoin: 'round',
                markerEnd: marker('excludeflow-end', 'red', 'red'),
                //markerStart: marker('circle-start', 'red', 'red'),
                stroke: 'red'
            };

            var path = drawPath(parentGfx, pathData, attrs);

            var excludeFlow = getSemantic(element);

            var source;

            /**
             * Enter code for replacement flows
             * Look at the code in the bpmnRenderer file in bpmn-js for guidance
             * Look from line: 1936 - 1412
             */
            
            return path;
        },


        
        'dcr:ResponseFlow': function(parentGfx, element) {
            
            var pathData = createPathFromConnection(element);

            var attrs = {
                strokeLinejoin: 'round',
                markerEnd: marker('responseflow-end', '#0096FF', '#0096FF'),
                markerStart: marker('circle-start', '#0096FF', '#0096FF'),
                stroke: '#0096FF'
            };

            var path = drawPath(parentGfx, pathData, attrs);

            var responseFlow = getSemantic(element);

            var source;

            /**
             * Enter code for replacement flows
             * Look at the code in the bpmnRenderer file in bpmn-js for guidance
             * Look from line: 1936 - 1412
             */
            
            return path;
        },


        
        'dcr:PreConditionFlow': function(parentGfx, element) {
            
            var pathData = createPathFromConnection(element);

            var attrs = {
                strokeLinejoin: 'round',
                markerEnd: marker('pre-conditionflow-end', 'orange', 'orange'),
                //markerStart: marker('circle-start', 'green', 'green'),
                stroke: 'orange'
            };

            var path = drawPath(parentGfx, pathData, attrs);

            var preConditionFlow = getSemantic(element);

            var source;

            /**
             * Enter code for replacement flows
             * Look at the code in the bpmnRenderer file in bpmn-js for guidance
             * Look from line: 1936 - 1412
             */
            
            return path;
        },







/***********************************************************************************************************************/
/*************************** LOOK AT THIS SECTION FOR PARALLEL MARKERS BELOW AGAIN *************************************/
/***********************************************************************************************************************/



        //embedded markers ==> starts here  ref: Line 1679

        'PendingMarker': function(parentGfx, element, position) {

            var markerPath = pathMap.getScaledPath('MARKER_PARALLEL', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                  mx: ((element.width / 2 + position.parallel) / element.width),
                  my: (element.height - 20) / element.height
                }
            });

            drawMarker('parallel', parentGfx, markerPath, {
                //strokeWidth: 2,
                fill: 'black',
                stroke: 'black'
            });
        },

        'ExecutedMarker': function(parentGfx, element, position) {
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
              fill: black,
              stroke: black,
              strokeLinecap: 'round',
              strokeMiterlimit: 0.5
            });
        },


    }

    function attachTaskMarkers(parentGfx, element, taskMarkers) {

        var obj = getSemantic(element);

        //var subprocess = taskMarkers && taskMarkers.indexOf('SubProcessMarker') !== -1;
        var position = {
            parallel: -6,
            loop: 30
        };

        forEach(taskMarkers, function(marker) {
            renderer(marker)(parentGfx, element, position);
        });

        var loopCharacteristics = obj.loopCharacteristics,
        isSequential = loopCharacteristics && loopCharacteristics.isSequential;

        if (loopCharacteristics) {

            if (isSequential === undefined) {
                renderer('ExecutedMarker')(parentGfx, element, position);
            }

            if (isSequential === false) {
                renderer('PendingMarker')(parentGfx, element, position);
            }
/*
            if (isSequential === true) {
                renderer('SequentialMarker')(parentGfx, element, position);
            }*/
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
    'textRenderer',
    'canvas'
];


function getConnectionsAbleToDraw() {
    return ['dcr:DcrTask', 'dcr:DcrTaskInc', 'dcr:DcrSubProcess', 'dcr:IncludeFlow', 'dcr:ExcludeFlow',  'dcr:ResponseFlow',  'dcr:PreConditionFlow'];
}




