import type { PluginMessageEvent } from './model';

penpot.ui.open("PenPlot", `?theme=${penpot.theme}`, {
  width: 640,
  height: 480,
});

penpot.on('themechange', (theme) => {
  sendMessage({ type: 'theme', content: theme });
});

penpot.ui.onMessage((message: any) => {
  if (message.type === "create-chart") {
    const svgString = message.content;
    const { width, height } = message.dimensions;
    
    // Create a board with the same dimensions as the chart
    const board = penpot.createBoard();
    
    // Create shape from SVG
    const chartGroup = penpot.createShapeFromSvg(svgString);
    
    // If chart was created successfully, add it to the board
    if (chartGroup) {
      board.resize(width, height);
      board.appendChild(chartGroup);
      chartGroup.x = 0;
      chartGroup.y = 0;
      
    }
  }
});

function sendMessage(message: PluginMessageEvent) {
  penpot.ui.sendMessage(message);
}
