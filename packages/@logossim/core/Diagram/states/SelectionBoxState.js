import { Rectangle } from '@projectstorm/geometry';
import {
  AbstractDisplacementState,
  SelectionLayerModel,
} from '@projectstorm/react-canvas-core';
import {
  LinkModel,
  PointModel,
} from '@projectstorm/react-diagrams-core';

/**
 * This State handles selection box events.
 *
 * Link (and link points) selection is currently disabled.
 */
export default class SelectionBoxState extends AbstractDisplacementState {
  constructor() {
    super({
      name: 'selection-box',
    });
  }

  activated(previous) {
    super.activated(previous);
    this.layer = new SelectionLayerModel();
    this.engine.getModel().addLayer(this.layer);
  }

  deactivated(next) {
    super.deactivated(next);
    this.layer.remove();
    this.engine.repaintCanvas();
  }

  getBoxDimensions(event) {
    const rel = this.engine.getRelativePoint(
      event.event.clientX,
      event.event.clientY,
    );

    return {
      left:
        rel.x > this.initialXRelative ? this.initialXRelative : rel.x,
      top:
        rel.y > this.initialYRelative ? this.initialYRelative : rel.y,
      width: Math.abs(rel.x - this.initialXRelative),
      height: Math.abs(rel.y - this.initialYRelative),
      right:
        rel.x < this.initialXRelative ? this.initialXRelative : rel.x,
      bottom:
        rel.y < this.initialYRelative ? this.initialYRelative : rel.y,
    };
  }

  fireMouseMoved(event) {
    this.layer.setBox(this.getBoxDimensions(event));

    const relative = this.engine.getRelativeMousePoint({
      clientX: this.initialX,
      clientY: this.initialY,
    });
    if (event.virtualDisplacementX < 0) {
      relative.x -= Math.abs(event.virtualDisplacementX);
    }
    if (event.virtualDisplacementY < 0) {
      relative.y -= Math.abs(event.virtualDisplacementY);
    }
    const rect = new Rectangle(
      relative,
      Math.abs(event.virtualDisplacementX),
      Math.abs(event.virtualDisplacementY),
    );

    if (!this.engine.getModel().isLocked()) {
      this.engine
        .getModel()
        .getSelectionEntities()
        .forEach(model => {
          if (model.getBoundingBox) {
            if (!this.allowSelection(model)) return;

            const bounds = model.getBoundingBox();
            if (
              rect.containsPoint(bounds.getTopLeft()) &&
              rect.containsPoint(bounds.getBottomRight())
            ) {
              model.setSelected(true);
            } else {
              model.setSelected(false);
            }
          }
        });
    }

    this.engine.repaintCanvas();
  }

  allowSelection(model) {
    return (
      !(model instanceof LinkModel) && !(model instanceof PointModel)
    );
  }
}
