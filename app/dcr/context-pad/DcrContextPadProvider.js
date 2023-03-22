import {
    assign,
    forEach,
    isArray,
    every
} from 'min-dash';

import inherits from 'inherits-browser';

import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider'

import {
    is
} from 'bpmn-js/lib/util/ModelUtil'

import {
    isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';



/**
 * A provider for BPMN 2.0 elements context pad
 */

//Thanks this works now and upon clicking the screw wrench, the default `bpmn-js` replace provider 

export default class DcrContextPadProvider {
    constructor(config, contextPad, create, elementFactory, injector, translate, popupMenu, connect) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;
        this.contextPad = contextPad;
        this.popupMenu = popupMenu;
        this.connect = connect;

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

        contextPad.registerProvider(this);
    }
    getContextPadEntries(element) {
        
        const {
            autoPlace,
            create,
            elementFactory,
            translate,
            contextPad,
            popupMenu,
            connect
        } = this;

        //var popupMenu = this.popupMenu;

        var businessObject = element.businessObject;


        function appendDcrTask(event, element) {

            const shape = elementFactory.createShape({ type: 'dcr:DcrTask' });

            create.start(event, shape, element);

            /*
            if (autoPlace) {
                const shape = elementFactory.createShape({ type: 'dcr:DcrTask' });
          
                autoPlace.append(element, shape);
              } else {
                appendDcrTaskStart(event, element);
              }*/
        }

        function startConnect(event, element) {
            connect.start(event, element);
        }
        

        function getReplaceMenuPosition(element) {
            var Y_OFFSET = 5;

            var pad = contextPad.getPad(element).html;

            var padRect = pad.getBoundingClientRect();

            var pos = {
            x: padRect.left,
            y: padRect.bottom + Y_OFFSET
            };

            return pos;
        }
        
        function appendDcrTaskStart(event) {
            const shape = elementFactory.createShape({ type: 'dcr:DcrTaskInc' });
        
            create.start(event, shape, element);

        }

        if (is(businessObject, 'dcr:DcrTask')) {

            return function (actions) {

                delete actions['append.end-event']
                delete actions['append.gateway']
                delete actions['append.intermediate-event']
                delete actions['append.text-annotation']
                delete actions['append.append-task']
                delete actions['replace']
                delete actions['connect']


                return {
                    ...actions,
                    'append-dcrtask': {
                        group: 'model',
                        className: 'bpmn-icon-start-event-non-interrupting-parallel-multiple',
                        title: translate('Append DcrTask'),
                        action: {
                        click: appendDcrTask,
                        dragstart: appendDcrTask
                        }
                    },

                    'append-dcrtaskinc': {
                        group: 'model',
                        className: 'bpmn-icon-lane-divide-two',
                        title: translate('Append DcrTaskinc'),
                        action: {
                        click: appendDcrTaskStart,
                        dragstart: appendDcrTaskStart
                        }
                    },

                    'append-connect': {
                        group: 'append',
                        className: 'bpmn-icon-connection',
                        title: translate('Connect using Custom Connector'),
                        action: {
                          click: startConnect,
                          dragstart: startConnect
                        }
                    },

                    'append-replace': {
                        group: 'edit',
                        className: 'bpmn-icon-screw-wrench',
                        title: translate('Change Event Type'),
                        action: {
                        click: function(event, element) {//appendDcrTaskStart

                            var position = assign(getReplaceMenuPosition(element), {
                                cursor: { x: event.x, y: event.y }
                            });

                            popupMenu.open(element, 'dcr-replace' /* 'bpmn-replace' */, position, {
                                title: translate('Change element'),
                                width: 300,
                                search: true
                              });
                            }
                        }
                    },


                    'append-include-flow': {
                        group: 'connect',
                        className: 'bpmn-icon-service',
                        title: translate('Render Include FLow'),
                        action: {
                            click: startConnect,
                            dragstart: startConnect
                        }
                    },

                    'append-includererer-flow': {
                        group: 'connect',
                        className: 'bpmn-icon-user',
                        title: translate('Render Include FLow'),
                        action: {
                            click: startConnect,
                            dragstart: startConnect
                        }
                    },

                }
                    
            }
        }

        if (is(businessObject, 'dcr:DcrTaskInc')) {

            return function (actions) {

                delete actions['append.end-event']
                delete actions['append.gateway']
                delete actions['append.intermediate-event']
                delete actions['append.text-annotation']
                delete actions['append.append-task']
                delete actions['replace']
                delete actions['connect']




                return {
                    ...actions,
                    'append-dcrtask': {
                        group: 'model',
                        className: 'bpmn-icon-start-event-non-interrupting-parallel-multiple',
                        title: translate('Append DcrTask'),
                        action: {
                        click: appendDcrTask,
                        dragstart: appendDcrTask
                        }
                    },

                    'append-dcrtaskinc': {
                        group: 'model',
                        className: 'bpmn-icon-lane-divide-two',
                        title: translate('Append DcrTaskinc'),
                        action: {
                        click: appendDcrTaskStart,
                        dragstart: appendDcrTaskStart
                        }
                    },

                    'append-replace': {
                        group: 'edit',
                        className: 'bpmn-icon-screw-wrench',
                        title: translate('Change Event Type'),
                        action: {
                        click: function(event, element) {//appendDcrTaskStart

                            var position = assign(getReplaceMenuPosition(element), {
                                cursor: { x: event.x, y: event.y }
                            });

                            popupMenu.open(element, /*'bpmn-replace'*/ 'dcr-replace', position, {
                                title: translate('Change element'),
                                width: 300,
                                search: true
                              });
                            }
                        }
                    },

                    'append-connect': {
                        group: 'append',
                        className: 'bpmn-icon-connection',
                        title: translate('Connect using Custom Connector'),
                        action: {
                          click: startConnect,
                          dragstart: startConnect
                        }
                    },

                }
                    
            }
        }

        if (is(businessObject, 'bpmn:SequenceFlow')) {
            return function(actions) {
                delete actions['append.end-event']
                delete actions['append.gateway']
                delete actions['append.intermediate-event']
                delete actions['append.text-annotation']
                delete actions['append.append-task']
                delete actions['replace']
                delete actions['connect']

                return {
                    ...actions,
                    'append-replace': {
                        group: 'edit',
                        className: 'bpmn-icon-screw-wrench',
                        title: translate('Change Event Type'),
                        action: {
                        click: function(event, element) {//appendDcrTaskStart

                            var position = assign(getReplaceMenuPosition(element), {
                                cursor: { x: event.x, y: event.y }
                            });

                            popupMenu.open(element, /*'bpmn-replace'*/ 'dcr-replace', position, {
                                title: translate('Change element'),
                                width: 300,
                                search: true
                              });
                            }
                        }
                    },
                }



            }
        }

        else {
            return {} 
         }
            
    };
}


DcrContextPadProvider.$inject = [
    'config',
    'contextPad',
    'create',
    'elementFactory',
    'injector',
    'translate',
    'popupMenu',
    //'eventBus',
    //'modeling',
    'connect',
    //'canvas',
    //'rules',
];




/**
 * https://codesandbox.io/s/replace-menu-provider-forked-w58sy5?file=/src/replace/MyReplaceMenuProvider.js
 * https://forum.bpmn.io/t/can-we-add-custom-element-and-shape-for-drawing/8885
 * https://forum.bpmn.io/t/customizing-look-and-feel/563
 * https://forum.bpmn.io/t/i-want-to-customize-the-color-of-the-line-and-arrow-of-the-whole-flowchart-how-can-i-do-it/4881/4
 * https://forum.bpmn.io/t/problems-with-custom-connection/5467
 * 
 */




