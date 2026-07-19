export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

/**
 * Clamp a top-left `pos` so an element of `size` stays fully within `bounds`.
 * When the element is larger than the bounds on an axis, it pins to 0.
 */
export function clampToBounds(pos: Point, size: Size, bounds: Size): Point {
  const maxX = Math.max(0, bounds.width - size.width);
  const maxY = Math.max(0, bounds.height - size.height);
  return {
    x: Math.min(Math.max(0, pos.x), maxX),
    y: Math.min(Math.max(0, pos.y), maxY),
  };
}
