import { CANVAS_WIDTH } from './constants';
import { getImageSprite } from './ImageSprite';

/**
 * Collision box object.
 * @param {number} x X position.
 * @param {number} y Y Position.
 * @param {number} w Width.
 * @param {number} h Height.
 */
export default class CollisionBox {

  public x;
  public y;
  public w;
  public h;

  public width;
  public height;

  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }
}
