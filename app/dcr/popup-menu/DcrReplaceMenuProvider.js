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


DcrReplaceMenuProvider.prototype.getHeaderEntries = function(element) {/*

    let headerEntries = [];

    if (isAny(element, ['dcr:DcrTask','dcr:DcrTaskInc'])) {
        headerEntries = headerEntries.concat(this._getLoopEntries(element));
    }

    return headerEntries;*/

}

//424

DcrReplaceMenuProvider.prototype._getLoopEntries = function(element) {

    var self = this;
    var translate = this._translate;

    function toggleLoopEntry(event, entry) {

        var newLoopCharacteristics = getBusinessObject(element).LoopCharacteristics;
    
        if (entry.active) {
            newLoopCharacteristics = undefined;
        } else {
            if (isUndefined(entry.options.isSequential) 
            || !newLoopCharacteristics
            || !is(newLoopCharacteristics, entry.options.loopCharacteristics)) {
              newLoopCharacteristics = self._moddle.create(entry.options.loopCharacteristics);
            }
        }

        self._modeling.updateProperties(element, { loopCharacteristics: newLoopCharacteristics });


/**
 * 
    if (entry.active) {
      newLoopCharacteristics = undefined;
    } else {
      if (isUndefined(entry.options.isSequential) 
      || !newLoopCharacteristics
      || !is(newLoopCharacteristics, entry.options.loopCharacteristics)) {
        newLoopCharacteristics = self._moddle.create(entry.options.loopCharacteristics);
      }

      newLoopCharacteristics.isSequential = entry.options.isSequential;
    }
 */
        

    }

    var businessObject = getBusinessObject(element),
        loopCharacteristics = businessObject.loopCharacteristics;

    
    var isSequential,
    isLoop,
    isParallel;

    if (loopCharacteristics) {
        isSequential = loopCharacteristics.isSequential;
        isLoop = loopCharacteristics.isSequential === undefined;
        isParallel = loopCharacteristics.isSequential !== undefined && !loopCharacteristics.isSequential;
    }
        
    var loopEntries = [
        {
        id: 'toggle-parallel-mi',
        className: 'bpmn-icon-parallel-mi-marker',
        title: translate('Paralle jk kjgling Multi Instance'),
        active: isParallel,
        action: toggleLoopEntry,
        options: {
            loopCharacteristics: 'bpmn:MultiInstanceLoopCharacteristics',
            isSequential: false
        }
        },
        /*
        {
        id: 'toggle-sequential-mi',
        className: 'bpmn-icon-sequential-mi-marker',
        title: translate('Sequentialbing Multi Instance'),
        active: isSequential,
        action: toggleLoopEntry,
        options: {
            loopCharacteristics: 'bpmn:MultiInstanceLoopCharacteristics',
            isSequential: true
        }
        },*/
        {
        id: 'toggle-loop',
        className: 'bpmn-icon-loop-marker',
        title: translate('Loopching'),
        active: isLoop,
        action: toggleLoopEntry,
        options: {
            loopCharacteristics: 'bpmn:StandardLoopCharacteristics'
        }
        }
    ];
    return loopEntries;

}


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
                type: 'dcr:DcrPendingInc'
            }, {
                type: 'dcr:DcrExecutedInc'
            }, {
                type: 'dcr:DcrPendingExecutedInc'
            }, 
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
                type: 'dcr:DcrPendingExc'
            }, {
                type: 'dcr:DcrExecutedExc'
            }, {
                type: 'dcr:DcrPendingExecutedExc'
            },
        ]));
        return this._createEntries(element, entries);
    }
/*
    if (is(businessObject, 'dcr:DcrPendingExc') ) {
        entries = dcrreplaceOptions.DCRTASKINC.filter(differentType).filter(isInTargets([
            {
                type: 'dcr:DcrTaskInc'
            },{
                type: 'dcr:DcrTask'
            }, {
                type: 'dcr:DcrPendingExc'
            }, {
                type: 'dcr:DcrExecutedExc'
            }
        ]));
        return this._createEntries(element, entries);
    }*/

    // sequence flows
    /*
    if (is(businessObject, 'bpmn:SequenceFlow')) {
        return this._createSequenceFlowEntries(element, replaceOptions.SEQUENCE_FLOW);
    }

    if (is(businessObject, 'bpmn:SequenceFlow') ) {
        entries = dcrreplaceOptions.SEQUENCE_FLOW.filter(differentType).filter(isInTargets([
            {
                type: 'bpmn:SequenceFlow'
            },{
                type: 'bpmn:ConditionalFLow'
            
            }
        ]));
        return this._createEntries(element, entries);
    }*/


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





