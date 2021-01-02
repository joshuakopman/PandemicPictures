document.addEventListener('DOMContentLoaded', () => {
  const ws = new WebSocket('ws://' + location.host);
  ws.onopen = () => {
    var dataHandler = new DataHandler();
    var uiHelper = new UIHelper();
    var uiEventListenerManager = new UIEventListenerManager(dataHandler, uiHelper);
    var uiManager = new UIManager(uiEventListenerManager, ws);

    uiManager.initializeView();
  };
});

window.requestIdleCallback = window.requestIdleCallback || function (handler) {
  let startTime = Date.now();
  return setTimeout(function () {
    handler({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50.0 - (Date.now() - startTime));
      }
    });
  }, 1);
}