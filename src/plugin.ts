import type { PluginMessageEvent } from "./model";
import type { TextData } from "./types";

penpot.ui.open("PenPlot", `?theme=${penpot.theme}`, {
  width: 640,
  height: 700,
});

penpot.on("themechange", (theme) => {
  sendMessage({ type: "theme", content: theme });
});

penpot.ui.onMessage((message: any) => {
  if (message.type === "create-chart") {
    const { svg: svgString, texts } = message.content;
    const { width, height } = message.dimensions;

    // Create a board with the same dimensions as the chart
    const board = penpot.createBoard();
    board.resize(width, height);

    // Create shape from SVG
    const chartGroup = penpot.createShapeFromSvg(svgString);

    // If chart was created successfully, add it to the board
    if (chartGroup) {
      board.appendChild(chartGroup);
      chartGroup.x = 0;
      chartGroup.y = 0;
      penpot.ungroup(chartGroup);

      // Remove base background if exists
      const baseBackground = board.children.find(
        (child) => child.name === "base-background"
      );
      if (baseBackground) {
        baseBackground.remove();
      }

      // Create and add text elements
      (texts as TextData[]).forEach((textData) => {
        const text = penpot.createText(textData.content);
        if (text) {
          text.align = textData.align;
          text.growType = "auto-width";
          text.name = simpleSlugify(textData.content);
          text.fontSize = textData.fontSize || "12";
          text.fontFamily = textData.fontFamily || "Work Sans";
          text.fills = textData.fills || [{ fillColor: "#000000", fillOpacity: 1 }];
          board.insertChild(1,text);
          text.x = textData.x;
          text.y = textData.y;
          

        }
      });
      penpot.selection = [board];
    }
  }
});

function sendMessage(message: PluginMessageEvent) {
  penpot.ui.sendMessage(message);
}


function simpleSlugify(text: string) {
    return text.substring(0,10).toLowerCase().replace(/ /g, "-")
}
