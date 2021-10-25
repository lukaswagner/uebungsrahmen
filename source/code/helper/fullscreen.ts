import { UI } from '@lukaswagner/web-ui';

interface VendorPrefixedDocument extends Document {
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitCancelFullScreen?: () => Promise<void>;
    msFullscreenElement?: Element;
    webkitIsFullScreen?: boolean;
    mozfullscreenchange?: Event;
}

interface VendorPrefixedHTMLElement extends HTMLElement {
    msRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    webkitRequestFullScreen?: () => Promise<void>;
}

export function setFullscreen(
    elem: VendorPrefixedHTMLElement,
    full = true
): void {
    const documentPrefixed = document as VendorPrefixedDocument;
    if (full) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else if (
        documentPrefixed.fullscreenElement ||
        documentPrefixed.mozfullscreenchange ||
        documentPrefixed.webkitIsFullScreen ||
        documentPrefixed.msFullscreenElement
    ) {
        if (documentPrefixed.exitFullscreen) {
            documentPrefixed.exitFullscreen();
        } else if (documentPrefixed.mozCancelFullScreen) {
            documentPrefixed.mozCancelFullScreen();
        } else if (documentPrefixed.webkitCancelFullScreen) {
            documentPrefixed.webkitCancelFullScreen();
        } else if (documentPrefixed.msExitFullscreen) {
            documentPrefixed.msExitFullscreen();
        }
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
        handler: (v: boolean) => setFullscreen(elem, v),
    });
    const documentPrefixed = document as VendorPrefixedDocument;
    documentPrefixed.addEventListener(
        'fullscreenchange',
        () => (checkbox.value = !!documentPrefixed.fullscreenElement)
    );
    documentPrefixed.addEventListener(
        'mozfullscreenchange',
        () => (checkbox.value = !!documentPrefixed.mozfullscreenchange)
    );
    documentPrefixed.addEventListener(
        'webkitfullscreenchange',
        () => (checkbox.value = !!documentPrefixed.webkitIsFullScreen)
    );
    documentPrefixed.addEventListener(
        'msfullscreenchange',
        () => (checkbox.value = !!documentPrefixed.msFullscreenElement)
    );
}
