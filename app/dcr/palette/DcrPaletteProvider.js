import { assign} from 'min-dash'


export default function DcrPaletteProvider(
    palette, create, elementFactory, 
    translate, spaceTool, lassoTool, handTool,
    globalConnect) {

    this._create = create;
    this._elementFactory = elementFactory;
    this._translate = translate;
    this._spaceTool = spaceTool;
    this._lassoTool = lassoTool;
    this._handTool = handTool;
    this._globalConnect = globalConnect;

    palette.registerProvider(this);
}

DcrPaletteProvider.$inject = [

    'palette',
    'create',
    'elementFactory',
    'translate',
    'spaceTool',
    'lassoTool',
    'handTool',
    'globalConnect'
];

DcrPaletteProvider.prototype.getPaletteEntries = function(element) {

    /*let entries = _getPaletteEntries.apply(this);

    delete entries['create.start-event'];

    return entries;*/

    var elementFactory = this._elementFactory,
        create = this._create,
        translate = this._translate,
        spaceTool = this._spaceTool,
        lassoTool = this._lassoTool,
        handTool = this._handTool,
        globalConnect = this._globalConnect,
        actions = {};

    function createAction(type, group, className, title, options) {

        function createListener(event) {

            var shape = elementFactory.createShape(assign({type: type}, options));

            if (options) {
                shape.businessObject.di.isExpanded = options.isExpanded;
            }

            create.start(event, shape);
        }

        //var shortType = type.replace(/^bpmn:/, '');
        //var shortType = type.replace(/^dcr\:/, '');


        return {
            group: group,
            className: className,
            title: title , //|| 'Create ' + shortType,
            action: {
                dragstart: createListener,
                click: createListener
            }
        };

    }


    return () => {
        return {
            'hand-tool': {
                group: 'tools',
                className: 'bpmn-icon-hand-tool',
                title: translate('Activate the hand tool'),
                action: {
                  click: function(event) {
                    handTool.activateHand(event);
                  }
                }
            },

            'lasso-tool': {
                group: 'tools',
                className: 'bpmn-icon-lasso-tool',
                title: translate('Activate the lasso tool'),
                action: {
                  click: function(event) {
                    lassoTool.activateSelection(event);
                  }
                }
            },

            'space-tool': {
                group: 'tools',
                className: 'bpmn-icon-space-tool',
                title: translate('Activate the create/remove space tool'),
                action: {
                  click: function(event) {
                    spaceTool.activateSelection(event);
                  }
                }
            },

            'global-connect-tool': {
                group: 'tools',
                className: 'bpmn-icon-connection-multi',
                title: translate('Activate the global connect tool'),
                action: {
                  click: function(event) {
                    globalConnect.start(event);
                  }
                }
            },

            'tool-separator': {
                group: 'tools',
                separator: true
            },

            'create.dcr-task': createAction(
                'dcr:DcrTask', 'activity', 'bpmn-icon-trash', 
                translate('Create DcrTask')
            ),

            'create.dcr-task-inc': createAction(
                'dcr:DcrTaskInc', 'activity', 'bpmn-icon-lane-divide-two', 
                translate('Create DcrTask (Inc)')
            ),

            /*
            'create.dcr-subprocess': createAction(
                'dcr:DcrSubProcess', 'activity', 'bpmn-icon-subprocess-expanded', 
                translate('Create Sub-Process')
            ),*/
        }
    };

};























