document.addEventListener('DOMContentLoaded', () => {
    const ws = new WebSocket('ws://'+location.host);
    ws.onopen = () => {
      var dataHandler = new DataHandler();
      var uiHelper = new UIHelper();
      var uiEventListenerManager = new UIEventListenerManager(dataHandler,uiHelper);
      var uiManager = new UIManager(dataHandler,uiEventListenerManager,ws);
      
      uiManager.initializeView();
    };
});





