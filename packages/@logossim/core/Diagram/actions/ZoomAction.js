import { Action, InputType } from '@projectstorm/react-canvas-core';

const ZOOM_LEVELS = [15, 25, 50, 75, 100, 150, 200, 300];

/**
 * Handles zoom in/out actions.
 */
export default class ZoomAction extends Action {
  constructor() {
    super({
      type: InputType.MOUSE_WHEEL,
      fire: ({ event }) => {
        event.stopPropagation();

        const model = this.engine.getModel();

        // We can block layer rendering because we are only targeting the transforms
        model.getLayers().forEach(layer => layer.allowRepaint(false));

        const zoomDirection =
          Math.sign(event.deltaY) > 0 ? 'in' : 'out';

        const currentZoomLevelIndex = ZOOM_LEVELS.indexOf(
          ZOOM_LEVELS.includes(model.getZoomLevel())
            ? model.getZoomLevel()
            : 100,
        );

        let nextZoomLevelIndex;
        if (zoomDirection === 'in') {
          nextZoomLevelIndex = Math.min(
            currentZoomLevelIndex + 1,
            ZOOM_LEVELS.length - 1,
          );
        } else {
          nextZoomLevelIndex = Math.max(currentZoomLevelIndex - 1, 0);
        }

        const oldZoomFactor = model.getZoomLevel() / 100;
        model.setZoomLevel(ZOOM_LEVELS[nextZoomLevelIndex]);
        const zoomFactor = model.getZoomLevel() / 100;

        const boundingRect = this.engine
          .getCanvas()
          .getBoundingClientRect();
        const clientWidth = boundingRect.width;
        const clientHeight = boundingRect.height;

        // Compute difference between rect before and after scroll
        const widthDiff =
          clientWidth * zoomFactor - clientWidth * oldZoomFactor;
        const heightDiff =
          clientHeight * zoomFactor - clientHeight * oldZoomFactor;

        // Compute mouse coords relative to canvas
        const clientX = event.clientX - boundingRect.left;
        const clientY = event.clientY - boundingRect.top;

        // Compute width and height increment factor
        const xFactor =
          (clientX - model.getOffsetX()) /
          oldZoomFactor /
          clientWidth;
        const yFactor =
          (clientY - model.getOffsetY()) /
          oldZoomFactor /
          clientHeight;

        model.setOffset(
          model.getOffsetX() - widthDiff * xFactor,
          model.getOffsetY() - heightDiff * yFactor,
        );
        this.engine.repaintCanvas();

        // Re-enable rendering
        model.getLayers().forEach(layer => layer.allowRepaint(true));
      },
    });
  }
}
