export function Links() {
    document.addEventListener('DOMContentLoaded', () => {
        const activeLink = localStorage.getItem('activeLink');
        if (activeLink) {
            const links = document.querySelectorAll('.nav-link');
            links.forEach(link => link.classList.remove('active'));

            const activeElement = document.getElementById(activeLink);
            if (activeElement) {
                activeElement.parentElement.classList.add('active');
            }
        }
    });
}
