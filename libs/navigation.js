function goToAnalytics() {
    localStorage.setItem('activeLink', 'analytics');
    window.location.href = "../analytics/index.html";
}
function goToHome() {
    localStorage.setItem('activeLink', 'home');
    window.location.href = "/index.html";
}



export { goToAnalytics, goToHome};