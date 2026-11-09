const objects = new Map<string, { __html: string }>();

/**
 * returns the same `dangerouslySetInnerHTML` object for a given markup.
 * React 19 rewrites innerHTML when the object is new, even when the string
 * hasn't changed... so the work page's rhombus got swapped from under the
 * pointer between a mousedown and mouseup.. meaning the click never fired.
 * (the project page's stones still pass a fresh object, nothing gets
 * re-rendered mid-click.. but if they do, then we are all set!!)
 */
export function stableHtml(markup: string) {
    let object = objects.get(markup);
    if (!object) objects.set(markup, (object = { __html: markup }));
    return object;
}
