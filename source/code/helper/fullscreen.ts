import { UI } from '@lukaswagner/web-ui';

export function setFullscreen(elem: HTMLElement, full = true): void {
    if (full) {
        elem.requestFullscreen();
    } else if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

export function toggleFullscreen(elem: HTMLElement): void {
    setFullscreen(elem, !document.fullscreenElement);
}

export function setupFullscreen(elem: HTMLElement, event = 'dblclick'): void {
    elem.addEventListener(event, () => toggleFullscreen(elem));
}

export function addFullscreenCheckbox(elem: HTMLElement, ui: UI): void {
    const checkbox = ui.input.checkbox({
        label: 'Fullscreen',
        handler: (v: boolean) => setFullscreen(elem, v)
    });
    document.addEventListener(
        'fullscreenchange',
        () => checkbox.value = !!document.fullscreenElement
    );
}
