const navbar = document.getElementById('navbar') as HTMLDivElement;
const button = document.getElementById('navbar-toggle') as HTMLDivElement;
button.onclick = () => navbar.classList.toggle('d-none');
