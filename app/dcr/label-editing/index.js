import ChangeSupportModule from 'diagram-js/lib/features/change-support';
import ResizeModule from 'diagram-js/lib/features/resize';
import DirectEditingModule from 'diagram-js-direct-editing';

import DcrLabelEditingProvider from './DcrLabelingProvider';
//import LabelEditingPreview from './DcrLabelEditingPreview';


export default {
  __depends__: [
    ChangeSupportModule,
    ResizeModule,
    DirectEditingModule
  ],
  __init__: [
    'labelEditingProvider',
    //'labelEditingPreview'
  ],
  labelEditingProvider: [ 'type', DcrLabelEditingProvider ],
  //labelEditingPreview: [ 'type', LabelEditingPreview ]
};
