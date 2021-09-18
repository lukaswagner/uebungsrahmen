import { UI } from "@lukaswagner/web-ui";

export function setFullscreen(elem: HTMLElement, full: boolean = true) {
    if (full) {
        elem.requestFullscreen();
    } else if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

export function toggleFullscreen(elem: HTMLElement) {
    setFullscreen(elem, !document.fullscreenElement);
}

export function setupFullscreen(elem: HTMLElement, event: string = 'dblclick') {
    elem.addEventListener(event, () => toggleFullscreen(elem));
}

export function addFullscreenCheckbox(elem: HTMLElement, ui: UI) {
    const checkbox = ui.input.checkbox({
        label: 'Fullscreen',
        handler: (v) => setFullscreen(elem, v)
    });
    document.addEventListener(
        'fullscreenchange',
        () => checkbox.value = !!document.fullscreenElement
    );
}
