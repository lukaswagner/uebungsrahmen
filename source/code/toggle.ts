function toggle(elemId: string, Id: string): void {
    const elem = document.getElementById(elemId) as HTMLDivElement;
    const toggle = document.getElementById(Id) as HTMLDivElement;
    if (!elem || !toggle) return;
    toggle.onclick = () => elem.classList.toggle('d-none');
}

toggle('navbar-navigation', 'navbar-toggle');
toggle('controls', 'controls-toggle');
