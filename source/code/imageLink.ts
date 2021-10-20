const images = document.getElementsByTagName('img');
for (let i = 0; i < images.length; i++) {
    const image = images.item(i);
    const parent = image.parentElement;
    const link = document.createElement('a');
    link.href = image.src;
    link.target = '_blank';
    link.title = 'Open image in new tab';
    parent.replaceChild(link, image);
    link.appendChild(image);
}
