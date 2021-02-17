function executeOrderSixtysix() {
    var ua = window.navigator.userAgent;
    var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    var webkit = !!ua.match(/WebKit/i);
    var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

    return iOSSafari && !localStorage.getItem('iOS-Safari-OK');
}

export { executeOrderSixtysix };