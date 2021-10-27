type Collapsible = {toggle: HTMLElement, content: HTMLElement};

const elements: Collapsible[] = [];

function isVisible(c: Collapsible): boolean {
    return c.toggle.classList.contains('triangle-down');
}

function show(c: Collapsible, visible: boolean): void {
    const current = isVisible(c);
    if (current === visible) return;
    c.toggle.classList.toggle('triangle-down');
    c.toggle.classList.toggle('triangle-right');
    c.content.classList.toggle('d-none');

    if (visible) elements?.forEach((e) => {
        if (e !== c) show(e, false);
    });
}

export function toggle(
    contentId: string, toggleId: string, visible = false
): void {
    const content = document.getElementById(contentId);
    const toggle = document.getElementById(toggleId);
    if (!content || !toggle) return;
    const c = {content, toggle};
    toggle.onclick = () => show(c, !isVisible(c));
    if (visible) {
        toggle.classList.add('triangle-down');
    } else {
        toggle.classList.add('triangle-right');
        content.classList.add('d-none');
    }
    elements.push(c);
}
