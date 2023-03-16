class Button {
    constructor(x, y, w, h, border, inner, hover, press, msg, tOffX, tOffY) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.border = border;
        this.inner = inner;
        this.press = press;
        this.pressing = false;
        this.msg = msg;
        this.pressed = false;
        this.hover = hover;
        this.offX = tOffX;
        this.offY = tOffY;
        this.hovering = true;
    }

    draw() {
        p.stroke(this.border);
        p.strokeWeight(1);
        p.fill(this.inner);
        if (this.hovering) {
            p.fill(this.hover);
        }
        if (this.pressing) {
            p.fill(this.press);
        }
        p.rect(this.x * height - 2, this.y * height, this.w * height + 4, this.h * height, 0);
        p.fill(255, 255, 255);
        switch (this.msg * 1) {
        case -1:
            p.fill(100, 0, 255);
            break;
        case 1:
            p.fill(0, 0, 0);
            break;
        case 2:
            p.fill(255, 0, 0);
            break;
        case 3:
            p.fill(0, 0, 255);
            break;
        case 4:
            p.fill(0, 255, 0);
            break;
        case 5:
            p.fill(0, 255, 255);
            break;
        case 6:
            p.fill(255, 255, 0);
            break;
        case 7:
            p.fill(255, 0, 255);
            break;
        case 8:
            p.fill(255, 100, 0);
            break;
        }
        p.text(this.msg, (this.x + this.offX) * height, (this.y + this.offY) * height);
    }
    handlePress() {
        if (p.mouseX > this.x * height && p.mouseY > this.y * height && p.mouseX < (this.x + this.w) * height && p.mouseY < (this.y + this.h) * height) {
            this.hovering = true;
        }
        else {
            this.hovering = false;
        }
        if (p.mouseIsPressed && p.mouseX > this.x * height && p.mouseY > this.y * height && p.mouseX < (this.x + this.w) * height && p.mouseY < (this.y + this.h) * height) {
            this.pressing = true;
            this.hovering = false;
        }
        else if (p.mouseIsPressed) {
            this.pressing = false;
        }
        else if (!p.mouseIsPressed && this.pressing) {
            this.pressed = true;
        }
    }
    isDone() {
        if (this.pressed) {
            this.pressing = false;
            this.pressed = false;
            return true;
        }
        return false;
    }
};