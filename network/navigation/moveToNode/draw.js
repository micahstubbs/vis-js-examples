var nodes = null;
var edges = null;
var network = null;
var offsetx,
  offsety,
  scale,
  positionx,
  positiony,
  duration,
  easingFunction,
  doButton,
  focusButton,
  showButton;
var statusUpdateSpan;
var finishMessage = "";
var showInterval = false;
var showPhase = 1;
var amountOfNodes = 25;

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function updateValues() {
  offsetx = parseInt(document.getElementById("offsetx").value);
  offsety = parseInt(document.getElementById("offsety").value);
  duration = parseInt(document.getElementById("duration").value);
  scale = parseFloat(document.getElementById("scale").value);
  positionx = parseInt(document.getElementById("positionx").value);
  positiony = parseInt(document.getElementById("positiony").value);
  easingFunction = document.getElementById("easingFunction").value;
}

function draw() {
  destroy();
  statusUpdateSpan = document.getElementById("statusUpdate");
  doButton = document.getElementById("btnDo");
  focusButton = document.getElementById("btnFocus");
  showButton = document.getElementById("btnShow");

  // randomly create some nodes and edges
  var data = getScaleFreeNetwork(amountOfNodes);

  // create a network
  var container = document.getElementById("mynetwork");
  var options = {
    physics: {
      stabilization: {
        iterations: 1200
      }
    }
  };
  network = new vis.Network(container, data, options);

  // add event listeners
  network.on("select", function(params) {
    document.getElementById("selection").innerHTML =
      "Selection: " + params.nodes;
  });
  network.on("stabilized", function(params) {
    document.getElementById("stabilization").innerHTML =
      "Stabilization took " + params.iterations + " iterations.";
  });
  network.on("animationFinished", function() {
    statusUpdateSpan.innerHTML = finishMessage;
  });
}

function fitAnimated() {
  updateValues();

  var options = {
    offset: { x: offsetx, y: offsety },
    duration: duration,
    easingFunction: easingFunction
  };
  statusUpdateSpan.innerHTML = "Doing fit() Animation.";
  finishMessage = "Animation finished.";
  network.fit({ animation: options });
}

function doDefaultAnimation() {
  updateValues();

  var options = {
    position: { x: positionx, y: positiony },
    scale: scale,
    offset: { x: offsetx, y: offsety },
    animation: true // default duration is 1000ms and default easingFunction is easeInOutQuad.
  };
  statusUpdateSpan.innerHTML = "Doing Animation.";
  finishMessage = "Animation finished.";
  network.moveTo(options);
}

function doAnimation() {
  updateValues();

  var options = {
    position: { x: positionx, y: positiony },
    scale: scale,
    offset: { x: offsetx, y: offsety },
    animation: {
      duration: duration,
      easingFunction: easingFunction
    }
  };
  statusUpdateSpan.innerHTML = "Doing Animation.";
  finishMessage = "Animation finished.";
  network.moveTo(options);
}

function focusRandom() {
  updateValues();

  var nodeId = Math.floor(Math.random() * amountOfNodes);
  var options = {
    // position: {x:positionx,y:positiony}, // this is not relevant when focusing on nodes
    scale: scale,
    offset: { x: offsetx, y: offsety },
    animation: {
      duration: duration,
      easingFunction: easingFunction
    }
  };
  statusUpdateSpan.innerHTML = "Focusing on node: " + nodeId;
  finishMessage = "Node: " + nodeId + " in focus.";
  network.focus(nodeId, options);
}

function startShow() {
  updateValues();
  if (showInterval !== false) {
    showInterval = false;
    showButton.value = "Start a show!";
    network.fit();
  } else {
    showButton.value = "Stop the show!";
    focusRandom();
    setTimeout(doTheShow, duration);
    showInterval = true;
  }
}

function doTheShow() {
  updateValues();
  if (showInterval == true) {
    if (showPhase == 0) {
      focusRandom();
      showPhase = 1;
    } else {
      fitAnimated();
      showPhase = 0;
    }
    setTimeout(doTheShow, duration);
  }
}
