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
        label: 'Pending Marker:ON',
        actionName: 'replace-with-dcr-pending-inc',
        className: 'bpmn-icon-start-event-none',
        target: {
          type: 'dcr:DcrPendingInc'
        }
    },
    {
        label: 'Executed Marker:ON',
        actionName: 'replace-with-dcr-executed-inc',
        className: 'bpmn-icon-intermediate-event-none',
        target: {
        type: 'dcr:DcrExecutedInc'
        }
    },
    {
        label: 'Pending and Executed Marker:ON',
        actionName: 'replace-with-dcr-pending-executed-inc',
        className: 'bpmn-icon-lane-insert-above',
        target: {
        type: 'dcr:DcrPendingExecutedInc'
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
        label: 'Pending Marker:ON',
        actionName: 'replace-with-dcr-pending-exc',
        className: 'bpmn-icon-intermediate-event-none',
        target: {
          type: 'dcr:DcrPendingExc'
        }
    },
    {
        label: 'Executed:ON',
        actionName: 'replace-with-dcr-executed-exc',
        className: 'bpmn-icon-intermediate-event-none',
        target: {
        type: 'dcr:DcrExecutedExc'
        }
    },
    {
        label: 'Pending and Executed Marker:ON',
        actionName: 'replace-with-dcr-pending-executed-exc',
        className: 'bpmn-icon-lane-insert-above',
        target: {
        type: 'dcr:DcrPendingExecutedExc'
        }
    },
    
]


/*

export var SEQUENCE_FLOW = [
    {
        label: 'Sequence have Flow',
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
];*/



