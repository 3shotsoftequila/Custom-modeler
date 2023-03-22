
import {query as domQuery} from 'min-dom'


import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    classes as svgClasses
} from 'tiny-svg';


function lineStyle(attrs) {
    return styles.computeStyle(attrs, ['no-fill'], {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        stroke: black,
        strokeWidth: 2
    });
}

export function addMarker(id, options) {
    var {
        ref = { x: 0, y: 0 },
        scale = 1,
        element
    } = options;

    var marker = svgCreate('marker', {
        id: id,
        viewBox: '0 0 20 20',
        refX: ref.x,
        refY: ref.y,
        markerWidth: 20 * scale,
        markerHeight: 20 * scale,
        orient: 'auto'
    });

    svgAppend(marker, element);

    var defs = domQuery('defs', canvas._svg);

    if (!defs) {
        defs = svgCreate('defs');

        svgAppend(canvas._svg, defs);
    }

    svgAppend(defs, marker);

    markers[id] = marker;
}


