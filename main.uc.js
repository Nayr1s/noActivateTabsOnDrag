// Более агрессивный вариант (вставь вместо предыдущего main.uc.js)
(function () {
  "use strict";
  if (location.href !== "chrome://browser/content/browser.xhtml") return;

  const tryPatch = () => {
    // Ищем объект, который отвечает за drag (в разных версиях может называться по-разному)
    const dnd = window.gZenDragAndDrop || window.TabDragAndDrop || gBrowser?.tabContainer?._dragAndDrop;
    if (!dnd || typeof dnd.startTabDrag !== "function") {
      setTimeout(tryPatch, 500);
      return;
    }

    const original = dnd.startTabDrag.bind(dnd);

    dnd.startTabDrag = function (event, tab, options) {
      const prev = gBrowser.selectedTab;
      const result = original(event, tab, options);

      // Сразу возвращаем предыдущую вкладку
      if (prev && prev !== tab && prev.isConnected) {
        gBrowser.selectedTab = prev;
      }
      return result;
    };

    console.log("[No Activate on Drag] patched startTabDrag");
  };

  if (document.readyState === "complete") {
    tryPatch();
  } else {
    window.addEventListener("load", tryPatch, { once: true });
  }
})();
