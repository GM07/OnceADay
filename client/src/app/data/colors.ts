/* tslint:disable:no-magic-numbers */
import { Color } from "./color";

export abstract class Colors {
    static readonly WHITE: Color = new Color(255, 255, 255);
    static readonly YELLOW: Color = new Color(255, 255, 0);
    static readonly BLACK: Color = new Color(0, 0, 0);
    static readonly BLUE: Color = new Color(0, 0, 255);
    static readonly RED: Color = new Color(255, 0, 0);
    static readonly GREEN: Color = new Color(0, 255, 0);
    static readonly GRAY: Color = new Color(122, 122, 122);
    static readonly CYAN: Color = new Color(0, 255, 255);
    static readonly PURPLE: Color = new Color(255, 0, 255);
}
