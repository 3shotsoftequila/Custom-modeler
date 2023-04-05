import inherits from 'inherits-browser';

import {
    every,
    find,
    forEach,
    some
} from 'min-dash';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

import { getParent, isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
    is
} from 'bpmn-js/lib/util/ModelUtil';

var HIGH_PRIORITY = 1500;


export default function DcrRules(eventBus) {
    RuleProvider.call(this, eventBus);
}

inherits(DcrRules, RuleProvider);

DcrRules.$inject = [ 'eventBus' ];

DcrRules.prototype.init = function() {
    let self = this;


    function canCreate(shape, target) {}

    function getConnection(source, target) {

        if (is(source, 'dcr:DcrTask')) {
            if (isAny( target, [ 'dcr:DcrTask', 'dcr:DcrTaskInc'])) {
                return {type: 'dcr:IncludeFlow'};
            } else {
                return false;
            }
        } 
        /*
        else if (is(source, 'dcr:DcrTaskInc')) {
            if (isAny( target, [ 'dcr:DcrTask', 'dcr:DcrTaskInc'])) {
                return {type: 'dcr:ExcludeFlow'};
            } else {
                return false;
            }
        }

        else if (is(source, 'dcr:DcrTaskInc')) {
            if (isAny( target, [ 'dcr:DcrTask', 'dcr:DcrTaskInc'])) {
                return {type: 'dcr:ExcludeFlow'};
            } else {
                return false;
            }
        }
        
        else if (is(source, 'dcr:DcrTask')) {
            if (isAny( target, [ 'dcr:DcrTask', 'dcr:DcrTaskInc'])) {
                return {type: 'dcr:PreConditionFlow'};
            } else {
                return false;
            }
        } 
        */

        return false;

    }



    function canConnect(source, target) {

        let dcrElementsWithCustomConnections = [ 'dcr:DcrTask', 'dcr:DcrTaskInc'];

        if (isAny(source, dcrElementsWithCustomConnections)) {
            return getConnection(source, target);
        } else if (isAny(target, dcrElementsWithCustomConnections)) {
            return getConnection(target, source);
        }

        return;
    }

    this.addRule( 'connection.create', HIGH_PRIORITY, function (context) {
        var source = context.source,
            target = context.target;

        return canConnect(source, target);
    });

    this.addRule('connection.reconnectStart', HIGH_PRIORITY, function (context) {
        var connection = context.connection,
            source = context.hover || context.source,
            target = connection.target;

        return canConnect(source, target, connection);
    });

    this.addRule('connection.reconnectEnd', HIGH_PRIORITY, function (context) {
        var connection = context.connection,
            source = connection.source,
            target = context.hover || context.target;

        return canConnect(source, target, connection);
    });



};














