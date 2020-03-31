import {
  State,
  AbstractDisplacementState,
} from '@projectstorm/react-canvas-core';

export default class DragCanvasState extends AbstractDisplacementState {
  constructor() {
    super({
      name: 'drag-canvas',
    });
  }

  async activated(prev) {
    super.activated(prev);
    this.engine.getModel().clearSelection();
    await this.engine.repaintCanvas(true);

    // We can block layer rendering because we are only targeting the transforms
    this.engine
      .getModel()
      .getLayers()
      .forEach(layer => layer.allowRepaint(false));

    this.initialCanvasX = this.engine.getModel().getOffsetX();
    this.initialCanvasY = this.engine.getModel().getOffsetY();
  }

  deactivated(next: State) {
    super.deactivated(next);

    this.engine
      .getModel()
      .getLayers()
      .forEach(layer => layer.allowRepaint(true));
  }

  fireMouseMoved(event) {
    // Allow moving only with left clicks
    if (event.event.nativeEvent.which !== 1) return;

    this.engine
      .getModel()
      .setOffset(
        this.initialCanvasX + event.displacementX,
        this.initialCanvasY + event.displacementY,
      );
    this.engine.repaintCanvas();
  }
}
