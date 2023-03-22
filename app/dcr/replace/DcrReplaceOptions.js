//437-528


export var DCRTASK = [
    {
        label: 'Task',
        actionName: 'replace-with-task',
        className: 'bpmn-icon-task',
        target: {
            type: 'bpmn:Task'
        }
    },
    {
        label: 'Dcr inc Task',
        actionName: 'replace-with-dcr-inc-task',
        className: 'bpmn-icon-send',
        target: {
            type: 'dcr:DcrTask'
        }
    },
    {
        label: 'Dcr exc Task',
        actionName: 'replace-with-dcr-exc-task',
        className: 'bpmn-icon-receive',
        target: {
            type: 'dcr:DcrTaskInc'
        }
    },
    {
        label: 'Start Event',
        actionName: 'replace-with-none-start',
        className: 'bpmn-icon-start-event-none',
        target: {
          type: 'bpmn:StartEvent'
        }
      },
]


//437-528


export var DCRTASKINC = [
    {
        label: 'Task',
        actionName: 'replace-with-task',
        className: 'bpmn-icon-task',
        target: {
            type: 'bpmn:Task'
        }
    },
    {
        label: 'Dcr inc Task',
        actionName: 'replace-with-dcr-inc-task',
        className: 'bpmn-icon-send',
        target: {
            type: 'dcr:DcrTask'
        }
    },
    {
        label: 'Dcr exc Task',
        actionName: 'replace-with-dcr-exc-task',
        className: 'bpmn-icon-receive',
        target: {
            type: 'dcr:DcrTaskInc'
        }
    },
    {
        label: 'Intermediate Throw Event',
        actionName: 'replace-with-none-intermediate-throw',
        className: 'bpmn-icon-intermediate-event-none',
        target: {
          type: 'bpmn:IntermediateThrowEvent'
        }
    },
]



export var SEQUENCE_FLOW = [
    {
        label: 'Sequence Flow',
        actionName: 'replace-with-sequence-flow',
        className: 'bpmn-icon-connection',
        target: {
            type: 'bpmn:SequenceFlow'
        }
    },
    
    {
        label: 'Conditional Flow',
        actionName: 'replace-with-conditional-flow',
        className: 'bpmn-icon-conditional-flow',
        target: {
            type: 'bpmn:ConditionalFlow'
        }
    }
];



