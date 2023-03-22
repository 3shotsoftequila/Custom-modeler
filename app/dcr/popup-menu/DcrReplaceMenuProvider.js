import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { isDifferentType } from 'bpmn-js/lib/features/popup-menu/util/TypeUtil';
import inherits from 'inherits';
import BaseReplaceMenuProvider from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';
import { forEach, filter, isUndefined } from 'min-dash';

import * as dcrreplaceOptions from '../replace/DcrReplaceOptions';

import * as replaceOptions from 'bpmn-js/lib/features/replace/ReplaceOptions';


import {isAny} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

export default function DcrReplaceMenuProvider (injector) {
    injector.invoke(BaseReplaceMenuProvider, this);
}

inherits(DcrReplaceMenuProvider, BaseReplaceMenuProvider);

DcrReplaceMenuProvider.$inject = [
    'injector'
];

DcrReplaceMenuProvider.prototype.register = function() {
    this._popupMenu.registerProvider('dcr-replace', this);
};


DcrReplaceMenuProvider.prototype.getEntries = function(element) {
    let businessObject = element.businessObject;
    let entries;

    if (!this._rules.allowed('shape.replace', { element: element })) {
        return [];
    }

    var differentType = isDifferentType(element);

    if (is(businessObject, 'dcr:DcrTask') ) {
        entries = dcrreplaceOptions.DCRTASK.filter(differentType).filter(isInTargets([
            {
                type: 'dcr:DcrTask'
            },{
                type: 'dcr:DcrTaskInc'
            }, {
                type: 'bpmn:StartEvent'
            }
        ]));
        return this._createEntries(element, entries);
    }

    if (is(businessObject, 'dcr:DcrTaskInc') ) {
        entries = dcrreplaceOptions.DCRTASKINC.filter(differentType).filter(isInTargets([
            {
                type: 'dcr:DcrTaskInc'
            },{
                type: 'dcr:DcrTask'
            }, {
                type: 'bpmn:IntermediateThrowEvent'
            }
        ]));
        return this._createEntries(element, entries);
    }

    // sequence flows
    /*
    if (is(businessObject, 'bpmn:SequenceFlow')) {
        return this._createSequenceFlowEntries(element, replaceOptions.SEQUENCE_FLOW);
    }*/

    if (is(businessObject, 'bpmn:SequenceFlow') ) {
        entries = dcrreplaceOptions.SEQUENCE_FLOW.filter(differentType).filter(isInTargets([
            {
                type: 'bpmn:SequenceFlow'
            },{
                type: 'bpmn:ConditionalFLow'
            
            }
        ]));
        return this._createEntries(element, entries);
    }


    return [];







};

function isInTargets(targets) {
  return function(element) {
    return targets.some(
      target => element.target.type == target.type &&
      element.target.eventDefinitionType == target.eventDefinitionType
    );
  };
}





