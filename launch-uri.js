function launchUri(url, successCb, failureCb) {
  var agent = navigator.userAgent.toLowerCase();
  if (navigator.msLaunchUri) {
    navigator.msLaunchUri(url, successCb, failureCb);
  } else if (agent.indexOf("chrome") !== -1) {
    launchWithBlur(url, successCb, failureCb);
  } else if (agent.indexOf("firefox") !== -1) {
    launchWithHiddenIframe(url, successCb, failureCb);
  } else {
    launchWithHiddenIframe(url, successCb, failureCb);
  }
}

function launchWithBlur(url, successCb, failureCb) {
  var timerId;
  var eventListener = function() {
    clearTimeout(timerId);
    successCb();
  }
  addEventListener("blur", eventListener);
  timerId = setTimeout(function() {
    removeEventListener("blur", eventListener);
    failureCb();
  }, 500);
  location.href = url;
}

function launchWithHiddenIframe(url, successCb, failureCb) {
  var iframe = document.createElement("iframe");
  iframe.style.visibility = "hidden";
  iframe.style.border = "none";
  iframe.width = 0;
  iframe.height = 0;
  document.body.appendChild(iframe);
  setTimeout(function() {
    try {
      iframe.contentWindow.document; // raise exception
      successCb();
    } catch (e) {
      failureCb();
    } finally {
      document.body.removeChild(iframe);
      iframe = null;
    }
  }, 500);
  iframe.src = url;
}
