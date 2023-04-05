import DcrReplaceMenuProvider from "./DcrReplaceMenuProvider";
import LoopPopupProvider from './LoopPopupProvider'

import PopupMenuModule from 'diagram-js/lib/features/popup-menu';

export default {
    
    __depends__: [
        PopupMenuModule,
    ],

    __init__: [ 
        'dcrReplaceMenuProvider',
        //'loopPopupProvider'
    ],
    dcrReplaceMenuProvider: [ 'type', DcrReplaceMenuProvider ],
    //loopPopupProvider: [ 'type', LoopPopupProvider ]

};









/**
 import DcrReplaceMenuProvider from "./DcrReplaceMenuProvider";
//import ReplaceModule from 'diagram-js/lib/features/replace';
//import PopupMenuModule from 'diagram-js/lib/features/popup-menu';


export default {
    /*
    __depends__: [
        //ReplaceModule,
        PopupMenuModule
    ],*//*

    __init__: [ 'dcrReplaceMenuProvider' ],
    dcrReplaceMenuProvider: [ 'type', DcrReplaceMenuProvider ]
};
 */